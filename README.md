# CropImage
Javascript library to crop images in a browser

![Demo picture](https://github.com/fabrice8/cropimage/blob/master/test/images/demo.png?raw=true)

## Install

```
npm install cropimages
```
or
```
yarn install cropimages
```

## Usage
**Note:** It requires **jquery** library

In node environment
```JS
import 'cropimages'
import 'cropimages/cropimage.css' // Crop style
```

In browser
```HTML
<link rel="stylesheet" type="text/css" src="https://unpkg.com/cropimages@0.0.4/cropimage.min.css">
<script type="text/javscript" src="https://unpkg.com/cropimages@0.0.4/cropimage.min.js">
```

```JS
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
    * Default: none
    */
  outBoundColor: 'none',

  /**
   * Cropper area border
   * 
   * Default: true
   */
  noBorder: false
}

// Initiate cropper
const cropper = $('#contain').cropimage( options )

$('.button-crop').on('click', function(){
  // Get the cropped image source URL
  const blobDataURL = cropper.getImage('PNG') // JPEG, PNG, ...
  // Callback with cropped image's blob generated URL
  $('#move-stats').html('<h3>Cropped Image</h3><img style="margin:10% auto;" src="'+ blobDataURL +'">')
})

$('.button-reset').on('click', function(){
  // Reset cropper to its initial state
  cropper.reset()
})
```

Voilà!

Feedback & Contribution
-------

You know the say: No one is whole alone! So, feedback and the smallest contributions you can think of are all welcome. Kindly report any encounted [Issues here][] and I'll be glad to work on it right away. Thank you.


License
-------

This software is free to use under the MIT license. See the [LICENSE file][] for license text and copyright information.


[LICENSE file]: https://github.com/fabrice8/cropimage/blob/master/LICENSE
[Issues here]: https://github.com/fabrice8/cropimage/issues