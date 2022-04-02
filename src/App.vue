<script lang="ts">
import { defineComponent, reactive, ref } from "vue";

type KeyupEvent = {
  w: () => void;
  s: () => void;
  d: () => void;
  a: () => void;
};

const colorSheet: Record<number, string> = {
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

const directions = {
  d: [1, 0],
  a: [-1, 0],
  w: [0, -1],
  s: [0, 1],
};

export default defineComponent({
  setup() {
    const gameStarted = ref(false);
    const gameStatus = ref(false);
    const boardWidth = 4;
    const boardHeight = 4;
    const gameBoard = reactive(
      Array.from({ length: boardHeight }, (_, x) => {
        return Array.from({ length: boardWidth }, (_, y) => {
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

    const initGame = () => {
      appendNewNumber();
      appendNewNumber();
      appendNewNumber();
      gameStarted.value = true;
    };

    const restartGame = () => {
      gameBoard.flat().forEach((_) => {
        _.value = 0;
        _.added = false;
      });
      initGame();
    };

    const randomPosition = () => {
      return {
        randomX: Math.floor(Math.random() * (boardHeight - 1)),
        randomY: Math.floor(Math.random() * (boardWidth - 1)),
      };
    };

    const randomNewValue = () => {
      return Math.random() > 0.99 ? 4 : 2;
    };

    const appendNewNumber = () => {
      let randomX = randomPosition().randomX;
      let randomY = randomPosition().randomY;
      while (gameBoard[randomX][randomY].value) {
        randomX = randomPosition().randomX;
        randomY = randomPosition().randomY;
      }
      gameBoard[randomX][randomY].value = randomNewValue();
    };

    const resetBoxes = () => {
      gameBoard.flat().forEach((_) => {
        _.added = false;
      });
    };

    const getNextBox = (currentDirection: number[], x: number, y: number) => {
      if (
        x + currentDirection[0] > 3 ||
        x + currentDirection[0] < 0 ||
        y + currentDirection[1] < 0 ||
        y + currentDirection[1] > 3
      )
        return false;
      return gameBoard[x + currentDirection[0]][y + currentDirection[1]];
    };

    const updateGameBoard = (
      currentDirection: number[],
      x: number,
      y: number
    ) => {
      let currentBox = gameBoard[x][y];
      let nextBox = getNextBox(currentDirection, x, y);

      while (nextBox && nextBox.value === 0) {
        nextBox.value = currentBox.value;
        currentBox.value = 0;
        currentBox = nextBox;
        nextBox = getNextBox(currentDirection, currentBox.x, currentBox.y);
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
        updateGameBoard(
          currentDirection,
          x + currentDirection[0],
          y + currentDirection[1]
        );
        return;
      }
    };

    const goingUp = () => {
      for (let x = 0; x < boardWidth; x++) {
        for (let y = 0; y < boardHeight; y++) {
          updateGameBoard(directions["w"], x, y);
        }
      }
    };
    const goingDown = () => {
      for (let x = 0; x < boardWidth; x++) {
        for (let y = boardHeight - 1; y >= 0; y--) {
          updateGameBoard(directions["s"], x, y);
        }
      }
    };
    const goingLeft = () => {
      for (let x = 0; x < boardWidth; x++) {
        for (let y = 0; y < boardHeight; y++) {
          updateGameBoard(directions["a"], x, y);
        }
      }
    };
    const goingRight = () => {
      for (let x = boardWidth - 1; x >= 0; x--) {
        for (let y = 0; y < boardHeight; y++) {
          updateGameBoard(directions["d"], x, y);
        }
      }
    };

    const endGame = () => {
      return gameBoard.flat().every((_) => {
        return _.value !== 0;
      });
    };

    const keyupEvent: KeyupEvent = {
      d: goingRight,
      a: goingLeft,
      w: goingUp,
      s: goingDown,
    };

    document.addEventListener("keyup", (e) => {
      if (e.key === "w") {
        keyupEvent["w"]();
      }
      if (e.key === "s") {
        keyupEvent["s"]();
      }
      if (e.key === "a") {
        keyupEvent["a"]();
      }
      if (e.key === "d") {
        keyupEvent["d"]();
      }
      resetBoxes();
      appendNewNumber();
      console.log(endGame());
      gameStatus.value = endGame();
    });

    return {
      gameBoard,
      gameStarted,
      colorSheet,
      initGame,
      restartGame,
    };
  },
});
</script>

<template>
  <div
    class="absolute inset-0 flex justify-center items-center bg-slate-500/50"
    v-show=""
  >
    <span class="text-red-600 text-3xl uppercase font-extrabold">
      game over
    </span>
  </div>
  <header>
    <h1 class="text-3xl font-bold underline">2048</h1>
    
  </header>

  <div class="flex justify-center items-center py-10">
    <div v-for="(col, i) in gameBoard" :key="i" class="w-20 h-20">
      <div>
        <div
          v-for="(box, j) in col"
          :key="j"
          class="w-20 h-20 border-2 flex justify-center items-center font-semibold text-lg"
          :style="{ 'background-color': colorSheet[box.value] }"
        >
          <Transition name="bounce">
            <span v-show="box.value > 0">
              {{ box.value }}
            </span>
          </Transition>
        </div>
      </div>
    </div>
  </div>
  <footer class="absolute bottom-1/4 left-0 w-full">
    <div class="flex justify-center mb-4">
      <button
        @click="initGame"
        :disabled="gameStarted"
        class="border-2 font-semibold border-neutral-700 text-neutral-700 px-2 py-1 rounded mx-1 disabled:opacity-75 disabled:border-gray-400 disabled:text-gray-400"
      >
        Start
      </button>
      <button
        @click="restartGame"
        class="border-2 font-semibold border-neutral-700 text-neutral-700 px-2 py-1 rounded mx-1 disabled:opacity-75"
      >
        Reset
      </button>
    </div>
    <pre>press W, A, S, D to slide.</pre>
  </footer>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.bounce-enter-active {
  animation: bounce-in 0.5s;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}
</style>
