/**
 * @projectDescription: jQuery plugin for setting a default message for input fields
 * @version: 1.0
 */

(function($){
      $.fn.inputMsg = function(opts) {
            opts = $.extend({
                  message:'Text here...',
                  color:'#ccc'
            }, opts);
            
            return $(this).each(function() {
                  var $this = $(this),
                        defaultColor = $this.css('color');
                  
                  $this
                        .val(opts.message)
                        .css('color', opts.color);
                  
                  $this
                        .blur(function(){
                              if(!$this.val()) {
                                    $this
                                          .val(opts.message)
                                          .css('color', opts.color);
                              }
                        })
                        .focus(function(){
                              if($this.val() == opts.message){
                                    $this
                                          .val('')
                                          .css('color', defaultColor);
                              }
                        });
            });
      }
})(jQuery);
