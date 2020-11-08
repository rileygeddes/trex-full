var PLAY =1
var END = 0
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var cloud, cloudimage, cloudgroup
var obstical, obsticalimage1, obsticalimage2, obsticalimage3, obsticalimage4, obsticalimage5, obsticalimage6,obsticalgroup
var score
var gameOver,gameOverImg
var restart, restartImg
var sound1, sound2, sound3

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadImage("trex_collided.png");
  obsticalimage1 = loadImage("obstacle1.png")
  obsticalimage2 = loadImage("obstacle2.png")
  obsticalimage3 = loadImage("obstacle3.png")
  obsticalimage4 = loadImage("obstacle4.png")
  obsticalimage5 = loadImage("obstacle5.png")
  obsticalimage6 = loadImage("obstacle6.png")
  cloudimage= loadImage("cloud.png")
  
  sound1= loadSound("jump.mp3")
  sound2= loadSound("checkPoint.mp3")
  sound3= loadSound("die.mp3")
  
  groundImage = loadImage("ground2.png")
  
  gameOverImg = loadImage("gameOver.png")
  restartImg = loadImage("restart.png")
}

function setup() {
  createCanvas(600, 200);
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  
  score = 0
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -2;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  gameOver = createSprite(300,100,20,20)
  gameOver.addImage("gameoverimg1",gameOverImg)
  gameOver.scale=0.5
  
  restart = createSprite(300,150,20,20)
  restart.addImage("restartimg1",restartImg)
  restart.scale=0.5
  
  restart.visible=false
  gameOver.visible=false
  cloudgroup = new Group()
  obsticalgroup = new Group()
}

function draw() {
background("white");
  //display score
  text("Score: "+ score, 250, 200);

  
  if(gameState === PLAY){
    //move the ground
    ground.velocityX = -(6 + 3*score/100);
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    if (score>0 && score%100 === 0){
      sound2.play()
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
     //jump when the space key is pressed
    if(keyDown("space") && trex.y>=159){
      trex.velocityY = -12 ;
      sound1.play();
    }
  
    //add gravity
    trex.velocityY = trex.velocityY + 0.8;
    
    //spawn the clouds
    spawnclouds();
  
    //spawn obstacles
    spawnobstical()
    
    //End the game when trex is touching the obstacle
    if(obsticalgroup.isTouching(trex)){
      gameState = END;
      sound3.play()
    }
  }
  
  else if(gameState === END) {
    trex.changeAnimation("collided", trex_collided)
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obsticalgroup.setVelocityXEach(0);
    cloudgroup.setVelocityXEach(0);
  
    
    //set lifetime of the game objects so that they are never destroyed
    obsticalgroup.setLifetimeEach(-1);
    cloudgroup.setLifetimeEach(-1);
    
    
  }
  
  if(mousePressedOver(restart)) {
    reset();
  }
  
  //console.log(trex.y);
  
  //stop trex from falling down
  trex.collide(invisibleGround);
    drawSprites();
}

function spawnclouds(){
  if(frameCount %60 === 0){
    cloud=createSprite(600,120,10,10)
    cloud.y=Math.round(random(80,120))
    cloud.velocityX=-1
    cloud.addImage(cloudimage)
    cloud.scale=0.5
    cloud.lifeTime = 600
    cloudgroup.add(cloud)
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
  }
  
}

function spawnobstical(){
  if(frameCount %80 === 0){
    obstical=createSprite(600,165,10,10)
    obstical.velocityX=-7
    var rand=Math.round(random(1,6));
    switch(rand){
      case 1 : obstical.addImage(obsticalimage1);
        break;
        
        case 2 : obstical.addImage(obsticalimage2);
        break;
        
        case 3 : obstical.addImage(obsticalimage3);
        break;
        
        case 4 : obstical.addImage(obsticalimage4);
        break;
        
        case 5 : obstical.addImage(obsticalimage5);
        break;
        
        case 6 : obstical.addImage(obsticalimage6);
        break;
        
        default:break;
    }
    obstical.scale=0.4
    obstical.lifeTime = 300
    obsticalgroup.add(obstical)
  }
  
}
function reset(){
  gameState = PLAY;
  
  gameOver.visible = false;
  restart.visible = false;
  
  obsticalgroup.destroyEach();
  cloudgroup.destroyEach();
   trex.changeAnimation("running", trex_running);
  score = 0;
}