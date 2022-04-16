import { onMounted, reactive, toRef } from 'vue'
import { Howl, SoundSpriteDefinitions } from 'howler'
import { alphabet } from '/~/state/alfavit'
import { useAlphabet } from '/~/composables/use-alphabet'

const ALPHABET_AUDIO_FILE_PATH = './audio/alfa.mp3'
const BACKGROUND_AUDIO_FILE_PATH = './audio/background.mp3'
const sprite = getAuditSprite()

const state = reactive<{
  audioReady: boolean
  backgroundAudioPlaying: boolean
  backgroundAudioReady: boolean
  alphabetAudio: Howl
  backgroundAudio: Howl
}>({
  audioReady: false,
  backgroundAudioReady: false,
  backgroundAudioPlaying: false,
  alphabetAudio: new Howl({
    src: [ALPHABET_AUDIO_FILE_PATH],
    sprite,
    onload() {
      state.audioReady = true
    },
  }),
  backgroundAudio: new Howl({
    src: [BACKGROUND_AUDIO_FILE_PATH],
    autoplay: false,
    loop: true,
    volume: 0.2,
    onload() {
      state.backgroundAudioReady = true
      state.backgroundAudioPlaying = state.backgroundAudio.playing()
    },
    onplay() {
      state.backgroundAudioPlaying = true
    },
    onpause() {
      state.backgroundAudioPlaying = false
    }
  })
})

function getAuditSprite(): SoundSpriteDefinitions {
  const result = {} as { [x: string]: [number, number] }

  alphabet.forEach(letterRecord => {
    result[letterRecord.letter] = letterRecord.audio || [0, 0]
  })

  return result
}

function toggleBackgroundSound() {
  if (state.backgroundAudio.playing()) {
    state.backgroundAudio.pause()
  } else {
    state.backgroundAudio.play()
  }
}

export function useAudio() {
  const { unsetActiveLetter } = useAlphabet()

  onMounted(() => {
    ['end', 'stop']
      .forEach((event) => {
        state.alphabetAudio.on(event, unsetActiveLetter)
      })
  })

  return {
    isReadyAudio: toRef(state, 'audioReady'),
    isReadyBackgroundAudio: toRef(state, 'backgroundAudioReady'),
    isPlayingBackgroundAudio: toRef(state, 'backgroundAudioPlaying'),
    alphabetAudio: toRef(state, 'alphabetAudio'),
    backgroundAudio: toRef(state, 'backgroundAudio'),
    toggleBackgroundSound,
  }
}
