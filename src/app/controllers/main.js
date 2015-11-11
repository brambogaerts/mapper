var config = require("../../config/config");
var Router = require("express").Router();

Router.get("/", function(req, res){
	res.render("index", {
		title: config.title
	});
});

module.exports = Router;
