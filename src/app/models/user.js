var config = require("../../config/config");
var crypto = require("crypto");
var fs = require("fs");

function prepare(){
	var data = loadData();
	return data;

	function loadData(){
		var promise = new Promise(function(resolve, reject){
			fs.readdir(config.dataPath, function(err, files){
				if(err == null){
					var groups = [];

					files.forEach(function(filename){
						var group = prepareGroup(filename, config.dataPath + filename);

						groups.push(group);
					});

					Promise.all(groups).then(function(groups){
						var data = [];

						groups.forEach(function(group){
							if(group != undefined){
								data.push(group);
							}
						});

						resolve(data);
					}, function(err){
						reject(err);
					});
				} else {
					reject(err);
				}
			});
		});

		return promise;
	}

	function prepareGroup(group, input){
		var promise = new Promise(function(resolve, reject){
			fs.stat(input, function(err, stats){
				if(err == null){
					if(stats.isDirectory()){
						var _group = {
							number: group,
							users: []
						};

						fs.readdir(input, function(err, files){
							if(err == null){
								var users = [];

								files.forEach(function(filename){
									var user = prepareUser(group, filename, input + "/" + filename);
									users.push(user);
								});

								Promise.all(users).then(function(users){
									users.forEach(function(user){
										if(user != undefined){
											_group.users.push(user);
										}
									});

									resolve(_group);
								}, function(err){
									reject(err);
								});
							} else {
								reject(err);
							}
						});
					} else {
						resolve();
					}
				} else {
					reject(err);
				}
			});
		});

		return promise;
	}

	function prepareUser(group, user, input){
		var promise = new Promise(function(resolve, reject){
			fs.stat(input, function(err, stats){
				if(err == null){
					if(stats.isDirectory()){
						user = user.replace("_", " ");
						var uid = crypto.createHash("md5").update(user).digest("HEX");

						var _user = {
							id: uid,
							name: user,
							objects: []
						};

						fs.readdir(input, function(err, files){
							if(err == null){
								var objects = [];

								files.forEach(function(filename){
									var object = prepareObject(group, uid, filename, input + "/" + filename);

									objects.push(object);
								});

								Promise.all(objects).then(function(objects){
									objects.forEach(function(object){
										if(object != undefined){
											_user.objects.push(object);
										}
									});

									resolve(_user);
								}, function(err){
									reject(err);
								});
							} else {
								reject(err);
							}
						});
					} else {
						resolve();
					}
				} else {
					reject(err);
				}
			});
		});

		return promise;
	}

	function prepareObject(group, uid, object, input){
		var promise = new Promise(function(resolve, reject){
			fs.stat(input, function(err, stats){
				if(err == null){
					if(stats.isDirectory()){
						var _object = {
							number: object,
							nodes: []
						};

						fs.readdir(input, function(err, files){
							if(err == null){
								var nodes = [];

								files.forEach(function(filename){
									var node = prepareNode(group, uid, object, filename, input + "/" + filename);
									nodes.push(node);
								});

								Promise.all(nodes).then(function(nodes){
									nodes.forEach(function(node){
										if(node != undefined){
											_object.nodes.push(node);
										}
									});

									resolve(_object);
								}, function(err){
									reject(err);
								});
							} else {
								reject(err);
							}
						});
					} else {
						resolve();
					}
				} else {
					reject(err);
				}
			});
		});

		return promise;
	}

	function prepareNode(group, uid, object, node, input){
		node = node.replace(".jpg", "");
		var nid = crypto.createHash("md5").update(group + uid + object + node).digest("HEX");

		var _node = {
			number: node,
			id: nid
		};

		var promise = new Promise(function(resolve, reject){
			fs.stat(__dirname + "/../../public/media/" + nid + ".jpg", function(err, stats){
				if(err != null){
					fs.createReadStream(input).pipe(fs.createWriteStream(__dirname + "/../../public/media/" + nid + ".jpg"));
				}

				resolve(_node);
			});
		});

		return promise;
	}
}

var groups = [];

prepare().then(function(_groups){
	groups = _groups;
}, function(err){
	console.log(err);
});

function findGroups(callback){
	var response = [];

	groups.forEach(function(group){
		response.push({
			"id": group.number
		});
	});

	callback(response);
}

function findGroup(id, callback){
	var done = false;

	groups.forEach(function(group){
		if(group.number == id){
			callback(group);
			done = true;
		}
	});

	if(!done){
		callback(null);
	}
}


function saveUser(data, group, id, callback){
	findUser(group, id, function(user){
		try {
			var contents = JSON.stringify(data);
			var underscoreName = user.name.replace(" ", "_");

			if(contents.charAt(0) == "{" && contents.charAt(contents.length-1) == "}"){
				fs.writeFile(config.dataPath + group + "/" + underscoreName + "/" + "data.json", contents, function(err){
					if(err){
						callback({
							status: 400,
							error: err
						});
					} else {
						callback({
							status: 200,
							error: null
						});
					}
				});
			}
		} catch(e){
			callback({
				status:200,
				error: e
			})
		}
	});
}

function findUser(group, id, callback){
	findGroup(group, function(group){
		if(group == null){
			callback(null);
		} else {
			var done = false;

			group.users.forEach(function(user){
				if(user.id == id){
					var underscoreName = user.name.replace(" ", "_");

					fs.readFile(config.dataPath + group.number + "/" + underscoreName + "/" + "data.json", function(err, file){
						if(err){
							callback(user);
						} else {
							var json = JSON.parse(file);

							user.objects = json.objects;
							user.keyframes = json.keyframes;
							callback(user);
						}
					});

					done = true;
				}
			});

			if(!done){
				callback(null);
			}
		}
	});
}


module.exports = {
	findGroups: findGroups,
	findGroup: findGroup,
	findUser: findUser,
	saveUser: saveUser
};
