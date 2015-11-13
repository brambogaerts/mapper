var config = require("../../config/config");
var Router = require("express").Router();
var User = require("../models/user");

Router.get("/", function(req, res){
	User.findGroups(function(groups) {
		res.render("index", {
			title: config.title,
			groups: groups
		});
	});
});

Router.get("/groep/:id", function(req, res){
	User.findGroup(req.params.id, function(group){
		res.render("users", {
			title: config.title,
			group: group
		});
	});
});

Router.get("/groep/:id/:user", function(req, res){
	User.findGroup(req.params.id, function(group){
		User.findUser(group.number, req.params.user, function(user){
			res.render("interface", {
				title: config.title,
				group: group,
				user: user
			});
		});
	});
});

Router.post("/groep/:id/:user", function(req, res){
	User.saveUser(req.body, req.params.id, req.params.user, function(result){
		res.send(result);
	});
});

module.exports = Router;
