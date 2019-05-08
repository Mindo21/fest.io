'use strict';

const socket = io();

const stageName = document.getElementById('stageNameSpan');
const artistName = document.getElementById('artistNameSpan');
const artistImg = document.getElementById('artistImg');
const scheduleList = document.getElementById('scheduleList');

const stageId = location.search.substring(1).split("=")[1]; // parameter in "/screen.html?id=1"
const artists = [];
const defaultImg = "../img/default.jpg";
const images = [defaultImg];
const IMG_CHANGE_TIME = 3000;   // set to 3 seconds for now

let currentArtist = null;
let x = -1;

function displayNextImage() {
    x = (x === images.length - 1) ? 0 : x + 1;
    artistImg.src = images[x];
}

function displayPreviousImage() {
    x = (x <= 0) ? images.length - 1 : x - 1;
    artistImg.src = images[x];
}

function startChangingImages() {
    setInterval(displayNextImage, IMG_CHANGE_TIME);
}

function getCurrentArtistImages() {
    // the images array should contain only the default image first
    images.splice(0);
    images.push(defaultImg);
    // if there is an artist playing, load their images
    if (currentArtist) {
        currentArtist.images.forEach((img) => {
            images.push("/img/" + currentArtist.id + "/" + img)
        });
    }
}

async function getStageName() {
    const response = await fetch("/stage/" + stageId);
    if (!response.ok) throw response;
    const stage = await response.json();
    stageName.textContent = stage.name;
}

function getCurrentArtist() {
    // find the artist locally by time
    const now = new Date();
    const currentTime = correctTime(now.getHours()) + ":" + correctTime(now.getMinutes());
    currentArtist = artists.find((artist) => artist.id == 3)
    if (currentArtist) {
        // if there is an artist playing
        artistName.textContent = currentArtist.name;
    } else {
        // if there is no artist playing right now
        artistName.textContent = "no artist playing right now";
    }
    // load the artist's images
    getCurrentArtistImages();
}

function correctTime(time) {
    return time < 10 ? "0" + time : time; // if time is 6:47 -> 06:47
}

async function getAllArtists(artistsGiven) {
    artists.splice(0);  // delete artists
    if (!artistsGiven) {
        // fetch all artists
        const response = await fetch("/stage/" + stageId + "/artists");
        if (!response.ok) throw response;
        const fetchedArtists = await response.json();
        fetchedArtists.forEach((artist) => {
            artists.push(artist);   // add the new fetched artists to the list
        });
    } else {
        artistsGiven.forEach((artist) => {
            artists.push(artist);   // add the new fetched artists to the list
        });
    }
}

function updateSchedule() {
    scheduleList.innerHTML = "";
    if (artists.length <= 0) {
        // if there are no artists
        addScheduleListItem();
    } else {
        // add each artist to the list
        artists.forEach((artist) => addScheduleListItem(artist));
    }
}

async function addScheduleListItem(artist) {
    if (artist) {
        // if artist is given
        const icon = document.createElement("img");
        icon.classList.add("artistIcon");
        icon.src = await getArtistIcon(artist);
        const name = document.createElement("span");
        name.classList.add("artistName");
        name.appendChild(document.createTextNode(artist.name));

        const scheduleItem = document.createElement("li");
        scheduleItem.appendChild(icon);
        scheduleItem.appendChild(name);
        scheduleList.appendChild(scheduleItem);
    } else {
        // if there is no artist
        const li = document.createElement("li");
        li.appendChild(document.createTextNode("No artists playing today..."));
        scheduleList.appendChild(li);
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

async function init() {
    getStageName();
    startChangingImages();   // start changing the images
}

window.addEventListener('load', init);

// ----------------------------
// SOCKET functions

socket.on('UPDATE_ARTISTS', async (artists) => {
    console.log('socket message received: ', artists);
    await getAllArtists(artists); // wait for the artists being loaded, then find the current artist
    getCurrentArtist();
    updateSchedule();

    // let li = document.createElement("li");
    // li.appendChild(document.createTextNode(JSON.stringify(artists)));
    // messages.appendChild(li);
});

socket.on('UPDATE_STAGES', (data) => {
    // console.log('socket message received: ', data);
    // let li = document.createElement("li");
    // li.appendChild(document.createTextNode(JSON.stringify(data)));
    // messages.appendChild(li);
});