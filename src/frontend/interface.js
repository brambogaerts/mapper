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
		$('.timeline').on('click', '.ion-play', Interface.play);
		$(document).on("keyup", function(event){
			if(event.which == 187){
				Interface.forceShow(true);
			} else {
				Interface.forceShow(false);
			}
		});
		$('.timeline').on('click', '.ion-pause', Interface.stop);

		$('.list span.toggle-images').click(function() {
			$(this).parent().toggleClass('expanded');
		});

		$(".image-checkbox").on("click", Interface.imageClicked);
		$(document).on("mouseup", function(){
			utils.save();
		});
	},

	play: function() {
		Interface.forceShow(false);

		globals.interval = setInterval(function() {
			$('body').addClass('playing');
			var totalTime = globals.duration;
			var t = globals.currentTime * totalTime;

			var next = t + 1;
			if (next >= totalTime) {
				Interface.stop();
			}
			utils.setTimelineTime(next/totalTime);
		}, 1);
	},

	stop: function() {
		$('body').removeClass('playing');
		clearInterval(globals.interval);

	},

	imageClicked: function(){
		var checked = $(this).prop('checked');

		if (checked) {
			utils.addImageToKeyframe($(this).data('id'));
		} else {
			utils.removeImageFromKeyframe($(this).data('id'));
		}

		var clicked = this;

		var image = $("#node" + clicked.dataset.id);

		if(image.length == 0){
			image = Interface.createNode(clicked.dataset.object, clicked.dataset.number, clicked.dataset.id, .5,.5);
		}

		if(clicked.checked){
			image.addClass("active");
		} else {
			image.removeClass("active");
		}


		user.objects.forEach(function(object){
			if(object.number == clicked.dataset.object){
				object.nodes.forEach(function(node){
					if(node.id == clicked.dataset.id){
						var loc = Interface.getNormalizedPosition(image);
						node.x = loc.x;
						node.y = loc.y;
					}
				});
			}
		});

		utils.save();
	},

	getNormalizedPosition: function(element){
		return {
			x: element.position().left / element.parent().width(),
			y: element.position().top/ element.parent().height()
		};
	},
	createNode: function(object, number, id, x, y){
		var printLeft = x * 100 + "%";
		var printTop = y * 100 + "%";

		return $("<div class='node' id='node"+id+"' data-number='"+number+"' data-id='"+id+"' data-object='"+object+"' style='background-image:url(media/"+id+".jpg);left: "+printLeft +";top: "+printTop +";'></div>").appendTo(".canvas").drag(Interface.dragNode);
	},
	loadNodes:function(){
		user.objects.forEach(function(object){
			object.nodes.forEach(function(node){
				if(node.x && node.y){
					Interface.createNode(object.number, node.number, node.id, node.x, node.y);
				}
			});
		});
	},
	forceShow:function(force){
		if(force){
			$(".node").addClass("force-show");
			$("body").addClass("force-show");
		} else {
			$(".node").removeClass("force-show");
			$("body").removeClass("force-show");
		}
	},
	dragNode:function(event, dd){
		Interface.moveNode(this, dd.offsetX, dd.offsetY);
	},
	moveNode:function(element, _x, _y){
		var ele = $(element);

		var canvasLeft = ele.parent().offset().left;
		var canvasTop = ele.parent().offset().top;

		_x -= canvasLeft;
		_y -= canvasTop;

		if(_x < 0){
			_x = 0;
		} else if(_x > ele.parent().width()){
			_x = ele.parent().width();
		}

		if(_y < 0){
			_y = 0;
		} else if(_y > ele.parent().height()){
			_y = ele.parent().height();
		}


		var x = _x / ele.parent().width();
		var y = _y / ele.parent().height();

		var printLeft = x * 100 + "%";
		var printTop = y * 100 + "%";


		ele.css({
			left: printLeft,
			top: printTop
		});

		user.objects.forEach(function(object){
			if(object.number == element.dataset.object){
				object.nodes.forEach(function(node){
					if(node.id == element.dataset.id){
						node.x = x;
						node.y = y;
					}
				});
			}
		});
	},
	addKeyframe: function() {
		if ($(this).hasClass('active')) {
			var current = utils.getCurrentKeyframe();

			var keyframe = {
				time: globals.currentTime,
				activeNodes: (current) ?  _.cloneDeep(current.activeNodes) : []
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
			var yes = confirm('Weet je het zeker?');
			if (yes) {
				var k = utils.getCurrentKeyframe();
				if (k) {
					$('.keyframe[data-time="' + k.time + '"]').remove();
					_.remove(user.keyframes, {
						time: k.time
					});
				}

				utils.save();

				var prev = utils.getPrevKeyframe();
				if (prev === false) {
					$('input.image-checkbox').prop('checked', false);
				}

				utils.setTimelineTime(globals.currentTime);
			}
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
