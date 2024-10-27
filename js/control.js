let playerSpeed = 20;

export const HandleKeyboardEvents = (player, canvas) => {
  const leftKey = document.getElementById('left');
  const rightKey = document.getElementById('right');
  const topKey = document.getElementById('top');
  const downKey = document.getElementById('down');

  // Move functions
  const startMovingLeft = () => { player.movingLeft = true; };
  const stopMovingLeft = () => { player.movingLeft = false; };

  const startMovingRight = () => { player.movingRight = true; };
  const stopMovingRight = () => { player.movingRight = false; };

  const startMovingUp = () => { player.movingUp = true; };
  const stopMovingUp = () => { player.movingUp = false; };

  const startMovingDown = () => { player.movingDown = true; };
  const stopMovingDown = () => { player.movingDown = false; };

  document.addEventListener('keydown', (event) => {
    console.log('Key pressed:', event.key, player);
    switch (event.key) {
      case 'ArrowLeft':
        startMovingLeft();
        break;
      case 'ArrowRight':
        startMovingRight();
        break;
      case 'ArrowUp':
        startMovingUp();
        break;
      case 'ArrowDown':
        startMovingDown();
        break;
    }
  });

  document.addEventListener('keyup', (event) => {
    switch (event.key) {
      case 'ArrowLeft':
        stopMovingLeft();
        break;
      case 'ArrowRight':
        stopMovingRight();
        break;
      case 'ArrowUp':
        stopMovingUp();
        break;
      case 'ArrowDown':
        stopMovingDown();
        break;
    }
  });

  leftKey.addEventListener('touchstart', startMovingLeft);
  leftKey.addEventListener('touchend', stopMovingLeft);

  rightKey.addEventListener('touchstart', startMovingRight);
  rightKey.addEventListener('touchend', stopMovingRight);

  topKey.addEventListener('touchstart', startMovingUp);
  topKey.addEventListener('touchend', stopMovingUp);

  downKey.addEventListener('touchstart', startMovingDown);
  downKey.addEventListener('touchend', stopMovingDown);
  console.log('I am in the control func', player);

  const updatePlayerPosition = () => {
    if (player.movingLeft) {
      moveLeft(player);
    }
    if (player.movingRight) {
      moveRight(player, canvas);
    }
    if (player.movingUp) {
      moveUp(player);
    }
    if (player.movingDown) {
      moveDown(player, canvas);
    }
    requestAnimationFrame(updatePlayerPosition);
  }
  updatePlayerPosition();
}





const moveLeft = (player) => {
  player.positionX = Math.max(player.positionX - player.speed, 0);
}

const moveRight = (player, canvas) => {
  player.positionX = Math.min(player.positionX + player.speed, canvas.width - player.width);
}

const moveUp = (player) => {
  player.positionY = Math.max(player.positionY - player.speed, 0)
}

const moveDown = (player, canvas) => {
  player.positionY = Math.min(player.positionY + player.speed, canvas.height - player.height)
}