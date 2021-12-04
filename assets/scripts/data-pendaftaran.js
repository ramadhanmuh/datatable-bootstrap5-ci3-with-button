function adjustIframeHeight() {
    var $body   = $('body'),
        $iframe = $body.data('iframe.fv');
    if ($iframe) {
        // Adjust the height of iframe
        $iframe.height($body.height());
    }
}

// IMPORTANT: You must call .steps() before calling .formValidation()
$('#form-data-pendaftaran').steps({
    headerTag: 'h3',
    bodyTag: 'section',
    onStepChanged: function(e, currentIndex, priorIndex) {
        // You don't need to care about it
        // It is for the specific demo
        adjustIframeHeight();
    },
    // Triggered when clicking the Previous/Next buttons
    onStepChanging: function(e, currentIndex, newIndex) {
        var allInput = $('section').eq(currentIndex).find('input');
        var allSelect = $('section').eq(currentIndex).find('select');
        var validate = true;

        $.each(allInput, function (key, value) {
            var input = allInput.eq(key);
            var value = input.val();

            if (value == '') {
                input.addClass('is-invalid')
                validate = false;
            } else {
                input.removeClass('is-invalid')
            }

            if (allInput.eq(key).hasClass('number')) {
                 if (!$.isNumeric(value)) {
                     input.addClass('is-invalid');
                     validate = false;
                 } else {
                    input.removeClass('is-invalid');
                 }
            }

        });

        $.each(allSelect, function (key, value) {
            var select = allSelect.eq(key);
            var selected = select.find(':selected');

            if (selected.val() === '') {
                validate = false;
                select.addClass('is-invalid');
            } else {
                select.removeClass('is-invalid');
            }

        });

        if (!validate) {
            return false;
        }

        return true;

        console.log(currentIndex)
        // var fv         = $('#form-data-pendaftaran').data('formValidation'), // FormValidation instance
        //     // The current step container
        //     $container = $('#form-data-pendaftaran').find('section[data-step="' + currentIndex +'"]');

        // // Validate the container
        // fv.validateContainer($container);

        // var isValidStep = fv.isValidContainer($container);
        // if (isValidStep === false || isValidStep === null) {
        //     // Do not jump to the next step
        //     return false;
        // }

        // return true;
    },
    // Triggered when clicking the Finish button
    onFinishing: function(e, currentIndex) {
        var fv         = $('#form-data-pendaftaran').data('formValidation'),
            $container = $('#form-data-pendaftaran').find('section[data-step="' + currentIndex +'"]');

        // Validate the last step container
        fv.validateContainer($container);

        var isValidStep = fv.isValidContainer($container);
        if (isValidStep === false || isValidStep === null) {
            return false;
        }

        return true;
    },
    onFinished: function(e, currentIndex) {
        // Uncomment the following line to submit the form using the defaultSubmit() method
        // $('#form-data-pendaftaran').formValidation('defaultSubmit');

        // For testing purpose
        $('#welcomeModal').modal();
    }
})