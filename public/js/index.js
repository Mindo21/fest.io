'use strict';

const btnAddArtist = document.getElementById('btnAddArtist');
const btnAddStage = document.getElementById('btnAddStage');
const artistsList = document.getElementById('artistsList');
const stagesList = document.getElementById('stagesList');

btnAddArtist.addEventListener('click', async () => {
    const newArtist = {
        id: 1,
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
        id: 1,
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
        addArtistListItem();
    } else {
        // add each artist to the list
        artists.forEach((artist) => addArtistListItem(artist));
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
        addStageListItem();
    } else {
        // add each artist to the list
        stages.forEach((stage) => addStageListItem(stage));
    }
}

function addArtistListItem(artist) {
    if (artist) {
        // if artist is given
        const icon = document.createElement("img");
        icon.classList.add("artistIcon");
        icon.src = "../img/default.jpg";
        const name = document.createElement("span");
        name.classList.add("artistName");
        name.appendChild(document.createTextNode(artist.name));
        const link = document.createElement("a");
        link.setAttribute('href', '../screen.html');
        link.appendChild(document.createTextNode('Click here to see artist...'));

        const artistItem = document.createElement("li");
        artistItem.appendChild(icon);
        artistItem.appendChild(name);
        artistItem.appendChild(link);
        artistsList.appendChild(artistItem);
    } else {
        // if there is no stage
        const li = document.createElement("li");
        li.appendChild(document.createTextNode("There are no artists stored..."));
        artistsList.appendChild(li);
    }
}

function addStageListItem(stage) {
    if (stage) {
        // if stage is given
        const name = document.createElement("span");
        name.classList.add("stageName");
        name.appendChild(document.createTextNode(stage.name));
        const link = document.createElement("a");
        link.setAttribute('href', '../screen.html');
        link.appendChild(document.createTextNode('Click here to see stage screen...'));

        const stageItem = document.createElement("li");
        stageItem.appendChild(name);
        stageItem.appendChild(link);
        stagesList.appendChild(stageItem);
    } else {
        // if there is no stage
        const li = document.createElement("li");
        li.appendChild(document.createTextNode("There are no stages stored..."));
        stagesList.appendChild(li);
    }
}

function init() {
    loadArtists();
    loadStages();
}

window.addEventListener('load', init);