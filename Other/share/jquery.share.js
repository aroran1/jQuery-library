/**
 * @projectDescription: Allows sharing of links on social networking sites.
 * @version: 1.0
 */
(function($){

	$.fn.share = function(opts){
	
		opts = $.extend({
			elem:	'li',
			url:	location.href,
			title:	$('title').text(),
			popup: 	true,
			sites:	[] //array of objects. E.g. {name: 'facebook', text: false} - name in camelCase
		}, opts);	
		
		return $(this).each(function(){
			for(var site in opts.sites){
				var node = 
					'<' + opts.elem + ' class="' + opts.sites[site].name + '">' +
						'<a target="_blank" href="' + getUrl(opts.sites[site].name) + '">';
						
				if(opts.sites[site].text){
					node += opts.sites[site].name;
				}
				
				node += '</a></' + opts.elem + '>';
				
				var $node = $(node),
					href = $node.find('a').attr('href');
				
				$node.find('a').attr('href', href);
				$(this).append($node);
			}

			if(opts.popup){
				$(this).find('a').click(function(e){
					if(!$(this).parent().hasClass('email')){
						e.preventDefault();
						window.open(
							$(this).attr('href'),
							'_blank',
							'status=no,location=no,menubar=no,scrollbars=yes,toolbar=no,resizable=yes,width=600,height=500'
						);
					}
				});	
			}			
			
			/**
			 * Gets the relevant url for a social networking site.
			 * 
			 * @param: site {String} - name of the site in camelCase
			 * @returns: url {String}
			 */
			function getUrl(site){
				switch(site){
					case 'facebook':
						return 'http://www.facebook.com/sharer.php?u=' + opts.url;
					case 'twitter':
						return 'http://twitter.com/share?text=' + opts.title + '&url=' + opts.url;
					case 'linkedIn':
						return 'http://www.linkedin.com/shareArticle?url=' + opts.url;	
					case 'stumbleUpon':
						return 'http://www.stumbleupon.com/submit?url=' + opts.url;
					case 'digg':
						return 'http://digg.com/submit?url=' + opts.url;
					case 'delicious':
						return 'http://delicious.com/share?title=' + opts.title + '&url=' + opts.url;
					case 'reddit':
						return 'http://reddit.com/submit?title=' + opts.title + '&url=' + opts.url;
					case 'yahoo':
						return 'http://uk.yahoo.com/add?url=' + opts.url;
					case 'buzz':
						return 'http://www.google.com/buzz/post?title=' + opts.title + '&url=' + opts.url;
					case 'email':
						return 'mailto:?Body=' + opts.url;
					default:
						return '';
				}
			}
		});
	}

})(jQuery);