
$(window).load(function() {
  // Delay load due to IE not fetching correct co-ordinates after ads are injected. This allows final page co-ordinates to be used after page is rendered and ad injector has finished its changes
  if($.browser.msie){
      setTimeout(stickyContent, 10);
  }else{
    stickyContent();
  }
});

function stickyContent() {

    $('#contentColumn').css('position', 'static');

    // stickyBlock modified upon DOM being ready, using 'load' to execute only after AD Injector has finished its modifications
    var stickyBlock = $('#block-hcmadinjector-placeholder-mpu2');

    stickyBlock.css('display', 'block');
    stickyBlock.css('float', 'left');
    stickyBlock.css('top', 'auto');
    stickyBlock.css('left', 'auto');
    stickyBlock.css('right', 'auto');
    stickyBlock.css('width', stickyBlock.width());

    //stickyBlock breaks out of flow using this function, dynamically calculate new height and apply here via JQuery
    var colRight = $('#sidebar');
    //var newHeight = (colRight.height() + stickyBlock.height());
    $('#sidebar').css({ height: colRight.height() });


    // Sticky Scrollbar
    if ($(stickyBlock).size()) {
        var scroller = new StickyScroller(stickyBlock,
	    {
	        start: stickyBlock.offset().top,
	        end: $(document).height() - ($('#footerWrapper').height() + stickyBlock.height() + 80),
	        range: stickyBlock.height(),
	        margin: 20
	    });
	}

}

/*
// ORIGINAL CODE
function stickyContent(){
   // MPU modified upon DOM being ready, using 'load' to execute only after AD Injector has finished its modifications	
   var MPU = $('#block-hcmadinjector-placeholder-mpu2');     
   
   //MPU breaks out of flow using this function, dynamically calculate new height and apply here via JQuery
   var colRight = $('#sidebar');
   //var newHeight = (colRight.height() + MPU.height());
   $('#sidebar').css({ height: colRight.height() });
   
   MPU.css('top','auto');
   MPU.css('left','auto');
   MPU.css('right','auto');
   
   // Sticky Scrollbar
   var scroller = new StickyScroller(MPU,
	{
	    start: MPU.offset().top,
	    end: $(document).height(),
	    range:MPU.height(),
	    margin: 20
  });

}
*/