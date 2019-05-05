'use strict';

const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(express.static('public'));

/**
 * Set up the sockets
 */

let stages = [];
let stage = null;
let connectedSocketsCount = 0;

io.on('connection', function(socket) {
    console.log('made socket connection: ', socket.id);
    connectedSocketsCount++;
    console.log('connected sockets: ', connectedSocketsCount);
    // if (!stage) {
    //     stage = {
    //         stageId: "sideStageId",
    //         name: "Side Stage",
    //         artists: []
    //     };
    // }

    socket.emit('output', stages);

    socket.on('disconnect', function() {
        console.log('disconnected socket: ', socket.id);
        connectedSocketsCount--;
        console.log('connected sockets: ', connectedSocketsCount);
    });

    socket.on('ADD_ARTIST_TO_STAGE', addArtistToStage);
    socket.on('ADD_STAGE', addStage);

    function addArtistToStage(data) {
        // console.log(JSON.stringify(data));

        // if there is no stage in array of stages yet
        if (stages.length <= 0) {
            stages = [{
                stageId: "sideStageId",
                name: "",
                artists: [data.newArtist]
            }];
        } else {
            const searchedStage = stages.find((e) => { return e.stageId == data.stageId; });
            if (searchedStage) {
                // if there already is a stage with the given stageId
                searchedStage.artists.push(data.newArtist);
            } else {
                // if there was no stage found with that stageId
                console.log("invalid stageId - Not Found: ", data.stageId);
            }
        }
        
        // console.log("Stages after adding to a stage: ", JSON.stringify(stages));
        io.emit('output', stages);
    }

    function addStage(data) {
        // console.log(JSON.stringify(data));
        stages.push(data);
        console.log("Stages after adding a stage: ", JSON.stringify(stages));
        io.emit('output', stages);
    }
});

// server.listen() instead of app.listen(), because I am using socket.io
server.listen(8080, (err) => {
    if (err) console.error('error starting server: ', err);
    else console.log('server started, listening on port 8080...');
});