var config = require("../../config/config");
var _ = require('lodash');
var Router = require("express").Router();

Router.get("/", function(req, res){
	res.render("index", {
		title: config.title,
		groups: config.groups
	});
});

Router.get("/groep/:id", function(req, res){
	var group = _.findWhere(config.groups, {id: parseInt(req.params.id)});
	res.render("users", {
		title: config.title,
		group: group
	});
});

Router.get("/groep/:id/:user", function(req, res){
	var group = _.findWhere(config.groups, {id: parseInt(req.params.id)});
	var user = _.findWhere(group.students, {slug: req.params.user});
	res.render("interface", {
		title: config.title,
		group: group,
		user: user
	});
});

Router.get("/data/groups", function(req, res){
	res.json(config.groups);
});

module.exports = Router;
