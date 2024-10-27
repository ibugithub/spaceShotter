let playerSpeed = 20;

export const HandleKeyboardEvents = (player, canvas) => {
  document.addEventListener('keydown', (event) => {
    switch (event.key) {
      case 'ArrowLeft':
        moveLeft(player);
        break;
      case 'ArrowRight':
        moveRight(player, canvas);
        break;
      case 'ArrowUp':
        moveUp(player);
        break;
      case 'ArrowDown':
        moveDown(player, canvas);
        break;
    }
  });
}

const moveLeft = (player) => {
  player.positionX = Math.max(player.positionX - player.speed);
  return Math.max(player);
}

const moveRight = (player, canvas) => {
  player.positionX = Math.min(player.positionX + playerSpeed, canvas.width - player.width);
}

const moveUp = (player) => {
  player.positionY = Math.max(player.positionY - player.speed, 0)
}

const moveDown = (player, canvas) => {
  player.positionY = Math.min(player.positionY + player.speed, canvas.height - player.height)
}
