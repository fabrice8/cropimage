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
  /* Source of the image to crop: 
    * - Relative URL
    * - Absolute URL
    * - Blob URL
    * - base64 
    */
  image: 'images/vertical.jpeg',

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
  circleCrop: true,

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

$('#contain').cropimage( options, function( imgSrc ){
  /* Callback function that return cropped image source URL when
    the user click on element reference with `btnDoneAttr`
  */

  // Do something with the image here...
} )
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