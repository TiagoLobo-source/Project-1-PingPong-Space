let player1Score = 0;
let player2Score = 0;
let IsMenuInitial = true;
let IsRestart = false;
let isInstructionsExit = false;
const exit = document.getElementById("exit");
document.getElementById("instructions").style.display = "none";

exit.addEventListener("click", function () {
  location.reload();
});

if (!isInstructionsExit) {
  document.getElementById("exit").style.display = "none";
}

const startItem1 = document.getElementById("startItem1");
startItem1.addEventListener("click", function () {
  IsMenuInitial = false;
  startGame();
});

const startItem4 = document.getElementById("startItem4");
startItem4.addEventListener("click", function () {
  document.getElementById("start").style.display = "none";
  let isInstructionsExit = true;
  if (isInstructionsExit) {
    document.getElementById("exit").style.display = "block";
    document.getElementById("instructions").style.display = "block";
  } else if (!isInstructionsExit) {
    document.getElementById("exit").style.display = "none";
    document.getElementById("instructions").style.display = "none";
  }
});

window.onload = () => {
  if (!IsMenuInitial) {
    startGame();
  }
};

function startGame() {
  let player1Score = 0;
  let player2Score = 0;
  const canvas = document.getElementById("game-window");
  const ctx = canvas.getContext("2d");

  let audio = new Audio("blazing stars.mp3");
  audio.play();
  audio.loop = true;

  //Initially hide Game-over menu
  const menu = document.querySelector(".restart-menu");

  if (!IsRestart) {
    function showRestartMenu() {
      menu.classList.add("active");
    }
  }

  function hideRestartMenu() {
    menu.classList.remove("active");
  }

  hideRestartMenu();

  //Starting position of the balls
  let ballX = canvas.width / 2;
  let ballY = canvas.height / 2;
  let ball2X = canvas.width / 2;
  let ball2Y = canvas.height / 2;

  let fixedSpeed = 6;

  //Random directions

  //Generate random number within our angle range that is 0 and 45
  function randomInteger(min, max) {
    return Math.random() * (max - min) + min;
  }

  //Random angle for each ball generated
  let angle1 = (Math.PI / 180) * randomInteger(0, 45);
  let angle2 = (Math.PI / 180) * randomInteger(0, 45);

  //Calculate directions using unitary values
  // hypotenuse direction= 1
  let randomDirectionX = 1 * Math.cos(angle1);
  let randomDirectionY = 1 * Math.sin(angle1);
  let randomDirection2X = 1 * Math.cos(angle2);
  let randomDirection2Y = 1 * Math.sin(angle2);

  //Calculate speeds
  let ballSpeedX = fixedSpeed * randomDirectionX;
  let ballSpeedY = fixedSpeed * randomDirectionY;
  let ballSpeed2X = fixedSpeed * randomDirection2X;
  let ballSpeed2Y = fixedSpeed * randomDirection2Y;

  // Paddles initial position
  let playerPaddleY = 300;
  let player2PaddleY = 300;

  //Players initial score

  //Reset game after someone scores

  const resetGame = () => {
    //Reset the ball positions
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ball2X = canvas.width / 2;
    ball2Y = canvas.height / 2;

    //Random angle for each ball generated
    angle1 = (Math.PI / 180) * randomInteger(0, 45);
    angle2 = (Math.PI / 180) * randomInteger(0, 45);

    // Calculate directions
    randomDirectionX = Math.cos(angle1);
    randomDirectionY = 1 * Math.sin(angle1);
    randomDirection2X = Math.cos(angle2);
    randomDirection2Y = 1 * Math.sin(angle2);

    // Calculate speeds
    ballSpeedX = fixedSpeed * randomDirectionX;
    ballSpeedY = fixedSpeed * randomDirectionY;
    ballSpeed2X = fixedSpeed * randomDirection2X;
    ballSpeed2Y = fixedSpeed * randomDirection2Y;

    //Reset the paddle positions
    playerPaddleY = 300;
    player2PaddleY = 300;
  };

  let radiusIndex = 0;
  const radius = [10, 15, 10];
  let colorIndex = 0;
  const colors = ["red", "orange", "yellow"];
  const colorsPaddles = ["white", "gray", "lightgray"];

  const keys = {
    ArrowUp: false,
    ArrowDown: false,
    w: false,
    s: false,
  };

  const updateGame = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //player 1
    ctx.fillStyle = colorsPaddles[colorIndex];
    ctx.fillRect(20, playerPaddleY, 10, 100);

    //player 2
    ctx.fillStyle = colorsPaddles[colorIndex];
    ctx.fillRect(canvas.width - 30, player2PaddleY, 10, 100);

    //Update the position of the ball
    ballX += ballSpeedX;
    ballY += ballSpeedY;
    ball2X -= ballSpeed2X;
    ball2Y -= ballSpeed2Y;

    // Check for collision with walls
    if (
      //Prevents from going beyond the left side of canvas
      ballX - radius[radiusIndex] < -10 ||
      //Prevents from going beyond the right side of canvas
      ballX + radius[radiusIndex] > canvas.width
    ) {
      ballSpeedX = -ballSpeedX;
    }
    if (
      //Prevents from going beyond the top side of canvas
      ballY - radius[radiusIndex] < -10 ||
      //Prevents from going beyond the lower side of canvas
      ballY + radius[radiusIndex] > canvas.height
    ) {
      ballSpeedY = -ballSpeedY;
    }

    if (
      //Prevents from going beyond the  left side of canvas
      ball2X - radius[radiusIndex] < -10 ||
      //Prevents from going beyond the right side of canvas
      ball2X + radius[radiusIndex] > canvas.width
    ) {
      ballSpeed2X = -ballSpeed2X;
    }

    if (
      //Prevents from going beyond the top side of canvas
      ball2Y - radius[radiusIndex] < -10 ||
      //Prevents from going beyond the lower side of canvas
      ball2Y + radius[radiusIndex] > canvas.height
    ) {
      ballSpeed2Y = -ballSpeed2Y;
    }

    //Check for collision with paddles (for each player and each ball - 4 case scenarios)

    if (
      //if ball 1 is between player 1 paddle left side and right side
      ballX + radius[radiusIndex] >= 10 &&
      ballX - radius[radiusIndex] <= 20 &&
      //if ball 1 is between player 1 paddle height
      ballY + radius[radiusIndex] >= playerPaddleY &&
      ballY - radius[radiusIndex] <= playerPaddleY + 100
    ) {
      ballSpeedX = -ballSpeedX;
    }

    if (
      //if ball 1 is between player 2 paddle left side and right side
      ballX + radius[radiusIndex] >= canvas.width - 40 &&
      //if ball 1 is between player 2 paddle height
      ballY + radius[radiusIndex] >= player2PaddleY &&
      ballY - radius[radiusIndex] <= player2PaddleY + 100
    ) {
      ballSpeedX = -ballSpeedX;
    }

    if (
      //if ball 2 is between player 1 paddle left side and right side
      ball2X + radius[radiusIndex] >= 10 &&
      ball2X - radius[radiusIndex] <= 20 &&
      //if ball 2 is between player 1 paddle height
      ball2Y + radius[radiusIndex] >= playerPaddleY &&
      ball2Y - radius[radiusIndex] <= playerPaddleY + 100
    ) {
      ballSpeed2X = -ballSpeed2X;
    }

    if (
      //if ball 2 is between player 2 paddle left side and right side
      ball2X + radius[radiusIndex] >= canvas.width - 40 &&
      //if ball 2 is between player 2 paddle height
      ball2Y + radius[radiusIndex] >= player2PaddleY &&
      ball2Y - radius[radiusIndex] <= player2PaddleY + 100
    ) {
      ballSpeed2X = -ballSpeed2X;
    }

    //Score information
    //Player 1 and 2 scores

    ctx.clearRect(550, 0, 400, 200);
    ctx.fillStyle = "white";

    ctx.font = "40px Arial";
    ctx.fillText("Player 1", 550, 50);

    ctx.font = "40px Arial";
    ctx.fillText(player1Score, 600, 120);

    ctx.font = "40px Arial";
    ctx.fillText("Player 2", 800, 50);

    ctx.font = "40px Arial";
    ctx.fillText(player2Score, 850, 120);

    if (ball2X - radius[radiusIndex] < 0) {
      player2Score += 1;
      hasScored = true;
      resetGame();
    } else if (ballX - radius[radiusIndex] < 0) {
      player2Score += 1;
      hasScored = true;
      resetGame();
    } else if (ballX + radius[radiusIndex] > canvas.width - 10) {
      player1Score += 1;
      hasScored = true;
      resetGame();
    } else if (ball2X + radius[radiusIndex] > canvas.width - 10) {
      player1Score += 1;
      hasScored = true;
      resetGame();
    } else {
      hasScored = false;
    }

    // Draw the ball

    ctx.beginPath();
    ctx.arc(
      ballX + radius[radiusIndex],
      ballY + radius[radiusIndex],
      radius[radiusIndex],
      0,
      2 * Math.PI
    );
    ctx.fillStyle = colors[colorIndex];
    ctx.fill();

    // Draw the 2nd ball
    ctx.beginPath();
    ctx.arc(
      ball2X + radius[radiusIndex],
      ball2Y + radius[radiusIndex],
      radius[radiusIndex],
      0,
      2 * Math.PI
    );
    ctx.fillStyle = colors[colorIndex];
    ctx.fill();

    // Update paddle positions
    if (keys.w) {
      movePlayer1PaddleUp();
    } else if (keys.s) {
      movePlayer1PaddleDown();
    }

    if (keys.ArrowUp) {
      movePlayer2PaddleUp();
    } else if (keys.ArrowDown) {
      movePlayer2PaddleDown();
    }
  };
  function checkGameOver() {
    let gameOver = false;

    if (player1Score >= 3 && player2Score < 3) {
      gameOver = true;
      IsRestart = true;
    } else if (player2Score >= 3 && player1Score < 3) {
      gameOver = true;
      IsRestart = true;
    }

    if (gameOver) {
      showRestartMenu();
      ctx.fillRect(920, 300, 10, 100);
      ctx.fillRect(570, 300, 10, 100);
      player2PaddleY = 300;
      const restartMenu = document.getElementById("restart");
      restartMenu.addEventListener("click", function () {
        startGame();
      });
      const restartExit = document.getElementById("restartExit");
      restartExit.addEventListener("click", function () {
        location.reload();
      });

      ctx.font = "40px Arial";
      ctx.fillText("GAME OVER", 620, 340);
      if (player1Score > player2Score) {
        ctx.clearRect(550, 0, 400, 200);
        ctx.fillStyle = "white";
        ctx.font = "40px Arial";
        ctx.fillText("Player 1", 550, 50);
        ctx.font = "40px Arial";
        ctx.fillText(player1Score, 600, 120);
        ctx.fillText("Player 2", 800, 50);
        ctx.font = "40px Arial";
        ctx.fillText(player2Score, 850, 120);
        ctx.fillText("PLAYER  1 WON", 600, 390);
        clearInterval(getGameInterval);
      } else {
        ctx.clearRect(550, 0, 400, 200);
        ctx.fillStyle = "white";
        ctx.fillText("Player 1", 550, 50);
        ctx.font = "40px Arial";
        ctx.fillText(player1Score, 600, 120);
        ctx.fillText("Player 2", 800, 50);
        ctx.font = "40px Arial";
        ctx.fillText(player2Score, 850, 120);
        ctx.fillText("PLAYER  2 WON", 600, 390);
        clearInterval(getGameInterval);
      }
    }
  }

  let getGameInterval = setInterval(() => {
    updateGame();
    checkGameOver();
  }, 20);
  document.addEventListener("keydown", (event) => {
    if (event.key in keys && playerPaddleY <= canvas.height - 100) {
      keys[event.key] = true;
    }
  });

  document.addEventListener("keyup", (event) => {
    if (event.key in keys) {
      keys[event.key] = false;
    }
  });

  // Functions to move the paddles
  function movePlayer1PaddleUp() {
    if (playerPaddleY > 0) {
      playerPaddleY -= 20;
    }
  }

  function movePlayer1PaddleDown() {
    if (playerPaddleY < canvas.height - 100) {
      playerPaddleY += 20;
    }
  }

  function movePlayer2PaddleUp() {
    if (player2PaddleY > 0) {
      player2PaddleY -= 20;
    }
  }

  function movePlayer2PaddleDown() {
    if (player2PaddleY < canvas.height - 100) {
      player2PaddleY += 20;
    }
  }

  setInterval(() => {
    colorIndex = (colorIndex + 1) % colors.length;
    radiusIndex = (radiusIndex + 1) % radius.length;
    colorIndex = (colorIndex + 1) % colorsPaddles.length;
  }, 100);
  function hideStartMenu() {
    document.getElementById("start").style.display = "none";
  }
  hideStartMenu();
  updateGame();
}
