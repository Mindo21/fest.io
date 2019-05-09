'use strict';

const btnAddArtist = document.getElementById('btnAddArtist');
const btnAddStage = document.getElementById('btnAddStage');
const artistsList = document.getElementById('artistsList');
const stagesList = document.getElementById('stagesList');

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

async function addingNewArtist() {
    let existingForm = document.getElementById("addNewFormSection");
    if (existingForm) {
        // remove the existing form first (change it back to artistListItem) - just load the list again
        await loadArtists();
    }
    // generate the form at the place of the addArtist button
    generateArtistForm();
}

async function artistClicked(id) {
    let existingForm = document.getElementById("addNewFormSection");
    if (existingForm) {
        // remove the existing form first (change it back to artistListItem) - just load the artists again
        await loadArtists();
    }
    // find the clicked button
    const artistListItemButton = document.getElementById(id);
    // generate the form and replace it at the artist list item
    if (artistListItemButton) generateArtistForm(artistListItemButton.parentElement);
    else console.log("the artist has been deleted");
}

async function loadArtists(artists) {
    if (!artists){
        // fetch all artists
        const response = await fetch('/artist');
        if (!response.ok) throw response;
        artists = await response.json();
    }    

    // clear the list
    while (artistsList.firstChild) {
        artistsList.removeChild(artistsList.firstChild);
    }
    // add each artist to the list
    artists.forEach((artist) => addArtistListItem(artist));
    // add the add row
    addArtistListItem();

    return artists;
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
    return stages;
}

function removeArtistListItem(artistListItem) {
    if (artistListItem) {
        artistsList.removeChild(artistListItem);
    } else {
        // if I want to remove the addNew/form list item
        artistsList.removeChild(artistsList.lastChild);
    }
}

async function addArtistListItem(artist) {
    if (artist) {
        // if artist is given
        const artistItem = document.createElement("li");
        artistsList.appendChild(artistItem);

        const artistItemBtn = document.createElement("button");
        artistItemBtn.classList.add("artistItemBtn");
        artistItemBtn.setAttribute('id', artist.id);
        artistItemBtn.setAttribute('onclick', 'artistClicked(this.id)');
        artistItem.appendChild(artistItemBtn);

        const icon = document.createElement("img");
        icon.classList.add("artistIcon");
        icon.src = await getArtistIcon(artist);
        artistItemBtn.appendChild(icon);

        const name = document.createElement("span");
        name.classList.add("artistName");
        name.appendChild(document.createTextNode(artist.name));
        artistItemBtn.appendChild(name);

        const time = document.createElement("span");
        time.classList.add("artistTime");
        time.appendChild(document.createTextNode(artist.startTime + " - " + artist.endTime));
        artistItemBtn.appendChild(time);
    } else {
        // if there is no artist
        const li = document.createElement("li");
        artistsList.appendChild(li);
        const addNewItemBtn = document.createElement("button");
        addNewItemBtn.classList.add("addNewItemBtn");
        addNewItemBtn.setAttribute('onclick', 'addingNewArtist()');
        li.appendChild(addNewItemBtn);

        const icon = document.createElement("img");
        icon.classList.add("addIcon");
        icon.src = "../img/add.svg";
        addNewItemBtn.appendChild(icon);

        const name = document.createElement("span");
        name.classList.add("artistName");
        name.appendChild(document.createTextNode("Add new..."));
        addNewItemBtn.appendChild(name);
    }
}

function addStageListItem(stage) {
    if (stage) {
        // if stage is given
        const stageItem = document.createElement("li");
        stagesList.appendChild(stageItem);

        const stageItemLink = document.createElement("button");
        stageItemLink.classList.add("stageItemLink");
        stageItemLink.setAttribute('onclick', 'stageClicked()');
        stageItem.appendChild(stageItemLink);

        const name = document.createElement("span");
        name.classList.add("stageName");
        name.appendChild(document.createTextNode(stage.name));
        stageItemLink.appendChild(name);
    } else {
        // if there is no stage
        const li = document.createElement("li");
        stagesList.appendChild(li);

        const liLink = document.createElement("button");
        liLink.classList.add("addNewItemLink");
        liLink.setAttribute('onclick', 'addingNewStage()');
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