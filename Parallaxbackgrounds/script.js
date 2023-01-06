const span = document.getElementById("gameSpeedInt");
const slider = document.getElementById("gameSpeed");
/** @type {HTMLCanvasElement} */
//canva setup
const canvas = document.getElementById("canvas");
const cxt = canvas.getContext("2d");
const CANVAS_WIDTH = canvas.width=700;
const CANVAS_HEIGHT = canvas.height=800;


let gameState= 0;
let gameSpeed= 10;
span.innerHTML = gameSpeed;
slider.addEventListener("change",(e)=>{
    gameSpeed = e.target.value;
    span.innerHTML = gameSpeed;
})
class parallaxImage{
    constructor(name,speedModifier){
        this.x = 0;
        this.y = 0;
        this.width = 2400;
        this.height = 700;
        this.speed = 1;
        this.speedModifier = speedModifier;
        //create image
        const image = new Image();
        image.src = name;
        this.image = image;
    }
    update(){
        this.x = Math.floor(gameState*this.speedModifier)%this.width;
    }
    draw(){
        cxt.drawImage(this.image, this.x,this.y,this.width,this.height);
        cxt.drawImage(this.image, this.x+this.width,this.y,this.width,this.height);
    }
}
let imageNames = [
    {
        name : "images/layer-1.png",
        speed : 0.2
    },
    {
        name : "images/layer-2.png",
        speed : 0.4
    },
    {
        name : "images/layer-3.png",
        speed : 0.6
    },
    {
        name : "images/layer-4.png",
        speed : 0.8
    },
    {
        name : "images/layer-5.png",
        speed : 1.
    }
]

let images=[];
console.log(images);
imageNames.forEach((elem)=>{
    const image = new Image();
    images.push(new parallaxImage(elem.name, elem.speed));
})
var animate = function(){
    cxt.clearRect(0,0,CANVAS_WIDTH, CANVAS_HEIGHT);
    images.forEach((elem)=>{
        elem.update();
        elem.draw();
    });
    requestAnimationFrame(animate);
    gameState-=gameSpeed;
}

animate();
