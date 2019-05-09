'use strict';

// server constants
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

// utils
const config = require('./config.js');
const db = require(config.db);

// this has to be above routers, because routers are using these functions
module.exports = {
    updateArtistsSocket: updateArtistsSocket,
    updateStagesSocket: updateStagesSocket,
}

// routers
const artistRouter = require('./routes/artist.js');
const stageRouter = require('./routes/stage.js');
const imgRouter = require('./routes/img.js');

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded());

app.use('/artist', artistRouter);
app.use('/stage', stageRouter);
app.use('/img', imgRouter);

// Set up the sockets

let connectedSocketsCount = 0;
io.on('connection', function(socket) {
    console.log('made socket connection: ', socket.id);
    connectedSocketsCount++;
    console.log('connected sockets: ', connectedSocketsCount);

    socket.emit('UPDATE_ARTISTS', db.getArtists());
    socket.emit('UPDATE_STAGES', db.getStages());

    socket.on('disconnect', function() {
        console.log('disconnected socket: ', socket.id);
        connectedSocketsCount--;
        console.log('connected sockets: ', connectedSocketsCount);
    });
});

function updateArtistsSocket(artists) {
    io.emit('UPDATE_ARTISTS', artists);
}

function updateStagesSocket(stages) {
    io.emit('UPDATE_STAGES', stages);
}

// server.listen() instead of app.listen(), because I am using socket.io
server.listen(8080, (err) => {
    if (err) console.error('error starting server: ', err);
    else console.log('server started, listening on port 8080...');
});