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
    const form = document.forms[0]; // there should always be only one
    const data = new FormData(form);
    data.append('id', id);  // appends the artistId or empty string "", server will deal with it
    console.log("form data: ", data);

    const response = await fetch('/artist', {
        method: 'POST',
        body: data
    });
    if (!response.ok) throw response;
    const artists = await response.json();

    console.log(artists);
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
    let artist = null;
    const li = document.createElement("li");
    li.classList.add('addingArtist');

    if (artistListItem) {
        // fetch artist
        const response = await fetch('/artist/' + artistListItem.firstChild.id);
        if (!response.ok) throw response;
        artist = await response.json();

        const nextItem = artistListItem.nextSibling;
        removeArtistListItem(artistListItem);
        artistsList.insertBefore(li, nextItem);
    } else {
        removeArtistListItem(); // removes the last list item
        artistsList.appendChild(li);    // appends at the end
    }

    // form section is the child of the li element

    const addNewFormSection = document.createElement("section");
    addNewFormSection.setAttribute("id", "addNewFormSection");
    li.appendChild(addNewFormSection);

    // the form has the artistId so that it can be brought back

    const addNewForm = document.createElement("form");
    if (artist) addNewForm.setAttribute("id", artist.id);
    addNewFormSection.appendChild(addNewForm);

    // everything is in the fieldset except buttons

    const fieldSet = document.createElement("fieldset");
    addNewForm.appendChild(fieldSet);

    // legend saying 'New Artist' or the name of the artist

    const legend1 = document.createElement('legend');
    fieldSet.appendChild(legend1);
    const span1 = document.createElement('span');
    span1.classList.add('number');
    span1.appendChild(document.createTextNode('1'));
    legend1.appendChild(span1);
    // load the artist name
    const newArtistText = artist ? artist.name : 'New Artist';
    legend1.appendChild(document.createTextNode(newArtistText));

    // input the name of the artist

    const inputName = document.createElement('input');
    inputName.setAttribute("type", "text");
    inputName.setAttribute("name", "name");
    inputName.setAttribute("placeholder", "Artist Name");
    // load the artist name into input
    if (artist) inputName.setAttribute("value", artist.name);
    fieldSet.appendChild(inputName);

    // input the genre for artist

    const inputGenre = document.createElement('input');
    inputGenre.setAttribute("type", "text");
    inputGenre.setAttribute("name", "genre");
    inputGenre.setAttribute("placeholder", "Genre");
    // load the artist genre into input
    if (artist) inputGenre.setAttribute("value", artist.genre);
    fieldSet.appendChild(inputGenre);

    // input the description for artist

    const inputDescription = document.createElement('textarea');
    inputDescription.setAttribute("name", "description");
    inputDescription.setAttribute("placeholder", "Short Description");
    // load the artist description into input
    if (artist) inputDescription.appendChild(document.createTextNode(artist.description));
    fieldSet.appendChild(inputDescription);

    // legend for the selection of stage
    
    const legend2 = document.createElement('legend');
    fieldSet.appendChild(legend2);
    const span2 = document.createElement('span');
    span2.classList.add('number');
    span2.appendChild(document.createTextNode('2'));
    legend2.appendChild(span2);
    legend2.appendChild(document.createTextNode('Stage'));

    // option group - select the Stage

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
        // load the artist stageId into selection input
        if (artist && artist.stageId == stage.id) option.setAttribute("selected", "selected");
        optGroup.appendChild(option);
    });

    // StartTime and EndTime

    const inputStartTime = document.createElement('input');
    inputStartTime.setAttribute("type", "text");
    inputStartTime.setAttribute("name", "startTime");
    inputStartTime.setAttribute("placeholder", "Start Time");
    // load the artist startTime into input
    if (artist) inputStartTime.setAttribute("value", artist.startTime);
    inputStartTime.classList.add("timepicker");
    fieldSet.appendChild(inputStartTime);

    const inputEndTime = document.createElement('input');
    inputEndTime.setAttribute("type", "text");
    inputEndTime.setAttribute("name", "endTime");
    inputEndTime.setAttribute("placeholder", "End Time");
    // load the artist endTime into input
    if (artist) inputEndTime.setAttribute("value", artist.endTime);
    inputEndTime.classList.add("timepicker");
    fieldSet.appendChild(inputEndTime);

    // using materialize's timepicker
    const timePickers = M.Timepicker.init(document.querySelectorAll('.timepicker'), {
        twelveHour: false,
        autoClose: true,
        defaultTime: 'now'
    });

    // legend for Images

    const legend3 = document.createElement('legend');
    fieldSet.appendChild(legend3);
    const span3 = document.createElement('span');
    span3.classList.add('number');
    span3.appendChild(document.createTextNode('3'));
    legend3.appendChild(span3);
    legend3.appendChild(document.createTextNode('Images'));

    // upload one icon image

    const inputIconFile = document.createElement('input');
    inputIconFile.setAttribute("type", "file");
    inputIconFile.setAttribute("name", "iconFile");
    inputIconFile.setAttribute("accept", "image/*");
    inputIconFile.setAttribute("onchange", "readImgUrl(this)");
    fieldSet.appendChild(inputIconFile);

    // upload multiple images

    const inputImgFile = document.createElement('input');
    inputImgFile.setAttribute("type", "file");
    inputImgFile.setAttribute("name", "imgFile");
    inputImgFile.setAttribute("accept", "image/*");
    inputImgFile.setAttribute("onchange", "readImgUrl(this)");
    inputImgFile.setAttribute("multiple", "");
    fieldSet.appendChild(inputImgFile);

    // Apply and Cancel buttons

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

function readImgUrl(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        const file = input.files[0];

        reader.onload = (e) => {
            const imgEl = document.createElement('img');
            imgEl.src = reader.result;
            imgEl.alt = file.name || 'uploaded image';
            imgEl.classList.add('uploadedImg');
            document.forms[0].appendChild(imgEl);
        };
        // wait a bit so browser shows that it's accepted the file and is generating a preview
        setTimeout(() => reader.readAsDataURL(file), 50);
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