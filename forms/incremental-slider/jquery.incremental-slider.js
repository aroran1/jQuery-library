/**
 * @projectDescription: jQuery plugin for replacing radio buttons or a select box with an incremental slider
 * @version: 1.3
 * @requires: jquery.event.drag-2.0.js, jquery.mobile-min.js (if mobile == true)
 */
 (function($){ 
	
	$.fn.incrementalSlider = function(opts){
		opts = $.extend({
			overlayDuration: 	2000,
			inputWrapper: 		'.inputWrapper',
			valueRegion:		'.valueRegion',
			showOverlay: 		false,
			mobile:				false //requires jquery.toucharea.js
		}, opts);
		
		return this.each(function(){
			var $this = $(this),
				$inputWrapper = $this.find(opts.inputWrapper),
				$slider = $('<div class="slider" />'),
				$sliderInner = $('<div class="sliderInner" />'),
				$scroller = $('<a href="#" class="scroller" />'),
				$overlay = $(
					'<div class="overlay">' +
						'<div class="overlayInner1">' +
							'<div class="overlayInner2">' +
								'<p></p>' +
							'</div>' +
						'</div>' +
						'<div class="overlayBtm"></div>' +
					'</div>'
				).hide(),
				$value = $this.find(opts.valueRegion),
				$inputs = $inputWrapper.find('input'),
				$select = $inputWrapper.find('select'),
				values = [],
				ranges = [],
				index = 0,
				increment = 0,
				overlayTimer = null;
				
			if($inputs.length){
				$inputWrapper.find('label').each(function(i){
					values.push($(this).text());
					if($(this).next('input').is(':checked')){
						index = i;
					}
				});
			}
			else{
				$inputWrapper.find('option').each(function(i){
					values.push($(this).text());
				});
				index = $select.prop('selectedIndex');
			}
			
			$inputWrapper.children().hide();
			$slider.append($sliderInner);
			$scroller.append($overlay);
			$sliderInner.append($scroller);
			$inputWrapper.append($slider);
			
			increment = $sliderInner.width() / (values.length-1);
			moveScroller();
			
			var sliderLeft = $sliderInner.offset().left;
			
			for(var i=0; i<values.length; i++){
				ranges[i] = [];
				ranges[i][0] = (i*increment) - (increment/2);
				ranges[i][1] = (i*increment) + (increment/2)
			}
			
			if(opts.mobile){
				$scroller.touchArea();
				$scroller.bind('touchdragmove', function(e, data) {
					moveHandler(data.x);
				})
			}
			else{
				$scroller
				    .bind('dragstart', function(e){
				    	$(this).focus();
				    })
					.bind('drag', function(e){
						moveHandler(e.pageX);
					})
					.click(function(e){
						e.preventDefault();
						$(this).focus();
						showOverlay();
					})
					.keydown(function(e){
						var keycode = e.keyCode;
						if(keycode == 37){ //left key
							if(index > 0){
								index--;
								moveScroller();
							}
						}
						else if(keycode == 39){ //right key
							if(index < values.length-1){
								index++;
								moveScroller();
							}
						}
					});
			}
			
			$this.bind('moveincrementalslider', function(e, i){
				if(i <= values.length-1 && i >= 0){
					index = i;
					moveScroller();
				}
			});
			
			$sliderInner.click(function(e){
				$scroller.focus();
				var left = e.pageX - sliderLeft;				
				if(left >= 0 && left <= $sliderInner.width()){
					for(var i in ranges){
						if(left >= ranges[i][0] && left <= ranges[i][1]){
							index = i;
							break;
						}
					}
				}
				moveScroller();
			});
			
			/**
			 * Handles mousemove/drag events. Moves the scroller when the mouse reaches a certain threshold.
			 */
			function moveHandler(x){
				var left = x - sliderLeft;
				index = 0;
				
				if(left >= 0 && left <= $sliderInner.width()){
					for(var i in ranges){
						if(left >= ranges[i][0] && left <= ranges[i][1]){
							index = i;
							break;
						}
					}
				}
				else{
					if(left < 0){
						index = 0;
					}
					else{
						index = ranges.length-1;
					}
				}
				moveScroller();
			}
			/**
			 * Changes the position of the scoller, checks the relevant radio button or selectedIndex,
			 * shows the overlay, tiggers the 'onmove.incrementalSlider' event.
			 */
			function moveScroller(){
				$scroller.css('left', (increment * index) - ($scroller.width() / 2));
				$inputs.eq(index).attr('checked', 'checked');
				$select.prop('selectedIndex', index);
				showOverlay();
				$value.text(values[index]);
				$this.trigger('onmoveincrementalslider', index);
			}
			/**
			 * Displays the overlay and removes it after a period of time.
			 */
			function showOverlay(){
				if(opts.showOverlay){
					clearTimeout(overlayTimer);
					$overlay.find('p').text(values[index]);
					$overlay.fadeIn(function(){
						overlayTimer = setTimeout(function(){
							$overlay.fadeOut();
						}, opts.overlayDuration);
					});
				}
			}
		});
	}
 
})(jQuery);