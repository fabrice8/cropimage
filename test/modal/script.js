

$(document).ready(function(){
  var img
  $('#imagUpload').change(function(e){
    img = e.target.files[0]
    
    $('#image_preview').attr('src', URL.createObjectURL(img))
    $('#image_preview,#crop').removeClass('d-none')
  })

  $('#crop').click(function(){
    var img_link = $('#image_preview').attr('src')

    $('#crop_popup').on('shown.bs.modal', function(){
      const cropOptions = {
        image: img_link,
        // imgFormat: 'auto', // Formats: 3/2, 200x360, auto
        // circleCrop: true,
        zoomable: true,
        // outBoundColor: 'white', // black, white
        btnDoneAttr: '#crop_popup .btn-primary'
      }

      $('#crop_popup .modal-body').cropimage(cropOptions, function(imgURL){
        // Do something with image here...
      } )
    })
    .modal()
  })
})