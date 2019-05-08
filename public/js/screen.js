'use strict';

const socket = io();
const bandName = document.getElementById('bandNameSpan');
const bandImg = document.getElementById('bandImg');

let currentArtist = null;
const artists = [];
const images = ["../img/default.jpg"];
let x = -1;

function displayNextImage() {
    x = (x === images.length - 1) ? 0 : x + 1;
    bandImg.src = images[x];
}

function displayPreviousImage() {
    x = (x <= 0) ? images.length - 1 : x - 1;
    bandImg.src = images[x];
}

function startTimer() {
    setInterval(displayNextImage, 5000);
}

function getCurrentImages() {
    if (currentArtist) {
        currentArtist.images.forEach((img) => {
            images.push("/img/" + currentArtist.id + "/" + img)
        });
    }
}

async function getCurrentArtist() {
    const artistId = 2;
    const response = await fetch("/artist/" + artistId);
    if (!response.ok) throw response;
    currentArtist = await response.json();
}

async function getAllArtists() {
    const stageId = 2;
    const response = await fetch("/stage/" + stageId + "/artist");
    if (!response.ok) throw response;
    currentArtist = await response.json();
}

async function init() {
    getAllArtists();
    await getCurrentArtist();
    getCurrentImages();
    startTimer();
}

window.addEventListener('load', init);