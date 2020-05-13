var hostname = '0.0.0.0';
var port = process.env.PORT || 3000;
var express = require('express');
var app = express();
app.use(express.static(__dirname));

var http = require('http');
var server = http.Server(app);
var io = require('socket.io')(server);

app.get('/', function (req, res) {
    res.sendfile('index.html');
});

var x = 50;
var y = 400;

var scrollX = 800;

var players = [];

class player {

    constructor(x, y, socketid, up, down, left, right, score) {
        this.x = x;
        this.y = y;
        this.socketid = socketid;
        this.up = false;
        this.down = false;
        this.left = false;
        this.right = false;
        this.score = 1000;
        this.frameCount = 0;
    }

}

server.listen(port, hostname, function () {
    console.log('listening on ' + hostname + ':' + port);
});

function idMatch(socketid) {
    for (let i = 0; i < players.length; i++) {
        if (players[i].socketid === socketid) {
            return true;
        }
    }
    return false;
}


// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection',
    // We are given a websocket object in our function
    function (socket) {

        setInterval(function () {

            scrollX -= 2;

            for (let i = 0; i < players.length; i++) {

                if (players[i].up) {
                    players[i].y -= 8;
                    //console.log(y + " up");
                }
                if (players[i].down) {
                    players[i].y += 1;
                    //console.log(y + " down");
                }
                if (players[i].left) {
                    players[i].x -= 1;
                    //console.log(x + " left");
                }
                if (players[i].right) {
                    players[i].x += 1;
                    //console.log(x + " right");
                }

                if (players[i].y < 400) {
                    players[i].y += 2;
                }

                if (players[i].y < 20) {
                    players[i].y = 20;
                }


            }

            if (players.length === 0 || scrollX < -6500) {
                scrollX = 800;
            }

            io.sockets.emit('update', players);
            io.sockets.emit('updateScrollX', scrollX);

        }, 1000 / 60);

        console.log("We have a new client: " + socket.id);
        socket.emit('myid', socket.id);


        if (!idMatch(socket.id)) {
            players.push(new player(50, 400, socket.id, false, false, false, false, 1000));
            //console.log(players);

            io.emit('new player', players);
        }

        socket.on('score',
            function (data) {
                let i = data.playerNumber;
                players[i].score = data.score;
            }
        );

        socket.on('frameCount',
            function (data) {
                let i = data.playerNumber;
                if (players.length > i) {
                    players[i].frameCount = data.frameCount;
                }
            }
        );


        // When this user emits, client side: socket.emit('otherevent',some data);
        socket.on('controls',
            function (data) {
                // Data comes in as whatever was sent, including objects
                //console.log("Received: controls " + data);

                // Send it to all other clients including sender
                //if(socket.id === playerIdArr[0]) {

                for (let i = 0; i < players.length; i++) {
                    if (players[i].socketid === data.socketid) {
                        if (data.controls === 'player1upPressed') {
                            players[i].up = data.bool;
                        }

                        if (data.controls === 'player1downPressed') {
                            players[i].down = data.bool;
                        }

                        if (data.controls === 'player1leftPressed') {
                            players[i].left = data.bool;
                        }

                        if (data.controls === 'player1rightPressed') {
                            players[i].right = data.bool;
                        }

                    }

                }


                // This is a way to send to everyone including sender
                // io.sockets.emit('message', "this goes to everyone");

            }
        );

        socket.on('disconnect', function () {
            console.log("Client has disconnected");
            for (let i = 0; i < players.length; i++) {
                if (players[i].socketid === socket.id) {
                    players.splice(i, 1);
                }
            }
            io.sockets.emit('update', players);
        });
    }
);


module.exports = app;
