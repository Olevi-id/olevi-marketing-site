//
// Scripts
// 

window.addEventListener('DOMContentLoaded', event => {

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            offset: 74,
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

});

const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

$('#submitButton').on('click', function(event) {
    event.preventDefault();
    $('textarea').prop('disabled', true);
    $('#submitButton').prop('disabled', true);
    if ($('textarea').val().length < 1) {
        $('#contactModalText').empty();                   
        $('#contactModalText').text('Tyhjää viestiä ei lähetetä.');
        return;
    };
    $('#contactModalText').addClass('lead');
    $('#contactModalText').empty();
    $('#contactModalText').text('Odota hetki...');
    $.post('https://ch.olevi.fi/webemailer/send',
      { message: $('#message').val(),
                flavor: 'olevi'
             }, function(data) {
        if (data.status == 'sent') {
          $('textarea').val(data.message);
          $('#contactModalText').addClass('lead');
          $('#contactModalText').empty();
          $('#contactModalText').text('Viesti lähetetty.');
        } else if (data.status == 'notSent' && data.reason == 'no tokens') {
          $('#contactModalText').text('Olet lähettänyt liian monta viestiä lyhyessä ajassa. Yritä myöhemmin uudelleen.');
          $('#dialog').dialog({
            title: 'Status: ' + data.status
          });

        }
        $('#submitButton').text('Status: ' + data.status);
    })
      .fail(function (jxhr) {
        if (typeof jxhr.responseJSON == 'undefined') {
        $('#contactModalText').addClass('lead');
          $('#contactModalText').text('Tapahtui virhe.');
          $('#submitButton').text('Error');
        } else {
          $('#submitButton').text('Error: ' + jxhr.responseJSON.error);
        }
      });
  });

