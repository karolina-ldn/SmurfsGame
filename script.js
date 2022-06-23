'use strict';


let canvas = document.getElementById("gameCanvas");
let canvasContext = canvas.getContext("2d");

canvas.height = 600;
canvas.width = 800;

let smurfX=40;
let smurfY=40;
let speed = 2;

let smurf = document.getElementById("smurf");
let tile = document.getElementById("grass");
let blueberry = document.getElementById("blueberry");
let gargamel = document.getElementById("gargamel");
let gargamelX = 120;
let gargamelY = 40;

let tileWidth = 40;
let tileHeight = 40;
let tileSize = 40;

//---------------------------------------------MAZE----------------------------------------------------

/*  1 - grass
    2 - blueberry
     */

const maze=[[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,4,0,0,0,0,0,2,1,2,0,0,0,0,0,0,0,0,2,1],
            [1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,0,0,1],
            [1,2,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1],
            [1,0,0,0,0,0,0,2,1,2,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,1],
            [1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,0,1],
            [1,2,0,0,0,0,0,0,0,0,0,0,1,1,1,1,2,1,0,1],
            [1,0,0,1,1,1,1,1,1,1,0,0,0,0,0,1,1,1,0,1],
            [1,0,0,1,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,1],
            [1,2,0,1,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            
]


//---------------------------arrow directions event listener-------------------------------------------------

let upDir = false;
let downDir = false;
let leftDir = false;
let rightDir = false;

document.addEventListener('keydown',keyDown);
document.addEventListener('keyup',keyUp);

//-----------------------------------game loop------------------------------------------------------------------

function runGame(){
    requestAnimationFrame(runGame);

    canvasContext.clearRect(0,0,canvas.width,canvas.height);

    renderMaze();

    drawSmurf();

    gargamelMovement();

    // smurfPosition(); // for debugging

    collisionDetection();

    collectBlueberry();

    smurfDeath();
    
   
}

//--------------------------------DRAW THE MAZE-----------------------------------------------------------
function renderMaze(){


    for (let i = 0; i < maze.length; i++){
        for (let j = 0; j < maze[i].length; j++){
            if (maze[i][j] == 1){
                canvasContext.drawImage(tile, tileWidth*j, tileHeight*i ,tileWidth,tileHeight);
            }

            if (maze[i][j] == 2){
                canvasContext.drawImage(blueberry, tileWidth*j+20, tileHeight*i+10,20,20);
            }
            // if (maze[i][j] == 3){
            //     canvasContext.drawImage(gargamel, tileW, tileHeight*i ,40,40);
            // }

            // if (maze[i][j] == 4){
            //         canvasContext.drawImage(smurf,smurfX,smurfY,40,40);
            //     }
            
            // canvasContext.strokeStyle = "red";
            // canvasContext.strokeRect(j*tileWidth,i*tileHeight,tileWidth,tileHeight)

        }
        
    }
}


//----------------------------------SMURF POSITION DISPLAYED ON SCREEN--------------------------------
//for debugging
let position = document.createElement("div")
let box = document.getElementById("box")
box.appendChild(position);
position.className += "position";

function  smurfPosition(){

    position.innerText = `top edge x: ${Math.floor((smurfX+15) / tileWidth)},
                                         y:${ Math.floor((smurfY) / tileHeight)},
                        right edge x: ${Math.floor((smurfX+30) / tileWidth)},
                                         y:${ Math.floor((smurfY+15) / tileHeight)},
                        left edge x: ${Math.floor((smurfX) / tileWidth)},
                                         y:${ Math.floor((smurfY+15) / tileHeight)},
                        bottom edge x: ${Math.floor((smurfX+15) / tileWidth)},
                                         y:${ Math.floor((smurfY+30) / tileHeight)}`              

}

//------------------------------------------collision detection-----------------------------------------

function collisionDetection(){
    let smurfPositionRowTop = Math.floor((smurfY) / tileHeight); //top middle edge
    let smurfPositionColumnTop =  Math.floor((smurfX+18) / tileWidth);

    let smurfPositionRowRight = Math.floor((smurfY+18) / tileHeight); //right middle edge
    let smurfPositionColumnRight =  Math.floor((smurfX+36) / tileWidth);

    let smurfPositionRowBottom = Math.floor((smurfY+36) / tileHeight); //bottom middle edge
    let smurfPositionColumnBottom =  Math.floor((smurfX+18) / tileWidth);

    let smurfPositionRowLeft = Math.floor((smurfY+18) / tileHeight); //left middle edge
    let smurfPositionColumnLeft =  Math.floor((smurfX) / tileWidth);
 
    //collision from the top 
    if (maze[smurfPositionRowTop][smurfPositionColumnTop] == 1 ){
      
        smurfY +=3;
        console.log("collision top");
    }

    //collision from the bottom
    if (maze[smurfPositionRowBottom][smurfPositionColumnBottom] == 1){
        smurfY -=3;
        console.log("collision bottom");
    }

    //collision from the right
    if (maze[smurfPositionRowRight][smurfPositionColumnRight] == 1){
        smurfX -=3;
        console.log("collision right");
    }

    //collision from the left
    if (maze[smurfPositionRowLeft][smurfPositionColumnLeft] == 1){
        console.log("collision left");
        smurfX +=3
    }

    // allow movement only when is not colliting

    else {
        arrowInputs();
    }
}


//------------------------------------collect blueberry----------------------------------------------------
function collectBlueberry(){
    let smurfPositionRow = Math.floor((smurfY+20 )/ tileHeight); // center of the smurf
    let smurfPositionColumn =  Math.floor((smurfX+20) / tileWidth);

    if (maze[smurfPositionRow][smurfPositionColumn] == 2){
        maze[smurfPositionRow].splice([smurfPositionColumn],1,0)
        pickBlueberry();
        
    }
}

//-------------------------------------GARGAMEL------------------------------------------------------------


function gargamelMovement(){
    canvasContext.drawImage(gargamel,gargamelX,gargamelY,40,40)

}

//---------------------------------------draw the smurf-----------------------------------------------------

function drawSmurf() {
    canvasContext.drawImage(smurf,smurfX,smurfY,40,40);
}
    
//----------------------------------------- Moving the smurf---------------------------------------------
function arrowInputs() {
    if (upDir) {
        smurfY = smurfY - speed
    }
    if (downDir) {
        smurfY = smurfY + speed;
    }
    
    if (leftDir) {
        smurfX = smurfX - speed;
    }
    
    if (rightDir) {
        smurfX = smurfX + speed;
    }
}


//arrow key functions
function keyDown(e){
    if (e.keyCode === 38) {
        upDir = true;
      }
    
      if (e.keyCode === 40) {
        downDir = true;
      }
    
      if (e.keyCode === 37) {
        leftDir = true;
      }
    
      if (e.keyCode === 39) {
        rightDir = true;
      }
}

function keyUp (e){
   
    if (e.keyCode === 38) {
        upDir = false;
      }
    
      if (e.keyCode === 40) {
        downDir = false;
      }
    
      if (e.keyCode === 37) {
        leftDir = false;
      }
    
      if (e.keyCode === 39) {
        rightDir = false;
      }
}
//--------------------------------------SMURF Dead------------------------------------------------------------
function smurfDeath(){
    if (smurfX == gargamelX && smurfY == gargamelY){
       
        console.log("gargamel");
    }
    
}

//-----------------------------------------MUSIC AND SOUNDS--------------------------------------------------

function playMusic(){
    let music = new Audio("/sounds/themesmurfs.mp3")
    music.play();
}

function pickBlueberry(){
    let music = new Audio("/sounds/pick.wav")
    music.play();
}

//-----------------------------------------------------------------------------------------------------------
playMusic();  

runGame();


       
