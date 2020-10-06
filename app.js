document.addEventListener('DOMContentLoaded', () => {
	const grid = document.querySelector('.grid');
	let squares = Array.from(document.querySelectorAll('.grid div'));
	const scoreDisplay = document.querySelector('#score');
	const startButton = document.querySelector('#start-button');
	const width = 10;
	let nextRandom = 0;
	let timerId;
	let score = 0;
	const colors = ['#ff8c00', 'blue', '#b22222', '#9932cc', '#32cd32', '#008080'];

	//Tetrominoes
	const lTetromino = [
		[1, width + 1, width * 2 + 1, 2],
		[width, width + 1, width + 2, width * 2 + 2],
		[1, width + 1, width * 2 + 1, width * 2],
		[width, width * 2, width * 2 + 1, width * 2 + 2],
	];

	const jTetromino = [
		[1, width + 1, width * 2 + 1, 0],
		[width, width + 1, width + 2, width * 2],
		[1, width + 1, width * 2 + 1, width * 2 + 2],
		[width + 2, width * 2 + 2, width * 2 + 1, width * 2],
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

	const tetrominoes = [lTetromino, jTetromino, zTetromino, tTetromino, oTetromino, iTetromino];

	let currentPosition = 4;
	let currentRotation = 0;

	//Randomly select a tetromino and its 1st rotation
	let random = Math.floor(Math.random() * tetrominoes.length);
	let current = tetrominoes[random][currentRotation];

	//Draw the tetromino
	function draw() {
		current.forEach((index) => {
			squares[currentPosition + index].classList.add('tetromino');
			squares[currentPosition + index].style.backgroundColor = colors[random];
		});
	}

	//Undraw the tetromino
	function undraw() {
		current.forEach((index) => {
			squares[currentPosition + index].classList.remove('tetromino');
			squares[currentPosition + index].style.backgroundColor = '';
		});
	}

	//Assign functions to keycodes
	function control(e) {
		if (e.keyCode === 37) {
			moveLeft();
		} else if (e.keyCode === 38) {
			rotate();
		} else if (e.keyCode === 39) {
			moveRight();
		} else if (e.keyCode === 40) {
			moveDown();
		}
	}
	//document.addEventListener("keyup", control);

	//Move tetromino down
	function moveDown() {
		undraw();
		currentPosition += width;
		draw();
		freeze();
	}

	//Freezes tetromino
	function freeze() {
		if (current.some((index) => squares[currentPosition + index + width].classList.contains('taken'))) {
			current.forEach((index) => squares[currentPosition + index].classList.add('taken'));
			//New tetromino
			random = nextRandom;
			nextRandom = Math.floor(Math.random() * tetrominoes.length);
			current = tetrominoes[random][currentRotation];
			currentPosition = 4;
			draw();
			displayShape();
			addScore();
			gameOver();
		}
	}

	//Move tetromino left
	function moveLeft() {
		undraw();
		const isAtLeftEdge = current.some((index) => (currentPosition + index) % width === 0);

		if (!isAtLeftEdge) currentPosition -= 1;

		if (current.some((index) => squares[currentPosition + index].classList.contains('taken'))) {
			currentPosition += 1;
		}
		draw();
	}

	//Move tetromino right
	function moveRight() {
		undraw();
		const isAtRightEdge = current.some((index) => (currentPosition + index) % width === width - 1);

		if (!isAtRightEdge) currentPosition += 1;

		if (current.some((index) => squares[currentPosition + index].classList.contains('taken'))) {
			currentPosition -= 1;
		}
		draw();
	}

	//Rotate the tetromino
	function rotate() {
		const isAtLeftEdge = current.some((index) => (currentPosition + index) % width === 0);

		const isAtRightEdge = current.some((index) => (currentPosition + index) % width === width - 1);
		if (!(isAtLeftEdge || isAtRightEdge)) {
			undraw();
			currentRotation++;
			if (currentRotation === current.length) {
				currentRotation = 0;
			}
			current = tetrominoes[random][currentRotation];
			draw();
		}
	}
	//Display next tetromino in mini-grid
	const displaySquares = document.querySelectorAll('.mini-grid div');
	const displayWidth = 4;
	const displayIndex = 0;

	const nextTetrominoes = [
		[1, displayWidth + 1, displayWidth * 2 + 1, 2], //lTetromino
		[1, displayWidth + 1, displayWidth * 2 + 1, 0], //jTetromino
		[0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], //zTetromino
		[1, displayWidth, displayWidth + 1, displayWidth + 2], //tTetromino
		[0, 1, displayWidth, displayWidth + 1], //oTetromino
		[1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1], //iTetromino
	];

	function displayShape() {
		displaySquares.forEach((square) => {
			square.classList.remove('tetromino');
			square.style.backgroundColor = '';
		});
		nextTetrominoes[nextRandom].forEach((index) => {
			displaySquares[displayIndex + index].classList.add('tetromino');
			displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom];
		});
	}

	//Button functionality
	startButton.addEventListener('click', () => {
		if (timerId) {
			document.removeEventListener('keyup', control);
			clearInterval(timerId);
			timerId = null;
			startButton.innerHTML = 'Start';
		} else {
			document.addEventListener('keyup', control);
			draw();
			startButton.innerHTML = 'Pause';
			timerId = setInterval(moveDown, 1000);
			nextRandom = Math.floor(Math.random() * tetrominoes.length);
			displayShape();
		}
	});

	//Add Score
	function addScore() {
		for (let i = 0; i < 199; i += width) {
			const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9];

			if (row.every((index) => squares[index].classList.contains('taken'))) {
				score += 10;
				scoreDisplay.innerHTML = score;
				row.forEach((index) => {
					squares[index].classList.remove('taken');
					squares[index].classList.remove('tetromino');
					squares[index].style.backgroundColor = '';
				});
				const squaresRemoved = squares.splice(i, width);
				squares = squaresRemoved.concat(squares);
				squares.forEach((cell) => grid.appendChild(cell));
			}
		}
	}

	//Game over
	function gameOver() {
		if (current.some((index) => squares[currentPosition + index].classList.contains('taken'))) {
			scoreDisplay.innerHTML = 'GAME OVER';
			clearInterval(timerId);
		}
	}
});
