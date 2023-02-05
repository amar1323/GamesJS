/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext("2d");
canvas.width=820;
canvas.height=700;
let groundY = canvas.height-115;

//InputHandler-----------------------------------------------------------------------------------
class InputHandler{
    constructor(){
        this.keys=[];
        window.addEventListener("keydown",e=>{
            if((e.key === "ArrowUp" || 
               e.key === "ArrowDown" ||
               e.key === "ArrowLeft" ||
               e.key === "ArrowRight") && this.keys.indexOf(e.key)===-1){
                this.keys.push(e.key);
            }
        });
        window.addEventListener("keyup",e=>{
            if(e.key === "ArrowUp" || 
               e.key === "ArrowDown" ||
               e.key === "ArrowLeft" ||
               e.key === "ArrowRight"){
                this.keys.splice(this.keys.indexOf(e.key,1));
            }
        });
    }
}
let input = new InputHandler();
//Game+Enemy-----------------------------------------------------------------------------------
let imageWorm = new Image();
let imageGhost = new Image();
let imageSpider = new Image();
let backgroundImage = new Image();
imageWorm.src = "images/enemy_worm.png";
imageGhost.src = "images/enemy_ghost.png"
imageSpider.src = "images/enemy_spider.png"

class Game{
    constructor(ctx,width,height){
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.enemies = [];
        this.timer = 0;
        this.updateFrame = 1000;
        this.enemyTypes = ['Worm', 'Ghost','Spider'];
        this.background = backgroundImage;
    }
    update(dt){
        this.timer+=dt;
        if(this.timer>this.updateFrame){
            this.#addEnemy();
            this.timer = 0;
        }
        this.enemies.forEach(enemy=>enemy.update(dt));
        this.enemies = this.enemies.filter(enemy=>!enemy.markedForDeletion);
    }
    draw(){
        this.enemies.forEach(enemy=> enemy.draw(this.ctx))
    }
    #addEnemy(){
        const idx = Math.floor(Math.random()*this.enemyTypes.length);
        if(this.enemyTypes[idx]=="Worm") this.enemies.push(new Worm(this));
        if(this.enemyTypes[idx]=="Ghost") this.enemies.push(new Ghost(this));
        if(this.enemyTypes[idx]=="Spider") this.enemies.push(new Spider(this));
    }
}

class Enemy{
    constructor(game){
        this.game = game;
        this.markedForDeletion = false;
        this.image = new Image();
        //Animation frame
        this.frameX = 0;
        this.updateFrame = 100;
        this.frame = 0;
        this.animationFrameModifier = Math.random()*5;
        this.frametimer = 0;
    }
    update(dt){
        this.frametimer+=dt;
        if(this.frametimer>this.updateFrame){
            this.frametimer = 0;
            this.frame+= Math.floor(this.animationFrameModifier);
        }
        this.position = Math.floor(this.frame)%this.frames;
    }
    draw(ctx){
        ctx.drawImage(this.image,this.position*this.spriteWidth,0, this.spriteWidth,this.spriteHeigh,this.x,this.y,this.width,this.height);
    }
}

class Worm extends Enemy{
    constructor(game){
        super(game);
        //Image sprite data
        this.frames = 6;
        this.spriteWidth = 1374/this.frames;
        this.spriteHeigh = 171;
        this.image = imageWorm;
        this.animationRate = Math.random()*0.1+0.02;
        //Image plot
        this.sizeModifier = Math.random()*0.2+0.3;
        this.width = this.spriteWidth*this.sizeModifier;
        this.height = this.spriteHeigh*this.sizeModifier;
        //enemy moovement
        this.x = game.width;
        this.y = groundY-this.height;
        this.speed = Math.random()*0.2+0.1;
    }
    update(dt){
        super.update(dt);
        this.timer+=dt*this.animationRate;
        this.x-=this.speed*dt;    
        if(this.x+this.width<0) this.markedForDeletion = true;
    }
}

class Ghost extends Enemy{
    constructor(game){
        super(game);
        //Image sprite data
        this.frames = 6;
        this.spriteWidth = 1566/this.frames;
        this.spriteHeigh = 209;
        this.image = imageGhost;
        this.animationRate = Math.random()*0.1+0.02;
        //Image plot
        this.sizeModifier = Math.random()*0.1+0.3;
        this.width = this.spriteWidth*this.sizeModifier;
        this.height = this.spriteHeigh*this.sizeModifier;
        //enemy moovement
        this.x = game.width;
        this.y = Math.random()*(game.height-0.6*game.height);
        this.speed = Math.random()*0.2+0.1;
        this.angle = 0;
        this.updateAngle = Math.random()*100+50;
        this.curve = Math.random()*5+1;
        this.opacity = Math.random()*0.5+0.4;
        this.timerAngle = 0;
    }
    update(dt){
        super.update(dt);
        this.timerAngle+=dt;
        if(this.timerAngle>this.updateAngle){
            this.angle++;
            this.timerAngle = 0;
        }
        this.x -=this.speed*dt;
        this.y+=Math.sin(this.angle)*this.curve;    
        if(this.x+this.width<0) this.markedForDeletion = true;
    }
    draw(ctx){
        ctx.save();
        ctx.globalAlpha = this.opacity;
        super.draw(ctx);
        ctx.restore();
    }
}

class Spider extends Enemy{
    constructor(game){
        super(game);
        //Image sprite data
        this.frames = 6;
        this.spriteWidth = 1860/this.frames;
        this.spriteHeigh = 175;
        this.image = imageSpider;
        this.animationRate = Math.random()*0.1+0.02;
        //Image plot
        this.sizeModifier = Math.random()*0.1+0.3;
        this.width = this.spriteWidth*this.sizeModifier;
        this.height = this.spriteHeigh*this.sizeModifier;
        //enemy moovement
        this.x = Math.random()*game.width;
        this.y = 0;
        this.speed = Math.random()*0.2+0.1;

    }
    update(dt){
        super.update(dt);
        this.y+=this.speed*dt;
        if(this.y > this.game.height*0.7) this.speed*=-1;
        if(this.y+this.height<0) this.markedForDeletion = true;
    }
    draw(ctx){
        ctx.beginPath();
        ctx.moveTo(this.x+this.width/2,0);
        ctx.lineTo(this.x+this.width/2,this.y+this.height/2+10);
        ctx.stroke();
        super.draw(ctx);
    }
}
const game = [];
game.push(new Game(ctx,canvas.width,canvas.height,backgroundImage));

//Player-----------------------------------------------------------------------------------
class SpriteSheet{
    constructor(imageName,imageWidth, imageHeight,spriteStates){
        this.image = new Image();
        this.image.src = imageName;
        //compute max of sprites length
        let oMax = spriteStates[0].frame;
        for(let i =1; i<spriteStates.length;i++){ if(spriteStates[i].frame>oMax) oMax = spriteStates[i].frame}; 
        this.width = imageWidth/oMax;
        this.height = imageHeight/spriteStates.length;
        this.animations=[];
        spriteStates.forEach((state,index)=>{
            let frames = { // this to express array of pairs equivalent vector<vector<struct{int x, int y}>>
                loc:[]
            }
            for(let i=0; i<state.frame;i++){
                let positionX = i * this.width;
                let positionY = index * this.height;
                frames.loc.push({x: positionX,y: positionY});
            }
            this.animations[state.name] = frames;
            
        });
    }

}

class Player{
    constructor(spriteSheet, playerState,sizeFactore,input){
        this.spriteSheet = spriteSheet;
        this.playerState  = playerState;
        this.frameX = 0;
        this.frameY = 0;
        this.animationFrame = 50;
        this.frame = 0;
        this.gameState=0;
        this.sizeFactore = sizeFactore;
        this.sizeX = this.spriteSheet.width*this.sizeFactore;
        this.sizeY = this.spriteSheet.height*this.sizeFactore;
        this.x = 0;
        this.y = groundY-this.sizeY;
        this.input = input;
        this.speedX = 5;
        this.speedY = 8;
        this.gravity = 5;
        this.maxJump = 200;
        this.endJump = false;
    }
    update(dt){
        this.frame+=dt;
        if(this.frame>this.animationFrame){
            this.gameState++;
            const framesL = this.spriteSheet.animations[this.playerState].loc.length;
            let position = Math.floor(this.gameState)%framesL;
            this.frameX = this.spriteSheet.animations[this.playerState].loc[position].x;
            this.frameY = this.spriteSheet.animations[this.playerState].loc[position].y;
            this.frame=0;
        }
        if(this.input.keys.indexOf("ArrowUp")>-1 && !this.endJump){
            this.playerState = "jump";
            this.y -=this.speedY;
        }
        if(this.input.keys.indexOf("ArrowDown")>-1){
            this.playerState = "roll";
            this.y +=this.speedY;
        }
        if(this.input.keys.indexOf("ArrowRight")>-1){
            this.x = Math.min(this.x+this.speedX,canvas.width-this.sizeX);
        }
        if(this.input.keys.indexOf("ArrowLeft")>-1){
            this.x = Math.max(this.x-this.speedX,0);
        }
        if(this.input.keys.indexOf("ArrowUp")>-1  &&  this.input.keys.indexOf("ArrowRight")>-1){
            this.playerState = "roll";
        }
        this.y+=this.gravity;
        if(this.y>groundY-this.sizeY){
            this.y = groundY-this.sizeY;
            this.playerState = "run";
            this.endJump=false;
        }
        if(this.y < groundY-this.sizeY-this.maxJump){
            this.endJump=true;
        }
    }
    draw(){
        ctx.drawImage(this.spriteSheet.image,this.frameX,this.frameY,this.spriteSheet.width, this.spriteSheet.height, this.x, this.y, this.sizeX, this.sizeY);
    }

}

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
let sprite = new SpriteSheet("images/dog.png", 6876, 5230,spriteStates);
let player = [];
player.push(new Player(sprite, "run",0.2,input));
//Background-----------------------------------------------------------------------------------
class Background{
    constructor(name,speedModifier,width,height){
        this.x = 0;
        this.y = 0;
        this.width = width;
        this.height = height;
        this.speedModifier = speedModifier;
        //create image
        this.image = new Image();
        this.image.src = name;
        this.animationFrame = 50;
        this.frame = 0;
        this.speed = 25;
    }
    update(dt){
        this.frame+=dt;
        if(this.frame>this.animationFrame){
            this.x = (this.x-this.speed*this.speedModifier)%this.width;
            this.frame = 0;
        }
    }
    draw(){
        ctx.drawImage(this.image,this.x,this.y,this.width,this.height);
        ctx.drawImage(this.image, this.x+this.width,this.y,this.width,this.height);
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

let background=[];
imageNames.forEach((elem)=>{
    background.push(new Background(elem.name, elem.speed, 2400, 700));
})
//animation-----------------------------------------------------------------------------------
let lastTime = 0;
let deltaTime=0;
var animate=function(time){
    ctx.clearRect(0,0, canvas.width,canvas.height);
    deltaTime = time-lastTime;
    lastTime = time;
    [...background,...player,...game].forEach(obj => obj.update(deltaTime));
    [...background,...player,...game].forEach(obj => obj.draw());
    requestAnimationFrame(animate);
}

animate(0);
