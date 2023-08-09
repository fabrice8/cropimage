$(document).ready( function(){
  const options = {
    /* Source of the image to crop: 
      * - Relative URL
      * - Absolute URL
      * - Blob URL
      * - base64 
      */
    image: '../images/horizontal.jpeg',

    /** Minimum crop image dimensions
     * 
     * Options:
     * - `auto` allow full dynamic resizing crop
     * - `A/B` format works like 'auto' but defines cropping width and height ratio. Eg. 1/2, 5/3, 4/4, ...
     * - `PxN` format define static image sizes. Eg. 200x360 (width: 200px, height: 360px)
     */
    imgFormat: 'auto',

    /** Minimum crop image dimensions
     * 
     * NOTE: If `imgFormat` is in for example A/B format, only 
     * one of `minWidth` and `minHeight` can be define. If both are
     * define, `minWidth` will be use to calculate `minHeight`,
     * visa-versa respective to their adaptive ratio.
     */
    minWidth: 100,
    minHeight: 100,

    /* Cropping area bordering type: Circle or Square (Default) */
    circleCrop: false,

    /* Zoomable image before crop */
    zoomable: true,

    /* Cropper container background
      *
      * Options:
      * - transparent (Default)
      * - custom (In this case, set your background style to the cropper container)
      */
    background: 'transparent',

    /* Show seperation grid within cropping area */
    inBoundGrid: true,

    /* Surrending out-bound cropping area mode:
      *
      * Options:
      * - light
      * - dark (Default)
      * - none
      */
    outBoundColor: 'none',

    /* Select attribute of the HTML Element that will trigger crop-done event */
    btnDoneAttr: '.btn-cropper-done'
  }

  // Initiate cropper
  $('#contain').cropimage( options, function( blobURL ){
    // Callback with cropped image's blob generated URL
    $('#move-stats').html('<h3>Cropped Image</h3><img style="margin:10% auto;" src="'+ blobURL +'">')
  } )
} )