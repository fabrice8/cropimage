# CropImagess
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
```js
import 'cropimages'
import 'cropimages/cropimage.css' // Crop style
```

In browser
```HTML
<link rel="stylesheet" type="text/css" src="cropimage.css">
<script type="text/javscript" src="cropimage.min.js">
```

```js
const options = {
  image: './horizontal.jpg',
  imgFormat: 'auto', // Formats: 3/2, 200x360, auto (default)
  circleCrop: true,
  zoomable: true,
  outBoundColor: 'white', // black, white
  btnDoneAttr: '.btn-cropper-done'
}

$('#contain').cropimage( options, function( imgSrc ){
  /* Callback function that return cropped image source URL when
    the user click on element reference with `btnDoneAttr`
  */

  // ...
} )
```
