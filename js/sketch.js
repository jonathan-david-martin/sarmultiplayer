//school themed game
//made by 10th grade students at SAR
//name of game: yet to be determined

//contols: up arrow key to jump

//sound variables
var song;
var sound;
var grumph;

//coordinate variables
var y = 400
var x = 50;
var scrollX = 800;
var scrollY = 400;
var rightButtonX = 200;
var rightButtonY = 100;

//controls
var player1rightPressed = false;
var player1leftPressed = false;
var player1upPressed = false;
var player1downPressed = false;

//images
var bee;
var bee_transparent;
var ipad;
var lockers;
var apple;
var backpack;
var clay_gray1;
var clay_gray2;

var game_name = 'FlappyBee';

var pacman_died_sound;

//var game = new Phaser.Game(800, 800, Phaser.AUTO, '', { preload: preload, create: create, update: update})
var socket;

var laserSprites = [];
var cursors;

var mysocketid;

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


function preload() {
    bee = loadImage('../assets/bee.png')
    bee_transparent = loadImage('../assets/bee_transparent.png')
    rabbih = loadImage('../assets/harczstark.png')
    rabbik = loadImage('../assets/kroll1.png')
    books = loadImage('../assets/books.png')
    song = loadSound('../assets/gamemusicmkr-med.mp3');
    ipad = loadImage('../assets/ipad.png')
    lockers = loadImage('../assets/lockers.png')
    apple = loadImage('../assets/apple.png')
    backpack = loadImage('../assets/backpack.png')
    clay_gray1 = loadImage('../assets/claypose1-gray.png');
    clay_gray2 = loadImage('../assets/claypose2-gray.png');

    sound = loadSound('../assets/sound.wav');
    grumph = loadSound('../assets/grumph2.wav');
    pacman_died_sound = loadSound('../assets/pacman_died.wav');
    grumph.duration = 500;
    //set the playback rate
    grumph.rate(1.5);
}

function setup() {
    socket = io();
    //socket = io({transports: ['websocket'], upgrade: false});

    socket.on('myid',
        function (data) {
            mysocketid = data;
        }
    );

    socket.on('new player',
        function (data) {
            players = data;
        }
    );


    socket.on('update',
        function (data) {
            players = data;
        }
    );

    socket.on('updateScrollX',
        function (data) {
            scrollX = data;
        }
    );

    createCanvas(windowWidth, windowHeight);
    fill(0);
    //play soundtrack as soon as game starts
    song.play();

}

function draw() {

    background(80);

    for (var i = 0; i < players.length; i++) {

        if (players[i].socketid === mysocketid) {
            text("me", players[i].x, players[i].y)
            image(bee, players[i].x, players[i].y, 100, 100)
        } else {
            image(bee_transparent, players[i].x, players[i].y, 100, 100)
        }

        if(players[i].socketid === mysocketid) {
            let data = {
                frameCount: round(frameCount/10,0),
                playerNumber: i
            }
            socket.emit('frameCount', data);
        }

    }



    textFont('Righteous');
    //points
    textSize(20);

    for (var i = 0; i < players.length; i++) {
        fill(0);
        if(players[i].socketid === mysocketid) {
            text('ME: ' + (players[i].score + players[i].frameCount), 100, 40 + 20 * i);
        }
        else{
            text('player ' + i + ': ' + (players[i].score + players[i].frameCount), 100, 40 + 20 * i);

        }

    }

    //player
    //tint(100, 0, 0);
    //text('me',x,y);
    //image(bee, x, y, 100, 100)

    //obstacles
    image(rabbih, scrollX, scrollY, 100, 132)
    image(rabbik, scrollX + 700, 360, 150, 175)
    image(books, scrollX + 100, 50, 100, 150)
    image(ipad, scrollX + 1400, 360, 150, 175)
    image(apple, scrollX + 2100, 360, 150, 175)
    image(lockers, scrollX + 2800, 360, 150, 175)
    image(backpack, scrollX + 3500, 360, 150, 175)


    //this is the rate the object in the game scroll from right to left
    //scrollX -= 3;

    //platform (the big rectangle the objects sit on)
    fill(242, 255, 0)
    rect(0, 500, windowWidth, 200);

    if (scrollX < -4200 + windowWidth) {
        if (abs(scrollX % 20) === 0) {
            if (!grumph.isPlaying()) {
                grumph.play();
            }
        }
    }

    if (scrollX < -6600 + windowWidth) {
        if(grumph.isPlaying()) {
            grumph.stop();
        }
    }

    //this code seem complicated, but it is just because the clay figure images face right. the push, pop, translate and scale code is just to make the images face the left
    push();
    translate(scrollX + 4200, scrollY);
    text('BULLY', 0, 50);
    scale(-1, 1);
    //the % symbol means the remainder when two numbers are divided
    if (abs(scrollX % 20) > 9) {
        image(clay_gray1, 0, 0, 50, 125);
    } else {
        image(clay_gray2, 0, 0, 50, 125);
    }
    pop();


    //this is the right button
    //x,y,width, height
    rect(rightButtonX, rightButtonY, 100, 100)
    textSize(30)
    fill(0)
    //textFont('Helvetica')
    text("right", rightButtonX + 20, rightButtonY + 60)

    //this is the up button
    fill(242, 255, 0)
    rect(400, 100, 100, 100)
    fill(0)
    text("up", 433, 160)

    //restart button
    fill(200)
    rect(rightButtonX, rightButtonY + 460, 100, 100)
    textSize(30)
    fill(0)
    //textFont('Helvetica')
    text("restart", rightButtonX + 10, rightButtonY + 480)

    //see if mouse clicks the right button
    if (mouseIsPressed && mouseX > rightButtonX && mouseY > rightButtonY && mouseX < rightButtonX + 100 && mouseY < rightButtonY + 100) {
        let data = {
            controls: 'player1rightPressed',
            bool: true,
            socketid: mysocketid
        }
        socket.emit('controls', data);
    }

    //see if the mouse clicks the up button
    if (mouseIsPressed && mouseX > 400 && mouseY > 100 && mouseX < 500 && mouseY < 200) {
        let data = {
            controls: 'player1upPressed',
            bool: true,
            socketid: mysocketid
        }
        socket.emit('controls', data);
    }




    for (var i = 0; i < players.length; i++) {
        if (players[i].socketid === mysocketid) {
            //collision with Rabbi Harczstark

            collision(scrollX, scrollY, players[i].x, players[i].y, i);

            //collision with Rabbi Kroll
            collision(scrollX + 700, scrollY, players[i].x, players[i].y, i);

            //collision with books
            collision(scrollX + 100, 50, players[i].x, players[i].y, i);

            collision(scrollX + 1400, scrollY, players[i].x, players[i].y, i);

            collision(scrollX + 2100, scrollY, players[i].x, players[i].y, i);

            collision(scrollX + 2800, scrollY, players[i].x, players[i].y, i);

            collision(scrollX + 3500, scrollY, players[i].x, players[i].y, i);

            collision(scrollX + 4200, scrollY, players[i].x, players[i].y, i);

        }
    }

//title screen
        if (frameCount < 120) {
            //blue
            fill(0, 0, 255);
            rect(0, 0, windowWidth, windowHeight);

            fill(255, 0, 0);
            textSize(100);
            text(game_name, windowWidth / 3, windowHeight / 2);
        }

//end of draw loop
    }

    function collision(x1, y1, x2, y2, i) {
        if (dist(x1, y1, players[i].x, players[i].y) < 100) {
            fill(0);
            if (!pacman_died_sound.isPlaying()) {
                pacman_died_sound.play();
            }
            textSize(40);
            text('oh no!', 100, 80);
            players[i].score -= 1;
            let data = {
                score: players[i].score,
                playerNumber: i
            }
            socket.emit('score', data);

        }


    }

    function mousePressed() {
        //see if the mouse clicks the restart button
        if (mouseIsPressed && mouseX > rightButtonX && mouseY > rightButtonY + 460 && mouseX < rightButtonX + 100 && mouseY < rightButtonY + 100 + 510) {
            scrollX = 800;
            x = 50;
            y = 400;
            loop();
            if (!song.isPlaying()) {
                song.play();
            }

        }

    }

    /*
    function keyPressed() {
      if (key === 'r') {
        scrollX = 800;
        x = 50;
        y = 400;
        loop();
        if (!song.isPlaying()) {
          song.play();
        }
      }
    }
     */

    function keyPressed() {

        if (key === 'r') {
            scrollX = 800;
            x = 50;
            y = 400;
            loop();
            if (!song.isPlaying()) {
                song.play();
            }
        }

        if (keyCode === UP_ARROW) {

            let data = {
                controls: 'player1upPressed',
                bool: true,
                socketid: mysocketid
            }
            socket.emit('controls', data);

        } else if (keyCode === DOWN_ARROW) {
            let data = {
                controls: 'player1downPressed',
                bool: true,
                socketid: mysocketid
            }
            socket.emit('controls', data);
        } else if (keyCode === LEFT_ARROW) {
            let data = {
                controls: 'player1leftPressed',
                bool: true,
                socketid: mysocketid
            }
            socket.emit('controls', data);
        } else if (keyCode === RIGHT_ARROW) {
            let data = {
                controls: 'player1rightPressed',
                bool: true,
                socketid: mysocketid
            }
            socket.emit('controls', data);
        }


    }

    function mouseReleased(){
        let data = {
            controls: 'player1upPressed',
            bool: false,
            socketid: mysocketid
        }
        socket.emit('controls', data);
        let data2 = {
            controls: 'player1rightPressed',
            bool: false,
            socketid: mysocketid
        }
        socket.emit('controls', data2);
    }


    function keyReleased() {
        if (keyCode === UP_ARROW) {
            let data = {
                controls: 'player1upPressed',
                bool: false,
                socketid: mysocketid
            }
            socket.emit('controls', data);
        } else if (keyCode === DOWN_ARROW) {
            let data = {
                controls: 'player1downPressed',
                bool: false,
                socketid: mysocketid
            }
            socket.emit('controls', data);
        } else if (keyCode == LEFT_ARROW) {
            let data = {
                controls: 'player1leftPressed',
                bool: false,
                socketid: mysocketid
            }
            socket.emit('controls', data);
        } else if (keyCode == RIGHT_ARROW) {
            let data = {
                controls: 'player1rightPressed',
                bool: false,
                socketid: mysocketid
            }
            socket.emit('controls', data);
        }


    }