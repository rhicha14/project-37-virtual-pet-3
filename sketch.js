var dog,sDog,hDog, database;
var foodS,foodStock;
var fedTime,lastFed;
var feed,addFood;
var foodObj;
var bedroom,garden,washroom;
var currentTime,gameState,readState;

function preload(){
  sDog=loadImage("Dog.png");
  hDog=loadImage("happy dog.png");
  garden=loadImage("Garden.png");
  washroom=loadImage("Wash Room.png");
  bedroom=loadImage("Bed Room.png");
  lazy = loadImage("Lazy.png");
  running = loadImage("running.png");
  }
  
  function setup() {
    database=firebase.database();
    createCanvas(1200,500);
  
    foodObj = new Food();
  
    foodStock=database.ref('Food');
    foodStock.on("value",readStock);
  
    fedTime=database.ref('FeedTime');
    fedTime.on("value",function(data){
      lastFed=data.val();
    });
  
    readState=database.ref('gameState');
    readState.on("value",function(data){
      gameState=data.val();
    });
    
    dog=createSprite(800,200,150,150);
    dog.addImage(sDog);
    dog.scale=0.15;
    
    feed=createButton("Feed the dog");
    feed.position(700,95);
    feed.mousePressed(feedDog);
  
    addFood=createButton("Add Food");
    addFood.position(800,95);
    addFood.mousePressed(addFoods);
  
  }
  
  function draw() {
    background("lightgreen");
    currentTime=hour();
    if(currentTime==(lastFed+1)){
        update("Playing");
        foodObj.garden();
     }else if(currentTime==(lastFed+2)){
      update("Sleeping");
        foodObj.bedroom();
     }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
      update("Bathing");
        foodObj.washroom();
     }else{
      update("Hungry");
      foodObj.display();
     }
  
     if(gameState!="Hungry"){
      feed.hide();
      addFood.hide();
      dog.remove();
    }else{
     feed.show();
     addFood.show();
     dog.addImage(sDog);
    }
    drawSprites();
  }
  
  //function to read food Stock
  function readStock(data){
    foodS=data.val();
    foodObj.updateFoodStock(foodS);
  }
  
  
  //function to update food stock and last fed time
  function feedDog(){
    dog.addImage(hDog);
  
    foodObj.updateFoodStock(foodObj.getFoodStock()-1);
    database.ref('/').update({
      Food:foodObj.getFoodStock(),
      FeedTime:hour(),
      gameState:"Hungry"
    })
  }
  
  //function to add food in stock
  function addFoods(){
    foodS++;
    database.ref('/').update({
      Food:foodS
    })
  }
  
  function update(state){
    database.ref('/').update({
      gameState:state
    })
  }

  async function hour(){
    var site = await fetch('http://worldtimeapi.org/api/timezone/Asia/Kolkata');
    var siteJSON = await site.json();
    var datetime = siteJSON.datetime;
    var hourTime = datetime.slice(11,13);
  }

  function createName(){
    input.hide();
    button.hide();

    name1 = input.value();
    var greeting = createElement('h3');
    greeting.html("Pet's name: "+ name1 );
    greeting.position(width,2+850,height/2+200);
  }

  function getGameState(){
    gameStateRef = database.ref("gameState");
    gameStateRef.on("value",function(data){
      gameState = data.val();
    });
    
  }