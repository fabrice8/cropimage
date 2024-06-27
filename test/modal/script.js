

$(document).ready(function(){
  var img
  $('#imagUpload').change(function(e){
    img = e.target.files[0]
    
    $('#image_preview').attr('src', URL.createObjectURL(img))
    $('#image_preview,#crop').removeClass('d-none')
  })

  let cropper
  $('#crop').click(function(){
    var img_link = $('#image_preview').attr('src')

    $('#crop_popup').on('shown.bs.modal', function(){
      const cropOptions = {
        image: img_link,
        // imgFormat: 'auto', // Formats: 3/2, 200x360, auto
        // circleCrop: true,
        zoomable: true
      }

      // Initiate cropper
      cropper = $('#crop_popup .modal-body').cropimage( cropOptions )

      setTimeout( () => {console.log('set-image'); cropper.setImage( img_link )}, 8000 )
    })
    .modal()
  })

  $('#crop_popup').on('click', '.crop-it', function(){
    // Get the cropped image source URL
    const blobDataURL = cropper.getImage('PNG') // JPEG, PNG, ...
    if( !blobDataURL ) return

    // Do something ...
  })
  $('#crop_popup').on('click', '.reset-it', function(){
    cropper.reset()
  })
})