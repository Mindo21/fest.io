'use strict';

let artists = [];
let stages = [];

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
    getArtists: getArtists,
    getStages: getStages,
    addArtist: addArtist,
    addStage: addStage,
}