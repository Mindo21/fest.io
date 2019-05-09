'use strict';

const MAX_ID = 1000; // store up to 1000 artists/stages

const artists = [
    {
        id: 1,
        name: "Blue Zodiac",
        genre: "blues",
        description: "A band that plays blues",
        startTime: "14:00",
        endTime: "15:00",
        stageId: 1,
        icon: "icon.jpg",
        images: ["crab.jpg", "landscape.jpg", "night.jpg"]
    },
    {
        id: 2,
        name: "Fearless Flyers",
        genre: "funk",
        description: "We like to play on guitars only...",
        startTime: "16:00",
        endTime: "17:00",
        stageId: 2,
        icon: "icon.jpg",
        images: ["crab.jpg", "night.jpg"]
    },
    {
        id: 3,
        name: "Vulfpeck",
        genre: "funk",
        description: "Gangster band playing funk and hip hop only...",
        startTime: "10:00",
        endTime: "11:00",
        stageId: 2,
        icon: "icon.jpg",
        images: ["crab.jpg", "landscape.jpg", "night.jpg"]
    }
];
const stages = [
    {
        id: 2,
        name: "Side Stage"
    }
];

function getArtist(id) {
    return artists.find((artist) => artist.id == id);
}

function getArtists() {
    return artists;
}

function getStage(id) {
    return stages.find((stage) => stage.id == id);
}

function getStages() {
    return stages;
}

function getArtistsByStage(id) {
    return artists.filter((artist) => artist.stageId == id);
}

function addArtist(artist) {
    const existingArtistIndex = artists.findIndex((a) => a.id == artist.id);
    if (existingArtistIndex != -1) {
        // if there already is an artist, replace him
        artists.splice(existingArtistIndex, 1);
    } else {
        const newId = findNewId(artists);
        if (newId == -1) return artists     // if the limit of artists is reached, dont add it
        artist.id = newId;
    }
    artists.push(artist);
    return artists;
}

function addStage(stage) {
    stages.push(stage);
    return stages;
}

function findNewId(arrayOfObjects) {
    const largest_id = Math.max(...arrayOfObjects.map(e => parseInt(e.id)));
    if (largest_id + 1 > MAX_ID) {
        // if the limit is reached, dont add artist
        return -1;
    }
    return largest_id + 1;
}

module.exports = {
    getArtist: getArtist,
    getArtists: getArtists,
    getStage: getStage,
    getStages: getStages,
    getArtistsByStage: getArtistsByStage,

    addArtist: addArtist,
    addStage: addStage,
}