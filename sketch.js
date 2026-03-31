let bgImg
let maxLogs = 0;
let progress = 0
let overSound, winSound, mockSounds = [];

var windowImg = { name: 'curtains', img: null, state: 'open', }
var coffeeImg = { name: 'coffee machine', img: null, state: 'open' }
var tvImg = { name: 'tv', img: null, state: 'open' }
var light1 = { name: 'desk lamp', img: null, state: 'open' }
var light2 = { name: 'roof lamp', img: null, state: 'open' }

function playSound(sound) {
  if (!sound.mp3.isPlaying()) {
    sound.mp3.play()
  }
}

function preload() {
  bgImg = loadImage('assets/bg.jpg')

  windowImg.img = loadImage('assets/only_window.png')
  coffeeImg.img = loadImage('assets/only_coffee.png')
  tvImg.img = loadImage('assets/only_tv.png')
  light1.img = loadImage('assets/only_light1.png')
  light2.img = loadImage('assets/only_light2.png')

  overSound = {
    mp3: loadSound('assets/game_over.mp3'),
    text: 'FUYIUH~~   You failed hahaha I am sure you are probably gonna be fired hahah',
  }
  winSound = {
    mp3: loadSound('assets/game_win.mp3'),
    text: 'HOW DARE YOU!!! AH—— ',
  }
  mockSounds = [
    {
      mp3: loadSound('assets/mock1.mp3'),
      text: 'HAHAHAHA, look what I just did'
    },
    {
      mp3: loadSound('assets/mock2.mp3'),
      text: 'HEYHEY, do you like this one?~~'
    },
    {
      mp3: loadSound('assets/mock3.mp3'),
      text: 'OHOH, my bad~~'
    }
  ]
}

function setup() {
  createCanvas(innerWidth, innerHeight)

  bgImg.resize(width,  height)
  windowImg.img.resize(width, height)
  coffeeImg.img.resize(width, height)
  tvImg.img.resize(width, height)
  light1.img.resize(width, height)
  light2.img.resize(width, height)

  maxLogs = floor((height - 130) / 35)
  lastUpdate = millis()
}

function drawObj(obj) {
  if (obj.state === 'open') {
    image(obj.img, 0, 0, width, height)
  }
}

function draw() {
  background(30)

  image(bgImg, 0, 0)
  drawObj(windowImg)
  drawObj(coffeeImg)
  drawObj(tvImg)
  drawObj(light1)
  drawObj(light2)

  updateClock()

  let y = height - 93
  fill(80, 242, 131)
  progress = 5
  rect(0, y, 440 * progress / 5, 10)
  fill(0)
  for(let i=0;i<progress;i++) {
    rect(440 * i / 5, y, 2, 10)
  }
}

function setState(obj, state) {
  obj.state = state
}

function switchState(obj) {
  obj.state = obj.state === 'open' ? 'close' : 'open'
}

function isWin(){
  progress = 0
  if (windowImg.state === 'close') progress++
  if (coffeeImg.state === 'close') progress++
  if (tvImg.state === 'close') progress++
  if (light1.state === 'close') progress++
  if (light2.state === 'close') progress++

  return progress === 5
}
