

var mercury;
var venus;
var earth;
var mars;
var jupiter;
var saturn;
var uranus;
var neptune;
var moon;

var planets = [];
var timeScale = 1;
var asteroidSpeed = 0.005;
var asteroids = [];
var asteroidRandom = 0;
var drawOrbits = true;
var xOffset = 0;
var yOffset = 0;
var paused = false;
var pauseButton;

function setup() {
  createCanvas(3000,3000);
  mercury = new CelestialBodies(width/2 - 150,height/2,20,0.0159,91,0,0,255,0,150,width/2,height/2);
  venus = new CelestialBodies(width/2 - 250,height/2,30,0.0118,183,7,7,255,0,250,width/2,height/2);
  earth = new CelestialBodies(width/2 - 350,height/2,50,0.01,38,242,218,255,0,350,width/2,height/2);
  mars = new CelestialBodies(width/2 - 450,height/2,25,0.0081,196,63,23,255,0,450,width/2,height/2);
  jupiter = new CelestialBodies(width/2 - 650,height/2,100,0.0044,94,80,80,255,0,650,width/2,height/2);
  saturn = new CelestialBodies(width/2 - 750,height/2,80,0.0033,150,114,63,255,0,750,width/2,height/2);
  uranus = new CelestialBodies(width/2 - 850,height/2,60,0.0023,61,135,255,255,0,850,width/2,height/2);
  neptune = new CelestialBodies(width/2 - 950,height/2,60,0.0018,41,100,196,255,0,950,width/2,height/2);
  moon = new CelestialBodies(earth.x - 75,earth.y,30,0.1,135,135,135,255,0,75,earth.x,earth.y);

  planets = [mercury,venus,earth,mars,jupiter,saturn,uranus,neptune,moon];
  for(var i = 0; i < 360; i++){
    asteroidRandom = floor(random(500,600));
    fill(255);
    asteroids.push(new Asteroid(asteroidRandom, height/2, 0.005, asteroidRandom));
  }

  for(i = 0; i < asteroids.length; i++){
    asteroids[i].Start();
  }

  pauseButton = new Button(width - 200, height - 100, 300, 100, "PAUSE");
  noStroke();
}

function draw() {
  if(!paused){
    background(27);
    KeyInput();
    DrawOrbits();
    for(var i = 0; i < planets.length; i++){
      planets[i].Draw();
      moon.orbX = earth.x;
      moon.orbY = earth.y;
    }
    for(var i = 0; i < asteroids.length; i++){
      asteroids[i].Draw();
    }
    DrawSun();
  }
  textSize(80);
  fill(255);
  textAlign(LEFT, BOTTOM);
  text("XOffset: " + xOffset + " YOffset: " + yOffset, 30, height-30);
  pauseButton.Draw();
}

function Glow(x,y,r,g,b,a,size){
  var newSize = size;
  var newA = a;
  for(var i = 0; i < 100; i++){
    fill(r,g,b,newA);
    ellipse(x,y,newSize,newSize);
    newSize--;
    newA += 0.25;
  }
}

function ChangeOrbits(){
  drawOrbits = !drawOrbits;
}

function DrawOrbits(){
  if(drawOrbits){
    for(var i = 8; i >= 5; i--){
      fill(255);
      ellipse(width/2,height/2,(i * 100 + 152 + xOffset) * 2, (i * 100 + 152 + yOffset) * 2);
      fill(27);
      ellipse(width/2,height/2,(i * 100 + 148 + xOffset) * 2, (i * 100 + 148 + yOffset) * 2);
    }
  
    for(var i = 3; i >= 0; i--){
      fill(255);
      ellipse(width/2,height/2,(i * 100 + 152 + xOffset) * 2, (i * 100 + 152 + yOffset) * 2);
      fill(27);
      ellipse(width/2,height/2,(i * 100 + 148 + xOffset) * 2, (i * 100 + 148 + yOffset) * 2);
    }
  }
}

//Function to rotate a coordinate around
//x,y is coordinate to rotate around
//takes in an angle of the object and radius of orbit
function RotateAround(angle,radius,x,y){
  angleMode(RADIANS);
  var newY;
  var newX;

  newX = x + cos(-angle) * radius;
  newY = y + sin(-angle) * radius;

  return{
    newX,
    newY
  }
}

function DrawSun(){
  fill(255,0,0);
  ellipse(width/2,height/2,150,150);
  Glow(width/2,height/2,255,200,0,0,200);
}

function KeyInput(){
  if(keyIsDown(LEFT_ARROW)){
    xOffset -= 5;
  }
  if(keyIsDown(RIGHT_ARROW)){
    xOffset += 5;
  }
  if(keyIsDown(UP_ARROW)){
    yOffset -= 5;
  }
  if(keyIsDown(DOWN_ARROW)){
    yOffset += 5;
  }
}

function Button(x,y,w,h,_text){
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.text = _text;

  this.Draw = function(){
    fill(255);
    rectMode(CENTER);
    rect(this.x,this.y,this.w,this.h);
    textSize(60);
    fill(0);
    textAlign(CENTER, CENTER);
    if(!paused){
      this.text = "PAUSE";
    }else{
      this.text = "UNPAUSE";
    }
    text(this.text.toString(), this.x,this.y);
  }

  this.ClickCheck = function(){
    if(mouseX >= this.x - this.w / 2 && mouseX <= this.x + this.w / 2 && mouseY >= this.y - this.h / 2 && mouseY <= this.y + this.h / 2){
      paused = !paused;
    }
  }
}

function CelestialBodies(x,y,size,speed,r,g,b,a,angle,offset,orbX,orbY){
  this.x = x;
  this.y = y;
  this.size = size;
  this.speed = speed;
  this.r = r;
  this.g = g;
  this.b = b;
  this.a = a;
  this.angle = angle;
  this.orbX = orbX;
  this.orbY = orbY;

  this.Draw = function(){
    fill(this.r,this.g,this.b,this.a);
    this.x = RotateAround(this.angle,offset + xOffset,this.orbX,this.orbY).newX;
    this.y = RotateAround(this.angle,offset + yOffset,this.orbX,this.orbY).newY;
    ellipse(this.x,this.y,this.size,this.size);
    Glow(this.x,this.y,this.r,this.g,this.b,0,this.size*2);
    this.angle += this.speed * timeScale;
  }
}

function Asteroid(x,y,speed,offset){
  this.x = x;
  this.y = y;
  this.size = 5;
  this.speed = speed;
  this.angle = 0;

  this.Draw = function(){
    fill(255);
    this.x = RotateAround(this.angle,offset + xOffset,width/2,height/2).newX;
    this.y = RotateAround(this.angle,offset + yOffset,width/2,height/2).newY;
    ellipse(this.x,this.y,this.size,this.size);
    this.angle += this.speed * timeScale;
  }

  this.Start = function(){
    for(i = 0; i < random(360); i++){
      this.x = RotateAround(this.angle,offset + xOffset,width/2,height/2).newX;
      this.y = RotateAround(this.angle,offset + yOffset,width/2,height/2).newY;
      ellipse(this.x,this.y,this.size,this.size);
      this.angle+= random(360);
    }
  }
}

function mouseClicked(){
  pauseButton.ClickCheck();
}