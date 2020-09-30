var trex,trex_run,trex_collide;
var ground,groundImg,invGround;
var obstacle,obstaclesGroup,obstacle1,obstacle2,obstacle3,obstacle4;
var cloud,cloudsGroup,cloudImg;
var gameState,PLAY,END,count;
var gameOver,restart,gameOverImg,restartImg;

function preload() {
  trex_run=loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collide=loadAnimation("trex_collided.png");
  
  groundImg=loadImage("ground2.png");
   obstacle1=loadImage("obstacle1.png");
   obstacle2=loadImage("obstacle2.png");
   obstacle3=loadImage("obstacle3.png");
   obstacle4=loadImage("obstacle4.png");
  
  cloudImg=loadImage("cloud.png");
  
  gameOverImg=loadImage("gameOver.png");
  
  restartImg=loadImage("restart.png");
}


function setup() {
  createCanvas(600, 200);
  trex=createSprite(50,170,40,20);
  trex.addAnimation("run",trex_run)
  trex.addAnimation("collide",trex_collide)
  trex.scale=0.5;
  trex.setCollider("circle",0,0,30);
  
 ground = createSprite(300,180,600,20);
ground.addImage(groundImg);
ground.x = ground.width /2;

//invisible Ground to support Trex
 invGround = createSprite(300,185,600,5);
 invGround.visible = false;

//create Obstacle and Cloud Groups
 obstaclesGroup = new Group();
 cloudsGroup = new Group();

//place gameOver and restart icon on the screen
 gameOver = createSprite(300,50);
  restart = createSprite(300,100);
gameOver.addImage(gameOverImg);
gameOver.scale = 0.5;  
restart.addImage(restartImg); 
restart.scale = 0.5;

gameOver.visible = false;
restart.visible = false;

//set text
textSize(18);
textFont("Georgia");


//score
 count = 0;

  PLAY=1;
  END=0;
  
  gameState=PLAY;
  
}

function draw() {
  
  //set background to white
  background("white");
  //display score
  text("Score: "+ count, 500, 50);
 // console.log(gameState);
  
  if(gameState === PLAY){
    //move the ground
    ground.velocityX = -(6 + 3*count/100);
    //scoring
    count =count+ Math.round(getFrameRate()/60);
      
   /* if (count>0 && count%100 === 0){
      playSound("checkPoint.mp3");
    }*/
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
     //jump when the space key is pressed
    if(keyDown("space") && trex.y >= 160){
      trex.velocityY = -12 ;
     // playSound("jump.mp3");
    }
  
    //add gravity
    trex.velocityY = trex.velocityY + 0.8;
    
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles
    spawnObstacles();
    
    //End the game when trex is touching the obstacle
    if(obstaclesGroup.isTouching(trex)){
     
      gameState = END;
      //playSound("die.mp3");
    }
  }
  
  else if(gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collide",trex_collide);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    
  }
  
  if(mousePressedOver(restart)) {
    reset();
  }
  
  //console.log(trex.y);
  
  //stop trex from falling down
  trex.collide(invGround);
  
  drawSprites();
}

function reset(){
  gameState=PLAY;
  trex.changeAnimation("run",trex_run);

gameOver.visible = false;
restart.visible = false;
cloudsGroup.destroyEach();
obstaclesGroup.destroyEach();
count =0;
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,165,10,40);
    obstacle.velocityX = - (6 + 3*count/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,4));
    switch(rand){
        
      case 1: obstacle.addImage(obstacle1); break; 
      case 2: obstacle.addImage(obstacle2); break; 
      case 3: obstacle.addImage(obstacle3); break; 
      case 4: obstacle.addImage(obstacle4);break; 
      default:break; 
    } 
    
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 100;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = random(80,120);
    cloud.addImage(cloudImg);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200 ;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}
  
