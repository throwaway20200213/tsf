const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./db/sqlite.db');

/**
 * Convert a number to a padded string representation of that number
 *
 * @param {number} number
 * @param {number} length
 */
function stringify(number, length = 4) {
  let str = number.toString();

  while (str.length < length) {
    str = `0${str}`;
  }

  return str;
}

/**
 * Create an array of sequential numbers
 * @param {number} size
 */
function makeSequentialArray(size) {
  return ([...Array(size).keys()]);
}

// Generate some device ids and insert them into the devices table
const ids = makeSequentialArray(100).map(x => stringify(x++));
const placeholders = ids.map(() => '(?)').join(',');
const sql = `INSERT INTO devices(id) VALUES ${placeholders}`;

db.run(sql, ids, function(err) {
  if (err) {
    return console.error(err.message);
  }
  console.log(`Rows inserted ${this.changes}`);
});
