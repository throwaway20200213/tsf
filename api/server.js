// Just going to use ES5 here, as it is a very basic API
// And I don't think the effort-to-reward of configuring babel
// is massively worth it in this case.
var express = require('express');

var app = express();
var HTTP_PORT = 8000;

// Start server
app.listen(HTTP_PORT, () => {
  console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});

// Root endpoint
app.get("/", (req, res, next) => {
  res.json({"message":"Ok"})
});


// Default response for any other request
app.use(function(req, res){
  res.status(404);
});