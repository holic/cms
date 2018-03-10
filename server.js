var express = require("express");

var app = express();

app.use(express.static(__dirname + "/dist"));
app.use(express.static(__dirname + "/public"));

app.use(function(req, res, next) {
  res.sendFile(__dirname + "/public/index.html");
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Listening on http://localhost:%s", this.address().port);
});
