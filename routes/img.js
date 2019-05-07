const express = require('express');
const router = express.Router();

const config = require('../config.js');
const db = require(config.db);

// GET requests
router.get('/:id/:fileName', sendImg);

// POST requests


//functions
// GET
function sendImg(req, res) {
    res.sendFile(config.uploaded_img + req.params.id + "/" + req.params.fileName);
}

module.exports = router;