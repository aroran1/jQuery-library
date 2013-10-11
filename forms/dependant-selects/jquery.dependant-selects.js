/**
 * @projectDescription: jQuery plugin for changing a second select box depending on the value of the first.
 * @version: 1.0
 */
(function($){
	
	$.fn.dependantSelects = function(opts){
		opts = $.extend({
			index: 			0,
			firstSelect: 	'.firstSelect',
			selectResults: 	'.selectResults'
		}, opts);
		
		return this.each(function(){
			var $firstSelect = $(this).find(opts.firstSelect + ' select'),
				$selectResults = $(this).find(opts.selectResults + ' select'),
				$emptySelect = $('<select />').appendTo($selectResults.parent());
			
			change();
			$firstSelect.change(function(){
				change();
			});
			
			/**
			 * Changes the second displayed select box
			 */
			function change(){
				var index = $firstSelect.prop('selectedIndex') - opts.index;
				$selectResults.hide();
				if(index >= 0){
					$emptySelect.hide();
					$selectResults.eq(index).show();
				}
				else{
					$emptySelect.show();
				}
			}
		});
	}
	
})(jQuery);