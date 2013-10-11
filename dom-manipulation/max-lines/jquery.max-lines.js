/**
 * @projectDescription: jQuery plugin for limiting the maximum number of lines of text in an element
 * @version: 1.0
 */

(function($){
	
	$.fn.maxLines = function(n, opts) {
	        
	   	return $(this).each(function() {
	   		opts = $.extend({suffix:'...'}, opts);
	   		
	        var $this=$(this),
	        txt=$this.text(),
	        orig=txt,
	        lh;
	
	        lh=$this.css('height','auto').text('.').height();
	        $this.text(txt);
	        while($this.height()>n*lh&&txt.length) {
	            txt=txt.substr(0,txt.length-1).replace(/\W$/,'');
	            $this.text(txt+opts.suffix);
	        }
	        if(txt!==orig) {
	            $this.closest('a').attr('title',orig);
	        }
	    });
	}
	
})(jQuery);