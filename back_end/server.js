const { Pool } = require('pg');
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const app = express();

// The port on which the app listents to
const PORT = 4000;
// Cities that Fruits n' Veggies delivers to
const COVERED_CITIES = ['london', 'manchester', 'oxford'];
// PosgreSQL error codes are "translated" here
const PG_ERROR_CODES = {
    duplicateKeys: '23505',
}

// Import the environment variables, namely `DB_USER`, `DB_PASSWORD`, `DB_HOST`,
// `DB_PORT`, and `DB_DATABASE`. The variables are credentials used for
// connecting to a remote database. 
require('dotenv').config({ path: __dirname + '/../.env' });
// Use the `bodyParser` middleware which parses request bodies into `req.body`.
// Reference: https://www.npmjs.com/package/body-parser
app.use(bodyParser.json());
// 
app.use(cors({ credentials: true, origin: true })); // ??? do I need the cors arg?

// Create a pool for the remote PostgreSQL database. 
const pool = new Pool({
    // Use the environment variables
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    ssl: { rejectUnauthorized: false },
    // Maximum number of connections in the pool
    max: 20,
    // If all the connections are busy, wait until a new connection is available
    connectionTimeoutMillis: 0,
    // Never close any connection
    idleTimeoutMillis: 0
});

// Helper functions that return `true` if the respective field is invalid
const invalidEmail = (email) => !/^[^@]+@[^@]+\.[^@]+$/.test(email);
const invalidName = (name) => !/^[A-Za-zÀ-ú ]+$/.test(name);
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

    console.log(q)

    try {
        pool.query(q, [], (err, qRes) => {
            if (err) {
                console.error(err);
            }
            res.send(qRes.rows);
        });
    } catch(e) {
        console.error(e);
        res.status(500).send();
    }
});

// app.get('/login', (req, res) => {

// });

app.post('/accounts/signup', async (req, res) => {
    // Destructure the form's data
    const { email, password1, password2, firstname, lastname, city, postcode, street } = req.body;
    // Here will be appended strings describing the errors
    const errors = [];

    // Handle form errors
    if (invalidEmail(email))
        errors.push('Email is invalid');
    else if (password1 !== password2)
        errors.push('Passwords do not match');
    else if (invalidName(firstname))
        errors.push('First name is invalid');
    else if (invalidName(lastname))
        errors.push('Last name is invalid');
    else if (invalidCity(city))
        errors.push('Your city is not in range');
    else if (invalidPostcode(postcode))
        errors.push('Postcode is invalid');
    else if (invalidStreet(street))
        errors.push('Street is invalid');

    // If any form error was found
    if (errors.length) {
        console.log(errors)
        return res.status(422).send({ errors: errors });
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
                    errors.push('Email address is already taken');
                    return res.status(422).send({ errors: errors })
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

app.post('/accounts/login', async (req, res) => {
    // Destructure the form's data
    const { email, password } = req.body;

    try {
        // Query for getting the hash associated with the form's email address
        const q = 'SELECT hash FROM "user" WHERE email = $1';
        // Get the hash associated with `email`
        const hash = (await pool.query(q, [email])).rows[0].hash;
        // `true` if the database's hash is the same as the form's hashed password
        const loginSuccess = await bcrypt.compare(password, hash);

        if (loginSuccess) {
            res.send('Login successful');
        } else {
            res.status(422).send({ error: 'Credetials do not match' });
        }
    } catch (e) {
        // If the email does not exist in the database. That happens when the hash
        // cannot be fetched from the database, causing the error "TypeError:
        // Cannot read property 'hash' of undefined".
        if (e.name === 'TypeError') {
            return res.status(422).send({ error: 'Credetials do not match' });
        }
        // Print server errors
        console.error(e)
        res.status(500).send();
    }
});

app.post('/accounts/logout', async (req, res) => {
    try {
        
    } catch (e) {
        res.status(500).send();
    }
});

app.listen(PORT);
