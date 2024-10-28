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

class Enemy {
  constructor(image, x, y, width, height, speed) {
    this.image = image;
    this.positionX = x;
    this.positionY = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
  }
  isOffScreen() {
    return this.positionY > canvas.height;
  }
  move() {
    this.positionY += this.speed;
  }
  drawEnemy() {
    ctx.drawImage(this.image, this.positionX, this.positionY, this.width, this.height);
  }

  isCollidingWithAmmo(ammo) {
    return (
      this.positionX < ammo.positionX + ammo.width &&
      this.positionX + this.width > ammo.positionX &&
      this.positionY < ammo.positionY + ammo.height &&
      this.positionY + this.height > ammo.positionY
    );
  }
}

const checkCollision = () => {
  for (let i = enemies.length - 1; i >= 0; i--) {
    for (let j = ammoSets.length - 1; j >= 0; j--) {
      if (enemies[i].isCollidingWithAmmo(ammoSets[j])) {
        enemies.splice(i, 1);
        ammoSets.splice(j, 1);
        break;
      }
    }
  }
}

const ammoImageName = "ammo.png";
let ammoImage;
let ammoSets = [];
const ammoWidth = 5;
const ammoHeight = 20;
let ammoSpeed = 5;
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

const fireAmmo = () => {
  const ammo = new Ammo(ammoImage, player.positionX + (player.width / 2), player.positionY, ammoWidth, ammoHeight, ammoSpeed);
  ammoSets.push(ammo);
}

const updateAmmoPositions = () => {
  ammoSets = ammoSets.filter((ammo) => {
    if (ammo.isOffScreen()) {
      return false;
    } else {
      ammo.move();
      ammo.drawAmmo();
      return true;
    }
  })
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
const throwEnemies = () => {
  let savedEnemiesX = [];
  for (let i = 0; i < enemieImages.length; i++) {
    let enemyX;
    let validPosition = false;
    while (!validPosition) {
      enemyX = Math.floor(Math.random() * (canvas.width - enemyWidth));
      if (!isOverlaped(savedEnemiesX, enemyX)) {
        validPosition = true;
      }
    }
    const enemyY = 0;
    const enemySpeed = 0.5 + Math.random() * (2.5 - 0.5)
    savedEnemiesX.push(enemyX);
    const enemy = new Enemy(enemieImages[i], enemyX, enemyY, enemyWidth, enemyHeight, enemySpeed);
    enemies.push(enemy);
  }

  console.log('enemies', enemies);
}

const drawPlayer = () => {
  ctx.drawImage(player.src, player.positionX, player.positionY, player.width, player.height);
}

const updateEnemiesPositions = () => {
  enemies = enemies.filter((enemy) => {
    if (enemy.isOffScreen()) {
      return false;
    } else {
      enemy.move();
      enemy.drawEnemy();
      return true;
    }
  })
}
// checking if objects x position is overlaped

const handleControls = () => {
  HandleKeyboardEvents(player, canvas);
}

const gameLoop = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  updateEnemiesPositions();
  updateAmmoPositions();
  checkCollision();
  requestAnimationFrame(gameLoop);
}

const main = () => {
  handleControls();
  const firingInterval = 300;
  setInterval(fireAmmo, firingInterval);
  const throwingInterval = 4000;
  setInterval(throwEnemies, throwingInterval);
}

const initialize = async () => {
  console.log('Loading all assets...');
  await loadAllAssets();
  console.log('All assets loaded');
  main();
  gameLoop();
}
initialize();