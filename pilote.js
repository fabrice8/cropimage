
	$(document).ready( function(){
		
		$('#contain').resizeImage({
														image: 'horizontal.jpg',
														// imgFormat: 'auto', // Formats: 3/2, 200x360, auto
														// circleCrop: true,
														// zoomable: true,
														// outBoundColor: 'white', // black, white
														btnDoneAttr: '.resize-done'
														
													}, function( imgResized ){
														
														$('#move-stats').html( '<h3>Resized Image</h3><img style="margin:10% auto;" src="'+ imgResized +'">' )
													} )
	} )