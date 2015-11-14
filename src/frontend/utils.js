var $ = require('jquery');
var globals = require('./globals');
var _ = require('lodash');

Number.prototype.map = function (in_min, in_max, out_min, out_max) {
	return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

'use strict';

var Utils = module.exports = {
	save: function() {
		var data = {
			keyframes: user.keyframes,
			objects: user.objects
		};

		$.ajax({
			url: window.location.href,
			method: 'POST',
			data: JSON.stringify(data),
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: function(resp) {
				console.log(resp);
			}
		});
	},

	sliderPxToTime: function(x) {
		var time = x.map(globals.limit.left, globals.limit.right, 0, 1);
		return Math.round(time*100)/100;
	},

	timeToSliderPx: function(time) {
		return time.map(0, 1, globals.limit.left, globals.limit.right) - 10 //-10 because of screen offset slider, -3 for keyframe dot width
	},

	setTimelineTime: function(time) {
		globals.currentTime = time;
		$('.indicator').css({
			left: Utils.timeToSliderPx(time)
		});

		Utils.updateControls();
		Utils.updateObjects();
	},

	setCurrentKeyFrame: function(keyframe) {
		globals.currentKeyframe = keyframe;
	},

	updateObjects: function() {
		if (user.keyframes.length > 0) {
			var change = false;
			if (!globals.currentKeyframe) {
				Utils.setCurrentKeyFrame(Utils.getCurrentKeyframe());
				change = true;
			} else {
				var times = globals.keyframeTimes;
				var cur = _.indexOf(times, globals.currentKeyframe.time);
				var next = cur + 1;

				var nextTime = times[next];
				if (globals.currentTime >= nextTime) {
					Utils.setCurrentKeyFrame(Utils.getCurrentKeyframe());
					change = true;
				} else if (globals.currentTime <= globals.currentKeyframe.time) {
					Utils.setCurrentKeyFrame(Utils.getCurrentKeyframe());
					change = true;
				}
			}

			if (change) {
				var k = globals.currentKeyframe;
				if (k) {
					$('.keyframe').removeClass('active');
					$('.keyframe[data-time="'+k.time+'"]').addClass('active');

					$('input[type="checkbox"]').prop('checked', false);
					$('.node').removeClass('active');
					_.each(k.activeNodes, function(n) {
						$('input[data-id="' + n + '"]').prop('checked', true);
						$('#node' + n).addClass('active');
					});
				}
			}
		}
	},

	updateControls: function() {
		var k = Utils.getKeyframeByTime(globals.currentTime);
		if (k) { // there's a keyframe on this specific time
			$('.controls .remove-keyframe').addClass('active');
			$('.controls .add-keyframe').removeClass('active');

			$('.list').addClass('enabled');
		} else {
			$('.controls .add-keyframe').addClass('active');
			$('.controls .remove-keyframe').removeClass('active');

			$('.list').removeClass('enabled');
		}
	},

	addImageToKeyframe: function(id) {
		var k = Utils.getCurrentKeyframe();
		if (k) {
			k.activeNodes.push(id);
		}
	},

	removeImageFromKeyframe: function(id) {
		var k = Utils.getCurrentKeyframe();
		if (k) {
			k.activeNodes = _.without(k.activeNodes, id);
		}
	},

	getKeyframeTimes: function() {
		return _.pluck(user.keyframes, 'time').sort();
	},

	getKeyframeByTime: function(time) {
		return _.findWhere(user.keyframes, {time: time});
	},

	getPrevKeyframe: function() {
		var k = Utils.getCurrentKeyframe();

		if (k) {
			var prevIdx = _.indexOf(user.keyframes, k);
			if (k.time === globals.currentTime) prevIdx--;

			if (prevIdx >= 0) {
				return user.keyframes[prevIdx];
			} else {
				return false;
			}
		} else {
			return false;
		}
	},

	getNextKeyframe: function() {
		var k = Utils.getCurrentKeyframe();

		var nextIdx = _.indexOf(user.keyframes, k) + 1;
		if (nextIdx && nextIdx < user.keyframes.length) {
			return user.keyframes[nextIdx];
		} else {
			return false;
		}
	},

	getCurrentKeyframe: function() {
		var k = Utils.getKeyframeByTime(globals.currentTime);
		if (typeof k !== 'undefined') {
			return k;
		} else {
			var t = globals.currentTime;
			var times = Utils.getKeyframeTimes();
			times.push(t);
			times.sort();

			var idx = _.indexOf(times, t) - 1;
			if (idx >= 0) {
				return user.keyframes[idx];
			}
		}
	}
};
