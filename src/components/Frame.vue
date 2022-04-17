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
      <menu-vue />
    </template>

    <loader-vue v-else />
  </div>
</template>
