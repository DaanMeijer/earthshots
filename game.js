const coords = require('./coords');

if (typeof(Number.prototype.toRadians) === "undefined") {
    Number.prototype.toRadians = function() {
        return this * Math.PI / 180;
    }
}

const roundDuration = 60;
class Game {

    constructor(io){
        this.io = io;
        this.clients = [];

        var game = this;
        this.io.on('connection', function(socket){
            game.addClient(socket);
        });

	this.secsRemaining = 0;
    }

    addClient(socket){
        var game = this;

        this.clients.push(socket);

        socket.distance = null;
        socket.points = 0;

        if(this.clients.length == 1){
            setTimeout(function(){
                game.startRound();
            }, 2000)
        }

        socket.on('close', function(){
            game.removeClient(socket);
            console.log('dropped client');
        });

        socket.on('round.guess', function(coords){
            game.guess(socket, coords);
        });

        if(this.currentCoords){
            let roundData = {
                lat: this.currentCoords.lat,
                lng: this.currentCoords.lng,
                duration: roundDuration,
            };

            socket.emit('round.start', roundData);
        }
    }

    removeClient(socket){
        this.clients.splice(this.clients.indexOf(socket), 1);

        if(this.clients.length == 0){
            this.stop();
        }
    }



    startRound(){

        this.currentCoords = coords[Math.floor(Math.random() * coords.length)];

        let roundData = {
            lat: this.currentCoords.lat,
            lng: this.currentCoords.lng,
            duration: roundDuration,
        };

        this.stop();
        this.secsRemaining = roundData.duration;

        this.emit('round.start', roundData);

        this.start();

    }

    stopRound(){
        this.currentCoords = null;
        let game = this;
        this.stop();

        var winner = null;
        this.clients.forEach(function(client){
            if(!client.distance){
                //no distance
                return;
            }

            if(client.distance < 2000){
                if(!winner || winner.distance > client.distance){
                    winner = client;
                }
            }
        });


        if(winner){
            winner.points++;
        }




        this.clients.forEach(function(client){
            client.emit('round.end', {distance: client.distance, winner: client == winner, points: client.points});

            client.distance = null;

            if(winner && winner.points >= 5){
                game.stopGame(winner);
            }
        });

        setTimeout(function(){
            game.startRound();
        }, 5000);
    }

    stopGame(winner){

        this.clients.forEach(function(client) {
            if (client === winner) {
                client.emit('game.win');
            } else {
                client.emit('game.lose');
            }
        });

        setTimeout(function(){
            process.exit();
        }, 5000);
    }

    guess(socket, coords){

        if(this.secsRemaining <= 0){
            return;
        }

        let distance = this.distance(coords) / 1000;

        socket.distance = distance;

        console.log('distance', distance);

        socket.emit('round.distance', {distance: distance});

        // this.stopRound();
    }

    distance(coords1, coords2){

        if(!coords2){
            coords2 = this.currentCoords;
        }

        if(!coords2){
            return 1000000;
        }

        let lat1 = Number.parseFloat(coords1.lat);
        let lat2 = Number.parseFloat(coords2.lat);
        let lng1 = Number.parseFloat(coords1.lng);
        let lng2 = Number.parseFloat(coords2.lng);

        let R = 6371e3; // metres
        let φ1 = lat1.toRadians();
        let φ2 = lat2.toRadians();
        let Δφ = (lat2 - lat1).toRadians();
        let Δλ = (lng2 - lng1).toRadians();

        let a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        let d = R * c;

        return d;
    }

    start(){
        const game = this;
        this.interval = setInterval(function(){
            game.tick();
        }, 1000);
    }

    stop(){
        clearInterval(this.interval);
    }

    tick(){
        console.log('tick', this.secsRemaining);

        this.secsRemaining--;
        this.emit('round.tick', {secsRemaining: this.secsRemaining});

        if(this.secsRemaining <= 0){
            this.stopRound();

        }else{
        }
    }

    emit(event, args){
        this.clients.forEach(function(socket){
            socket.emit(event, args);
        });
    }

}

module.exports = Game;
