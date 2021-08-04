const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const leaveButton = document.getElementById('leave-btn');

// Get username and room from URL
const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

const socket = io();
// Join chatroom
socket.emit('joinRoom', {username, room});

// Get room and users
socket.on('roomUsers', ({room, users}) => {
    outputRoomName(room);
    outputUsers(users);
})

// Message from server
socket.on('message', message => {
    outputMessage(message);

    // Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get message text
    const msgInput = e.target.elements.msg;
    const msg = msgInput.value;

    // Emit message to server
    socket.emit('chatMessage', msg);

    // Clear input
    msgInput.value = '';
    msgInput.focus();
});

// Output message to DOM
function outputMessage(message) {
    const {username, text, time} = message;
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `
        <div class="message">
        <p class="meta">${username} <span>${time}</span></p>
        <p class="text">${text}</p>
        </div>
    `;
    chatMessages.appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
    roomName.innerText = room;    
}

// Add users to DOM
function outputUsers(users) {
    userList.innerHTML = `
        ${users.map(user => `<li>${user.username}-${user.id.substring(0, 3)}</li>`).join('')} 
    `;
}

// Prompt the user before leave the chat room
leaveButton.addEventListener('click', () => {
    const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
    if (leaveRoom) {
        window.location = '../index.html';
    }
})