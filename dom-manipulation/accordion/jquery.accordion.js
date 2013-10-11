/**
 * @projectDescription: jQuery plugin for creating an accordion effect on content nodes
 * @version: 1.1
 */
 
(function($){

	$.fn.accordion = function(opts) {
		opts = $.extend({
			node: 		'div.node',
			heading:	'h2',
			content:	'div.content',
			open:		'open',
			speed:		'normal',
			event:		'click',
			update:		[],			//[{selector:'.selector', text:['close','open']}]
			overlap: 	false,
			collapsible: true,
			sameHeight:	true
		}, opts);
		
		return this.each(function(){
			
			var $openNode = null,
				$obj = $(this),
				height = 0,
				enabled = true;
				
			$obj.attr({
				'aria-live': 'polite',
				'aria-relevant': 'all'
			})
				.find(opts.node).each(function(){
				var $this = $(this);
					
				height = Math.max(height, $this.find(opts.content).height());
				$this.find(opts.heading).css('cursor', 'pointer');
				if(!$this.hasClass(opts.open)){
					$this.find(opts.heading).attr('aria-selected', 'false').end()				
						.find(opts.content).attr('aria-hidden', 'true')
						.hide();				
				}
				else{
					$openNode = $this;
					$this.find(opts.heading).attr('aria-selected', 'true').end()				
						.find(opts.content).attr('aria-hidden', 'false');				
					$this.trigger('onopenaccordion');
				}
				
				$this.find(opts.heading).bind(opts.event, function(e){
					e.preventDefault();
					if(enabled){
						toggleNodes($this);
					}
				});
				
				$this.bind('openaccordion', function(){
					if(enabled){
						toggleNodes($this);
					}
				});
			});
			
			if(opts.sameHeight){
				$obj.find(opts.content).height(height);
			}
			
			$obj
				.find(opts.content)
				.bind('closeaccordion', function(){
					if(enabled){
						closeAnimate();
					}
				});
			
			/**
			 * Toggles nodes by calling different animate functions.
			 * 
			 * @param: {jQuery object} $node - node that event was fired on.
			 */
			function toggleNodes($node){
				enabled = false;
				if($openNode){
					if($openNode[0] != $node[0]){
						if(opts.overlap){
							overlapAnimate($node);
						}
						else{
							closeAnimate($node);
						}
					}
					else{
						opts.collapsible ? closeAnimate():enabled = true;						
					}
				}
				else{
					openAnimate($node);
				}
			}
			/**
			 * Animation function called with opts.overlap is set to true.
			 * 
			 * @param: {jQuery object} $node - node that event was fired on.
			 */
			function overlapAnimate($node){
				$node.find(opts.content).height(0).show().css('overflow', 'hidden');
				var height = $openNode.find(opts.content).height();
				$openNode.css('overflow', 'hidden');
				$openNode.find(opts.content).animate({height:0}, {duration:opts.speed, complete:function(){
					close();
					open($node);
					enabled = true;
					$(this).css({display: 'none', height: height});
				}, step: function(heightVal){
					$node.find(opts.content).height(height - heightVal);
				}});
			}
			/**
			 * Animation function called with opts.overlap is set to false and $node is open.
			 * 
			 * @param: {jQuery object} $node - node that event was fired on.
			 */
			function closeAnimate($node){
				$openNode.find(opts.content).slideUp(opts.speed, function(){
					close();
					if($node){
						openAnimate($node);
					}
					else{
						enabled = true;
						$openNode = null;
					}
				});
			}
			/**
			 * Animation function called with opts.overlap is set to false and $node is closed.
			 * 
			 * @param: {jQuery object} $node - node that event was fired on.
			 */
			function openAnimate($node){
				$node.find(opts.content).slideDown(opts.speed, function(){
					open($node);
				});
			}
			/**
			 * Called when a node is closed.
			 */
			function close(){
				$openNode.removeClass(opts.open)
					.find(opts.heading).attr('aria-selected', 'false').end()
					.find(opts.content).attr('aria-hidden', 'true');
				$obj.trigger('oncloseaccordion', $openNode);
				update($openNode, false);
			}
			/**
			 * Called when a node is opened.
			 * 
			 * @param: {jQuery object} $node - node that event was fired on. 
			 */
			function open($node){
				$node.addClass(opts.open)
					.find(opts.heading).attr('aria-selected', 'true').end()
					.find(opts.content).attr('aria-hidden', 'false');
				$node.trigger('onopenaccordion', $node);
				$openNode = $node;
				enabled = true;
				update($node, true);
			}
			/**
			 * Updates the text value of an arbitrary number of selectors, depending on if
			 * the node passed is open or closed.
			 * 
			 * @param: {jQuery object} $node
			 * @param: {boolean} isOpen - if the node passed is open or not.
			 */
			function update($node, isOpen){
				for(var i=0;i<opts.update.length;i++) {
					$(opts.update[i].selector, $node).html(opts.update[i].text[isOpen?0:1]);
				}
			}
		});
	};
})(jQuery);