const express = require('express');
const router = express.Router();
const app = require("../app.js");
const multer = require('multer');

const config = require('../config.js');
const db = require(config.db);

// multer is a package that handles file uploads nicely
const uploader = multer({
    dest: config.uploaded_img,
    limits: { // for security
      fields: 10,
      fileSize: 1024*1024*20,
      files: 11,    // up to 10 photos + icon
    },
  });

// GET requests
router.get('/', sendArtists); // get all artists
router.get('/:id', sendArtist); // get artist by id

// POST requests
router.post(
    '/',    // on call '/' method: 'POST'
    uploader.fields([{ name: 'iconFile', maxCount: 1 }, { name: 'imgFile', maxCount: 11 }]),    // upload icon and images
    addArtist   // add new artist
);

// DELETE requests
router.delete('/:id', deleteArtist); // delete artist with id


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
async function addArtist(req, res) {
    console.log("req.body: ", req.body);
    const artists = await db.addArtist(req.files, req.body);
    app.updateAllArtistsSocket(artists);
    if (req.accepts('html')) {
        // browser should go to the listing of artists
        res.redirect(303, '/');
    } else {
        // request that accepts JSON will instead get the data
        res.json(artists);
    }
}

// DELETE
async function deleteArtist(req, res) {
    try {
        await db.deleteArtist(req.params.id);
        res.sendStatus(200);
    } catch (e) {
        if (e.status === 'gone') {
            res.sendStatus(410); // already gone
        } else {
            error(res, e);
        }
    }
}

module.exports = router;
