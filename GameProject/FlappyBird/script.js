//board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;
function isMobileDevice() {
    return /Mobi|Android|iPhone/i.test(navigator.userAgent) || window.innerWidth <= 430;
}
  
  if (isMobileDevice()){
    boardHeight=window.screen.height;
    boardWidth = window.screen.width;
  }else{
    boardHeight=640
    boardWidth=360;
  }
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


//physics
let velocityX = -2;
let velocityY = 0; //bird jump speed
let gravity = 0.3;


let gameOver = true;
let score = 0;

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
    document.addEventListener("keydown",moveBird);
    document.addEventListener("click",moveBird);
}

function update() {
    requestAnimationFrame(update);
    if(gameOver) return;
    context.clearRect(0,0,board.width,board.height);

    //bird
    velocityY +=gravity;
    // bird.y += velocityY;
    bird.y  = Math.max(bird.y + velocityY,0); //apply gravity to current bird.y, limi the bird.y to top of the canvas
    context.drawImage(birdImg,bird.x,bird.y,bird.width,bird.height)

    if (bird.y>board.height) {
        gameOver = true;
    }
    //pipe
    for(let i = 0; i < pipeArray.length; i++){
        let pipe = pipeArray[i];
        pipe.x+=velocityX;
        context.drawImage(pipe.img,pipe.x,pipe.y,pipe.width,pipe.height);
        // context.drawImage(pipe,pipe.x,pipe.y+pipe.height,pipe.width,pipe.height);
        if (!pipe.passed && bird.x>pipe.x+pipe.width) {
            score +=0.5;
            pipe.passed=true;
        }
        if(detectCollison(bird,pipe)){
            gameOver = true;
            document.getElementById('finalScore').innerText = score;
            document.getElementById('gameOverScreen').style.display = 'block';
        }
    }
    while (pipeArray.length>0 && pipeArray[0].x+pipeArray[0].width<0) {
        console.log(pipeArray);
        
        pipeArray.shift() // removes first element from the array
    }
    //score
    context.fillstyle = "white";
    context.font = "45px sans-serif";
    context.fillText(`Score: ${score}`,5,45);

    if (gameOver) {
        context.fillText("Game Over",5,90)
    }
}
function placePipes(){
    if (gameOver) {
        return;
    }
    let randomPipeY = pipeY -pipeHeight/4 -Math.random()*pipeHeight/2;
    let openingSpace = boardHeight/4;
    let topPipe = {
        img: topPipeImg,
        x:pipeX,
        y:randomPipeY,
        width:pipeWidth,
        height:pipeHeight,
        passed: false
    }
    pipeArray.push(topPipe);
    let bottomPipe = {
        img:bottomPipeImg,
        x:pipeX,
        y:randomPipeY+pipeHeight+openingSpace,
        width:pipeWidth,
        height:pipeHeight,
        passed:false
    }
    pipeArray.push(bottomPipe);
}
function moveBird(e){
    console.log(e.type);
    
    if (e.code =='Space' || e.code =='ArrowUp' || e.type =='click') {
        velocityY = -6;
        if (gameOver) {
            bird.y=birdY;
            pipeArray = [];
            score = 0;
            gameOver = false;
            document.getElementById('gameOverScreen').style.display = 'none';

        }
    }
}

function detectCollison(a,b){
    return a.x < b.x + b.width &&
     a.x+a.width>b.x &&
     a.y<b.y+b.height &&
     a.y + a.height>b.y;
}  
function retryGame() {
    document.getElementById('gameOverScreen').style.display = 'none';
}
  