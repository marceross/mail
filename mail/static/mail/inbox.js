document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

    // Show compose view and hide other views
    document.querySelector('#emails-view').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'block';

    // Clear out composition fields
    document.querySelector('#compose-recipients').value = '';
    document.querySelector('#compose-subject').value = '';
    document.querySelector('#compose-body').value = '';   

  document.querySelector('#compose-form').onsubmit = function() {
      fetch('/emails', {
              method: 'POST',
              body: JSON.stringify({
                  recipients: document.querySelector('#compose-recipients').value,
                  subject: document.querySelector('#compose-subject').value,
                  body: document.querySelector('#compose-body').value,
              }),
          })
          .then((response) => response.json())
          .then((result) => {
              // invalid data or email show error alert
              if (result.error) {
                  alert(result.error);
              }
              else {
                  window.alert('Email Sent Successfully!');
                  load_mailbox('sent');
                  console.log(result)
              }
          });
      return false;
  };
}

function load_mailbox(mailbox) {

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  const emailsView = document.querySelector('#emails-view');
  emailsView.style.display = 'block';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
// TO GET EMAILS
  fetch(`emails/${mailbox}`)
      .then((response) => response.json())
      .then((emails) => {
          // create divs for the inbox section
          emails.forEach((email) => {
              const emailDiv = document.createElement('div');
              emailDiv.innerHTML = `
          <div class=''>
              <p class='bg-dark text-light'>Email</p>
              <p>Sender: ${email.sender}</p>
              <p>Subject: ${email.subject}</p>
              <p>Timestamp: ${email.timestamp}</p>
          </div>
      `;
              emailsView.append(emailDiv);
          });
      });
}