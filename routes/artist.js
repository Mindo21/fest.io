const express = require('express');
const router = express.Router();

const config = require('../config.js');
const db = require(config.db);

// GET requests
router.get('/', sendArtists);

// POST requests
router.post('/', addArtist);


// functions

function sendArtists(req, res) {
    const artists = db.getArtists();
    res.json(artists);
}

function addArtist(req, res) {
    const artists = db.addArtist(req.body);
    res.json(artists);
}

module.exports = router;
