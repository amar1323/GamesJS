/** @type {HTMLCanvasElement} */
//canva setup
const canvas = document.getElementById("canvas");
const CANVAS_WIDTH = canvas.width = 700;
const CANVAS_HEIGHT = canvas.height = 800;

const cxt = canvas.getContext("2d");
let gameState = 0;

const enemiesData=[
    {
        name:"images/enemy1.png",
        width: 1758,
        height: 155,
        frames:6
    }
    ,
    {
        name:"images/enemy2.png",
        width: 1596,
        height: 188,
        frames:6
    },
    {
        name:"images/enemy3.png",
        width: 1308,
        height: 177,
        frames:6
    },
    {
        name:"images/enemy4.png",
        width: 1917,
        height: 212,
        frames:9
    }
]

class Enemy{
    constructor(name,width,height,frames){
        this.image = new Image();
        this.image.src = name;
        this.width = width;
        this.height = height;
        this.frames = frames;
        this.sx = this.width/this.frames;
        this.sy = this.height;
        this.x = Math.random()*(CANVAS_WIDTH-this.sx);
        this.y = Math.random()*(CANVAS_HEIGHT-this.sy);
        this.size = 2.;
        this.wingSpeed = Math.random();
    }
    update(){
        this.x += Math.random()*-4 +2;
        this.y += Math.random()*-4 +2;
    }
    draw(){
        let i = Math.floor(gameState*this.wingSpeed)%this.frames;
        cxt.drawImage(this.image,i*this.sx,0,this.sx,this.height, this.x,this.y,this.sx/this.size,this.sy/this.size);
    }

}
let enemies = []
enemiesData.forEach((elem)=>{
    for(let i=0; i<5;i++){
        enemies.push(new Enemy(elem.name, elem.width, elem.height,elem.frames));
    }
});
var animate = function(){
    cxt.clearRect(0,0, CANVAS_WIDTH,CANVAS_HEIGHT);
    enemies.forEach((enemy)=>{
        enemy.update();
        enemy.draw();
    })
    gameState++;
    requestAnimationFrame(animate);
}

animate();