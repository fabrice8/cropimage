# imageResizer
Jquery plugin to resize/crop images in a browser

## Usage

```js
  <script type="text/javscript" src="jquery.imageResizer.min.js">
```

```js
$('#contain').imageResizer({
                            image: 'horizontal.jpg',
                            imgFormat: 'auto', // Formats: 3/2, 200x360, auto
                            circleCrop: true,
                            zoomable: true,
                            outBoundColor: 'white', // black, white
                            btnDoneAttr: '.resize-done'
                            }, function( imgResizedURL ){
                              // Callback function when the user click on element reference with `btnDoneAttr`
                              // ...
                            } )
```
**Note:** Requires **jquery** library
