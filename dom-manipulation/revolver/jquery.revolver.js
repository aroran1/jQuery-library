/*
 * @projectDescription Creates a revolving series of content slides
 * @version 2.0
 * 
 */
(function($){
	
	$.fn.revolver = function(opts){
		opts = $.extend(true,{
			duration: 500,
			interval: 5000,
			index: 0,
			selectors: {
				window:	'.revolverWindow',
				belt: 	'.revolverBelt',
				item: 	'.revolverItem',
				prev: 	'.revolverPrev',
				next: 	'.revolverNext',
				pager: 	'.revolverPager'
			},
			classes: {
				pagerItem: 			'pagerItem',
				pagerItemSelected: 	'pagerItemSelected',
				prevDisabled: 		'prevDisabled',
				nextDisabled: 		'nextDisabled'
			}
		}, opts);
		
		return this.each(function(){
			var $this = $(this),
				$window = $this.find(opts.selectors.window),
				$belt = $this.find(opts.selectors.belt),
				$items = $this.find(opts.selectors.item),
				$prev = $this.find(opts.selectors.prev),
				$next = $this.find(opts.selectors.next),
				$pager = $this.find(opts.selectors.pager),
				maxHeight = 0,
				itemWidth = $items.outerWidth(),
				currIndex = opts.index,
				visibleItems = 0,
				busy = false,
				autoPlayTimer = null,
				items = [];
				
			$items.each(function(i){
				maxHeight = Math.max(maxHeight, $(this).outerHeight());
				$pager.append('<div class="' + opts.classes.pagerItem + '" />');
				
				if((i+1) * itemWidth <= $window.width()){
					visibleItems++;
				}
				items.push($(this).addClass('index'+i).remove());
			});
			
			for(var i=0; i<visibleItems; i++){
				$belt.append(items[currIndex+i]);
			}
			
			$window.css({
				position: 'relative',
				height: maxHeight,
				overflow: 'hidden'
			});
			$belt.css({
				position: 'absolute',
				top: 0,
				left: 0,
				width: itemWidth * $items.length
			});
			
			$pager
				.show()
				.find('.' + opts.classes.pagerItem).each(function(i){
					$(this).click(function(e){
						e.preventDefault();
						change(i, false, false);
					});
				});
			$prev
				.css({
					display: 'block',
					cursor: 'pointer'
				})
				.click(function(e){
					e.preventDefault();
					if(!$(this).hasClass(opts.classes.prevDisabled)){
						change(currIndex-1, false, true);
					}
				});
			$next
				.css({
					display: 'block',
					cursor: 'pointer'
				})
				.click(function(e){
					e.preventDefault();
					if(!$(this).hasClass(opts.classes.nextDisabled)){
						change(currIndex+1, false, true);
					}
				});
				
			if(opts.interval > 0){
				setTimer(currIndex+1);
				$this.hover(function(){
					clearInterval(autoPlayTimer);
				}, function(){
					setTimer(currIndex+1);
				});
			}
			
			$this.bind('changerevolver', function(e, index){
				change(index, false, true);
			});
			$this.bind('stoprevolver', function(e){
				clearInterval(autoPlayTimer);
			});
			$this.bind('startrevolver', function(e){
				setTimer(currIndex+1);
			});
			
			change(currIndex, true);
			
			/**
			 * Sets the timer to run the autoplay functionality
			 * @param: index {int} - index to start autoplay at
			 */
			function setTimer(index){
				var timeIndex = index;
				clearInterval(autoPlayTimer);
				autoPlayTimer = setInterval(function(){
					change(timeIndex, false);
					if(opts.infinite && timeIndex == $items.length) {
						timeIndex = 1;	
					} 	
					else if(!opts.infinite && timeIndex >= $items.length - visibleItems) {
						timeIndex = 0;
					}
					else{
						timeIndex++;
					}
				}, opts.interval);
			}
			/**
			 * Changes the visible panels.
			 * @param: index {int} - index to change to
			 * @param: snap {boolean} - whether to snap or animate
			 * @param: resetTimer {boolean} - whether to reset the timer or not
			 */	
			function change(index, snap, resetTimer){ 
				var duration = snap ? 0 : opts.duration;
				
				if(!opts.infinite){
					if(index > $items.length - visibleItems){
						index = $items.length - visibleItems;
					}
				}
				
				if(opts.interval > 0 && resetTimer){
					clearInterval(autoPlayTimer);
				}
				if(!busy){
					busy = true;
					
					if(opts.infinite){ 
						var left = 0,
							forward = true,
							count = 0,
							limit = index+visibleItems;
						
						if(index < currIndex){
							forward = false;
						}	

						if(index < 0){
							index = items.length-1;
							currIndex = items.length;
						}
						
						if(forward){ 
							for(var i=currIndex; i<limit; i++){		
								
								var item = items[i],
									limitCount = 0;
									
								if(i > (items.length-1)){
									item = items[limitCount];
									limit = limit - i;
									i = 0;
								}
								
								$belt.append(item);
								count++;
							}
							left = (itemWidth*(count-visibleItems))*-1;
						}
						else{
							for(var i=currIndex; i>index; i--){
								$belt.prepend(items[i-1]);
								count++;
							}
							$belt.css('left', (itemWidth*count)*-1);
							left = 0;
						}
						
						if(index > items.length-1){
							index = 0;
						}
						
						$belt.animate({left: left}, duration, function(){
							updatePager(index);
							$belt.children().each(function(i){
								var classes = $(this).attr('class'),
									itemIndex = parseInt(classes.substr(classes.indexOf('index'), 6).substr(5,1));
								
								if(itemIndex < index || itemIndex > index+visibleItems){
									if((index == items.length-2 && itemIndex == 0) 
											|| (index == items.length-1 && (itemIndex == 0 || itemIndex == 1))) 
									{										
									}
									else{
										$(this).remove();
									}
								}
							});
							$belt.css('left', 0);
							busy = false;
							currIndex = index;
						});
					}
					else{
						$belt.animate({left: (index * itemWidth) * -1}, duration, function(){
							updateNavigation(index);
							updatePager(index);
							busy = false;
							
							if(opts.interval > 0 && resetTimer){
								setTimer(index+1);
							}
							currIndex = index;
							$this.trigger('onchangerevolver', currIndex);
						});
					}
				}
			}
			/**
			 * Updates the navigation
			 * @param: index {int} - current index of visible panels
			 */
			function updateNavigation(index){
				if(index == 0){
					$prev.addClass(opts.classes.prevDisabled);
				}
				else{
					$prev.removeClass(opts.classes.prevDisabled);
				}
				
				if(index == $items.length - visibleItems){
					$next.addClass(opts.classes.nextDisabled);
				}
				else{
					$next.removeClass(opts.classes.nextDisabled);
				}
			}
			/**
			 * Updates the pager
			 * @param: index {int} - current index of visible panels
			 */
			function updatePager(index){ 
				$pager.find('.' + opts.classes.pagerItem).each(function(i){
					if((i >= index && i < index+visibleItems) || (i <= index + (visibleItems-1)-items.length)){
						$(this).addClass(opts.classes.pagerItemSelected);
					}
					else{
						$(this).removeClass(opts.classes.pagerItemSelected);
					}
				});
			}
		});
	}
	
})(jQuery);