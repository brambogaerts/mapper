var Router = require("express").Router();
var User = require("../models/user");

Router.get("/users/group/:group", function(req, res){
	res.send({
		status: 200,
		error: null
	});
});

Router.get("/users/:id", function(req, res){
	res.send({
		status: 200,
		error: null
	});
});

Router.post("/users/:id", function(req, res){
	res.send({
		status: 200,
		error: null
	});
});

module.exports = Router;
