// const formatMessage = require("../../utils/messages");

const socket = io();

const {username, room} = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

const msgForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');

console.log({username, room});
// sending data on 'joinRoom' event
socket.emit('joinRoom', {username, room});

socket.on('message', message=>{
  console.log(message);
  addToPage(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

socket.on('roomUsers', ({room, users})=>{
  addUsersToPage({room, users});
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

function addUsersToPage({room, users}){

  const roomElement = document.getElementById('room-name');
  const usersList = document.getElementById('users');

  roomElement.innerText = room;
  usersList.innerHTML = '';
  users.map((user)=>{
    const userListItem = document.createElement("li");
    userListItem.innerText = user.username;

    usersList.appendChild(userListItem);
  });

}