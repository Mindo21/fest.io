'use strict';

const socket = io();
const messages = document.getElementById('messages');

socket.on('output', (data) => {
    console.log('socket message received: ', data);
    let li = document.createElement("li");
    li.appendChild(document.createTextNode(JSON.stringify(data)));
    messages.appendChild(li);
});