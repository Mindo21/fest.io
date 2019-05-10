'use strict';

const socket = io();

const stageName = document.getElementById('stageNameSpan');
const artistName = document.getElementById('artistNameSpan');
const artistNameHeader = document.getElementById('artistNameHeaderSpan');
const artistImg = document.getElementById('artistImg');
const scheduleList = document.getElementById('scheduleList');

const stageId = location.search.substring(1).split("=")[1]; // parameter in "/screen.html?id=1"
const artists = [];
const defaultImg = "../img/default.jpg";
const images = [defaultImg];
const IMG_CHANGE_TIME = 5000;   // set to 5 seconds for now
const CURRENT_ARTIST_REFRESH_TIME = 60000   // set to 1 minute - checking for current artist every minute

let currentArtist = null;
let x = -1;
let changingImages = false;
let currentArtistHighlighted = false;

function displayNextImage() {
    x = (x === images.length - 1) ? 0 : x + 1;
    artistImg.src = images[x];
}

function displayPreviousImage() {
    x = (x <= 0) ? images.length - 1 : x - 1;
    artistImg.src = images[x];
}

function displayDefaultImage() {
    x = 0;
    artistImg.src = images[x];
}

async function startChangingImages() {
    if (!changingImages) changingImages = true;
    displayNextImage();
    await getCurrentArtist();
    // wait IMG_CHANGE_TIME and then find the current artist again (which changes the image and so on)
    if (currentArtist) setTimeout(startChangingImages, IMG_CHANGE_TIME);
    else {
        getCurrentArtistImages();
        displayDefaultImage();
        // after some period, check if there is any artist that is now up to perform
        setTimeout(startChangingImages, CURRENT_ARTIST_REFRESH_TIME);
    }
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

async function generateStageName(givenStageName) {
    if (!givenStageName) {
        const response = await fetch("/stage/" + stageId);
        if (!response.ok) throw response;
        const stage = await response.json();
        if (stage) stageName.textContent = stage.name;
        else stageName.textContent = "STAGE NOT FOUND";
    } else {
        stageName.textContent = givenStageName;
    }
}

async function getCurrentArtist() {
    // find the artist locally by time
    const currentTime = getCurrentTime();
    const previousArtist = currentArtist;
    currentArtist = artists.find((artist) => artist.startTime <= currentTime && artist.endTime >= currentTime);
    if (currentArtist) {
        // if there is an artist playing
        artistNameHeader.innerHTML = "Playing: <strong>" + currentArtist.name + "</strong>";
        // load the artist's images
        if (images.length <= 1 || previousArtist != currentArtist) {
            getCurrentArtistImages();
            if (!changingImages) startChangingImages();
            if (!currentArtistHighlighted || previousArtist != currentArtist) {
                if (previousArtist) {
                    const previousScheduleItemArtist = document.getElementById(previousArtist.id);
                    if (previousScheduleItemArtist) previousScheduleItemArtist.style.background = 'grey';
                }
                console.log("highlight artist with id: ", currentArtist.id);
                const scheduleItemArtist = document.getElementById(currentArtist.id);
                if (scheduleItemArtist) {
                    scheduleItemArtist.style.background = 'green';
                    currentArtistHighlighted = true;
                } else {
                    console.log("could not find artist list item for highlight");
                }
            }
        }
    } else {
        // if there is no artist playing right now
        await updateSchedule();   // to clear the highlighted artist
        // find the soonest artist to perform
        const sortedArtists = artists.sort(function(a, b) {
            var timeA = a.startTime;
            var timeB = b.startTime;
            if (timeA < timeB) {
              return -1;
            }
            if (timeA > timeB) {
              return 1;
            }
            // times must be equal
            return 0;
        });
        const soonestArtist = sortedArtists.find(a => a.startTime > currentTime);
        // display the soonest artist to perform
        artistNameHeader.innerHTML = "Soon: " + soonestArtist.startTime + " - <strong>" + soonestArtist.name + "</strong>";
        if (images.length != 1) getCurrentArtistImages();
    }
}

function getCurrentTime() {
    const now = new Date();
    return correctTime(now.getHours()) + ":" + correctTime(now.getMinutes());
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
            // add the new fetched artists on this stage to the list
            if (artist.stageId == stageId) artists.push(artist);
        });
    }
}

async function updateSchedule() {
    scheduleList.innerHTML = "";
    currentArtistHighlighted = false;
    if (artists.length <= 0) {
        // if there are no artists
        addScheduleListItem();
    } else {
        // add each artist to the list
        // sort them against start time
        const sortedArtists = artists.sort(function(a, b) {
            var timeA = a.startTime;
            var timeB = b.startTime;
            if (timeA < timeB) {
              return -1;
            }
            if (timeA > timeB) {
              return 1;
            }
            // times must be equal
            return 0;
        });
        for (let artist of sortedArtists) {
            await addScheduleListItem(artist);
        }
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

        const time = document.createElement("span");
        time.classList.add("artistTime");
        time.appendChild(document.createTextNode(artist.startTime + " - " + artist.endTime));

        const scheduleItem = document.createElement("li");
        scheduleItem.setAttribute("id", artist.id);
        // grey out the artists that already performed
        if (artist.endTime < getCurrentTime()) scheduleItem.style.background = 'grey';
        scheduleItem.appendChild(icon);
        scheduleItem.appendChild(name);
        scheduleItem.appendChild(time);
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
    generateStageName();
    // the rest is loaded thanks to the socket 'onconnection' emit
}

window.addEventListener('load', init);

// ----------------------------
// SOCKET functions

socket.on('UPDATE_ARTISTS', async (artists) => {
    await getAllArtists(artists); // wait for the artists being loaded, then find the current artist
    await updateSchedule();   // to clear the highlighted artist
    if (!changingImages) startChangingImages();     // start changing the images
});

socket.on('UPDATE_STAGES', (stages) => {
    const stage = stages.find(stage => stage.id == stageId);
    if (stage) generateStageName(stage.name);
    else generateStageName("STAGE NOT FOUND")
});