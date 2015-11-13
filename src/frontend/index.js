var $ = require('jquery');
require('jquery.event.drag')($);
var page = require('page');

var globals = require('./globals');
var utils = require('./utils');
var routes = require('./routes');

function init() {
	if ($('.slider').length) {
		var offset = $('.slider').offset();
		globals.limit.left = offset.left;
		globals.limit.right = globals.limit.left + $('.slider').width();
	}

	console.log(globals);
}

$(function() {
	init();
	page();
});