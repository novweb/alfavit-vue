import { reactive, toRef } from "vue"

const state = reactive({
  activeLetter: null
} as {
  activeLetter: string | null
})

function setActiveLetter(value: string) {
  state.activeLetter = value
}

function unsetActiveLetter() {
  state.activeLetter = null
}

export function useAlphabet() {
  return {
    activeLetter: toRef(state, 'activeLetter'),
    setActiveLetter,
    unsetActiveLetter,
  }
}
