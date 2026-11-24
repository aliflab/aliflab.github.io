
document.addEventListener('DOMContentLoaded', function() {

    document.getElementById('contactForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission

        var form = this;
        var data = new FormData(form);
        var button = form.querySelector('button[type="submit"]');
        button.disabled = true; // stop double-clicks sending the message twice

        fetch(form.action, {
            method: form.method,
            body: data,
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => {
            if (response.ok) {
                form.reset(); // Clear the form
                document.getElementById('resultMessage').style.display = 'block'; // Show the success message
            } else {
                response.json().then(data => {
                    if (data.errors) {
                        alert('Something went wrong. Please check your entry and try again.');
                    } else {
                        alert('Oops! There was a problem submitting your form');
                    }
                }).catch(() => {
                    // error body was not JSON (e.g. an HTML 5xx or 429 page)
                    alert('Oops! There was a problem submitting your form');
                });
            }
        }).catch(error => {
            alert('Error: ' + error);
        }).finally(() => {
            button.disabled = false;
        });
    });
});
