var $ = require('jquery');
var globals = require('./globals');
var _ = require('lodash');

Number.prototype.map = function (in_min, in_max, out_min, out_max) {
	return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

'use strict';

var Utils = module.exports = {
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

	updateObjects: function() {
		var change = false;
		if (!globals.currentKeyframe) {
			globals.currentKeyframe = Utils.getCurrentKeyframe();
			change = true;
		} else {
			var times = globals.keyframeTimes;
			var cur = _.indexOf(times, globals.currentKeyframe.time);
			var next = cur + 1;

			var nextTime = times[next];
			if (globals.currentTime >= nextTime) {
				globals.currentKeyframe = Utils.getCurrentKeyframe();
				change = true;
			} else if (globals.currentTime <= globals.currentKeyframe.time) {
				globals.currentKeyframe = Utils.getCurrentKeyframe();
				change = true;
			}
		}

		if (change) {
			var k = globals.currentKeyframe;
			$('.keyframe').removeClass('active');
			$('.keyframe[data-time="'+k.time+'"]').addClass('active');

			$('input[type="checkbox"]').prop('checked', false);
			_.each(k.activeNodes, function(n) {
				$('input[data-id="' + n + '"]').prop('checked', true);
			});
		}
	},

	updateControls: function() {
		var k = Utils.getKeyframeByTime(globals.currentTime);
		if (k) { // there's a keyframe on this specific time
			$('.controls .remove-keyframe').addClass('active');
			$('.controls .add-keyframe').removeClass('active');
		} else {
			$('.controls .add-keyframe').addClass('active');
			$('.controls .remove-keyframe').removeClass('active');
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

		var prevIdx = _.indexOf(user.keyframes, k);
		if (k.time === globals.currentTime) prevIdx--;

		if (prevIdx >= 0) {
			return user.keyframes[prevIdx];
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