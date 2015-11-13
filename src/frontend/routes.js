var $ = require('jquery');
var page = require('page');

var utils = require('./utils');
var Interface = require('./interface');
var globals = require('./globals');

page('/', chooseGroup);
page('/groep/:id', chooseUser);
page('/groep/:id/:user', showInterface);

function chooseGroup(ctx) {
	$('.groups').on('click', '.group', function() {
		window.location = '/groep/' + $(this).data('id');
	});
}

function chooseUser(ctx) {
	var groupId = ctx.params.id;
	$('.users').on('click', '.user', function() {
		window.location = '/groep/' + groupId + '/' + $(this).data('slug');
	});
}

function showInterface(ctx) {
	user.keyframes.forEach(function(obj, idx) {
		$div = $('<div class="keyframe" data-time="' + obj.time + '"/>');
		$div.css({
			left: utils.timeToSliderPx(obj.time)
		});

		$('.slider').append($div);
	});

	Interface.initEvents();
	utils.updateControls();
	
	globals.keyframeTimes = utils.getKeyframeTimes();
}