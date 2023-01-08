document.addEventListener("DOMContentLoaded",function(){
    /** @type {HTMLCanvasElement} */
    //canva setup
    const canvas = this.getElementById("canvas1");
    canvas.width = 1200;
    canvas.height = 600;
    const ctx = canvas.getContext("2d");
    let imageWorm = new Image();
    let imageGhost = new Image();
    let imageSpider = new Image();
    let backgroundImage = new Image();
    imageWorm.src = "images/enemy_worm.png";
    imageGhost.src = "images/enemy_ghost.png"
    imageSpider.src = "images/enemy_spider.png"
    backgroundImage.src = "images/background.jpg";
    

    class Game{
        constructor(ctx,width,height,backgroundImage){
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
            this.ctx.clearRect(0,0,this.width,this.height);
            this.ctx.drawImage(this.background,0,0,this.width,this.height);
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
                this.frame+= Math.floor(this.animationFrameModifier = Math.random()*5);
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
            this.y = game.height-this.height;
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
            if(this.y > game.height*0.6) this.speed*=-1;
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

    let currentTime = 0;
    const game = new Game(ctx,canvas.width,canvas.height,backgroundImage);
    var animate = function(timeStamp){
        const dt = timeStamp-currentTime;
        currentTime = timeStamp;
        game.update(dt);
        game.draw();
        requestAnimationFrame(animate);
    }
    animate(0);
});