"use strict";

// DISPLAY CONTROLLER
const displayController = (() => {
  const htmlElements = {
    startButton: `<button class="button start" type="submit">Start game!</button>`,
    againButton: `<button class="button again" type="button">Again?</button>`,
  };

  const spots = document.querySelectorAll(".spot");
  const textContainer = document.querySelector(".text-container");
  const headerContainer = document.querySelector(".grid-center");
  const heading = document.querySelector("h1");

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

  const renderWinningCombination = (combo) => {
    console.log(combo);
    for (let i = 0; i < spots.length; i++) {
      if (i === combo[0] || i === combo[1] || i === combo[2]) {
        spots[i].classList.add("winning-combo");
      }
    }
  };

  const unrenderWinningCombination = () => {
    spots.forEach((spot) => {
      spot.classList.remove("winning-combo");
    });
  };

  const renderScoreboard = () => {
    heading.textContent = `${scoreboard.score[0]} — ${scoreboard.score[1]}`;
    const xNameSpace = headerContainer.querySelector("h2.x-name");
    const oNameSpace = headerContainer.querySelector("h2.o-name");
    if (xName !== "Player one") {
      xNameSpace.textContent = xName;
    }
    if (oName !== "Player two") {
      oNameSpace.textContent = oName;
    }
  };

  const renderParagraphNextMove = () => {
    const paragraph = textContainer.querySelector("p");
    if (currentTurn === "x") {
      paragraph.textContent = `${xName}, your turn!`;
    }
    if (currentTurn === "o") {
      paragraph.textContent = `${oName}, your turn!`;
    }
  };

  const renderParagraphResult = (res) => {
    const paragraph = textContainer.querySelector("p");
    if (res === "x") {
      paragraph.innerHTML = `<b>${xName}</b> wins!`;
    }
    if (res === "o") {
      paragraph.innerHTML = `<b>${oName}</b> wins!`;
    }
    if (res === "tie") {
      paragraph.innerHTML = "It's a tie! Play again?";
    }
  };

  const hover = (event) => {
    event.target.classList.add("hover");
  };

  const unhover = (event) => {
    event.target.classList.remove("hover");
  };

  const resetHovers = () => {
    spots.forEach((spot) => {
      spot.classList.remove("hover");
    });
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
  const removeNameForms = () => {
    const el = textContainer.querySelector(".name-forms");
    textContainer.removeChild(el);
  };

  return {
    renderBoard,
    renderScoreboard,
    renderParagraphNextMove,
    renderParagraphResult,
    renderWinningCombination,
    unrenderWinningCombination,
    addStartButton,
    removeStartButton,
    addAgainButton,
    removeAgainButton,
    removeNameForms,
    hover,
    unhover,
    resetHovers,
  };
})();

// EVENTS
const eventController = (() => {
  const board = (() => {
    const spots = document.querySelectorAll(".spot");

    const gameboardHandler = (event) => {
      game.makeMove(event);
    };
    const hoverHandler = (event) => {
      displayController.hover(event);
    };
    const unhoverHandler = (event) => {
      displayController.unhover(event);
    };
    const bind = () => {
      spots.forEach((spot) => {
        spot.addEventListener("click", gameboardHandler);
        spot.addEventListener("mouseenter", hoverHandler);
        spot.addEventListener("mouseleave", unhoverHandler);
      });
    };
    const unbind = () => {
      spots.forEach((spot) => {
        displayController.resetHovers();
        spot.removeEventListener("click", gameboardHandler);
        spot.removeEventListener("mouseenter", hoverHandler);
        spot.removeEventListener("mouseleave", unhoverHandler);
      });
    };

    return { bind, unbind };
  })();

  const startButton = (() => {
    const textContainer = document.querySelector(".text-container");

    const startButtonHandler = () => {
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

    const againButtonHandler = () => {
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
      return false;
    } else {
      gameboardArray[i] = marker;
      render();
      return true;
    }
  };

  return { gameboardArray, reset, placeMarker };
})();

let xName = "";
let oName = "";

// SCOREBOARD OBJECT
const scoreboard = (() => {
  const score = [0, 0];
  const getNames = () => {
    const formX = document.querySelector("#x-name");
    if (formX.value == "") {
      xName = "Player one";
    } else {
      xName = formX.value;
    }
    const formO = document.querySelector("#o-name");
    if (formO.value == "") {
      oName = "Player two";
    } else {
      oName = formO.value;
    }
  };
  const render = () => {
    displayController.renderScoreboard();
  };

  return { score, getNames, render };
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
        return [board[a], [a, b, c]];
      }
    }

    if (board.every((spot) => typeof spot !== "number")) {
      return ["tie", ["tie", "tie", "tie"]];
    }

    return null; // Game is still in progress
  };

  const init = () => {
    scoreboard.getNames();
    displayController.removeNameForms();
    scoreboard.render();
    eventController.startButton.unbind();
    displayController.removeStartButton();
    gameboard.reset();
    eventController.board.bind();
    displayController.renderParagraphNextMove();
  };

  const initAgain = () => {
    currentTurn = "x";
    eventController.againButton.unbind();
    displayController.removeAgainButton();
    gameboard.reset();
    displayController.unrenderWinningCombination();
    eventController.board.bind();
    displayController.renderParagraphNextMove();
  };

  const makeMove = (event) => {
    let marker = currentTurn;
    if (gameboard.placeMarker(event.target.dataset.index, marker) === true) {
      currentTurn = takeTurns();
    }
    displayController.renderParagraphNextMove();
    let result = checkWinner();
    if (result !== null) {
      finish(result);
    }
  };

  const finish = (result) => {
    if (result[0] === "x") {
      scoreboard.score[0] += 1;
    } else if (result[0] === "o") {
      scoreboard.score[1] += 1;
    }
    scoreboard.render();
    displayController.renderParagraphResult(result[0]);
    displayController.renderWinningCombination(result[1]);
    eventController.board.unbind();
    displayController.addAgainButton();
    eventController.againButton.bind();
  };

  return { takeTurns, checkWinner, init, initAgain, makeMove, finish };
})();
