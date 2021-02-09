require('newrelic');
const express = require('express');
// const compression = require('compression');
const Cart = require('../database/Cart');

const pgp = require('pg-promise')(/* options */)
const db = pgp('postgres://student:student@54.186.112.152:5432/postgres')

const app = express();
const port = 3003;

// app.use(compression());
app.use(express.static('public'));

app.get('/api/item/:itemID', (req, res) => {
  db.query(`SELECT * FROM items WHERE _id = '${req.params.itemID}';`)
  .then((result) => res.send(result))
  .catch((err) => res.send(err));  
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
