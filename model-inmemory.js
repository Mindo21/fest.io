'use strict';

const fs = require('fs');
const { promisify } = require('util');

const unlinkAsync = promisify(fs.unlink);
const renameAsync = promisify(fs.rename);
const config = require("./config");

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
        images: []
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
        images: ["crab.jpg", "night.jpg", "landscape.jpg"]
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
        images: ["sea.jpg"]
    }
];
const stages = [
    {
        id: 1,
        name: "Side Stage"
    },
    {
        id: 2,
        name: "Main Stage"
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

async function addArtist(reqFiles, newArtist) {
    // create the artist first
    const existingArtist = artists.find((a) => a.id == newArtist.id);
    let artist;
    if (existingArtist) {
        // if there already is an artist, give him the new data (the images are missing)
        existingArtist.name = newArtist.name;
        existingArtist.genre = newArtist.genre;
        existingArtist.description = newArtist.description;
        existingArtist.startTime = newArtist.startTime;
        existingArtist.endTime = newArtist.endTime;
        existingArtist.stageId = newArtist.stageId;
        artist = existingArtist;
    } else {
        // create new artist
        const newId = findNewId(artists);
        if (newId == -1) return artists     // if the limit of artists is reached, dont add it
        newArtist.id = newId;
        newArtist["icon"] = 'icon.jpg';
        newArtist["images"] = [];
        artist = newArtist;
    }
    // then save the images
    if (reqFiles) {
        // move the files where we want them
        // create the folder with artistId
        try {
            if (!fs.existsSync(config.uploaded_img + artist.id)){
            fs.mkdirSync(config.uploaded_img + artist.id);
            }
        } catch (err) {
            console.error(err);
        }
        // icon file
        if (reqFiles.iconFile) {
            const iconFile = reqFiles.iconFile[0];
            const newIconFilePath = config.uploaded_img + artist.id + '/icon.jpg';
            try {
                await renameAsync(iconFile.path, newIconFilePath);
            } catch (e) {
                throw ['failed to move incoming file', e];
            }
        }
        // img files (images of the artist)
        const imgFilesNames = [];
        if (reqFiles.imgFile) {
            for (const imgFile of reqFiles.imgFile) {
                const fileExt = imgFile.mimetype.split('/')[1] || 'png';
                const newFilename = imgFile.filename + '.' + fileExt;
                const newImgFilesPath = config.uploaded_img + artist.id + '/' + newFilename;
                try {
                    await renameAsync(imgFile.path, newImgFilesPath);
                } catch (e) {
                    throw ['failed to move incoming file', e];
                }
                imgFilesNames.push(newFilename);
            };
        }
        // now add the files to the artist
        artist.images = artist.images.concat(imgFilesNames);
        console.log("artist stored: ", artist);
    }
    // actually add the created artist to the array and return artists
    if (!existingArtist) artists.push(artist);
    return artists;
}

function addStage(newStage) {
    // create the stage first
    const stage = stages.find((s) => s.id == newStage.id);
    if (stage) {
        // if there already is a stage, give him the new data
        stage.name = newArtist.name;
    } else {
        // create new stage and add it to the list
        const newId = findNewId(stages);
        if (newId == -1) return stages     // if the limit of stage is reached, dont add it
        newStage.id = newId;
        stages.push(newStage);
    }
    return stages;
}

function findNewId(arrayOfObjects) {
    if (!arrayOfObjects || arrayOfObjects.length <= 0) return 1;
    const largest_id = Math.max(...arrayOfObjects.map(e => parseInt(e.id)));
    if (largest_id + 1 > MAX_ID) {
        // if the limit is reached, dont add artist
        return -1;
    }
    return largest_id + 1;
}

const GONE = { status: 'gone' };

async function deleteArtist(id) {
    const index = artists.findIndex(a => a.id == id);
    if (!index) {
        throw GONE;
    }
    removedArtist = artists.splice(index, 1)[0];
    const iconFileName = config.uploaded_img + id + "/" + removedArtist.icon;
    // asynchronously delete the icon
    try {
        await unlinkAsync(iconFileName);
    } catch (e) {
        throw ['failed fs delete of ' + iconFileName, e];
    }
    const imgNames = removedArtist.images;
    imgNames.forEach(async imgName => {
        // asynchronously delete the img
        try {
            await unlinkAsync(config.uploaded_img + id + "/" + imgName);
        } catch (e) {
            throw ['failed fs delete of ' + config.uploaded_img + id + "/" + imgName, e];
        }
    })
    console.log("artist with images removed (hopefully)");
}

module.exports = {
    getArtist: getArtist,
    getArtists: getArtists,
    getStage: getStage,
    getStages: getStages,
    getArtistsByStage: getArtistsByStage,

    addArtist: addArtist,
    addStage: addStage,

    deleteArtist: deleteArtist,
}
