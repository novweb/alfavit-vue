import { computed, reactive, toRef } from 'vue'
import { colors } from '/~/state/colors'

const state = reactive<{
  color: { primary: string, secondary: string }
}>({
  color: getRandomColor()
})

const textColor = computed(() => state.color.primary)
const backgroundColor = computed(() => shadeColor(state.color.secondary, 100))

function getRandomColor() {
  return colors[Math.floor(Math.random() * colors.length)]
}

function updateColor() {
  state.color = getRandomColor()
}

function getBackgroundColor(key: number) {
  if (!state.color) return ''

  const backgroundColor = state.color?.secondary

  let odd = key % 2 === 0

  if (key >= 30) odd = !odd
  if (odd) {
    return `linear-gradient(
      18deg,
      ${backgroundColor},
      ${convertHexToRGBA(backgroundColor, 80)}
    )`
  }

  return `linear-gradient(
    18deg,
    ${backgroundColor},
    ${backgroundColor}
  )`
  // return `linear-gradient(
  //       18deg,
  //       ${backgroundColor},
  //       ${convertHexToRGBA(backgroundColor, 80)}
  //     )`;
}

function convertHexToRGBA(hexCode: string, opacity: number): string {
  let hex = hexCode.replace('#', '')

  if (hex.length === 3) {
    hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`
  }

  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)

  return `rgba(${r},${g},${b},${opacity / 100})`
}

function shadeColor(hexCode: string, percent: number) {
  let hex = hexCode.replace('#', '')

  if (hex.length === 3) {
    hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`
  }

  let r = parseInt(hex.substring(0, 2), 16)
  let g = parseInt(hex.substring(2, 4), 16)
  let b = parseInt(hex.substring(4, 6), 16)

  r = (r * (100 + percent)) / 100
  g = (g * (100 + percent)) / 100
  b = (b * (100 + percent)) / 100

  r = r < 255 ? r : 255
  g = g < 255 ? g : 255
  b = b < 255 ? b : 255

  const Rr = r.toString(16).length === 1 ? `0${r.toString(16)}` : r.toString(16)
  const Gg = g.toString(16).length === 1 ? `0${g.toString(16)}` : g.toString(16)
  const Bb = b.toString(16).length === 1 ? `0${b.toString(16)}` : b.toString(16)

  return `#${Rr}${Gg}${Bb}`
}

export function useColors() {
  return {
    currentColor: toRef(state, 'color'),
    textColor,
    backgroundColor,
    shadeColor,
    updateColor,
    getBackgroundColor,
  }
}
