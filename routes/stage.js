const express = require('express');
const router = express.Router();
const app = require("../app.js");

const config = require('../config.js');
const db = require(config.db);

// GET requests
router.get('/', sendStages); // get all stages
router.get('/:id', sendStage); // get stage by id
router.get('/:id/artists', sendArtists); // get artists by stage id

// POST requests
router.post('/', addStage); // add new stage (json)


// functions
// GET
function sendStages(req, res) {
    const stages = db.getStages();
    res.json(stages);
}

function sendStage(req, res) {
    const stage = db.getStage(req.params.id);
    if (stage)
        res.json(stage);
    else
        res.sendStatus(404);
}

function sendArtists(req, res) {
    const artists = db.getArtistsByStage(req.params.id);
    if (artists)
        res.json(artists);
    else
        res.sendStatus(404);
}

// POST
function addStage(req, res) {
    const stages = db.addStage(req.body);
    app.updateStagesSocket(stages);
    if (req.accepts('html')) {
        // browser should go to the listing of stages
        res.redirect(303, '/');
    } else {
        // request that accepts JSON will instead get the data
        res.json(stages);
    }
}

module.exports = router;
