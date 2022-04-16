<script setup lang="ts">
import { computed } from 'vue'
import { useAudio } from '/~/composables/use-audio'
import { colors } from '/~/state/colors'
import LoaderVue from './Loader.vue'
import AlphabetVue from './Alphabet.vue'
import MenuVue from './Menu.vue'

const { isReadyAudio, isReadyBackgroundAudio } = useAudio()
const isReady = computed(() => isReadyAudio.value && isReadyBackgroundAudio.value)
</script>

<template>
  <div class="w-full min-h-full">
    <template v-if="isReady">
      <alphabet-vue />
      <div v-if="false">
        <div
          v-for="col in colors"
          class="relative flex items-center justify-center m-8 rounded aspect-square font-joy"
          :style="{
            color: col.primary,
            backgroundColor: col.secondary,
          }"
        >
          <pre class="absolute top-0 left-0 text-sm">{{ col }}</pre>

          <span class="text-6xl ">
            А
          </span>
        </div>
      </div>
      <menu-vue />
    </template>

    <loader-vue v-else />
  </div>
</template>
