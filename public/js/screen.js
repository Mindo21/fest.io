'use strict';

const socket = io();
const bandName = document.getElementById('bandNameSpan');
const img = document.getElementById('bandImg');

let currentArtist = null;
let images = ["../img/default.jpg"];
let x = -1;

function displayNextImage() {
    x = (x === images.length - 1) ? 0 : x + 1;
    img.src = images[x];
}

function displayPreviousImage() {
    x = (x <= 0) ? images.length - 1 : x - 1;
    img.src = images[x];
}

function startTimer() {
    setInterval(displayNextImage, 3000);
}

async function downloadImages() {
    if (currentArtist) {
        imageJSON = await fetch("/img/:" + currentArtist.images);
    }
}

async function getCurrentArtist() {
    const artistId = "aaaaaaaa";
    currentArtist = await fetch("/artist/:" + artistId);
}

async function init() {
    await getCurrentArtist();
    await downloadImages();
    startTimer();
}

window.addEventListener('load', init);