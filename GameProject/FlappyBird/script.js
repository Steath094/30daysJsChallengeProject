//board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

//bird
let birdWidth = 34;
let birdHeight = 24;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let birdImg;
let bird = {
    x :birdX,
    y:birdY,
    width:birdWidth,
    height: birdHeight
}

//pipes
let pipeArray = []
let pipeWidth = 64; //width/height ratio = 1/8th
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;
let topPipeImg;
let bottomPipeImg;
window.onload = function() {
    board = document.getElementById('board');
    board.width = boardWidth;
    board.height = boardHeight;
    //used for drawing on the board
    context = board.getContext("2d");

    //draw
    // context.fillStyle = "green";
    // context.fillRect(bird.x,bird.y,bird.width,bird.height);

    //load image
    birdImg = new Image();
    birdImg.src = "Images/flappybird.png";
    birdImg.onload = function(){
        context.drawImage(birdImg,bird.x,bird.y,bird.width,bird.height)
    }

    topPipeImg = new Image();
    topPipeImg.src = "Images/toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "Images/bottompipe.png";

    requestAnimationFrame(update)
    setInterval(placePipes,1500);
}

function update() {
    requestAnimationFrame(update);
    context.clearRect(0,0,board.width,board.height);

    //bird
    context.drawImage(birdImg,bird.x,bird.y,bird.width,bird.height)
    //pipe
    for(let i = 0; i < pipeArray.length; i++){
        let pipe = pipeArray[i];
        context.drawImage(pipe.img,pipe.x,pipe.y,pipe.width,pipe.height);
        context.drawImage(pipe,pipe.x,pipe.y+pipe.height,pipe.width,pipe.height);
    }
}
function placePipes(){
    let topPipe = {
        img: topPipeImg,
        x:pipeX,
        y:pipeY,
        width:pipeWidth,
        height:pipeHeight,
        passed: false
    }
    pipeArray.push(topPipe);
    let bottomPipe = {
        x:pipeX,
        y:pipeY+pipeHeight+100
    }
    pipeArray.push(bottomPipe);
}