

// Keep track of our socket connection
var socket;
var song;
var fft;
var button;
var spectrum;
var stepSize = 4;
var touchStepSize = 2;
var transp = 140;
var ampConst = 0.015;
var angle;
var rad;
var x;
var y;
var xOff;
var yOff;
var xOffScale=0.25;
var yOffScale=xOffScale*1.2;

var amp;
var countCx = 0;
var countCol = 0;
var ampScale = 1;
var ampExponent = 1;
var rEllipseFactor = 1;
let ampScaleSlider;
let offScaleSlider;
let rSlider;
let gSlider;
let bSlider;
let rEllipseSlider;
var drawingCutOff = 0.7;
var slider1,slider2,slider3,slider4,slider5;

var r = 100;
var g = 100;
var b = 100;
var sel;
var frames=0;
var playedOnce = false;
var endingText = 'take a screenshot and post to instagram\n #comprehension_art     @noaru_band';
var unique_username = '';
var endingTextDarkness = 0;
var inp, submit_button;
var introP1;
var introP2;
var igOpen = false;
var igUser = '';
var allowDraw = false;
var p5canvas;
var allUserNames = [];
var userNum = 0;
var runAllUsers = false;
var ontoNextUser = false;
var currentUserName = '';

function preload() {
    song = loadSound('../assets/gamemusicmkr-med.mp3');

}



function toggleSong() {
    if (!song.isPlaying()) {
        song.play();
    }
}




function setup() {

    col = color(25,23,200,2);
    fontCol = color(255,255,255);


    submit_button = createButton('then click here to draw');
    submit_button.mousePressed(toggleSong);
    submit_button.style('display', 'table');
    submit_button.style('margin', '0 auto');
    submit_button.style('margin-top', '5%');
    submit_button.style('font-size', '20px');
    submit_button.style('background-color', col);
    submit_button.style('color', fontCol);

    fill(255);
    textAlign(CENTER);

    var p5canvas = createCanvas(windowWidth*0.95, windowHeight*0.9);
    background(0);
    strokeWeight(5);

//end of setup function
}



