'use strict';

const defaultImg = "../img/default.jpg";

let addingArtist = false;

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
    addingArtist = true;
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

async function artistApplyClicked(id) {
    let newArtist;
    const form = document.forms[0]; // there should always be only one

    // if (id) {
        newArtist = {
            id: id,
            name: form.elements.name.value,
            genre: form.elements.genre.value,
            description: form.elements.description.value,
            startTime: form.elements.startTime.value,
            endTime: form.elements.endTime.value,
            stageId: form.elements.stageName.value,
            icon: "icon.jpg",
            images: ["crab.jpg", "landscape.jpg", "night.jpg"]
        }
    // } else {
    //     newArtist = {
    //         id: id,
    //         name: form.elements.name.value,
    //         genre: form.elements.genre.value,
    //         description: form.elements.description.value,
    //         startTime: form.elements.startTime.value,
    //         endTime: form.elements.endTime.value,
    //         stageId: form.elements.stageName.value,
    //         icon: "icon.jpg",
    //         images: ["crab.jpg", "landscape.jpg", "night.jpg"]
    //     }
    // }

    console.log("new artist: ", JSON.stringify(newArtist));

    // upload the new artist
    const response = await fetch('/artist', {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newArtist)
    });
    if (!response.ok) throw response;
    const artists = await response.json();

    // load new artists
    loadArtists(artists);
}

async function artistCancelClicked() {
    await loadArtists();
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

async function generateArtistForm(artistListItem) {
    let artistId = null;
    const li = document.createElement("li");
    li.classList.add('addingArtist');

    if (artistListItem) {
        artistId = artistListItem.firstChild.id;
        const nextItem = artistListItem.nextSibling;
        removeArtistListItem(artistListItem);
        artistsList.insertBefore(li, nextItem);
    } else {
        removeArtistListItem(); // removes the last list item
        artistsList.appendChild(li);    // appends at the end
    }

    const addNewFormSection = document.createElement("section");
    addNewFormSection.setAttribute("id", "addNewFormSection");
    li.appendChild(addNewFormSection);

    // the form has the artistId so that it can be brought back
    const addNewForm = document.createElement("form");
    if (artistId) addNewForm.setAttribute("id", artistId);
    addNewFormSection.appendChild(addNewForm);

    const fieldSet = document.createElement("fieldset");
    addNewForm.appendChild(fieldSet);

    const legend1 = document.createElement('legend');
    fieldSet.appendChild(legend1);
    const span1 = document.createElement('span');
    span1.classList.add('number');
    span1.appendChild(document.createTextNode('1'));
    legend1.appendChild(span1);
    legend1.appendChild(document.createTextNode('New Artist'));

    const inputName = document.createElement('input');
    inputName.setAttribute("type", "text");
    inputName.setAttribute("name", "name");
    inputName.setAttribute("placeholder", "Artist Name");
    fieldSet.appendChild(inputName);

    const inputGenre = document.createElement('input');
    inputGenre.setAttribute("type", "text");
    inputGenre.setAttribute("name", "genre");
    inputGenre.setAttribute("placeholder", "Genre");
    fieldSet.appendChild(inputGenre);

    const inputDescription = document.createElement('textarea');
    inputDescription.setAttribute("name", "description");
    inputDescription.setAttribute("placeholder", "Short Description");
    fieldSet.appendChild(inputDescription);
    
    const legend2 = document.createElement('legend');
    fieldSet.appendChild(legend2);
    const span2 = document.createElement('span');
    span2.classList.add('number');
    span2.appendChild(document.createTextNode('2'));
    legend2.appendChild(span2);
    legend2.appendChild(document.createTextNode('Stage'));

    const stageSelection = document.createElement('select');
    stageSelection.setAttribute("id", "stageSelection");
    stageSelection.setAttribute("name", "stageName");
    fieldSet.appendChild(stageSelection);
    const optGroup = document.createElement('optgroup');
    optGroup.setAttribute("label", "Stages");
    stageSelection.appendChild(optGroup);

    // load stages into the option group
    const stages = await loadStages();
    stages.forEach((stage) => {
        const option = document.createElement("option");
        option.setAttribute("value", stage.id);
        option.appendChild(document.createTextNode(stage.name));
        optGroup.appendChild(option);
    });

    const inputStartTime = document.createElement('input');
    inputStartTime.setAttribute("type", "text");
    inputStartTime.setAttribute("name", "startTime");
    inputStartTime.setAttribute("placeholder", "Start Time");
    inputStartTime.classList.add("timepicker");
    fieldSet.appendChild(inputStartTime);

    const inputEndTime = document.createElement('input');
    inputEndTime.setAttribute("type", "text");
    inputEndTime.setAttribute("name", "endTime");
    inputEndTime.setAttribute("placeholder", "End Time");
    inputEndTime.classList.add("timepicker");
    fieldSet.appendChild(inputEndTime);

    // using materialize's timepicker
    const timePickers = M.Timepicker.init(document.querySelectorAll('.timepicker'), {
        twelveHour: false,
        autoClose: true,
        defaultTime: 'now'
    });

    const legend3 = document.createElement('legend');
    fieldSet.appendChild(legend3);
    const span3 = document.createElement('span');
    span3.classList.add('number');
    span3.appendChild(document.createTextNode('3'));
    legend3.appendChild(span3);
    legend3.appendChild(document.createTextNode('Images'));

    const inputApply = document.createElement('input');
    inputApply.setAttribute("type", "button");
    inputApply.setAttribute("value", "Apply");
    inputApply.setAttribute("id", "applyBtn");
    inputApply.setAttribute("onclick", "artistApplyClicked(this.parentElement.id)");
    addNewForm.appendChild(inputApply);

    const inputCancel = document.createElement('input');
    inputCancel.setAttribute("type", "button");
    inputCancel.setAttribute("value", "Cancel");
    inputCancel.setAttribute("id", "cancelBtn");
    inputCancel.setAttribute("onclick", "artistCancelClicked()");
    addNewForm.appendChild(inputCancel);
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