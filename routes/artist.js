const express = require('express');
const router = express.Router();

const config = require('../config.js');
const db = require(config.db);

// GET requests
router.get('/', sendArtists);
router.get('/:id', sendArtist);

// POST requests
router.post('/', addArtist);


// functions
// GET
function sendArtists(req, res) {
    const artists = db.getArtists();
    res.json(artists);
}

function sendArtist(req, res) {
    const artist = db.getArtist(req.params.id);
    if (artist)
        res.json(artist);
    else
        res.sendStatus(404);
}

// POST
function addArtist(req, res) {
    const artists = db.addArtist(req.body);
    res.json(artists);
}

module.exports = router;
