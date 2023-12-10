document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  const emailsView = document.querySelector('#emails-view');
  emailsView.parentNode.insertBefore(Object.assign(document.createElement('div'), { id: 'details-view' }), emailsView.nextSibling);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email(
    defaultRecipients = '',
    replyTimestamp = '',
    replySubject = '',
    replyBody = ''
) {

    // Show compose view and hide other views
    document.querySelector('#compose-view').style.display = 'block';
    document.querySelector('#emails-view').style.display = 'none';
    document.querySelector('#details-view').style.display = 'none';

  // reply button is clicked values appear
  if (replyTimestamp) {
    document.querySelector('#compose-subject').value = `Re: ${replySubject}`;
    document.querySelector(
        '#compose-body'
    ).value = `\n\n\n\n\n\n\n\n\n\nOn ${replyTimestamp}, ${defaultRecipients} wrote:\n ${replyBody}`;
    document.querySelector('#compose-recipients').value = defaultRecipients;
}


// Clear out composition fields if compose button is clicked
else {
      document.querySelector('#compose-recipients').value = '';
      document.querySelector('#compose-subject').value = '';
      document.querySelector('#compose-body').value = '';   
  } 

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
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#details-view').style.display = 'none';

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
              <div class='${email.read ? "bg-secondary" : "bg-light"}'>
              <p class='bg-dark text-light'>Email</p>
              <p>Sender: ${email.sender}</p>
              <p>Subject: ${email.subject}</p>
              <p>Timestamp: ${email.timestamp}</p>
              <!--<p>Read: ${email.read}</p>-->
          </div>
      `;
            // toogles to the individual email
            emailDiv.addEventListener('click', () => {
                view_email(email.id);
            });
              emailsView.append(emailDiv);
          });
        })
        .catch((error) => {
            console.error('Error fetching emails:', error);
        });
  }
  
  function view_email(id) {
    document.querySelector('#emails-view').style.display = 'none';
    document.querySelector('#details-view').style.display = 'block';
    const detailsView = document.querySelector('#details-view');
    fetch(`emails/${id}`)
        .then((response) => response.json())
        .then((emailData) => {
            detailsView.innerHTML = `
      <p>Sender: ${emailData.sender}</p>
      <p>Subject: ${emailData.subject}</p>
      <p>Timestamp: ${emailData.timestamp}</p>
      <p>Body: ${emailData.body}</p>
      <p>Recipients: ${emailData.recipients.join(", ")}</p>
      <button class='btn btn-primary reply-btn'>Reply</button>
    `;
            document
                .querySelector('.reply-btn')
                .addEventListener('click', (event) => {
                    event.preventDefault();
                    compose_email(
                        emailData.sender,
                        emailData.timestamp,
                        emailData.subject,
                        emailData.body
                    );
                });
            update_read(emailData.id);
        })
        .catch((error) => {
            console.error('Error fetching email data:', error);
      });
}

function update_read(id){
    fetch(`emails/${id}`, {
        method: "PUT",
        body: JSON.stringify({
            read: true,
        }),
    })
}