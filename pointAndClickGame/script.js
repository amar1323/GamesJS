/** @type {HTMLCanvasElement} */
//canva setup
const canvas = document.getElementById("canvas1");
const cxt = canvas.getContext("2d");
canvas.width = 600;
canvas.height = 600;
cxt.font = "50px Impact"
//collision setup
const canvaCol = document.getElementById("collisionColor");
const cxtCol = canvaCol.getContext("2d");
canvaCol.width = canvas.width;
canvaCol.height = canvas.height;
// helpers for time management
let currentTimeStamp =0;
let deltaTimeStamp =0;
let nextToRaven = 0;
//very important to set offSet Io from window
const canvasBorderInfo = canvaCol.getBoundingClientRect();
//game score
let gameScore = 0;
let gameOver = false;
let ravens = []
let booms = []
let particles = []
class Raven{
    constructor(){
        this.speedX = Math.random()*3+1;
        this.speedY = Math.random()*6-3;
        this.markedFordeletion = false;
        this.image = new Image();
        this.image.src = "images/raven.png";
        this.frames = 6;
        this.spriteWidth = 1626/this.frames;
        this.spritheight = 194;
        this.sizeRatio = Math.random()*0.4+0.2;
        this.width = this.spriteWidth*this.sizeRatio;
        this.height = this.spritheight*this.sizeRatio;
        this.x = canvas.width;
        this.y = Math.random()*(canvas.height-this.height);
        this.timer = 0;
        this.frame = 0;
        this.updateFrames = Math.random()*100+100;
        this.randomColor = [Math.floor(Math.random()*255), Math.floor(Math.random()*255), Math.floor(Math.random()*255)] // probility to have two equal intevals is (1/(255^3))^2
        this.color = 'rgb('+this.randomColor[0]+','+this.randomColor[1]+','+this.randomColor[2]+')';
        this.hasParticle = Math.random()>0.5;
    }
    update(dt){
        if(this.x <0) gameOver=true;
        this.timer+=dt;
        if(this.timer>=this.updateFrames){
            this.frame++;
            this.timer = 0;
        }
        this.x-= this.speedX;
        this.y += this.speedY;
        if(this.y <0 || this.y+this.height>canvas.height){
            this.speedY *=-1;
        }
        if(this.x+this.width<0){
            this.markedFordeletion = true;
        }
        if(this.hasParticle)
            particles.push(new Particle(this.x,this.y,this.width,this.color));
    }
    draw(){
        let iSprite = this.frame%this.frames;
        cxtCol.fillStyle = this.color;
        cxtCol.fillRect(this.x,this.y, this.width,this.height);
        cxt.save();
        cxt.filter = 'invert(1)';
        cxt.drawImage(this.image, iSprite*this.spriteWidth,0,this.spriteWidth,this.spritheight,this.x,this.y,this.width,this.height);
        cxt.restore();
    }
}

class Boom{
    constructor(x,y,sizeRatio){
        this.markedFordeletion = false;
        this.image = new Image();
        this.image.src = "images/boom.png";
        this.frames = 5;
        this.spriteWidth = 1000/this.frames;
        this.spritheight = 179;
        this.width = this.spriteWidth*sizeRatio;
        this.height = this.spritheight*sizeRatio;
        this.x = x-this.width*0.5;
        this.y = y-this.height*0.5;
        this.timer = 0;
        this.frame = 0;
        this.updateFrames = 100;
        this.sound = new Audio();
        this.sound.src = "sound/boom.wav"
    }
    update(dt){
        if(this.frame==0) this.sound.play();
        this.timer+=dt;
        if(this.timer>=this.updateFrames){
            this.frame++;
            this.timer = 0;
        }
        if(this.frame>=this.frames){
            this.markedFordeletion = true;
        }
    }
    draw(){
        cxt.drawImage(this.image, this.frame*this.spriteWidth,0,this.spriteWidth,this.spritheight,this.x,this.y,this.width,this.height);
    }

}

class Particle{
    constructor(x,y,size,color){
        this.size = size;
        this.x = x+size/2+Math.random()*20-10;
        this.y = y+size/2+Math.random()*20-20;
        this.radius = Math.random()*this.size/5;
        this.maxRadius = Math.random()*35+20;
        this.speed = Math.random()+0.5;
        this.updateFrames = 100;
        this.markedFordeletion = false;
        this.color = color;

    }
    update(dt){
        this.x+=this.speed;
        this.radius+=0.3;
        this.timer=0;
        if(this.radius>this.maxRadius-10){
            this.markedFordeletion = true;
        }
    }
    draw(){
        cxt.save();
        cxt.globalAlpha= 1-this.radius/this.maxRadius;
        cxt.beginPath();
        //cxt.fillStyle = this.color;
        cxt.fillStyle = "rgb(196, 189, 189)";
        cxt.arc(this.x,this.y,this.radius,0,2*Math.PI);
        cxt.fill();
        cxt.restore();
    }


}
window.addEventListener("click", (e)=>{
    let positionX = e.x-canvasBorderInfo.x;
    let positionY = e.y-canvasBorderInfo.y;
    const pixelColor = cxtCol.getImageData(positionX, positionY,1,1);
    ravens.forEach((raven)=>{
        if(raven.randomColor[0]==pixelColor.data[0] && raven.randomColor[1]==pixelColor.data[1]&&raven.randomColor[2]==pixelColor.data[2]){
            raven.markedFordeletion = true;
            booms.push(new Boom(positionX, positionY, raven.sizeRatio));
            gameScore++;
        }
    })
})
var drawScore = function(){
    cxt.fillStyle = 'grey';
    cxt.fillText("Score : "+ gameScore, 19,49);
    cxt.fillStyle = 'white';
    cxt.fillText("Score : "+ gameScore, 24,52);
}

var drawGameOver = function(){
    cxt.textAlign = 'center';
    cxt.fillStyle = 'red';
    cxt.fillText("Game Over your Score : "+ gameScore, canvas.width/2,canvas.height/2);
}
const backgroudImage = new Image();
backgroudImage.src="images/Halloweenv.2.0.jpg";
var drawBackgroud = function(){
    cxt.drawImage(backgroudImage, 0,0,canvas.width,canvas.height);
}

var animate=function(timeStamp){
    cxt.clearRect(0,0,canvas.width,canvas.height);
    cxtCol.clearRect(0,0,canvaCol.width,canvaCol.height);
    deltaTimeStamp = timeStamp-currentTimeStamp;
    currentTimeStamp = timeStamp;
    nextToRaven +=deltaTimeStamp;
    if(nextToRaven>500){
        ravens.push(new Raven());
        nextToRaven = 0;
        ranvens = ravens.sort((a,b)=>{return a.width-b.width;});
    }
    drawBackgroud();
    drawScore();
    [...particles, ...ravens, ...booms].forEach(object=> object.update(deltaTimeStamp));
    [...particles,...ravens, ...booms].forEach(object=> object.draw());
    ravens = ravens.filter(object=> !object.markedFordeletion)
    booms = booms.filter(object=> !object.markedFordeletion)
    particles = particles.filter(object=> !object.markedFordeletion)
    if(!gameOver)
        requestAnimationFrame(animate);
    else{
        drawGameOver();
    }
    //requestAnimationFrame(animate);
}
animate(0);

