function refreshCaptcha() {
    var baseUrl = $('meta[name="url"]').attr('content');
    var url =  baseUrl + 'masuk/refresh_captcha_json';

    $.ajax({
        'url': url,
        'success': function (data, textStatus, jqXHR) {
            $('#captcha-img').attr(
                'src', baseUrl + 'captcha/' + data
            )
        }
    })
}

$(document).ready(function () {
    $('#refresh-captcha-btn').click(function () {
        refreshCaptcha();
    });
});
