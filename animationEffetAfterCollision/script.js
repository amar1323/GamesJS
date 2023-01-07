/** @type {HTMLCanvasElement} */
//canva setup
const canvas = document.getElementById("canvas");
const cxt = canvas.getContext("2d");
const CANVAS_WIDTH = canvas.width = 600;
const CANVAS_HEIGHT = canvas.height = 600;
const canvasPositionInfo = canvas.getBoundingClientRect();

class Boom{
    constructor(x,y){
        this.sx = 1000/5;
        this.sy = 179;
        this.size = 0.5;
        this.x = x;
        this.y = y;
        this.frames = 5;
        this.image = new Image();
        this.image.src = "images/boom.png";
        this.frame=0;
        this.timer =0;
        this.animeStagger = 5;
        this.angle = Math.random()*2*Math.PI;
        this.sound = new Audio();
        this.sound.src = "sound/boom.wav"
    }
    update(){
        if(this.frame==0) this.sound.play();
        this.timer++;
        if(this.timer%this.animeStagger==0)
        this.frame++;
    }
    draw(){
        cxt.save();
        cxt.translate(this.x,this.y);
        cxt.rotate(this.angle);
        cxt.drawImage(this.image,this.frame*this.sx, 0, this.sx, this.sy,0-0.5*this.sx*this.size,0-0.5*this.sy*this.size, this.sx*this.size, this.sy*this.size);
        cxt.restore();
    }
}

let boomAnimation=[];
var createAnimation= function(e){
    let positionX = e.x-canvasPositionInfo.left;
    let positionY = e.y-canvasPositionInfo.top;
    boomAnimation.push(new Boom(positionX,positionY));
}
canvas.addEventListener("click",(e)=>{
    createAnimation(e);
}
)

var animation=function(){
    cxt.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
    for(let i = boomAnimation.length-1; i>=0; i--){
        boomAnimation[i].update();
        boomAnimation[i].draw();
        if(boomAnimation[i].frame>boomAnimation[i].frames)
            boomAnimation.splice(i,1);
    }
    requestAnimationFrame(animation);
}

animation();