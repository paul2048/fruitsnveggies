const { pool } = require('./dbConfig');

const getUserBasket = async (userId) => {
  // Select the items from the basket
  const q = `SELECT "name", price, discounted_price, sell_per_unit FROM basket
            JOIN item ON item_id = item.id
            JOIN product ON product_id = product.id
            WHERE user_id = $1`;
  const items = (await pool.query(q, [userId])).rows;

  // The basket is made out of objects the have the the following format:
  // { name, sell_per_unit, price, quantity }. Each object has a unique pair
  // of `name` and `price`.
  const basket = [];
  // This object maps a string made out of a unique pair of name and price
  // (`name_price`) to the index of the where the item with that name and price
  // in the `basket` index. This object achieves O(n) insead of O(n^2) in the
  // "for" loop below.
  const basketRows = { length: 0 };

  // Iterate over each item in the basket
  for ({ name, price, discounted_price, sell_per_unit } of items) {
    const sellingPrice = discounted_price || price;
    const basketRowKey = `${name}_${sellingPrice}`;
    const basketIndex = basketRows[basketRowKey];

    // If the item that costs `sellingPrice` is in `basketRows`
    if (basketIndex !== undefined) {
      basket[basketIndex].quantity += 1;
    }
    else {
      // The data of a row in the user's basket table
      const basketRow = { name, sell_per_unit, price, quantity: 1 };

      // Add `discounted_price` to the row if the item is discounted
      if (sellingPrice !== price) {
        basketRow.discounted_price = discounted_price;
      }

      basket.push(basketRow);
      basketRows[basketRowKey] = (basketRows.length)++;
    }
  }

  return basket;
};

module.exports = getUserBasket;
