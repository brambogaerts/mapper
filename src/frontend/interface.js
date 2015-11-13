var $ = require('jquery');
var _ = require('lodash');

var utils = require('./utils');
var globals = require('./globals');

'use strict';

var Interface = module.exports = {
	initEvents: function() {
		$('.slider')
			.on('click', function(e) {
				var l = Math.min(globals.limit.right, Math.max(0, e.offsetX));
				utils.setTimelineTime(utils.sliderPxToTime(l));
			})
			.drag(function( ev, dd ){
				var l = Math.min(globals.limit.right, Math.max(globals.limit.left, ev.pageX));
				utils.setTimelineTime(utils.sliderPxToTime(l));
			});

		$('.slider').on('click', '.keyframe', function(e) {
			var time = $(this).data('time');
			utils.setTimelineTime(time);
			return false;
		});

		$('.timeline').on('click', '.add-keyframe', Interface.addKeyframe);
		$('.timeline').on('click', '.remove-keyframe', Interface.removeKeyframe);
		$('.timeline').on('click', '.next-keyframe', Interface.gotoNextKeyframe);
		$('.timeline').on('click', '.prev-keyframe', Interface.gotoPrevKeyframe);

		$('.list span.toggle-images').click(function() {
			$(this).parent().toggleClass('expanded');
		});

		$(".image-checkbox").on("click", Interface.imageClicked);
	},

	imageClicked: function(){
		console.log(this);
	},

	addKeyframe: function() {
		if ($(this).hasClass('active')) {
			var current = utils.getCurrentKeyframe();

			var keyframe = {
				time: globals.currentTime,
				activeNodes: (current) ? current.activeNodes : []
			};

			user.keyframes.push(keyframe);
			var idx = user.keyframes.length - 1;

			var $div = $('<div class="keyframe" data-time="' + keyframe.time + '"/>');
			$div.css({
				left: utils.timeToSliderPx(keyframe.time)
			});

			$('.slider').append($div);

			user.keyframes = _.sortBy(user.keyframes, 'time');
			globals.keyframeTimes = utils.getKeyframeTimes();

			utils.setTimelineTime(globals.currentTime);

			utils.save();
		}
	},

	removeKeyframe: function() {
		if ($(this).hasClass('active')) {
			var k = utils.getCurrentKeyframe();
			if (k) {
				$('.keyframe[data-time="' + k.time + '"]').remove();
				_.remove(user.keyframes, {
					time: k.time
				});
			}

			utils.setTimelineTime(globals.currentTime);

			utils.save();
		}
	},

	gotoNextKeyframe: function() {
		var next = utils.getNextKeyframe();
		if (next) {
			utils.setTimelineTime(next.time);
		}
	},

	gotoPrevKeyframe: function() {
		var prev = utils.getPrevKeyframe();
		if (prev) {
			utils.setTimelineTime(prev.time);
		}
	}
};
