/*
 * @projectDescription: Creates a lightbox to display full-size photos one by one
 * @version: 1.0
 * @requires: jquery.lightbox.js
 */

(function($){
	
	$.fn.photoGallery = function(opts) {
		
		opts = $.extend({
			itemSelector: '.photo',
			lightboxClassName: 'photoGallery',
			includeNav: true,
			includeTitle: true
		}, opts);
		
		var $obj = this;
		$obj.totalPhotos = this.find(opts.itemSelector).length;
		
		return this.each(function() {
			var $lightbox = null;
			/*
			 * Event handler for clicking on a thumbnail. Gets the index of the clicked thumbnail.
			 */
			$obj.find(opts.itemSelector).click(function() {
				$obj.currentPhoto = $obj.find(opts.itemSelector).index(this);
				open();
				return false;
			});
			
			/*
			 * Opens the lightbox and sets click event handlers to 'previous' and 'next' buttons
			 */
			function open() {
				var content = '<div id="lightboxPhotoFrame"><img src="" id="lightboxPhoto" style="display: none;" /></div>';
				if(opts.includeNav && $obj.totalPhotos>1) {content += '<a href="#" class="prev">Previous</a><a href="#" class="next">Next</a>';}
				if(opts.includeTitle) {content += '<span id="lightboxPhotoTitle"></span>';}
				
				$lightbox = $.lightbox({
					className: opts.lightboxClassName,
					content: content
				});
				
			    $lightbox.find('.prev').click(function() {
			    	if($obj.currentPhoto > 0) {
				    	$obj.currentPhoto--;		    		
				    	updatePhoto();		    		
			    	}
					return false;
			    });
		    		    		
			     $lightbox.find('.next').click(function() {
			    	if($obj.currentPhoto < $obj.totalPhotos-1) {
				    	$obj.currentPhoto++;
				    	updatePhoto();		    		
			    	}
					return false;
			    });
			    
				updatePhoto();	
			}
			
			/*
			 * Removes current photo, appends new hidden photo, fades it in when loaded
			 */
			function updatePhoto() {
		    	$('#lightboxPhoto').fadeOut('normal', function() {
		    		$(this).remove();
		    		
			    	$('<img id="lightboxPhoto" />')
			    		.hide()
			    		.appendTo('#lightboxPhotoFrame');
			    		
			    	$('#lightboxPhoto').load(function() {
			    		if($('#lightboxPhotoFrame').height() != $('#lightboxPhoto').height() || $('#lightboxPhotoFrame').width() != $('#lightboxPhoto').width()) {
			    			animateLightbox();
			    		}
			    		else {
			    			$('#lightboxPhoto').fadeIn();
			    			$('#lightboxPhotoTitle').text($obj.find(opts.itemSelector).eq($obj.currentPhoto).attr('title'));
			    		}
			    	}).attr('src', $obj.find(opts.itemSelector).eq($obj.currentPhoto).attr('href'));
		    	});
		    	
		    	updateNav();
			}
			
			/*
			 * Toggles CSS class of 'previous' and 'next' buttons at the beginning and end of a slideshow
			 */
			function updateNav() {
				 $lightbox.find('.prev').toggleClass('disabled', $obj.currentPhoto === 0);
				 $lightbox.find('.next').toggleClass('disabled', $obj.currentPhoto === $obj.totalPhotos-1);
			}
			
			/*
			 * Animates the width and height of the lightbox between photo changes.
			 */
			function animateLightbox() {
    			var startPos = $lightbox.position();
	    		$('#lightboxPhotoFrame').animate({
	    			'width': $('#lightboxPhoto').width()
	    		}, {
	    			duration: 500,
	    			step: function(now, fx) {
	    				var distance = (now-fx.start)/2;
	    				$lightbox.css('left', startPos.left - distance);
	    			},
	    			complete: function() {
			    		$('#lightboxPhotoFrame').animate({
			    			'height': $('#lightboxPhoto').height()
			    		}, {
			    			duration: 500,
			    			step: function(now, fx) {
			    				var distance = (now-fx.start)/2;
			    				$lightbox.css('top', startPos.top - distance);
			    			},
			    			complete: function() {
			    				$('#lightboxPhoto').fadeIn();
			    				$('#lightboxPhotoTitle').text($obj.find(opts.itemSelector).eq($obj.currentPhoto).attr('title'));
			    			}
			    		});
	    			}
	    		});				
			}
			
		});
	}	
})(jQuery);
