/**
 * @projectDescription: Replaces default browser scrollbars with custom ones.
 * @version: 1.0
 * @requires: jquery.event.drag-2.0.js, jquery.mousewheel.js
 */
(function($){
	
	$.fn.scrollbars = function(opts) {
		opts = $.extend({
			increment: 20, //px to move content for one click
			wheelMultiplier: 2, //no. x increment to move for one scroll wheel pip
			minSize: 20, //px size of bar
			horizontalScroll: false, //set to true when content within this has explicit width
			active: 'active'
	    }, opts);
	    
	   	return this.each(function() {
	   		var $this = $(this),
	       	 	height = $this.height(),
	        	width = $this.width(),
	        	fullHeight = 0,
	        	fullWidth = 0;
	        	
	        $this.css({overflow: 'auto', position: 'relative', height: 'auto'});
	        fullHeight = $this.height();
	        $this.css({height: height, width: 'auto'});
	        fullWidth = $this.width();
	        $this.css({width: width});
	        
	        if(fullHeight > height){ //if vertical scroll required
	        	appendScrollableInner();				
				$this.css({overflow: 'hidden'});
				setVals(appendScrollbar(), true);
	        }
	        if(fullWidth > width && opts.horizontalScroll){ //if horizontal scroll required
	        	if(!$this.find('.scrollableContent').length){
	        		appendScrollableInner();
	        	}
	        	$this.css({overflow: 'hidden'});
	        	setVals(appendScrollbar());
	        }
	        /*
	         * Sets the values and events for a scrollbar.
	         * 
	         * @param: $node {jQuery object} - wrapping node of scrollbar
	         * @param: vertical {boolean} - if vertical scrollbar or not
	         */
	        function setVals($node, vertical){
	        	var $scrollableContent = $this.find('.scrollableContent'),
	        		$scrollableInner = $this.find('.scrollableInner'),
	        		$scrollBg = $node.find('.scrollBg'),
	        		$scrollBar = $node.find('.scrollBar'),
	        		$scrollBarInner1 = $node.find('.scrollBarInner1'),
	        		$scrollBarInner2 = $node.find('.scrollBarInner2'),
	        		$scrollGrab = $node.find('.scrollGrab').css('position', 'absolute'),
	        		$arrow1 = $node.find('.arrow1'),
	        		$arrow2 = $node.find('.arrow2'),
		        	initMousePos = 0,
					position = 0,
					limit = 0;
	        		
	        	if(vertical){
	        		$node.addClass('verticalScroll').css({top:0, right:0});
	        		$scrollableInner.css({width:width-$node.width()}); 
	        		$scrollBg.height($this.height()-($arrow1.height()+$arrow2.height()));
	        		$scrollBarInner2.height(Math.max($this.height() / $scrollableContent.height() * $scrollBg.height(), opts.minSize));
	        		$scrollGrab.css('top', $scrollBarInner2.height()/2);
	        		$scrollBar.css('top', 0);
					limit = $scrollBg.height() - $scrollBar.height();
					
					$this.mousewheel(function(e, delta){
						e.preventDefault();
						if (delta > 0){
							scrollCall(opts.increment/opts.wheelMultiplier,true);
						}
						else if (delta < 0){
							scrollCall(opts.increment/opts.wheelMultiplier);
						}
					});
	        	}
	        	else{
	        		$node.addClass('horizontalScroll').css({bottom:0, left:0});
	        		$scrollableInner.height(height-$node.height()); 
	        		$scrollBg.width($this.width()-($arrow1.width()+($arrow2.width()*2)));
	        		$scrollBarInner2.width(Math.max($this.width() / $scrollableContent.width() * $scrollBg.width(), opts.minSize));
	        		$scrollGrab.css('left', $scrollBarInner2.width()/2);
	        		$scrollBar.css('left', 0);
	        		limit = $scrollBg.width() - $scrollBar.width();
	        	}
	        	updateArrows(position, limit, $arrow1, $arrow2);
	        	$arrow1.click(function(){
	        		if($arrow1.hasClass('active')){
						scrollCall(opts.increment, true);
					}						
				});
				$arrow2.click(function(){
					if($arrow2.hasClass('active')){
						scrollCall(opts.increment);
					}
				});
				
				$scrollBg.click(function(e){
					if(vertical){
						if(e.pageY - Math.ceil($scrollBg.offset().top) < position){
							scrollCall(1, true, $scrollBar.height());
						}
						else if(e.pageY - Math.ceil($scrollBg.offset().top) > position + $scrollBar.height()){
							scrollCall(1, false, $scrollBar.height());
						}
					}
					else{
						if(e.pageX - Math.ceil($scrollBg.offset().left) < position){
							scrollCall(1, true, $scrollBar.width());
						}
						else if(e.pageX - Math.ceil($scrollBg.offset().left) > position + $scrollBar.width()){
							scrollCall(1, false, $scrollBar.width());
						}
					}
				});
				
				$scrollBar
					.bind('dragstart', function(e){
						if($.contains($scrollBar[0], e.target)){
							initMousePos = e.pageY;
							position = parseFloat($scrollBar.css('top'));
							if(!vertical){
								initMousePos = e.pageX;
								position = parseFloat($scrollBar.css('left'));
							}	
						}					
					})
					.bind('drag', function(e){
						mouseMoveHandler(e);			   
					})
					.bind('dragend', function(e){
						$scrollBar.unbind('mousemove', mouseMoveHandler);
						position = parseFloat($scrollBar.css('top'));
						if(!vertical){
							position = parseFloat($scrollBar.css('left'));
						}
					});
				
				function scrollCall(increment, back, len, mousePos){
					var	length = $scrollBg.height();
					if(!vertical){
						length = $scrollBg.width();
					}
					if(len){
						length = len;
					}
					if(isNaN(mousePos)){
						var pos = position + length/increment;
						if(back){
							pos = position - length/increment;
						}
						position = scroll(vertical, pos, limit, $scrollBg, $scrollBar, $scrollableContent, $arrow1, $arrow2);
					}
					else{
						pos = mousePos;
						scroll(vertical, pos, limit, $scrollBg, $scrollBar, $scrollableContent, $arrow1, $arrow2);
					}
				}
				
				function mouseMoveHandler(e){
					var diff = e.pageY - initMousePos;
					if(!vertical){
						diff = e.pageX - initMousePos;
					}
					var pos = position + diff;
					scrollCall(opts.increment, false, false, pos);
				}
	        }
	        /**
	         * Update the 'active' state of the arrows based on position of bar.
	         * 
	         * @param: position {float} - top or left value of scrollbar
	         * @param: limit {int} - limit of scrollbar i.e. bottom/right of scroll region
	         * @param: $arrow1 {jQuery object} - down or right arrow
	         * @param: $arrow2 {jQuery object} - up or left arrow
	         */
	        function updateArrows(position, limit, $arrow1, $arrow2){
	        	if(position <= 0){
					$arrow1.removeClass(opts.active);
				}
				else if(position > 0){
					$arrow1.addClass(opts.active);
				}
				if(position >= limit){
					$arrow2.removeClass(opts.active);
				}
				else if(position < limit){
					$arrow2.addClass(opts.active);
				}
	        }
	        /**
	         * Moves the scrollbar and the scrollable content
	         * 
	         * @param: vertical {boolean} - if vertical scrollbar or not
	         * @param: position {float} - top or left value of scrollbar
	         * @param: limit {int} - limit of scrollbar i.e. bottom/right of scroll region
	         * @param: $scrollBg {jQuery object} - scroll region
	         * @param: $scrollBar {jQuery object} - scrollbar
	         * @param: $scrollableContent {jQuery object} - scrollable content container
	         * @param: $arrow1 {jQuery object} - down or right arrow
	         * @param: $arrow2 {jQuery object} - up or left arrow
	         * @returns: returnPos {float} - new value of top or left value of scrollbar
	         */
	        function scroll(vertical, position, limit, $scrollBg, $scrollBar, $scrollableContent, $arrow1, $arrow2){
	        	if(position > limit){
					position = limit;
				}
				if(position < 0){
					position = 0;	
				}
				var returnPos = 0;
				if(vertical){
		        	var scrollGapHeight = $scrollBg.height() - $scrollBar.height(),
						scrollPercent = (position / scrollGapHeight) * 100,
						scrollableInnerHeightPercent = ($scrollableContent.height() + $this.find('.horizontalScroll').height()) / 100,
						contentPos = (scrollableInnerHeightPercent * scrollPercent) - ($this.height() * (scrollPercent/100));
					
					$scrollBar.css({top:position});
					$scrollableContent.css({top:(contentPos)*-1});
					returnPos = parseFloat($scrollBar.css('top'));
				}
				else{
					var scrollGapWidth = $scrollBg.width() - $scrollBar.width(),
						scrollPercent = (position / scrollGapWidth) * 100,
						scrollableInnerWidthPercent = ($scrollableContent.width() + $this.find('.verticalScroll').width())/ 100,
						contentPos = (scrollableInnerWidthPercent * scrollPercent) - ($this.width() * (scrollPercent/100));
					
					$scrollBar.css({left:position});
					$scrollableContent.css({left:(contentPos)*-1});
					returnPos = parseFloat($scrollBar.css('left'));
				}
				updateArrows(position, limit, $arrow1, $arrow2);
				return returnPos;
	        }
	        /**
	         * Appends '.scrollableInner' and '.scrollableContent' divs.
	         */
	        function appendScrollableInner(){
	        	var $scrollableContent = $('<div class="scrollableContent" />')
	        		.css({position:'absolute', top:0})
	        		.append($this.children())
	        		.appendTo($this);
	        		
	        	$('<div class="scrollableInner" />')
	        		.css({overflow: 'hidden', position: 'relative', width: width, height: height})
	        		.append($scrollableContent)
	        		.appendTo($this);
	        }
	        /**
	         * Appends entire scroll region.
	         * 
	         * @returns: $scrollRegion {jquery object} - scroll region
	         */
	        function appendScrollbar(){
	        	var $scrollRegion = $(
					'<div class="scrollWrapper">' +
						'<div class="arrow arrow1">' +
							'<div class="arrow1Inner" />' +
						'</div>' +
						'<div class="scrollBg">' +
							'<div class="scrollBar">' +
								'<div class="scrollBarInner1">' +
									'<div class="scrollBarInner2">' +
										'<div class="scrollGrab" />' +
									'</div>' +
								'</div>' +
							'</div>' +
						'</div>' +
						'<div class="arrow arrow2">' +
							'<div class="arrow2Inner" />' +
						'</div>' +
					'</div>'
				)
				.appendTo($this)
				.css('position', 'absolute');
				$scrollRegion
					.find('.scrollBg').css('position', 'relative')
					.find('.scrollBar').css({position: 'absolute', cursor: 'pointer'});
				return $scrollRegion;
	        }
	    });
	}
	
})(jQuery);