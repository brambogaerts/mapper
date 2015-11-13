var express  = require("express");
var hbs      = require("hbs");
var config   = require("./config/config");

var app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/app/views");

app.use(express.static(__dirname + "/public"));
app.use(require("./app/controllers/main"));
app.use(require("./app/controllers/users"));

app.listen(config.port);
