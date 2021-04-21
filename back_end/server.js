require('dotenv').config({ path: __dirname + '/../.env' });
const express = require('express');
const { pool } = require("./dbConfig");
const cors = require('cors');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();

// The port on which the app listents to
const PORT = 4000;
/////////////////// Add cities to database table
const COVERED_CITIES = ['london', 'manchester', 'oxford'];
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


// 
const initPassport = require('./passportConfig.js');
initPassport(
  passport,
  async (getByIdentifier, val) => {
    try {
      const q = `SELECT * FROM "user" WHERE ${getByIdentifier} = $1`;
      return (await pool.query(q, [val])).rows[0];
    } catch {
      return;
    }
  }
);

// Helper functions that return `true` if the respective field is invalid
const invalidEmail = (email) => !/^[^@]+@[^@]+\.[^@]+$/.test(email);
const invalidName = (name) => !/^[^ ][A-Za-zÀ-ú ]+$/.test(name);
const invalidCity = (city) => !COVERED_CITIES.includes(city.toLowerCase());
const invalidPostcode = (postcode) => !/^[A-Za-z0-9 ]{1,8}$/.test(postcode);
const invalidStreet = (street) => !/^[0-9]+ [A-Za-z ]+$/.test(street);


// Send the products of a specific type: fruits, vegetables, discounts, or all
// (note that `productType` is optional; thus "/products" will get all products).
app.get('/products/:productType?', (req, res) => {
  const type = req.params.productType;

  ///////////////// needs sell_by_date and number of available items
  ///////////////// if the stock is limitedfrom the item tables
  let q = 'SELECT "name", price, is_sold_per_unit FROM product';

  // 
  if (type === 'discounts') {
    q = `SELECT DISTINCT ON ("name") "name", min(sell_by_date) as sell_by_date,
        price, is_sold_per_unit, discounted_price FROM product
        JOIN item ON product.id = item.product_id
        WHERE discounted_price IS NOT NULL
        GROUP BY sell_by_date, "name", price, is_sold_per_unit, discounted_price`;
  }
  // 
  else if (type !== undefined) {
    q += ` WHERE is_fruit = ${type === 'fruits'}`;
  }

  // console.log(q)

  try {
    pool.query(q, [], (err, qRes) => {
      if (err) {
        console.error(err);
      }
      res.send(qRes.rows);
    });
  } catch (e) {
    console.error(e);
    res.status(500).send();
  }
});

app.get('/cities', (req, res) => {
  res.send({ cities: COVERED_CITIES });
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
  if (invalidCity(city))
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
    // `user` is a reserved keyword, so we need to use the quotes around it.
    // Reference: https://stackoverflow.com/a/9036651/7367049
    const q = `INSERT INTO "user" (email, hash, firstname, lastname, city, postcode, street)
              VALUES ($1, $2, $3, $4, $5, $6, $7)`;
    const args = [email, hash, firstname, lastname, city, postcode, street];

    // Try to insert the user into the database
    await pool.query(q, args, (err) => {
      // Handle query errors
      if (err) {
        // If the email is already taken
        if (err.code == PG_ERROR_CODES.duplicateKeys) {
          errors.email = 'Email address is already taken';
          return res.status(422).send(errors)
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
