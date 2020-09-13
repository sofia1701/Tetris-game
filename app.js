document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  let squares = Array.from(document.querySelectorAll(".grid div"));
  const scoreDisplay = document.querySelector("#score");
  const startButton = document.querySelector("#start-button");
  const width = 10;

  //Tetrominoes
  const lTetromino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2],
  ];

  const zTetromino = [
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
  ];

  const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1],
  ];

  const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
  ];

  const iTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
  ];

  const tetrominoes = [
    lTetromino,
    zTetromino,
    tTetromino,
    oTetromino,
    iTetromino,
  ];

  let currentPosition = 4;
  let currentRotation = 0;

  //Randomly select a tetromino and its 1st rotation
  let random = Math.floor(Math.random() * tetrominoes.length);
  let current = tetrominoes[random][currentRotation];

  //Draw the tetromino
  function draw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.add("tetromino");
    });
  }

  //Undraw the tetromino
  function undraw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.remove("tetromino");
    });
  }

  //Tetromino moves down every 1sec
  timerId = setInterval(moveDown, 1000);

  //Assign functions to keycodes
  function control(e) {
    if (e.keyCode === 37) {
      moveLeft();
    }else if(e.keyCode === 38) {
      //rotate();
    }else if(e.keyCode === 39) {
      moveRight();
    }else if(e.keyCode === 40) {
      moveDown();
    }
  }
  document.addEventListener("keydown", control);

  //Move tetromino down
  function moveDown() {
    freeze();
    undraw();
    currentPosition += width;
    draw();
  }

  //Freezes tetromino
  function freeze() {
    if (
      current.some((index) =>
        squares[currentPosition + index + width].classList.contains("taken")
      )
    ) {
      current.forEach((index) =>
        squares[currentPosition + index].classList.add("taken")
      );
      //New tetromino
      random = Math.floor(Math.random() * tetrominoes.length);
      current = tetrominoes[random][currentRotation];
      currentPosition = 4;
      draw();
    }
  }

  //Move tetromino left
  function moveLeft() {
    undraw();
    const isAtLeftEdge = current.some(
      (index) => (currentPosition + index) % width === 0
    );

    if (!isAtLeftEdge) currentPosition -= 1;

    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("taken")
      )
    ) {
      currentPosition += 1;
    }
    draw();
  }

  //Move tetromino right
  function moveRight() {
    undraw();
    const isAtRightEdge = current.some(
      (index) => (currentPosition + index) % width === width-1
    );

    if (!isAtRightEdge) currentPosition += 1;

    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("taken")
      )
    ) {
      currentPosition -= 1;
    }
    draw();
  }
});
