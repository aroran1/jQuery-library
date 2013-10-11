/**
 * @projectDescription: jQuery plugin for creating a tabset
 * @version: 1.3
 * @requires: jquery.fade-elem.js, jquery.address-1.4.min.js (if hashAware is set to true)
 */

(function($){
	$.fn.tabs = function(opts) {
		opts = $.extend({
			node:			'.tabNode',
			content:		'.tabContent',
			heading:		'h2',
			wrapElem:		'ul',
			itemElem:		'li',
			removeHeading: 	true,
			selected:		'selected',
			className:		'',
			itemClassName:	'tab',
			index:			0,
			interval:		-1,
			fadeDuration:	0,
			prepend:		true, //set to false if append is required
			hashAware:		false, //if set to true jquery.address-1.3.2.min.js is required.
			sameHeight:		false  //if set to true, all tabcontents are the same height
		}, opts);
		
		return this.each(function(){
								  
			var $this = $(this),
				$tabList = $('<' + opts.wrapElem + ' class="' + opts.className + '" />'),
				timer = null,
				maxHeight = 0,
				busy = false;
				
			$this.find(opts.node).each(function(i){
				var itemClassName = opts.itemClassName + i,
					hashVal = '#';
					
				if(opts.hashAware){
					hashVal = '#' + opts.itemClassName + i;
				}	
					
				if(i == $this.find(opts.node).length-1){
					itemClassName += ' last';
				}
				$tabList.append('<' + opts.itemElem + ' class="' + itemClassName + '"><a class="' + itemClassName + '" href="' + hashVal + '">' + $(this).find(opts.heading).html() + '</a></' + opts.itemElem + '>');
				if(opts.removeHeading){
					$(this).find(opts.heading).remove();
				}
			});
			
			if(opts.prepend){$this.prepend($tabList);}
			else{$this.append($tabList);}
			
			if(!opts.hashAware){
				change(opts.index, true);
			}
			
			if(opts.sameHeight){
				$this.find(opts.node).each(function(){
					maxHeight = Math.max(maxHeight, $(this).height());
				});
				$this.find(opts.node).height(maxHeight);
				$this.height($this.height());
			}
			
			$tabList.find(opts.itemElem + ' a').each(function(i){
				$(this).click(function(e){
					e.preventDefault();
					if(!busy){
						busy = true;
						clearTimeout(timer);
						
						if(opts.hashAware){
							$.address.value($(this).attr('href').substr($(this).attr('href').indexOf('#')+1, $(this).attr('href').length));
						}
						else{
							change(i);
						}
					}
				});
			});
			$this.bind('tabschange', function(index){
				change(index);
			});
			
			if(opts.interval != -1){
				autoPlay(opts.index+1);
			}
			
			if(opts.hashAware){
				var count = 0;
				$.address.change(function(){
					if($.address.value().substr(0,4) == '/' + opts.itemClassName){
						change($.address.value().substr(4,$.address.value().length), !count);
						count++;
					}
					else {
						if(count == 0){
							change(0, true);
						}
					}
				});
			}
			
			/**
			 * Automatically changes the selected tab
			 * 
			 * @param: {index} - index of selected tab
			 */
			function autoPlay(index){
				timer = setTimeout(function(){
					change(index);
					if(index >= $tabList.find(opts.itemElem).length-1){
						autoPlay(0);
					}
					else{
						autoPlay(index+1);
					}
				}, opts.interval+opts.fadeDuration);
			}
			/**
			 * Changes the selected tab item and displayed content
			 * 
			 * @param: {Int} index - index of selected tab
			 */
			function change(index, snap){
				if($this.find(opts.node + ':visible')[0] != $this.find(opts.node).eq(index)[0] || snap){
					$tabList.find(opts.itemElem).removeClass(opts.selected);
					$tabList.find(opts.itemElem).eq(index).addClass(opts.selected);
					
					var fadeDuration = opts.fadeDuration;
					if(snap){fadeDuration = 0;}
					
					$this.find(opts.node + ':visible').fadeElem({
						fadeSpeed: fadeDuration,
						callback: function(){
							$this.find(opts.node).eq(index).fadeElem({
								fadeSpeed: fadeDuration,
								fadeOut: false,
								callback: function(){
									busy = false;
								}
							});
						}
					});
					
	                $this.trigger('tabsonchange', index);
	            }
	            else{
	            	busy = false;
	            }
			}
		});
	}

})(jQuery)