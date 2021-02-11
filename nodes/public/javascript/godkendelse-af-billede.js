function validateAndUpdateImage(labelId, inputId, imageTypeError, imageDimensionsError, imageSizeError, cropperModal,
                                cropFrameId, imageElement, crop64base) {
    document.getElementById(imageTypeError).hidden = true;
    document.getElementById(imageDimensionsError).hidden = true;
    document.getElementById(imageSizeError).hidden = true;

    let file = document.getElementById(inputId).files[0];

    // Get dimensions of the image
    if (file.type === "image/jpeg" || file.type === "image/jpg" || file.type === "image/png") {
        let _URL = window.URL || window.webkitURL;
        let img = new Image();
        img.src = _URL.createObjectURL(file);

        // Check the aspect ratio and dimensions
        img.onload = function () {
            if (this.width < 250 || this.height < 250){
                document.getElementById(inputId).value = '';
                document.getElementById(imageDimensionsError).hidden = false;
                return;
            }
            if (file.size > 10000000) {
                console.log("Invalid image");
                document.getElementById(inputId).value = '';
                document.getElementById(imageSizeError).hidden = false;
            } else {
                $('#' + cropperModal).modal({
                    backdrop: 'static',
                    keyboard: false
                });


                $('#' + cropperModal).modal('show');

                let src = this.src;
                let cropper;

                $('#' + cropperModal).on('shown.bs.modal', function (event) {
                    let cropFrame = document.getElementById(cropFrameId);
                    cropFrame.src = src
                    cropper = new Cropper(cropFrame, {
                        aspectRatio: 1 / 1,
                        viewMode: 1,
                        movable: false,
                        zoomable: false,
                        rotable: false,

                        ready() {

                            $('#confirm').click(function () {

                                let canvas = cropper.getCroppedCanvas({
                                    minWidth: 250,
                                    minHeight: 250,
                                    maxWidth: 2048,
                                    maxHeight: 2048
                                });
                                
                                let dataUrl = canvas.toDataURL('image/jpeg');

                                document.getElementById(crop64base).value = dataUrl.split(';base64,')[1];
                                document.getElementById(imageElement).src = dataUrl;
                                document.getElementById(labelId).innerHTML = document.getElementById(inputId).files[0].name;
                            });

                            $('#close').click(function () {
                                document.getElementById(inputId).value = '';
                            })

                        }
                    });
                })

                $('#' + cropperModal).on('hidden.bs.modal', function (event) {
                    cropper.destroy();
                    cropper = null;
                    cropFrame.src = '';
                    $('#' + cropperModal).off('shown.bs.modal');
                    $('#' + cropperModal).off('hidden.bs.modal');
                    $('#confirm').off('click');
                    $('#close').off('click');
                });
            }
        }

    } else {
        console.log("Invalid file type");
        document.getElementById(imageTypeError).hidden = false;
    }
}