<script lang="ts">
import { computed, defineComponent, reactive } from "vue";
import { random } from "gsap/all";
import { colorSheet } from "@/assets/colorSheet.ts";

export default defineComponent({
  setup() {
    const boardWidth = 4;
    const boardHeight = 4;
    const gameBoard = reactive(
      Array.from({ length: boardHeight }, (_, y) => {
        return Array.from({ length: boardWidth }, (_, x) => {
          return { boxId: y * 10 + x, value: 0, added: false };
        });
      })
    );

    const randomPosition = () => {
      return {
        randomX: Math.floor(random(0, boardHeight - 1)),
        randomY: Math.floor(random(0, boardWidth - 1)),
      };
    };

    const randomNewValue = () => {
      return random([2, 4]);
    };

    const boxColor = computed((boxValue) => {
      return colorSheet[boxValue];
    });

    const initGame = () => {
      const { randomX, randomY } = randomPosition();
      console.log(randomX, randomY);
      if (gameBoard[randomX][randomY].value) return;
      gameBoard[randomX][randomY].value = randomNewValue();
      console.log(
        gameBoard[randomX][randomY],
        gameBoard[randomX][randomY].boxId
      );
    };
    return {
      gameBoard,
      boxColor,
      initGame,
    };
  },
});
</script>

<template>
  <header>
    <h1 class="text-3xl font-bold underline">2048</h1>
    <button @click="initGame">開始遊戲</button>
  </header>
  <div class="flex justify-center items-center py-10">
    <div v-for="(row, i) in gameBoard" :key="i" class="w-20 h-20">
      <div>
        <div
          v-for="(col, j) in row"
          :key="j"
          class="w-20 h-20 border-2 flex justify-center items-center"
          style="background-color: {{ boxColor(col.value) }}"
        >
          {{ col.value }}
        </div>
      </div>
    </div>
  </div>
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
</style>
