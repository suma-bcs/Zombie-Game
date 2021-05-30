//Gamestates
var PLAY = 1;
var END = 0;
var gameState = PLAY;

var ground,invisible_ground;
var player,zombie;
var score;
//Group variables
var HandGroup,CoinsGroup,SkullGroup;

var gameOver,restart;
//image variables
var zombie_image,skull_img,handImg,deadImg,bg,bg2,coinImg,girl;
var gameOver_img,restart_img;

//sound variables
var point2,point,growl,bgm;

//to load images and sounds
function preload(){

  zombie_image=loadAnimation("images/zombie1.png","images/zombie2.png","images/zombie3.png",
                            "images/zombie4.png","images/zombie5.png","images/zombie6.png");

  handImg=loadImage("images/grave.png");

  deadImg = loadImage("images/dead.png");

  girl=loadAnimation("images/girl1.png","images/girl2.png")

  bg=loadImage("images/bg.png");
  bg2=loadImage("images/bg2.png")

  coinImg=loadImage("images/coin.png")

  skull_img=loadImage("images/skull.png");

  gameOver_img=loadImage("images/game-over.png");
  restart_img=loadImage("images/restore.png");
 
  growl=loadSound("sounds/zombiegrowl.wav");
  point=loadSound("sounds/point.wav");
  point2=loadSound("sounds/point2.wav");
  bgm=loadSound("sounds/bgm.wav");
}

function setup() {
 createCanvas(800,500);
  
ground=createSprite(0,-50,0,0);
ground.addImage(bg)
ground.scale=1.5;
ground.velocityX=-1;

invisible_ground=createSprite(400,470,800,10);
invisible_ground.visible=false;
  
player=createSprite(300,420,20,100);
player.addAnimation("a",girl);
player.scale=0.3
player.setCollider("rectangle",0,0,player.width,player.height)

zombie=createSprite(150,410,20,100);
zombie.scale=0.4;
zombie.addAnimation("zom",zombie_image);
 
gameOver = createSprite(400,80);
gameOver.addImage(gameOver_img);
gameOver.scale=0.15;

restart = createSprite(400,200);
restart.addImage(restart_img);
restart.scale=0.2;

// creating Groups
HandGroup=new Group();
CoinsGroup=new Group();
SkullGroup=new Group();

score=0;
bgm.loop();
}

function draw() {
  
background("black");
  
player.velocityY = player.velocityY + 0.8;
player.collide(invisible_ground); 
  
 //Gravity
zombie.velocityY = zombie.velocityY + 0.8;
zombie.collide(invisible_ground); 

  
   if (gameState===PLAY){
    
    gameOver.visible=false;
    restart.visible=false;
    
    ground.velocityX = -(4 + score/50) ;
    
    if (ground.x < 80){
      ground.x = ground.width/2;
    } 
    
  // player movements
    if((keyDown("space")&& player.y >= 220)) {
      player.velocityY = -10;
       
     }  
     if(keyDown("left")) {
       player.x-=2;
      }  
      if(keyDown("right")) {
       player.x+=2;
      }

    //function calls
    spawnhands();
    spawnCoins();

    // for level 1
   if(score>200){
     Level1();
   }
   //only checkpoint sound

  if(score===200){
    point2.play();
    point2.loop = false;
  }
   //for level 2
   if(score===400){
     //only checkpoint sound
      point2.play();
      point2.loop = false;
     level2()
   }
 
   //rules 
  if(player.isTouching(CoinsGroup)){
    player.velocityY=3;
    score=score+5;
    point.play();
    CoinsGroup.setVisibleEach(false);
  }

  if (player.isTouching(SkullGroup)){
    growl.play();
    gameState=END;
  }
  if (player.isTouching(HandGroup)){
    growl.play();
    gameState=END;
  }
   }

   
else if ( gameState===END) {
 zombie.addImage(deadImg);
 bgm.stop()
  gameOver.visible=true;
  restart.visible=true;
  ground.velocityX = 0;
  player.velocityY = 0
   
  zombie.x=player.x;
  player.y=zombie.y;
 
  //set lifetime of the game objects so that they are never destroyed
  HandGroup.setLifetimeEach(-1);
  HandGroup.setVelocityXEach(0);
  
  CoinsGroup.destroyEach();
  SkullGroup.destroyEach();

  CoinsGroup.setVelocityXEach(0);
  SkullGroup.setVelocityYEach(0);

   //to restart game
    if(mousePressedOver(restart)) {
      reset();
    }
} 
  
  drawSprites();

  //displaying the score
  fill("gold");
  textSize(30);
  text("Score: "+ score, 650,50);
}

// to spawn hands on ground
function spawnhands() {
if (frameCount % 120 === 0){
  var hand = createSprite(800,450,10,40);
  hand.addImage("hand",handImg);
  hand.scale=0.14
  hand.velocityX = -(4 + score/50) ;;
  hand.lifetime=200;
  HandGroup.add(hand);
  hand.setCollider("circle",0,0,1);
  } 
}

//to spaw coins for score
function spawnCoins() {
if (frameCount % 100 === 0){
  var coin = createSprite(800,random(200,350),10,40);
  coin.velocityX = -6 ;;
  coin.addImage(coinImg)
  coin.scale=0.06;
  coin.lifetime=130;
  CoinsGroup.add(coin);
  coin.setCollider("circle",0,0,1);
  }
}

// LEVEL 1
function Level1(){
  ground.shapeColor="yellow"
if (frameCount % 120 === 0){
  var skull = createSprite(random(200,800),50,10,40);
  skull.velocityY = 6 ;
  skull.addImage(skull_img)
  skull.scale = 0.1
  skull.lifetime = 200;
  SkullGroup.add(skull);
  skull.setCollider("circle",0,0,1);

}
}

// LEVEL 2
function level2(){
  ground.addImage(bg2);
  SkullGroup.collide(invisible_ground);
}

// to resey the game and play again
function reset(){
gameState=PLAY;
gameOver.visible=false;
restart.visible=false;
HandGroup.destroyEach();
score=0;
zombie.x=150;
ground.addImage(bg);
bgm.play();

}




