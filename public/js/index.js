'use strict';

const defaultImg = "../img/default.jpg";

const btnAddArtist = document.getElementById('btnAddArtist');
const btnAddStage = document.getElementById('btnAddStage');
const artistsList = document.getElementById('artistsList');
const stagesList = document.getElementById('stagesList');

btnAddArtist.addEventListener('click', async () => {
    const newArtist = {
        id: 1,
        name: "Gee Band",
        genre: "funk",
        description: "Gangster band playing funk and hip hop only...",
        startTime: "10:00",
        endTime: "11:00",
        stageId: 2,
        icon: "icon.jpg",
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
    // add each artist to the list
    artists.forEach((artist) => addArtistListItem(artist));
    // add the add row
    addArtistListItem();
}

async function loadStages(stages) {
    if (!stages){
        // fetch all stages
        const response = await fetch('/stage');
        if (!response.ok) throw response;
        stages = await response.json();
    }

    stagesList.innerHTML = "";
    // add each stage to the list
    stages.forEach((stage) => addStageListItem(stage));
    // add the add row
    addStageListItem();
}

async function addArtistListItem(artist) {
    if (artist) {
        // if artist is given
        const artistItem = document.createElement("li");
        artistsList.appendChild(artistItem);

        const artistItemLink = document.createElement("a");
        artistItemLink.classList.add("artistItemLink");
        artistItemLink.setAttribute('href', '/detail_artist.html?id=' + artist.id);
        artistItem.appendChild(artistItemLink);

        const icon = document.createElement("img");
        icon.classList.add("artistIcon");
        icon.src = await getArtistIcon(artist);
        artistItemLink.appendChild(icon);

        const name = document.createElement("span");
        name.classList.add("artistName");
        name.appendChild(document.createTextNode(artist.name));
        artistItemLink.appendChild(name);

        const time = document.createElement("span");
        time.classList.add("artistTime");
        time.appendChild(document.createTextNode(artist.startTime + " - " + artist.endTime));
        artistItemLink.appendChild(time);
    } else {
        // if there is no artist
        const li = document.createElement("li");
        artistsList.appendChild(li);
        const liLink = document.createElement("a");
        liLink.classList.add("addNewItemLink");
        liLink.setAttribute('href', '/add_artist.html');
        li.appendChild(liLink);

        const icon = document.createElement("img");
        icon.classList.add("addIcon");
        icon.src = "../img/add.svg";
        liLink.appendChild(icon);

        const name = document.createElement("span");
        name.classList.add("artistName");
        name.appendChild(document.createTextNode("Add new..."));
        liLink.appendChild(name);
    }
}

async function getArtistIcon(artist) {
    const response = await fetch('/img/' + artist.id + '/' + artist.icon);    
    // if there is no icon found, return default image
    if (response.status != 200) {
        return defaultImg;
    }
    // return the call to the icon
    return '/img/' + artist.id + '/' + artist.icon;
}

function addStageListItem(stage) {
    if (stage) {
        // if stage is given
        const stageItem = document.createElement("li");
        stagesList.appendChild(stageItem);

        const stageItemLink = document.createElement("a");
        stageItemLink.classList.add("stageItemLink");
        stageItemLink.setAttribute('href', '/screen.html?id=' + stage.id);
        stageItem.appendChild(stageItemLink);

        const name = document.createElement("span");
        name.classList.add("stageName");
        name.appendChild(document.createTextNode(stage.name));
        stageItemLink.appendChild(name);
    } else {
        // if there is no stage
        const li = document.createElement("li");
        stagesList.appendChild(li);

        const liLink = document.createElement("a");
        liLink.classList.add("addNewItemLink");
        liLink.setAttribute('href', '/add_stage.html');
        li.appendChild(liLink);

        const icon = document.createElement("img");
        icon.classList.add("addIcon");
        icon.src = "../img/add.svg";
        liLink.appendChild(icon);

        const name = document.createElement("span");
        name.classList.add("stageName");
        name.appendChild(document.createTextNode("Add new..."));
        liLink.appendChild(name);
    }
}

function init() {
    loadArtists();
    loadStages();
}

window.addEventListener('load', init);