const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./db/sqlite.db');

db.run('CREATE TABLE devices(id VARCHAR(32) PRIMARY KEY)');

db.run(`CREATE TABLE connections (
  id INTEGER PRIMARY KEY,
  device_id VARCHAR(32) NOT NULL,
  neighbour_id VARCHAR(32) NOT NULL,
  interface VARCHAR(4),
  level INTEGER,
  timestamp DATETIME
)`);

db.close()
