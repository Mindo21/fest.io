'use strict';

const socket = io();
const btnAddArtist = document.getElementById('btnAddArtist');
const btnAddStage = document.getElementById('btnAddStage');
const stagesList = document.getElementById('stagesList');

socket.on('output', (data) => {
    console.log('socket message received: ', data);
    stagesList.innerHTML = "";
    data.forEach((stage) => {
        const li = document.createElement("li");
        li.appendChild(document.createTextNode(JSON.stringify(stage)));
        stagesList.appendChild(li);
    });
});

btnAddArtist.addEventListener('click', () => {
    const newArtist = {
        name: "Gee Band",
        genre: "funk",
        photoUrl: "bf"
    }
    console.log("New artist:", JSON.stringify(newArtist));
    socket.emit('ADD_ARTIST_TO_STAGE', { stageId: "stageidadded", newArtist: newArtist});
});

btnAddStage.addEventListener('click', () => {
    const newStage = {
        stageId: "stageidadded",
        name: "Main Stage",
        artists: []
    }
    socket.emit('ADD_STAGE', newStage);
});