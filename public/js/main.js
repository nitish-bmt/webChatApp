// const formatMessage = require("../../utils/messages");

const socket = io();

const {username, room} = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

const msgForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');

// sending data on 'joinRoom' event
socket.on('joinRoom', {username, room});

socket.on('message', message=>{
  console.log(message);
  addToPage(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// msgForm.msg.value
// Why can;t i use this instead of event listener
// msgForm.onsubmit((e)=>{
//   e.prevent
// })

msgForm.addEventListener('submit',(e)=>{
  
  // forms by default are submitted to files
  // here we're preventing that
  e.preventDefault();

  const msg = e.target.elements.msg.value;


  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();

  // emitting to server 
  socket.emit('chatMessage', msg);
})


function addToPage(messageObj){

  const {user, message, time} = messageObj;
  const newDiv = document.createElement('div');

  newDiv.classList.add('message');
  newDiv.innerHTML = `
    <p class="meta">${user} <span>${time}</span></p>
		<p class="text">${message}</p>`;
    
  document.querySelector('.chat-messages').appendChild(newDiv);
}