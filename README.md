# imageResizer
Javascript plugin to resize images in a browser

Integrate it to you web page
<pre>
  <script type="text/javscript" src="jquery.resizeImage.min.js">
</pre><br>

Execute this code to show the resizer in the $("#contain") and then proceed to the resizing
<pre>
$('#contain').resizeImage({
                            image: 'horizontal.jpg',
                            imgFormat: 'auto', // Formats: 3/2, 200x360, auto
                            circleCrop: true,
                            zoomable: true,
                            outBoundColor: 'white', // black, white
                            btnDoneAttr: '.resize-done'
                            }, function( imgResizedURL ){
                              // Callback function when the user click on btnDone
                              // ...
                            } )
</pre>
<strong>Note:</strong> Require jquery plugin as integrated to the test folder

<a href="https://befagh.com/imageresizer/">Demo</a>
