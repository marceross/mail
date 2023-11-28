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
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
}



// TO GET EMAILS

fetch('/emails/inbox')
.then(response => response.json())
.then(emails => {
 // Print emails
 console.log(emails);
 // ... do something else with emails ...
});


[
  {
  "id": 100,
  "sender": "foo@example.com",
  "recipients": ["bar@example.com"],
  "subject": "Hello!",
  "body": "Hello, world!",
  "timestamp": "Jan 2 2020, 12:00 AM",
  "read": false,
  "archived": false
  },
  {
  "id": 95,
  "sender": "baz@example.com",
  "recipients": ["bar@example.com"],
  "subject": "Meeting Tomorrow",
  "body": "What time are we meeting?",
  "timestamp": "Jan 1 2020, 12:00 AM",
  "read": true,
  "archived": false
  }
 ]
 


fetch('/emails/100')
.then(response => response.json())
.then(email => {
 // Print email
 console.log(email);
 // ... do something else with email ...
});

[
{
  "id": 100,
  "sender": "foo@example.com",
  "recipients": ["bar@example.com"],
  "subject": "Hello!",
  "body": "Hello, world!",
  "timestamp": "Jan 2 2020, 12:00 AM",
  "read": false,
  "archived": false
 }
]



// TO SEND EMAILS

fetch('/emails', {
  method: 'POST',
  body: JSON.stringify({
  recipients: 'baz@example.com',
  subject: 'Meeting time',
  body: 'How about we meet tomorrow at 3pm?'
  })
 })
 .then(response => response.json())
 .then(result => {
  // Print result
  console.log(result);
 });
 


// to MARK AS READ/UNREAD TO OR AS ARCHIEVED/UNARCHIEVED

 fetch('/emails/100', {
  method: 'PUT',
  body: JSON.stringify({
  archived: true
  })
 })
 


// To create an HTML element and add an event handler to it
/*This code creates a new div element, sets its innerHTML , adds an event handler to run a
particular function when that div is clicked on, and then adds it to an HTML element whose id
is container*/

const element = document.createElement('div');
element.innerHTML = 'This is the content of the div.';
element.addEventListener('click', function() {
 console.log('This element has been clicked!')
});
document.querySelector('#container').append(element);