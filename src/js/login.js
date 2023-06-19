(function($) {
  $('#login form').submit(function() {
    $('#message-warning').attr('style', '')

    var $form = $(this)
    var data = $form.serializeArray().reduce((n, c) => {
      return {
        ...n,
        [c.name]: c.value
      }
    }, {})
    console.info('>>> data', data)

    var settings = {
      url: $form.attr('action'), 
      crossDomain: true,
      data: data,
      method: 'post',
      success: (result) => {
        console.info('>>> result', result)
        if(result.error) {
          $('#message-warning').text(result.error).show()
        } else if(!result.url) {
          $('#message-warning').text('Something went wrong, try again later').show()
        } else {
          window.location = result.url
        }
      },
      dataType: 'json'
    }
    console.info('>>> settings', settings)

    $.ajax(settings)

    return false
  });
})(jQuery)
