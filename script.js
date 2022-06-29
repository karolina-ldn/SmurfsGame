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
let coin = document.getElementById("coin");
let key = document.getElementById("key");
let gargamel = document.getElementById("gargamel");
let gargamelX = 400;
let gargamelY = 240;
let cat = new Image();
cat.src = "images/cat.png"
let catX = 640
let catY = 400
let smurfette = new Image();
smurfette.src = "images/background.png"


//gargamel directions
let directions = [];
let north = {x:0,y:-1};
let south = {x:0,y:1};
let west = {x:-1,y:0};
let east = {x:1,y:0};
directions.push(north,south,west,east);
console.log(directions);
let gargamelDirection = directions[3];
let catDirection = directions[2];

let tileWidth = 40;
let tileHeight = 40;
let tileSize = 40;

let collectedBlueberries = 0;
let collectedCoins = 0;


//---------------------------------------------MAZE----------------------------------------------------

/*  
    0 - empty path
    1 - grass
    2 - blueberry
    3 - coin
    4 - smurfette
    5 - key
*/

let maze1=[  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,0,0,0,0,0,3,1,2,3,3,3,3,3,3,3,3,2,1],
            [1,2,1,1,1,1,1,3,1,0,1,1,1,1,1,1,1,1,0,1],
            [1,0,0,0,0,3,1,2,0,0,0,0,0,0,0,2,1,2,0,1],
            [1,1,1,1,1,3,1,1,1,1,1,1,1,1,1,1,1,1,0,1],
            [1,3,0,0,0,3,1,3,3,3,3,3,3,3,3,3,1,2,0,1],
            [1,3,1,0,1,1,1,0,1,1,1,1,1,1,1,0,1,1,0,1],
            [1,2,1,0,2,1,0,0,0,0,0,0,0,2,1,0,0,0,0,1],
            [1,1,1,1,1,1,0,1,1,1,1,0,1,1,1,1,2,1,0,1],
            [1,0,0,0,0,0,0,1,0,2,1,0,0,0,2,1,1,1,0,1],
            [1,2,1,1,1,1,1,1,0,1,1,0,1,1,1,1,0,0,0,1],
            [1,1,1,2,3,3,3,3,3,3,3,3,1,2,0,0,0,1,0,1],
            [1,2,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1],
            [1,3,3,3,3,3,3,3,3,3,2,1,2,3,3,3,3,3,3,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            
]

let maze = [   [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                [1,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1],
                [1,2,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,1,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1],
                [1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,0,1],
                [1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,1,0,0,1],
                [1,0,1,0,1,1,1,0,1,1,1,1,1,1,1,0,1,1,0,1],
                [1,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,1],
                [1,1,1,1,1,1,0,0,0,1,1,0,1,1,1,1,0,1,0,1],
                [1,0,0,0,0,0,0,1,0,0,1,0,0,0,0,1,1,1,0,1],
                [1,0,1,1,1,1,1,1,0,1,1,0,1,1,1,1,0,0,0,1],
                [1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
                [1,0,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1],
                [1,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,1],
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

    drawGargamel();

    moveGargamel();

    // smurfPosition(); // for debugging
    drawCat();

    moveCat();

    collisionDetection();

    collectBlueberry();

    collectCoin()

    collectKey();
    
    smurfDeath();
    
    nextLevel();
   
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
            if (maze[i][j] == 3){
                    canvasContext.drawImage(coin,tileWidth*j+20, tileHeight*i+10,20,20);
            }
            if (maze[i][j] == 5){
                    canvasContext.drawImage(key,tileWidth*j+20, tileHeight*i+10,20,20);
            }
            if (maze[i][j] == 4){
                canvasContext.drawImage(smurfette,tileWidth*j, tileHeight*i,40,40);
        }
            // canvasContext.strokeStyle = "red";
            // canvasContext.strokeRect(j*tileWidth,i*tileHeight,tileWidth,tileHeight)

        }
        
    }
}


//----------------------------------SMURF POSITION DISPLAYED ON SCREEN--------------------------------
//for debugging
// let position = document.createElement("div")
// let box = document.getElementById("box")
// box.appendChild(position);
// position.className += "position";

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
        // maze[smurfPositionRow].splice([smurfPositionColumn],1,0)
        maze[smurfPositionRow][smurfPositionColumn] = 0
        pickSound();
        scoreCount();
        renderKey();
        
    }
}
//----------------------------------------collect coin------------------------------------------------------
function collectCoin(){
    let smurfPositionRow = Math.floor((smurfY+20 )/ tileHeight); // center of the smurf
    let smurfPositionColumn =  Math.floor((smurfX+20) / tileWidth);
    if (maze[smurfPositionRow][smurfPositionColumn] == 3){
        maze[smurfPositionRow][smurfPositionColumn] = 0
        pickSound();
        coinCount();        
    }
}
//-------------------------------------SCORE--------------------------------------------------------------
let scoreBoard = document.createElement("div");
box.appendChild(scoreBoard);
scoreBoard.className += "score-board";
let blueberryImage = document.createElement("img"); //image on the score board
scoreBoard.appendChild(blueberryImage);
blueberryImage.src = "images/blueberry.png";
blueberryImage.className += "blueberry-image";
let scoreBlueberry = document.createElement("p");
scoreBoard.appendChild(scoreBlueberry);
scoreBlueberry.innerText = ` ${collectedBlueberries}`
let coinImage = document.createElement("img");
scoreBoard.appendChild(coinImage);
coinImage.src = "images/coin.png";
coinImage.className += "blueberry-image";
let coinsCollected = document.createElement("p");
scoreBoard.appendChild(coinsCollected);
coinsCollected.innerText = `${collectedCoins}`
let keyImage = document.createElement("img");
scoreBoard.appendChild(keyImage);
keyImage.src = "images/key.png";
keyImage.className += "key-image";
let scoreKey = document.createElement("p");
scoreBoard.appendChild(scoreKey);
scoreKey.innerText = "collect all blueberries";


function scoreCount(){
    collectedBlueberries++;
    scoreBlueberry.innerText = ` ${collectedBlueberries}`

}

function coinCount(){
    collectedCoins++;
    coinsCollected.innerText = `${collectedCoins}`
}
//-----------------------------------------lives left-------------------------------------------------------
let live = new Image();
live.src = "images/live.png";
scoreBoard.appendChild(live);
live.className += "live";
let lives = 3
let livesNumber = document.createElement("p");
scoreBoard.appendChild(livesNumber);
livesNumber.innerText = `${lives}`

function lostLive(){
    lives --;
    livesNumber.innerText = `${lives}`
    if (lives < 1){
        gameOverSound();
        alert("game over")
        location.reload();
    }
}


//------------------------------------------count items left-----------------------------------------------------

function countSquaresContaining (sT){

   let count = 0;
    for (let i = 0; i < maze.length; i++){
        for (let j = 0; j < maze[i].length; j++){
            if (maze[i][j]== sT){
               count++;
            }
           
        } 
    }   
    
   return count;
}
//--------------------------------------render the key---------------------------------------------------------
function renderKey(){
    if (countSquaresContaining (2) == 0){   //see if all the blueberries have been collected and render the key
        maze[3][1] = 5 ; 
        scoreKey.innerText = "collect the key"
    };
    
}
//--------------------------------------------COLLECT KEY---------------------------------------------------
function collectKey(){
    let smurfPositionRow = Math.floor((smurfY+20 )/ tileHeight); // center of the smurf
    let smurfPositionColumn =  Math.floor((smurfX+20) / tileWidth);
    if (maze[smurfPositionRow][smurfPositionColumn] == 5){
        // maze[smurfPositionRow].splice([smurfPositionColumn],1,0)
        maze[smurfPositionRow][smurfPositionColumn] = 0;
        pickSound();
        maze[14][2] = 4;
        scoreKey.innerText = "collected"
    }
}
//----------------------------------------open maze----------------------------------------------------------
function allItemsCollected(){
    if (countSquaresContaining (5) == 0){   //see if all the blueberries have been collected and render the key
        maze[14][2] = 4 ; 
    };
}

//---------------------------------------NEXT LEVEL---------------------------------------------------------
function nextLevel(){
    let smurfPositionRow = Math.floor((smurfY+20 )/ tileHeight); // center of the smurf
    let smurfPositionColumn =  Math.floor((smurfX+20) / tileWidth);
    if(smurfPositionRow  == 14 && smurfPositionColumn == 2){
        changeMaze();
        smurfX=40;
        smurfY=40;
        scoreKey.innerText = "collect all blueberries";
        catX = 640
        catY = 400
    }    
}

function changeMaze(){
    if (maze == maze){
        maze = maze1
    }
    if (maze == maze1){
        maze = maze
    }
}
   
//-------------------------------------GARGAMEL------------------------------------------------------------

function drawGargamel(){
    canvasContext.drawImage(gargamel,gargamelX,gargamelY,40,40)
}

function moveGargamel(){
    let gargamelPositionRowTop = Math.floor((gargamelY) / tileHeight); //top middle edge
    let gargamelPositionColumnTop =  Math.floor((gargamelX+18) / tileWidth);

    
    let gargamelPositionRowBottom = Math.floor((gargamelY+36) / tileHeight); //bottom middle edge
    let gargamelPositionColumnBottom =  Math.floor((gargamelX+18) / tileWidth);

    let gargamelPositionRowLeft = Math.floor((gargamelY+18) / tileHeight); //left middle edge
    let gargamelPositionColumnLeft =  Math.floor((gargamelX) / tileWidth);
    let gargamelPositionRowRight = Math.floor((gargamelY+18) / tileHeight); //right middle edge
    let gargamelPositionColumnRight =  Math.floor((gargamelX+36) / tileWidth);

    // let gargamelPositionRow = Math.floor((gargamelY+18+gargamelDirection.y*20) / tileHeight); //right middle edge
    // let gargamelPositionColumn =  Math.floor((gargamelX+18+gargamelDirection.x*20) / tileWidth);

    gargamelX += gargamelDirection.x
    gargamelY += gargamelDirection.y
    // if (maze[gargamelPositionRowBottom+1][gargamelPositionColumnBottom] == 0){
    //     gargamelDirection = directions[1] // 0-N 1-S 2-W 3-E
    // }

    // if (maze[gargamelPositionRowTop-1][gargamelPositionColumnTop] == 0){
    //     gargamelDirection = directions[0]
    // }
    // if (maze[gargamelPositionRowRight][gargamelPositionColumnRight+1] == 0){
    //     gargamelDirection = directions[3]
    // }
    // if(maze[gargamelPositionRowLeft][gargamelPositionColumnLeft-1] == 0){
    //     gargamelDirection = directions[2]
    // }

    if (maze[gargamelPositionRowRight][gargamelPositionColumnRight] == 1){
        console.log("r")
        gargamelX -= 3
        changeDirection()
    }
    if (maze[gargamelPositionRowBottom][gargamelPositionColumnBottom] == 1){
        console.log("d")
        gargamelY -= 3
        changeDirection()
    }
    if(maze[gargamelPositionRowLeft][gargamelPositionColumnLeft] == 1){
        console.log("l")
        gargamelX += 3
        changeDirection()
    }
    if(maze[gargamelPositionRowTop][gargamelPositionColumnTop] == 1){
        console.log("t")
        gargamelY += 3
        changeDirection();
    }

    // if (maze[gargamelPositionRow][gargamelPositionColumn] == 1){ //collision  
    //     console.log("hit");
    //     changeDirection()
    // }
    
}

function changeGargamelDirection (){
    // if (random(0,50) > 49) {
    //     changeDirection();
    // }
    setInterval(changeDirection,5000);
}       

// function random(min,max){
//     return Math.floor(Math.random()*(max-min+1))+min;
// }

function changeDirection(){
    let newDirection = directions[Math.floor(Math.random()*directions.length)]
    if (gargamelDirection != newDirection){
        gargamelDirection = newDirection
    }
    console.log(gargamelDirection)
}
//-----------------------------------------Gargamel's cat----------------------------------------------------
   function drawCat(){
        canvasContext.drawImage(cat,catX,catY,40,40)
    }
    
    function moveCat(){
    let catPositionRowTop = Math.floor((catY) / tileHeight); //top middle edge
    let catPositionColumnTop =  Math.floor((catX+18) / tileWidth);

    
    let catPositionRowBottom = Math.floor((catY+36) / tileHeight); //bottom middle edge
    let catPositionColumnBottom =  Math.floor((catX+18) / tileWidth);

    let catPositionRowLeft = Math.floor((catY+18) / tileHeight); //left middle edge
    let catPositionColumnLeft =  Math.floor((catX) / tileWidth);
    let catPositionRowRight = Math.floor((catY+18) / tileHeight); //right middle edge
    let catPositionColumnRight =  Math.floor((catX+36) / tileWidth);

    
    catX += catDirection.x
    catY += catDirection.y

    if (maze[catPositionRowRight][catPositionColumnRight] == 1){
        console.log("cr")
        catX -= 3
        changeDirectionCat()
    }
    if (maze[catPositionRowBottom][catPositionColumnBottom] == 1){
        console.log("cd")
        catY -= 3
        changeDirectionCat()
    }
    if(maze[catPositionRowLeft][catPositionColumnLeft] == 1){
        console.log("cl")
        catX += 3
        changeDirectionCat()
    }
    if(maze[catPositionRowTop][catPositionColumnTop] == 1){
        console.log("ct")
        catY += 3
        changeDirectionCat();
    }
}

function changeDirectionCat(){
    let newDirection = directions[Math.floor(Math.random()*directions.length)]
    if (catDirection != newDirection){
        catDirection = newDirection
    }
    console.log(catDirection)
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
    let size = 25
    if (smurfX+size > gargamelX && smurfX < gargamelX+size){
        if (smurfY+size > gargamelY && smurfY < gargamelY+size){
            smurfX = 40;
            smurfY = 40;
             console.log("gargamel");
             changeDirection()
             lostLive();
             lostLiveSound();
        }
    }
    if (smurfX+size > catX && smurfX < catX+size){
        if (smurfY+size > catY && smurfY < catY+size){
            smurfX = 40;
            smurfY = 40;
             console.log("cat");
             changeDirectionCat()
             lostLive();
             lostLiveSound();
        }
    }
    
}

//-----------------------------------------MUSIC AND SOUNDS--------------------------------------------------

function playMusic(){
    let music = new Audio("sounds/themesmurfs.mp3")
    music.volume = 0.01
    music.play();
}

function pickSound(){
    let music = new Audio("sounds/pick.wav")
    music.volume = 0.03
    music.play();
}

function lostLiveSound(){
    let music = new Audio("sounds/lostlive.wav")
    music.volume = 0.05
    music.play();
}

function gameOverSound(){
    let music = new Audio("sounds/gameover.wav")
    music.volume = 0.04
    music.play();
}

//-----------------------------------------------------------------------------------------------------------

function start(){
    box.className -= "hidden"
    let game = document.getElementById("game");
    game.remove();
    playMusic(); 
    runGame();
    changeGargamelDirection();
}

