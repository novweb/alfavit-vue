<script setup lang="ts">
import { PropType, computed } from 'vue'
import { useAlphabet } from '/~/composables/use-alphabet'
import { useAudio } from '/~/composables/use-audio'
import { useColors } from '/~/composables/use-colors'
import { IAlphabetItem } from '/~/state/alfavit'

const props = defineProps({
  subKey: {
    type: Number,
    default: 0,
  },
  letter: {
    type: Object as PropType<IAlphabetItem>,
    required: true,
  }
})

const { alphabetAudio } = useAudio()
const { getBackgroundColor, currentColor, shadeColor, textColor } = useColors()
const { activeLetter, setActiveLetter, unsetActiveLetter } = useAlphabet()

const isActive = computed(() => props.letter.letter === activeLetter.value)
const isSilenced = computed(() => activeLetter.value !== null && !isActive.value)

const animationDuration = props.letter.audio[1] / 1000
const color = props.subKey % 2 == 0 ? currentColor.value.primary : shadeColor(currentColor.value.primary, -20)

function run() {
  if (alphabetAudio.value?.playing() && isActive.value) return

  unsetActiveLetter()

  if (alphabetAudio.value?.playing()) alphabetAudio.value?.pause()

  setActiveLetter(props.letter.letter)

  alphabetAudio.value?.play(props.letter.letter)
}
</script>

<template>
  <div
    class="transition-all duration-200 rounded shadow cursor-pointer aspect-square alpha__letter"
    :style="{
      '--animate-duration': `${animationDuration}s`,
      background: getBackgroundColor(subKey),
      color,
    }"
    @click="run"
  >
    <div
      class="flex items-center justify-center w-full h-full transition-all duration-200 transform font-joy"
      :class="{
        'scale-125': isActive,
        'opacity-30': isSilenced,
      }"
    >
      <span
        class="transition-all duration-200 transform"
        :class="{
          'animate__animated animate__rubberBand animate__infinite': isActive,
        }"
        :style="{
          color: textColor
        }"
      >
        {{ letter.letter }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.alpha__letter {
  font-size: calc(100vw / 14);
}

@media (orientation: portrait) {
  .alpha__letter {
    font-size: calc(100vw / 10);
  }
}
</style>
