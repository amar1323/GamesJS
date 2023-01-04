// bind select menu from html and playerState using eventListener
let playerState = "roll";
const menuSelect = document.getElementById("animations");
menuSelect.addEventListener('change',function(e){
    playerState = e.target.value;
});

/** @type {HTMLCanvasElement} */
//canva setup
const canvas = document.getElementById("canvas1");
const cxt = canvas.getContext("2d");
const CANVAS_WIDTH = canvas.width = 600;
const CANVAS_HEIGHT = canvas.height = 600;

//image constants
const IMAGE_WIDTH = 6876;
const IMAGE_HEIGHT = 5230;
const playerImage = new Image();
playerImage.src = "image/dog.png";
const spriteWidth = IMAGE_WIDTH/12+2;  //how to figure out centering?
const spriteHeight = IMAGE_HEIGHT/10;
//image desctiption
const spriteAnimations =[];
const spriteStates = [
    {
        name:'idle',
        frame:7
    },
    {
        name:'jump',
        frame:7
    },
    {
        name:'fall',
        frame:7
    },
    {
        name:'run',
        frame:9
    },
    {
        name:'dizzy',
        frame:11
    },
    {
        name:'sit',
        frame:5
    },
    {
        name:'roll',
        frame:7
    },
    {
        name:'bite',
        frame:7
    },
    {
        name:'ko',
        frame:12
    },
    {
        name:'getHit',
        frame:4
    },
];
spriteStates.forEach((state,index)=>{
    let frames = { // this to express array of pairs equivalent vector<pair<int,int>>
        loc:[]
    }
    for(let i=0; i<state.frame;i++){
        let positionX = i * spriteWidth;
        let positionY = index * spriteHeight;
        frames.loc.push({x: positionX,y: positionY});
    }
    spriteAnimations[state.name] = frames;
});

//game constants
let gameFrame = 0;
const gameStagger = 5;

var animate = function(){
    cxt.clearRect(0,0,CANVAS_WIDTH, CANVAS_HEIGHT);
    const framesL = spriteAnimations[playerState].loc.length;
    let position = Math.floor(gameFrame/gameStagger)%framesL;
    let frameX = spriteAnimations[playerState].loc[position].x;
    let frameY = spriteAnimations[playerState].loc[position].y;
    //cxt.drawImage(image,sx,sy,sw,sh,dx,dy,dw,dh); s:source, d:destination
    cxt.drawImage(playerImage,frameX,frameY,spriteWidth,spriteHeight,0,0,spriteWidth,spriteHeight);
    gameFrame++;
    requestAnimationFrame(animate);
}

animate();




