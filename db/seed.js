const sqlite3 = require('sqlite3').verbose();
const randomDate = require('random-datetime');

const db = new sqlite3.Database('./db/sqlite.db');

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
const devices = makeSequentialArray(100).map(x => stringify(x++));
const placeholders = devices.map(() => '(?)').join(',');
const sql = `INSERT INTO devices(id) VALUES ${placeholders}`;

db.run(sql, devices, function(err) {
  if (err) {
    return console.error(err.message);
  }
  console.log(`Rows inserted ${this.changes}`);
});

const interfaces = ['WIFI', 'BTLE'];


/**
 * Generate a random number within the specified range
 * (Minumum and maximum are inclusive)
 */
function random(minimum, maximum) {
  const min = Math.ceil(minimum);
  const max = Math.floor(maximum);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// For each device, randomly generate some connections
devices.forEach(device => {
  const numberOfNeighbours = random(1,8);
  const neighbours = makeSequentialArray(numberOfNeighbours).map(() => {
    const index = random(0, devices.length - 1);
    return devices[index];
  });

  // For simplicity I'm just going to use separate inserts for each row
  // instead of batching them
  neighbours.forEach(neighbour => {
    const interfaceType = interfaces[random(0,1)];
    const level = random(0,10);
    const date = randomDate({
      year: 2020,
      month: 3
    });

    const values = [device, neighbour, interfaceType, level, date.toISOString().slice(0, 19).replace('T', ' ')];
    const sql = `INSERT INTO connections(device_id, neighbour_id, interface, level, timestamp) VALUES (${values.map(val => `"${val}"`).join(',')})`;

    db.run(sql, [], function(err) {
      if (err) {
        return console.error(err.message);
      }
      console.log(`Rows inserted ${this.changes}`);
    });
  });
});