const express = require('express');
const router = express.Router();

const config = require('../config.js');
const db = require(config.db);

// GET requests
router.get('/', sendStages);

// POST requests
router.post('/', addStage);


// functions

function sendStages(req, res) {
    const stages = db.getStages();
    res.json(stages);
}

function addStage(req, res) {
    const stages = db.addStage(req.body);
    res.json(stages);
}

module.exports = router;
