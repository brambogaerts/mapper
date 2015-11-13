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
			user.keyframes = [{
				"time": 0,
				"activeNodes": [
					"b4fde1c1c2ca43b9689b8d00301c0cfe",
					"f19c658af4ac6d879921f8400180f705",
					"d70e6204fdbbfe9382428ce6e737c987"
				]
			}, {
				"time": 0.5,
				"activeNodes": [
					"b4fde1c1c2ca43b9689b8d00301c0cfe",
					"f19c658af4ac6d879921f8400180f705"
				]
			}, {
				"time": 1,
				"activeNodes": [
					"b4fde1c1c2ca43b9689b8d00301c0cfe"
				]
			}]
			res.render("interface", {
				title: config.title,
				group: group,
				user: user
			});
		});
	});
});

module.exports = Router;
