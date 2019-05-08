'use strict';

const artists = [
    {
        id: 2,
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
        id: 3,
        name: "Fearless Flyers",
        genre: "funk",
        description: "We like to play on guitars only...",
        startTime: "16:00",
        endTime: "17:00",
        stageId: 2,
        icon: "icon.jpg",
        images: ["crab.jpg", "night.jpg"]
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

function addArtist(data) {
    artists.push(data);
    return artists;
}

function addStage(data) {
    stages.push(data);
    return stages;
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