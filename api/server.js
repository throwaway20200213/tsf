const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const HTTP_PORT = 8000;

const db = new sqlite3.Database('./db/sqlite.db');

// Start server
app.listen(HTTP_PORT, () => {
  console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});

const SELECT_DEVICES_QUERY = `
  SELECT * FROM devices
  LEFT JOIN connections
  ON devices.id = connections.device_id
`;

// list all devices endpoint
app.get('/devices', (req, res) => {
  db.all(SELECT_DEVICES_QUERY, [], (err, rows) => {
    if (err) {
      throw err;
    }

    // Group devices by device id
    // and list neightbours
    const devices = rows.reduce((acc, row) => {
      if (acc[row.device_id] === undefined) {
        acc[row.device_id] = {};
      }

      acc[row.device_id]["device_id"] = row.device_id;

      if (acc[row.device_id]["neighbours"] === undefined) {
        acc[row.device_id]["neighbours"] = [];
      }

      const neighbour = {
        remote_device_id: row.neighbour_id,
        time: row.timestamp,
        interface: row.interface,
        level: row.level
      };

      acc[row.device_id]["neighbours"].push(neighbour);

      return acc;

    }, {});

    // Object.values() to remove the keys that were only being used for grouping purposes
    res.json(Object.values(devices));
  });
});

// Root endpoint
app.get("/", (req, res, next) => {
  res.json({"message":"Ok"})
});

// Default response for any other request
app.use(function(req, res){
  res.status(404);
});