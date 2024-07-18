$(document).ready(function() {

    // 
    $('form input, form select').on('input change', function() {
        var isValid = true;
        var $input = $(this);
        if ($input.prop('required') && !$input.val()) {
            isValid = false;
        }
        if ($input.attr('pattern') && $input.val() && !RegExp($input.attr('pattern')).test($input.val())) {
            isValid = false;
        }
        if (isValid) {
            $input.removeClass('is-invalid').addClass('is-valid');
            $input.next('.invalid-feedback').hide();
        } else {
            $input.removeClass('is-valid').addClass('is-invalid');
            $input.next('.invalid-feedback').show();
        }
    });

    
});