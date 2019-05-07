'use strict';

const path = require('path');

// constants for directories
module.exports.public = path.join(__dirname, '/public/');
module.exports.public_img = module.exports.public + 'img/';
module.exports.uploaded_img = path.join(__dirname, '/uploaded_img/');

// database (in-memory for now)
module.exports.db = path.join(__dirname, '/model-inmemory.js');