let snake;
let rez = 20;
let food;
let w;
let h;
let count = 0;
let highScore = window.localStorage.getItem("hScore")
  ? window.localStorage.getItem("hScore")
  : 0;
const counterLabel = document.getElementById("counterLabel");
const hLabel = document.getElementById("hScore");
const hName = document.getElementById("hName");
const resetBtn = document.getElementById("resetBtn");
let video;
let flippedVideo;
let classifier;
let label = "Let's play  a game";
let imageModelURL = "https://teachablemachine.withgoogle.com/models/oLeP2goHD/";
function preload() {
  classifier = ml5.imageClassifier(imageModelURL + "model.json");
}

function setup() {
  sketchContainer = select("#sketch-container");
  let canvas = createCanvas(400, 400);

  video = createCapture(VIDEO);
  video.size(400, 400);
  video.hide();

  flippedVideo = ml5.flipImage(video);
  classifyVideo();

  canvas.parent(sketchContainer);
  w = floor(width / rez);
  h = floor(height / rez);
  frameRate(1);
  snake = new Snake();
  foodLocation();
  hLabel.innerText = highScore;
}

//this function handle all video/frame classification
function classifyVideo() {
  flippedVideo = ml5.flipImage(video);
  classifier.classify(flippedVideo, gotResult);
}

function gotResult(error, results) {
  // If there is an error
  if (error) {
    console.error(error);
    return;
  }
  // The results are in an array ordered by confidence.
  // console.log(results[0]);
  label = results[0].label;
  controlSnake();
  classifyVideo();
}

function foodLocation() {
  let x = floor(random(w));
  let y = floor(random(h));
  food = createVector(x, y);
}

function controlSnake() {
  if (label === "left") {
    snake.setDir(-1, 0);
  } else if (label === "right") {
    snake.setDir(1, 0);
  } else if (label === "down") {
    snake.setDir(0, 1);
  } else if (label === "up") {
    snake.setDir(0, -1);
  }
}

function draw() {
  background(220);
  image(flippedVideo, 0, 0);
  text(label, 10, 10);

  let texty = ` ${count}`;
  counterLabel.innerText = texty;
  hLabel.innerText = highScore;
  scale(rez);

  if (snake.eat(food)) {
    foodLocation();
    count++;
    let text = `${count}`;
    counterLabel.innerText = text;
  }
  snake.update();
  snake.show();
  if (snake.endGame()) {
    if (count > highScore) {
      highScore = count;
      const name = prompt("Let's put your name on display, champion 🥳🥳🥳");
      hName.innerText = name;
      window.localStorage.setItem("hScore", highScore);
    }
    count = 0;
    // print("END GAME");
    background(255, 0, 0);
    // noLoop();
  }

  noStroke();
  fill(255, 0, 0);
  rect(food.x, food.y, 1, 1);
}

resetBtn.addEventListener("click", function (e) {
  e.preventDefault();
  setup();
});
