import { reactive, Ref, ref } from "vue";
import { GameBoardBox } from "@/types/index";

const directions = {
  d: [1, 0],
  a: [-1, 0],
  w: [0, -1],
  s: [0, 1],
};

export const colorSheet: Record<number, string> = {
  2: "#eee4da",
  4: "#eee4eb",
  8: "#f26179",
  16: "#f59563",
  32: "#f67c5f",
  64: "#f65e36",
  128: "#edcf72",
  256: "#edcc61",
  512: "#9c0",
  1024: "#3365a5",
  2048: "#09c",
};

export class PlayGame {
  boardWidth: number;
  boardHeight: number;
  gameStarted: Ref<boolean>;
  gameStatus: Ref<boolean>;
  gameBoard: GameBoardBox[][];

  constructor(width: number, height: number) {
    this.gameStarted = ref(false);
    this.gameStatus = ref(false);
    this.boardWidth = width;
    this.boardHeight = height;
    this.gameBoard = reactive(
      Array.from({ length: this.boardHeight }, (_, x) => {
        return Array.from({ length: this.boardWidth }, (_, y) => {
          return {
            boxId: x + "" + y,
            x,
            y,
            value: 0,
            added: false,
          };
        });
      })
    );
  }

  restartGame() {
    this.gameBoard.flat().forEach((_) => {
      _.value = 0;
      _.added = false;
    });
    this.initGame();
  }

  randomPosition() {
    return {
      randomX: Math.floor(Math.random() * (this.boardHeight - 1)),
      randomY: Math.floor(Math.random() * (this.boardWidth - 1)),
    };
  }

  randomNewValue() {
    return Math.random() > 0.99 ? 4 : 2;
  }

  appendNewNumber() {
    let randomX = this.randomPosition().randomX;
    let randomY = this.randomPosition().randomY;
    while (this.gameBoard[randomX][randomY].value) {
      randomX = this.randomPosition().randomX;
      randomY = this.randomPosition().randomY;
    }
    this.gameBoard[randomX][randomY].value = this.randomNewValue();
  }

  initGame() {
    this.appendNewNumber();
    this.appendNewNumber();
    this.appendNewNumber();
    this.gameStarted.value = true;
  }

  resetBoxes() {
    this.gameBoard.flat().forEach((_) => {
      _.added = false;
    });
  }

  getNextBox(currentDirection: number[], x: number, y: number) {
    if (
      x + currentDirection[0] > 3 ||
      x + currentDirection[0] < 0 ||
      y + currentDirection[1] < 0 ||
      y + currentDirection[1] > 3
    )
      return null;
    return this.gameBoard[x + currentDirection[0]][y + currentDirection[1]];
  }

  updateGameBoard(currentDirection: number[], x: number, y: number) {
    let currentBox = this.gameBoard[x][y];
    let nextBox = this.getNextBox(currentDirection, x, y);

    while (nextBox && nextBox.value === 0) {
      nextBox.value = currentBox.value;
      currentBox.value = 0;
      currentBox = nextBox;
      nextBox = this.getNextBox(currentDirection, currentBox.x, currentBox.y);
    }
    if (
      nextBox &&
      currentBox.value === nextBox.value &&
      !nextBox.added &&
      !currentBox.added
    ) {
      nextBox.value = nextBox.value * 2;
      nextBox.added = true;
      currentBox.value = 0;
      this.updateGameBoard(
        currentDirection,
        x + currentDirection[0],
        y + currentDirection[1]
      );
      return;
    }
  }

  goingUp() {
    console.log("fuck", this);
    for (let x = 0; x < this.boardWidth; x++) {
      for (let y = 0; y < this.boardHeight; y++) {
        console.log("hehe");
        this.updateGameBoard(directions["w"], x, y);
      }
    }
  }
  goingDown() {
    for (let x = 0; x < this.boardWidth; x++) {
      for (let y = this.boardHeight - 1; y >= 0; y--) {
        this.updateGameBoard(directions["s"], x, y);
      }
    }
  }
  goingLeft() {
    for (let x = 0; x < this.boardWidth; x++) {
      for (let y = 0; y < this.boardHeight; y++) {
        this.updateGameBoard(directions["a"], x, y);
      }
    }
  }
  goingRight() {
    for (let x = this.boardWidth - 1; x >= 0; x--) {
      for (let y = 0; y < this.boardHeight; y++) {
        this.updateGameBoard(directions["d"], x, y);
      }
    }
  }

  endGame() {
    return this.gameBoard.flat().every((_) => {
      return _.value !== 0;
    });
  }

  keyupHandler(e: KeyboardEvent) {
    if (e.key === "w") {
      this.goingUp();
    }
    if (e.key === "s") {
      this.goingDown();
    }
    if (e.key === "a") {
      this.goingLeft();
    }
    if (e.key === "d") {
      this.goingRight();
    }
    this.resetBoxes();
    this.appendNewNumber();
    this.gameStatus.value = this.endGame();
  }
}
