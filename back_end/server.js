require('dotenv').config({ path: __dirname + '/../.env' });
const express = require('express');
const { pool } = require('./dbConfig');
const pgFormat = require('pg-format');
const cors = require('cors');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();

// The port on which the app listents to
const PORT = 4000;
// PosgreSQL error codes are "translated" here
const PG_ERROR_CODES = {
  duplicateKeys: '23505',
}


// Use the `bodyParser` middleware which parses request bodies into `req.body`.
// Reference: https://www.npmjs.com/package/body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
}));
app.use(cookieParser(process.env.SESSION_SECRET))
app.use(passport.initialize());
app.use(passport.session());


const initPassport = require('./passportConfig.js');
initPassport(
  passport,
  // `getByIdentifier` can be 'email' or 'id'
  async (getByIdentifier, val) => {
    try {
      // `user` is a reserved keyword, so we need to use the quotes around it.
      // Reference: https://stackoverflow.com/a/9036651/7367049
      const q = `SELECT "user".id, firstname, lastname, email, hash, postcode,
                street, balance, city_id, city.name AS city FROM "user"
                JOIN city ON city_id = city.id WHERE "user".${getByIdentifier} = $1`;
      return (await pool.query(q, [val])).rows[0];
    } catch (e) {
      return e;
    }
  }
);

// Helper functions that return `true` if the respective field is invalid
const invalidEmail = (email) => !/^[^@]+@[^@]+\.[^@]+$/.test(email);
const invalidName = (name) => !/^[^ ][A-Za-zÀ-ú ]+$/.test(name);
const invalidCity = (cities, city) => !cities.map((city) => city.name).includes(city);
const invalidPostcode = (postcode) => !/^[A-Za-z0-9 ]{1,8}$/.test(postcode);
const invalidStreet = (street) => !/^[0-9]+ [A-Za-z ]+$/.test(street);


// Send the products of a specific type: fruits, vegetables, discounts, or all
// (note that `productType` is optional; thus "/products" will get all products).
app.get('/products/:productType?', (req, res) => {
  const type = req.params.productType;
  const sortBy = req.query.sortBy.toLowerCase();
  let q = `SELECT product.id, "name", price, sell_per_unit, discounted_price
          FROM product JOIN item ON product.id = item.product_id`;

  // Filter out the products that are not discounted
  if (type === 'discounts')
    q += ' WHERE discounted_price IS NOT NULL';
  // Filter out the type of products that are not requested
  else if (type !== undefined)
    q += ` WHERE is_fruit = ${type === 'fruits'}`;

  // Always sort by `name` and `discounted_price` because later in the code, when
  // `products[name] === undefined`, the `price` variable must be the original
  // price (if the item at the original code is available).
  q += ` ORDER BY ${sortBy}, "name", discounted_price DESC`;

  try {
    pool.query(q, [], (err, qRes) => {
      if (err) console.error(err);
      // When we have 3 apples and 2 bananas, we have 5 items
      const items = qRes.rows;
      // When we have 3 apples and 2 bananas, we have 2 products
      const products = [];

      for (item of items) {
        const { id, name, price, sell_per_unit, discounted_price } = item;
        // This is `true` only for each unique `name`
        if (products[name] === undefined) {
          // Each product will have the following structure:
          // product_name: {
          //   id: product_id
          //   price: price_without_discount,
          //   sell_per_unit: true/false
          //   prices: {
          //     original_price: quantity0,
          //     discount_price1: quantity1,
          //     discount_price2: quantity2,
          //   }
          // }
          products[name] = {
            id,
            price,
            sell_per_unit,
            prices: {
              [price]: 1,
            },
          };
        }
        // If the iterated item is discounted
        else if (discounted_price !== null) {
          const prices = products[name]['prices'];
          if (prices[discounted_price] === undefined)
            prices[discounted_price] = 1;
          else
            prices[discounted_price] += 1;
        }
        // If the item is not discounted, but the product was iterated through before
        else {
          products[name]['prices'][price] += 1;
        }
      }

      // Send an array to the client, instead of an object because React
      // can't render objects in JSX
      productsList = Object.entries(products)
        .map(([name, product]) => ({ name, ...product }))
      res.send(productsList);
    });
  } catch (e) {
    console.error(e);
    res.status(500).send();
  }
});

app.get('/cities', async (req, res) => {
  // Get the cities' names
  const cities = (await pool.query('SELECT "name" FROM city')).rows;
  res.send({ cities: cities.map((city) => city.name) });
});

app.get('/product', async (req, res) => {
  const productName = req.query.name;
  const q = 'SELECT * FROM product WHERE name = $1';

  try {
    const product = (await pool.query(q, [productName])).rows[0];
    res.send(product);
  } catch (e) {
    console.error(e);
    res.status(404).send('Cannot find product');
  }
});

app.get('/basket', (req, res) => {
  // If the user is not logged in
  if (!req.user) {
    return res.sendStatus(403);
  }

  const userId = req.user.id;
  // Select the items from the basket
  const q = `SELECT "name", price, discounted_price, sell_per_unit FROM basket
            JOIN item ON item_id = item.id
            JOIN product ON product_id = product.id
            WHERE user_id = $1`;

  pool.query(q, [userId], (err, data) => {
    if (err) {
      console.error(err);
      return res.send(err);
    }
    const items = data.rows;
    // The basket is made out of objects the have the the following format:
    // { name, sell_per_unit, price, quantity }. Each object has a unique pair
    // of `name` and `price`.  
    const basket = [];
    // This object maps a string made out of a unique pair of name and price
    // (`name_price`) to the index of the where the item with that name and price
    // in the `basket` index. This object achieves O(n) insead of O(n^2) in the
    // "for" loop below. 
    const basketRows = {length: 0};

    // Iterate over each item in the basket
    for ({name, price, discounted_price, sell_per_unit} of items) {
      const sellingPrice = discounted_price || price;
      const basketRowKey = `${name}_${sellingPrice}`;
      const basketIndex = basketRows[basketRowKey];

      // If the item that costs `sellingPrice` is in `basketRows`
      if (basketIndex !== undefined) {
        basket[basketIndex].quantity += 1;
      }
      else {
        const basketRow = {name, sell_per_unit, price, quantity: 1};

        // Add `discounted_price` to the row if the item is discounted
        if (sellingPrice !== price) {
          basketRow.discounted_price = discounted_price;
        }

        basket.push(basketRow);
        basketRows[basketRowKey] = (basketRows.length)++;
      }
    }

    // Sort the basket by item name and send it to the client
    res.send(basket.sort((a, b) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
    }));
  });
});

app.post('/basket/add', async (req, res) => {
  // If the user is not logged in
  if (!req.user) {
    return res.sendStatus(403);
  }

  const productId = req.body.productId;
  const userId = req.user.id;
  const quantity = req.body.quantity;
  // Out of the cheapest discounted items, get the item with the soonest `sell_by_date`
  let q = `SELECT item.id FROM item
          WHERE product_id = $1 AND transaction_id IS NULL
          AND item.id NOT IN (SELECT item_id FROM basket WHERE user_id = $2)
          ORDER BY discounted_price, sell_by_date LIMIT $3`;

  pool.query(q, [productId, userId, quantity], (err, data) => {
    if (err) {
      console.error(err);
      return res.send(err);
    }

    const items = data.rows;
    const basket = items.map((item) => [userId, item.id]);
  
    if (items.length === 0) {
      return res.status(422).send('The product is not currently in stock');
    }
    else if (items.length < quantity) {
      return res.status(422).send('You are trying to add more items than the number of available items');
    }

    // Insert 1 or more items into the user's basket
    q = 'INSERT INTO basket (user_id, item_id) VALUES %L';
    pool.query(pgFormat(q, basket), [], (err) => {
      if (err) {
        console.error(err);
        return res.send(err);
      }
    });
  });
});

app.post('/basket/remove', (req, res) => {
  // If the user is not logged in
  if (!req.user) {
    return res.sendStatus(403);
  }

  const { name, discounted_price } = req.body;
  const userId = req.user.id;
  let q = `DELETE FROM basket WHERE user_id = $1 AND item_id IN
          (SELECT item_id FROM basket
          JOIN item ON item_id = item.id
          JOIN product ON product_id = product.id
          WHERE user_id = $1 AND product."name" = $2
          AND discounted_price ${discounted_price ? '= $3)' : 'IS NULL)'}`;

  let args = [userId, name];
  if (discounted_price) {
    args.push(discounted_price);
  }

  pool.query(q, args, (err) => {
    if (err) {
      console.error(err);
    }
    res.sendStatus(200);
  });
});

app.post('/order', (req, res) => {
  // If the user is not logged in
  if (!req.user) {
    return res.sendStatus(403);
  }

  const { ccName, ccNumber, ccDate, cvc, confirmBitcoin } = req.body;

  return res.status(422).send({ ccName: 'yooo' });

  res.send('Your order was placed successfully');
});

app.post('/accounts/signup', async (req, res) => {
  // Destructure the form's data
  const { firstname, lastname, email, password1, password2, city, postcode, street } = req.body;
  // Here will be appended strings describing the errors
  const errors = {};

  // Handle form errors
  if (invalidName(firstname))
    errors.firstname = 'First name is invalid';
  if (invalidName(lastname))
    errors.lastname = 'Last name is invalid';
  if (invalidEmail(email))
    errors.email = 'Email is invalid';
  if (password1.length < 8)
    errors.password1 = 'Password is shorter than 8 characters';
  else if (password1 !== password2)
    errors.password2 = 'Passwords do not match';

  const cities = (await pool.query('SELECT * FROM city')).rows;
  if (invalidCity(cities, city))
    errors.city = 'Your city is not in range';
  if (invalidPostcode(postcode))
    errors.postcode = 'Postcode is invalid';
  if (invalidStreet(street))
    errors.street = 'Street is invalid';

  // If any form error was found
  if (Object.entries(errors).length > 0) {
    return res.status(422).send(errors);
  }

  try {
    const hash = await bcrypt.hash(password1, 10);
    const q = `INSERT INTO "user" (email, hash, firstname, lastname, city_id, postcode, street)
              VALUES ($1, $2, $3, $4, $5, $6, $7)`;
    const city_id = cities.find((city2) => city2.name === city).id;
    const args = [email, hash, firstname, lastname, city_id, postcode, street];

    // Try to insert the user into the database
    await pool.query(q, args, (err) => {
      // Handle query errors
      if (err) {
        // If the email is already taken
        if (err.code == PG_ERROR_CODES.duplicateKeys) {
          errors.email = 'Email address is already taken';
          return res.status(422).send(errors);
        }
        // Print any other errors
        console.error(err);
      }
      res.send('Sign up successful');
    });
  } catch (e) {
    // Print server errors
    console.error(e);
    res.status(500).send();
  }
});

app.post('/accounts/login', passport.authenticate('local'), (req, res) => {
  const userInfo = {
    id: req.user.id,
    balance: req.user.balance,
    city: req.user.city,
    email: req.user.email,
    firstname: req.user.firstname,
    lastname: req.user.lastname,
    postcode: req.user.postcode,
    street: req.user.street,
  };
  res.send(userInfo);
});

app.get('/user', (req, res) => res.send(req.user));

app.get('/accounts/logout', (req, res) => {
  req.session.destroy();
  req.logout();
  res.sendStatus(200);
});

app.listen(PORT);
