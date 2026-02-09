//
// Scripts
//

window.addEventListener('DOMContentLoaded', ()  => {

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            offset: 74,
        });
    }

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

const submitButton = document.getElementById('submitButton');
const messageTextarea = document.getElementById('message');
const contactModalText = document.getElementById('contactModalText');

if (submitButton) {
    submitButton.addEventListener('click', function(event) {
        event.preventDefault();

        if (messageTextarea) {
            messageTextarea.disabled = true;
        }
        submitButton.disabled = true;

        const messageValue = messageTextarea ? messageTextarea.value : '';

        if (messageValue.length < 1) {
            if (contactModalText) {
                contactModalText.textContent = 'Tyhjää viestiä ei lähetetä.';
            }
            return;
        }

        if (contactModalText) {
            contactModalText.classList.add('lead');
            contactModalText.textContent = 'Odota hetki...';
        }

        fetch('https://ch.olevi.fi/webemailer/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                message: messageValue,
                flavor: 'olevi'
            })
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw err; }).catch(() => { throw new Error('Network response was not ok'); });
            }
            return response.json();
        })
        .then(data => {
            if (data.status === 'sent') {
                if (messageTextarea) {
                    messageTextarea.value = data.message;
                }
                if (contactModalText) {
                    contactModalText.classList.add('lead');
                    contactModalText.textContent = 'Viesti lähetetty.';
                }
            } else if (data.status === 'notSent' && data.reason === 'no tokens') {
                if (contactModalText) {
                    contactModalText.textContent = 'Olet lähettänyt liian monta viestiä lyhyessä ajassa. Yritä myöhemmin uudelleen.';
                }
                // The original code used $('#dialog').dialog(...) which looks like jQuery UI.
                // However, I don't see jQuery UI being loaded in index.pug.
                // Keeping it as a comment or safe check if needed, but standardizing on what we have.
                console.log('Status: ' + data.status);
            }
            submitButton.textContent = 'Status: ' + data.status;
        })
        .catch(error => {
            if (contactModalText) {
                contactModalText.classList.add('lead');
                contactModalText.textContent = 'Tapahtui virhe.';
            }
            if (error && error.error) {
                submitButton.textContent = 'Error: ' + error.error;
            } else {
                submitButton.textContent = 'Error';
            }
        });
    });
}

