/**
 * @projectDescription: jQuery plugin for replacing default <select> or <ul> with custom ones.
 * @version: 2.2
 */
(function($){
	
	$.fn.customSelect = function(opts){
		opts = $.extend({
			active: 'active',
			startValue: null,
			maxHeight: 300
		}, opts);
		
		return this.each(function(i){			
			var selectExists = true;
			if(!$(this).find('select').length){
				selectExists = false;
			}
			
			var $this = $(this),
				$node = selectExists ? $this.find('select').hide() : $this.find('ul').hide(),
				$valueRegion = $('<div tabIndex="0" class="valueRegion"><div class="valueRegionInner"><div class="arrow"/></div></div>"').appendTo($this),
				$value = $('<div class="value" />').prependTo($valueRegion.find('.valueRegionInner')),
				$menu = $('<div class="customSelectMenu"><div class="customSelectMenuInner"><ul role="menu" id="menu' + i + '" /></div></div>').hide().appendTo($this),
				selectIndex = 0,
				changeCount = 0,
				scrollCount = 1,
				scrollTimer = null;
			
			if(selectExists){
				if(typeof($.fn.prop) == 'function'){
					var selectIndex = $node.prop('selectedIndex');
				}
				else{
					var selectIndex = $node.attr('selectedIndex');
				}
			}

			$node.find('option, li').each(function(){
				var $listItem = $(
					'<li role="menuitem" aria-haspopup="menu' + i + '">' + $(this).text() + '</li>'
				).appendTo($menu.find('ul'));
				
				if($(this).find('a').length){
					$listItem.html(
						'<a href="' + $(this).find('a').attr('href') + '">' + $(this).text() + '</a>'
					);
				}
			});
			
			var $scrollTop = $('<div class="scroll scrollTop" />'),
				$scrollBtm = $('<div class="scroll scrollBottom" />');
				
			if($menu.height() > opts.maxHeight){
				var $scrollRegion = $('<div class="scrollRegion" />')
						.append($menu.find('ul'))
						.css({
							height: opts.maxHeight,
							overflow: 'hidden',
							position: 'relative'
						});
				$scrollTop
					.css('visibility', 'hidden')
					.hover(function(){
						scrollMenu();
					}, function(){
						clearInterval(scrollTimer);
					}),
				$scrollBtm
					.hover(function(){
						scrollMenu(true);
					}, function(){
						clearInterval(scrollTimer);
					});
				
				$menu.find('.customSelectMenuInner')
					.append($scrollRegion)
					.prepend($scrollTop)
					.append($scrollBtm);
					
				$menu.find('ul').css({
					position: 'relative',
					top: 0,
					left:0
				});
				
				
				$menu.show();
				if($(window).height() <= $menu.outerHeight() + $valueRegion.outerHeight()){
					opts.maxHeight = ($(window).height() - ($menu.outerHeight() - $scrollRegion.height())) - ($valueRegion.outerHeight()+40);
					$scrollRegion.height(opts.maxHeight);
				}
				$menu.hide();
			}
			
			$valueRegion.click(function(e){
				e.preventDefault();
				if($menu.is(':visible')){
					highlight();
					close();
				}
				else{
					open();
				}
			});
			$(document).click(function(e){
				if(!$.contains($this[0], e.target)){
					close();
				}
			});
			var $links = $menu.find('li');
			$links.each(function(i){
				$(this)
					.click(function(){
						selectIndex = i;
						change();
						$menu.hide();
					})
					.hover(function(){
						selectIndex = i;
						highlight();
					}, function(){
						$(this).removeClass(opts.active);
					});
			});
			$valueRegion.keyup(function(e){
				var keycode = e.keyCode,
					listSize = $menu.find('li').length-1;
				if(keycode <= 40 && keycode >= 13){
					if((keycode == 40) && (e.altKey)){ //alt & down key
						if(!$menu.is(':visible')){
							open();
						}
					}
					else if(((keycode == 38) && (e.altKey)) || (keycode == 27)){ //alt & up key or esc key
						if($menu.is(':visible')){
							close();
						}
					}
					else if((keycode == 40) || (keycode == 39)){ //down or right key
						if(selectIndex < listSize){
							selectIndex++;
						}
					}
					else if((keycode == 38) || (keycode == 37)){ //up or left key
						if(selectIndex > 0){
							selectIndex--;
						}
					}
					else if((keycode == 34) || (keycode == 35)){ //page down or end key
						if(selectIndex < listSize){
							selectIndex = listSize;
						}
					}
					else if((keycode == 33) || (keycode == 36)){ //page up or home key
						if(selectIndex > 0){
							selectIndex = 0;
						}
					}
					else if(keycode == 13){ //enter key
						close();
						if(!selectExists){
							document.location = $menu.find('li a').eq(selectIndex).attr('href');
						}
					}
					change();
				}
			});
			
			change();
			
			/**
			 * Opens the menu
			 */
			function open(){
				$menu.show();
				$valueRegion.addClass('open');
				$this.trigger('onopencustomselect');
			}
			/**
			 * Closes the menu
			 */
			function close(){
				$menu.hide();
				$valueRegion.removeClass('open');
				$this.trigger('onclosecustomselect');
			}
			/**
			 * Scrolls the menu content
			 * @param: down (boolean) - whether to scroll down or up
			 */
			function scrollMenu(down){
				scrollTimer = setInterval(function(){
					var top = (10 * scrollCount) * -1;
					if(down && top <= opts.maxHeight - $menu.find('ul').outerHeight()){
						clearInterval(scrollTimer);
						$scrollTop.css('visibility', 'visible');
						$scrollBtm.css('visibility', 'hidden');
					}
					else if(!down && top >= 0){
						clearInterval(scrollTimer);
						$scrollTop.css('visibility', 'hidden');
						$scrollBtm.css('visibility', 'visible');
					}
					else{
						$menu.find('ul').css({
							top: top
						});
						$scrollTop.css('visibility', 'visible');
						$scrollBtm.css('visibility', 'visible');
						if(down){scrollCount++;}
						else{scrollCount--;}
					}
				}, 50);
			}
			/**
			 * Remove the active class from all menu items and add it to the selected index
			 */
			function highlight(){
				$links.removeClass(opts.active);
				$links.eq(selectIndex).addClass(opts.active);
			}
			/**
			 * Change the selected value of the custom and real select boxes
			 */
			function change(){
				if(changeCount == 0 && opts.startValue != null){
					$value.text(opts.startValue);
				}
				else{
					$value.text($menu.find('li').eq(selectIndex).text());
				}
				if(selectExists){
					if(typeof($.fn.prop) == 'function'){
						$node.prop('selectedIndex', selectIndex);
					}
					else{
						$node.attr('selectedIndex', selectIndex);
					}
				}
				highlight();
				changeCount++;
			}
		});
	}
	
})(jQuery);