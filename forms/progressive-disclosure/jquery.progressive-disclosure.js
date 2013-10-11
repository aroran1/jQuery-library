/**
 * @projectDescription: jQuery plugin for allowing for progressive disclosure within forms
 * @version: 1.0
 */
(function($){
	
	$.fn.progressiveDisclosure = function(opts){
		opts = $.extend({
			rules:		[],
			question:	'.progressiveDisclosureQuestion',
			content:	'.progressiveDisclosureContent',
			duration:	'normal'
		}, opts);
			
		return this.each(function(){		
			var $this = $(this),
				$questions = $this.find(opts.question),
				$content = $this.find(opts.content).hide(),
				showContent = true;
				
			$questions.each(function(){
				var $input = $(this).find('input');
				if($input.length){
					$input.click(function(){
						checkRules();
						showHide();
					});
				}
				else{
					var $select = $(this).find('select');
					$select.change(function(){
						checkRules();
						showHide();
					});
				}
			});
			
			checkRules();
			showHide(true);
			/**
			 * Shows or hides the content based on the boolean value of showContent.
			 * 
			 * @param: {boolean} snap - whether the content should slide or not
			 */
			function showHide(snap){
				var duration = opts.duration;
				if(snap){duration = 0;}
				if(showContent){
					$content.slideDown(duration);
				}
				else{
					$content.slideUp(duration);
				}
			}
			/**
			 * Checks if the current selection of form elements matches a rule. If so
			 * showContent is set to true, if not showContent is set to false.
			 */
			function checkRules(){
				for(var i=0; i<opts.rules.length; i++){
					$questions.each(function(j){
						var index = opts.rules[i][j],
							$input = $(this).find('input');
						if($input.length){
							if(index != -1 && $input.eq(index).length && !$input.eq(index).is(':checked')){
								showContent = false;
								return false;
							}
							else{
								showContent = true;
							}
						}
						else{
							var $select = $(this).find('select');
							if(index != -1 && $select.eq(index).length && $select.prop('selectedIndex') != index){
								showContent = false;
								return false;
							}
							else{
								showContent = true;
							}
						}
					});
					if(showContent == true){
						return;
					}
				}
			}
		});
	}
	
})(jQuery);
