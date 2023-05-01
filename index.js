// DISPLAY CONTROLLER
const displayController = (() => {
  const htmlElements = {
    startButton: `<button class="button start" type="button">Start game!</button>`,
    againButton: `<button class="button again" type="button">Again?</button>`,
  };

  const spots = document.querySelectorAll(".spot");
  const textContainer = document.querySelector(".text-container");

  const renderBoard = () => {
    spots.forEach((spot) => {
      spot.classList.remove("x");
      spot.classList.remove("o");
    });
    for (let i = 0; i < spots.length; i++) {
      if (gameboard.gameboardArray[i] === "x") {
        spots[i].classList.add("x");
      } else if (gameboard.gameboardArray[i] === "o") {
        spots[i].classList.add("o");
      }
    }
  };

  const addStartButton = () => {
    textContainer.innerHTML += htmlElements.startButton;
  };
  const removeStartButton = () => {
    const el = textContainer.querySelector(".start");
    textContainer.removeChild(el);
  };

  const addAgainButton = () => {
    textContainer.innerHTML += htmlElements.againButton;
  };
  const removeAgainButton = () => {
    const el = textContainer.querySelector(".again");
    textContainer.removeChild(el);
  };

  return {
    renderBoard,
    addStartButton,
    removeStartButton,
    addAgainButton,
    removeAgainButton,
  };
})();

// EVENTS
const eventController = (() => {
  const board = (() => {
    const spots = document.querySelectorAll(".spot");

    const gameboardHandler = (event) => {
      game.makeMove(event);
    };
    const bind = () => {
      spots.forEach((spot) => {
        spot.addEventListener("click", gameboardHandler);
      });
    };
    const unbind = () => {
      spots.forEach((spot) => {
        spot.removeEventListener("click", gameboardHandler);
      });
    };

    return { bind, unbind };
  })();

  const startButton = (() => {
    const textContainer = document.querySelector(".text-container");

    const startButtonHandler = (event) => {
      game.init();
    };
    const bind = () => {
      textContainer
        .querySelector(".start")
        .addEventListener("click", startButtonHandler);
    };
    const unbind = () => {
      textContainer
        .querySelector(".start")
        .removeEventListener("click", startButtonHandler);
    };

    return { bind, unbind };
  })();

  const againButton = (() => {
    const textContainer = document.querySelector(".text-container");

    const againButtonHandler = (event) => {
      game.initAgain();
    };
    const bind = () => {
      textContainer
        .querySelector(".again")
        .addEventListener("click", againButtonHandler);
    };
    const unbind = () => {
      textContainer
        .querySelector(".again")
        .removeEventListener("click", againButtonHandler);
    };

    return { bind, unbind };
  })();

  return { board, startButton, againButton };
})();

// GAMEBOARD OBJECT
const gameboard = (() => {
  const gameboardArray = [0, 1, 2, 3, 4, 5, 6, 7, 8];

  const render = () => {
    displayController.renderBoard();
  };

  const reset = () => {
    for (let i = 0; i < gameboardArray.length; i++) {
      gameboardArray[i] = i;
      render();
    }
  };

  const placeMarker = (i, marker) => {
    if (gameboardArray[i] === "x" || gameboardArray[i] === "o") {
      console.log("Place taken!");
    } else {
      gameboardArray[i] = marker;
    }
    render();
  };

  return { gameboardArray, reset, placeMarker };
})();

// GAME OBJECT
let currentTurn = "x";
displayController.addStartButton();
eventController.startButton.bind();

const game = (() => {
  const takeTurns = () => {
    if (currentTurn === "x") {
      return "o";
    } else {
      return "x";
    }
  };

  const checkWinner = () => {
    const board = gameboard.gameboardArray;

    const winConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // Horizontal lines
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // Vertical lines
      [0, 4, 8],
      [2, 4, 6], // Diagonal lines
    ];

    for (let condition of winConditions) {
      const [a, b, c] = condition;
      if (
        typeof board[a] !== "number" &&
        board[a] === board[b] &&
        board[a] === board[c]
      ) {
        return board[a]; // Return the winning marker
      }
    }

    if (board.every((cell) => typeof cell !== "number")) {
      return "tie";
    }

    return null; // Game is still in progress
  };

  const init = () => {
    eventController.startButton.unbind();
    displayController.removeStartButton();
    gameboard.reset();
    eventController.board.bind();
  };

  const initAgain = () => {
    currentTurn = "x";
    eventController.againButton.unbind();
    displayController.removeAgainButton();
    gameboard.reset();
    eventController.board.bind();
  };

  const makeMove = (event) => {
    let marker = currentTurn;
    gameboard.placeMarker(event.target.dataset.index, marker);
    currentTurn = takeTurns();
    let result = checkWinner();
    if (result !== null) {
      finish(result);
    }
  };

  const finish = (result) => {
    console.log(result);
    eventController.board.unbind();
    displayController.addAgainButton();
    eventController.againButton.bind();
  };

  return { takeTurns, checkWinner, init, initAgain, makeMove, finish };
})();
