import { HandleKeyboardEvents } from "./control.js";
const canvas = document.getElementById("gameArea");
const ctx = canvas.getContext("2d");
canvas.width = canvas.parentElement.clientWidth;
canvas.height = canvas.parentElement.clientHeight;
const arrowKey = document.getElementById("keyDiv");

const playerWidth = 60;
const playerHeight = 65;
let player = {
  src: "spaceShip.png",
  positionX: (canvas.width - playerWidth) / 2,
  positionY: (canvas.height - playerHeight),
  width: 60,
  height: 65,
  speed: 2.5,
  movingLeft: false,
  movingRight: false,
  movingUp: false,
  movingDown: false,
}

const enemiesSrc = ['enemy4.png', 'enemy5.png', 'enemy6.png', 'enemy7.png', 'enemy8.png'];
let enemieImages = [];
let enemies = [];
let enemyWidth = 40;
let enemyHeight = 40;

// let ammo = {
//   src: "ammo.png",
//   positionX: player.positionX + 13,
//   positionY: player.positionY,
//   width: 5,
//   height: 20,
//   speed: 5
// }

const ammoImageName = "ammo.png";
let ammoImage;
let ammoSets = [];
class Ammo {
  constructor(image, x, y, width, height, speed) {
    this.image = image;
    this.positionX = x;
    this.positionY = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
  }

  isOffScreen() {
    return this.positionY <= 0;
  }

  move() {
    this.positionY -= this.speed;
  }
  drawAmmo() {
    ctx.drawImage(this.image, this.positionX, this.positionY, this.width, this.height);
  } 

}

const initializeAmmo = (count, gap) => {
  for (let i = 0; i < count; i++) {
    const ammo = new Ammo(ammoImage, player.positionX + (player.width/2), player.positionY - i*gap, 5, 20, 3);
    ammoSets.push(ammo);
  }
  console.log('the ammo sets are in initfuc are', ammoSets);
}

const updateAmmoPosition = () => {
  for (let i = 0; i < ammoSets.length; i++) {
   if(ammoSets[i].isOffScreen()) {
     ammoSets[i].positionY = player.positionY;
     ammoSets[i].positionX = player.positionX + (player.width/2);
   } else {
     ammoSets[i].move();
     ammoSets[i].drawAmmo();
   }
  }
  console.log('the ammo sets in the updateAmmo are', ammoSets);    
}


if (canvas.width >= 300 && canvas.width <= 425) {
  enemyWidth = 20;
  enemyHeight = 20;
  player.width = 30;
  player.height = 35;
}
if (canvas.width >= 426 && canvas.width <= 768) {
  enemyWidth = 30;
  enemyHeight = 30;
  player.width = 40;
  player.height = 45;
}
if (canvas.width >= 769 && canvas.width <= 1024) {
  arrowKey.style.display = "none";
  enemyWidth = 40;
  enemyHeight = 40;
  player.width = 50;
  player.height = 55;
}
if (canvas.width >= 1025 && canvas.width <= 1440) {
  arrowKey.style.display = "none";
  enemyWidth = 60;
  enemyHeight = 60;
  player.width = 70;
  player.height = 75;
}
if (canvas.width >= 1441) {
  arrowKey.style.display = "none";
  enemyWidth = 70;
  enemyHeight = 70;
  player.width = 80;
  player.height = 85;
}

const loadAsset = async (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = `./assets/${src}`;
    img.onload = () => { resolve(img) }
    img.onerror = (err) => { reject(err) }
  })
}
const loadAllAssets = async () => {
  try {
    player.src = await loadAsset(player.src);
    ammoImage = await loadAsset(ammoImageName);
    const images = await Promise.all(enemiesSrc.map(src => loadAsset(src)));
    enemieImages.push(...images);
  } catch (error) {
    console.error('Failed to load asset:', error);
  }
}
const initializeEnemies = () => {
  let savedEnemyX = [];
  for (let i = 0; i < enemieImages.length; i++) {
    let enemyX;
    let validPosition = false;
    while (!validPosition) {
      enemyX = Math.floor(Math.random() * (canvas.width - enemyWidth));
      if (!isOverlaped(savedEnemyX, enemyX)) {
        validPosition = true;
      }
    }
    const enemyY = 0;
    const enemySpeed = 0.5 + Math.random() * (2.5 - 0.5)
    savedEnemyX.push(enemyX);

    const enemyWithPosition = {
      image: enemieImages[i],
      positionX: enemyX,
      positionY: enemyY,
      speed: enemySpeed,
    }
    enemies.push(enemyWithPosition);
  }
}

const drawPlayer = () => {
  ctx.drawImage(player.src, player.positionX, player.positionY, player.width, player.height);
}

const drawEnemies = () => {
  for (let i = 0; i < enemies.length; i++) {
    ctx.drawImage(enemies[i].image, enemies[i].positionX, enemies[i].positionY, enemyWidth, enemyHeight);
    enemies[i].positionY += enemies[i].speed;
    if (enemies[i].positionY > canvas.height) {
      enemies[i].positionY = 0;
    }
  }
}
// checking if objects x position is overlaped
const isOverlaped = (savedEnemyX, enemyX) => {
  if (savedEnemyX.length === 0) {
    return false;
  }
  for (let x of savedEnemyX) {
    if (Math.abs(x - enemyX) < enemyWidth + 10) {
      return true;
    }
  }
  return false;
}


const handleControls = () => {
  HandleKeyboardEvents(player, canvas);
}

const gameLoop = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  drawEnemies();
  updateAmmoPosition();
  requestAnimationFrame(gameLoop);
}

const main = () => {
  handleControls();
  initializeEnemies();
  initializeAmmo(5, 50);
}

const initialize = async () => {
  console.log('Loading all assets...');
  await loadAllAssets();
  console.log('All assets loaded');
  main();
  gameLoop();
}
initialize();