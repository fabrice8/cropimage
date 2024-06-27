$(function(){
  const options = {
    /** Source of the image to crop: 
      * - Relative URL
      * - Absolute URL
      * - Blob URL
      * - base64
      * 
      * Default: undefined
      */
    image: '../images/horizontal.jpeg',

    /** Minimum crop image dimensions
     * 
     * Options:
     * - `auto` allow full dynamic resizing crop
     * - `A/B` format works like 'auto' but defines cropping width and height ratio. Eg. 1/2, 5/3, 4/4, ...
     * - `PxN` format define static image sizes. Eg. 200x360 (width: 200px, height: 360px)
     * 
     * Default: auto
     */
    imgFormat: 'auto',

    /** Minimum crop image dimensions
     * 
     * NOTE: If `imgFormat` is in for example A/B format, only 
     * one of `minWidth` and `minHeight` can be define. If both are
     * define, `minWidth` will be use to calculate `minHeight`,
     * visa-versa respective to their adaptive ratio.
     * 
     * Default: auto (For both)
     */
    minWidth: 100,
    minHeight: 100,

    /**
     * Cropping area bordering type: Circle or Square
     * 
     * Default: false (Square)
     */
    circleCrop: false,

    /**
     * Zoomable image before crop
     * 
     * Default: true
     */
    zoomable: true,

    /** 
      * Cropper container background
      *
      * Options:
      * - transparent
      * - custom (In this case, set your background style to the cropper container)
      *   Eg. black, rgb(100, 100, 120), #fff000, etc
      * 
      * Default: transparent
      */
    background: 'transparent',

    /**
     * Show seperation grid within cropping area
     * 
     * Default: true
     */
    inBoundGrid: true,

    /** Surrending out-bound cropping area mode:
      *
      * Options:
      * - light
      * - dark (Default)
      * - none
      * 
      * Default: light
      */
    outBoundColor: 'none',

    /**
     * Cropper area border
     * 
     * Default: true
     */
    noBorder: false
  },

  // Initiate cropper
  cropper = $('#contain').cropimage( options )
  
  $('.button-crop').on('click', function(){
    // Get the cropped image source URL
    const blobDataURL = cropper.getImage('PNG') // JPEG, PNG, ...
    if( !blobDataURL ) return
    
    // Callback with cropped image's blob generated URL
    $('#move-stats').html('<h3>Cropped Image</h3><img style="margin:10% auto;" src="'+ blobDataURL +'">')
  })

  $('.button-reset-crop').on('click', function(){
    cropper.reset()
  })
})