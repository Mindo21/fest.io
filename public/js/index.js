'use strict';

const btnAddArtist = document.getElementById('btnAddArtist');
const btnAddStage = document.getElementById('btnAddStage');
const artistsList = document.getElementById('artistsList');
const stagesList = document.getElementById('stagesList');

btnAddArtist.addEventListener('click', async () => {
    const newArtist = {
        artistId: "aaaaaaaa",
        name: "Gee Band",
        genre: "funk",
        startTime: "10:00",
        endTime: "11:00",
        stageId: 1,
        images: ["crab.jpg", "landscape.jpg", "night.jpg"]
    }

    // send the new artist to server
    const response = await fetch('/artist', {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newArtist)
    });
    if (!response.ok) throw response;
    const artists = await response.json();

    loadArtists(artists);
});

btnAddStage.addEventListener('click', async () => {
    const newStage = {
        stageId: "aaaaaaab",
        name: "Main Stage"
    }

    // send the new stage to server
    const response = await fetch('/stage', {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newStage)
    });
    if (!response.ok) throw response;
    const stages = await response.json();

    loadStages(stages);
});

async function loadArtists(artists) {
    if (!artists){
        // fetch all artists
        const response = await fetch('/artist');
        if (!response.ok) throw response;
        artists = await response.json();
    }    

    artistsList.innerHTML = "";
    if (artists.length <= 0) {
        // if there are no artists
        const li = document.createElement("li");
        li.appendChild(document.createTextNode("There are no artists stored..."));
        artistsList.appendChild(li);
    } else {
        // add each artist to the list
        artists.forEach((artist) => {
            const li = document.createElement("li");
            li.appendChild(document.createTextNode(JSON.stringify(artist)));
            artistsList.appendChild(li);
        });
    }
}

async function loadStages(stages) {
    if (!stages){
        // fetch all stages
        const response = await fetch('/stage');
        if (!response.ok) throw response;
        stages = await response.json();
    }

    stagesList.innerHTML = "";
    if (stages.length <= 0) {
        // if there are no stages
        const li = document.createElement("li");
        li.appendChild(document.createTextNode("There are no stages stored..."));
        stagesList.appendChild(li);
    } else {
        // add each artist to the list
        stages.forEach((stage) => {
            const li = document.createElement("li");
            li.appendChild(document.createTextNode(JSON.stringify(stage)));
            stagesList.appendChild(li);
        });
    }
}


function init() {
    loadArtists();
    loadStages();
}

window.addEventListener('load', init);