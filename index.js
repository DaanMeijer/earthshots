const express = require('express');
const socketIo = require('socket.io');
const http = require('http');
const Game = require('./game');
const GoogleMapsAPI = require('googlemaps');

const app = express();
const server = http.createServer(app);
const io = socketIo.listen(server);

app.use(express.static('static'));

app.get('/', function (req, res) {
    res.redirect('/static/')
});

server.listen(8123);

const game = new Game(io);

game.start();

