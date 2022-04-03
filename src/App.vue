<script lang="ts">
import { defineComponent, onMounted } from "vue";
import { PlayGame, colorSheet } from "@/composable/logic";

export default defineComponent({
  setup() {
    const game = new PlayGame(4, 4);
    onMounted(() => {
      document.addEventListener("keyup", (e) => {
        game.keyupHandler(e);
      });
    });
    return {
      colorSheet,
      game,
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
    <div v-for="(col, i) in game.gameBoard" :key="i" class="w-20 h-20">
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
        @click="game.initGame"
        :disabled="game.gameStarted.value"
        class="border-2 font-semibold border-neutral-700 text-neutral-700 px-2 py-1 rounded mx-1 disabled:opacity-75 disabled:border-gray-400 disabled:text-gray-400"
      >
        Start
      </button>
      <button
        @click="game.restartGame"
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
