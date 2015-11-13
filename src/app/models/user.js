var config = require("../../config/config");
var assert = require("assert");
var crypto = require("crypto");
var fs = require("fs");

prepare();

function prepare(){
	loadData();
	var data = {};

	setTimeout(function(){
		console.log(JSON.stringify(data, null, 4));
	}, 2000);

	function loadData(){
		fs.readdir(config.dataPath, function(err, files){
			assert(err === null, "Error reading data directory");
			files.forEach(function(filename){
				prepareGroup(filename, config.dataPath + filename);
			});
		});
	}

	function prepareGroup(group, input){
		fs.stat(input, function(err, stats){
			assert(err === null, "Error getting stats for directory: " + input);
			if(stats.isDirectory()){
				data[group] = {
					number: group,
					users: {}
				};

				fs.readdir(input, function(err, files){
					assert(err === null, "Error reading directory: " + input);
					files.forEach(function(filename){
						prepareUser(group, filename, input + "/" + filename);
					});
				});
			}
		});
	}

	function prepareUser(group, user, input){
		fs.stat(input, function(err, stats){
			assert(err === null, "Error getting stats for directory: " + input);
			if(stats.isDirectory()){
				user = user.replace("_", " ");
				userid = crypto.createHash("md5").update(user).digest("HEX");

				data[group][userid] = {
					id: userid,
					name: user,
					group: group,
					objects: {},
					keyframes: []
				};

				fs.readdir(input, function(err, files){
					assert(err === null, "Error reading directory: " + input);
					files.forEach(function(filename){
						prepareObject(group, userid, filename, input + "/" + filename);
					});
				});
			}
		});
	}

	function prepareObject(group, userid, object, input){
		fs.stat(input, function(err, stats){
			assert(err === null, "Error getting stats for directory: " + input);
			if(stats.isDirectory()){
				data[group][userid].objects[object] = {
					number: object
				};

				fs.readdir(input, function(err, files){
					assert(err === null, "Error reading directory: " + input);
					files.forEach(function(filename){
						prepareNode(group, userid, object, filename, input + "/" + filename);
					});
				});
			}
		});
	}

	function prepareNode(group, userid, object, node, input){
		node = node.replace(".jpg", "");
	}
}

module.exports = {

};
