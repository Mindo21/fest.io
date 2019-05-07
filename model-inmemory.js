'use strict';

const artists = [
    {
        id: 2,
        name: "Blue Zodiac",
        genre: "blues",
        startTime: "14:00",
        endTime: "15:00",
        stageId: 1,
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

function getStages() {
    return stages;
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
    getStages: getStages,
    addArtist: addArtist,
    addStage: addStage,
}