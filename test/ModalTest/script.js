$(document).ready(function(){
  $('#imagUpload').change(function(e){
    var 
    img = e.target.files[0],
    img_link = URL.createObjectURL( img )

    $('#image_preview').attr('src', img_link )
    $('#image_preview,#crop').removeClass('d-none')
  })

  $('#crop').click(function(){
    var img_link=$('#image_preview').attr('src')
    const cropOptions = {
      image: img_link,
      // imgFormat: 'auto', // Formats: 3/2, 200x360, auto
      // circleCrop: true,
      zoomable: true,
      // outBoundColor: 'white', // black, white
      btnDoneAttr: '#crop_popup .btn-primary'
    }

    $('#crop_popup .modal-body').cropimage(cropOptions, function(imgURL){
      /// ...
    } )
    $('#crop_popup').modal()
  })
})