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

function parseNeighbour(row) {
  return {
    remote_device_id: row.neighbour_id,
    time: row.timestamp,
    interface: row.interface,
    level: row.level
  };
}

// Group devices by device id
// and list neightbours
function parseDevices(rows) {
  const groupedDevices = rows.reduce((acc, row) => {
    if (acc[row.device_id] === undefined) {
      acc[row.device_id] = {};
    }

    acc[row.device_id]["device_id"] = row.device_id;

    if (acc[row.device_id]["neighbours"] === undefined) {
      acc[row.device_id]["neighbours"] = [];
    }

    acc[row.device_id]["neighbours"].push(parseNeighbour(row));

    return acc;
  }, {});

  // Object.values() to remove the keys that were only being used for grouping purposes
  return Object.values(groupedDevices);
}

// list all devices endpoint
app.get('/devices', (req, res) => {
  db.all(SELECT_DEVICES_QUERY, [], (err, rows) => {
    if (err) {
      throw err;
    }

    res.json(parseDevices(rows));
  });
});

app.get('/devices/:id', (req, res) => {
  const query = `${SELECT_DEVICES_QUERY} WHERE devices.id = ?`;

  db.all(query, [req.params.id], (err,rows) => {
    if (err) {
      throw err;
    }

    if (!rows.length) {
      res.status(404);
    }

    const response = rows.reduce((acc, row) => {
      acc["device_id"] = row.device_id;

      if (acc["neighbours"] === undefined) {
        acc["neighbours"] = [];
      }

      acc["neighbours"].push(parseNeighbour(row));

      return acc;
    }, {});

    res.json(response);
  });
});

// Show all connections for a device (local & remote)
app.get('/devices/:id/connections', (req, res) => {
  const query = `${SELECT_DEVICES_QUERY} WHERE devices.id = ? OR connections.neighbour_id = ?`;

  db.all(query, [req.params.id, req.params.id], (err, rows) => {
    if (err) {
      throw err;
    }

    if (!rows.length) {
      res.status(404);
    }

    res.json(parseDevices(rows));
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