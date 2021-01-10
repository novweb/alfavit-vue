<template>
  <div id="app"
    :class="{
      'is-loader': showLetters,
      'is-portrait': !orientationIsLanding,
    }"
  >
    <div class="loader" v-if="!showLetters">
      Загружаемся...
    </div>

    <template v-if="showLetters">
      <div
        class="letter-box"
        v-for="(letter, key) in alfavit"
        :key="key"
        :style="{
          '--animate-duration': `${alfavitSource[letter].audio[1] / 1000}s`,
          background: getBackgroundColor(key),
          color: (key % 2 == 0)
            ? colorSet.letter
            : shadeColor(colorSet.letter, -20),
        }"
        @click="letterRun(letter)"
      >
        <div
          class="letter-box__inset"
          :class="{
            'letter-box__inset--active': letter === activeLetter,
            'letter-box__inset--silenced': activeLetter !== '' && letter !== activeLetter
          }"
        >
          <span
            :class="{
              'animate__animated animate__rubberBand animate__infinite': letter === activeLetter,
            }"
          >{{ letter }}</span>
        </div>
      </div>
    </template>

    <div class="controll" v-if="showLetters" @click="changeColor()">
      <img src="./assets/001-brush.svg" alt="" />
    </div>

    <div class="controlr" v-if="showLetters" @click="toggleBackgroundSound()">
      <img src="./assets/002-headphones.svg" alt="" :class="{'is-playing': backgroundAudioPlaying}">
    </div>
  </div>
</template>

<script>
import 'animate.css';
import { Howl } from 'howler';
import alfavitSource from './alfavit.json';

const getAudioSpriteFromJSON = (alfaSource) => {
  const result = {};
  Object.keys(alfaSource).forEach((bukva) => {
    result[bukva] = alfaSource[bukva].audio || [0, 0];
  });
  return result;
};

const audioSprite = getAudioSpriteFromJSON(alfavitSource);

const optimizedResize = (() => {
  const callbacks = [];
  let running = false;

  // run the actual callbacks
  function runCallbacks() {
    callbacks.forEach((callback) => {
      callback();
    });

    running = false;
  }

  // fired on resize event
  function resize() {
    if (!running) {
      running = true;

      if (window.requestAnimationFrame) {
        window.requestAnimationFrame(runCallbacks);
      } else {
        setTimeout(runCallbacks, 66);
      }
    }
  }

  // adds callback to loop
  function addCallback(callback) {
    if (callback) {
      callbacks.push(callback);
    }
  }

  return {
    // public method to add additional callback
    add(callback) {
      if (!callbacks.length) {
        window.addEventListener('resize', resize);
      }
      addCallback(callback);
    },
  };
})();

export default {
  name: 'App',

  data() {
    return {
      activeLetter: '',
      showLetters: false,
      alfavitSource,
      alfavit: Object.keys(alfavitSource),
      alfaAudio: null,
      alfaAudioLoaded: false,
      backgroundAudio: null,
      backgroundAudioPlaying: false,
      backgroundAudioLeaded: false,
      colorSet: null,
      orientationIsLanding: true,
    };
  },

  computed: {
    colors() {
      return this.alfavit.map((letter) => alfavitSource[letter].colors) || [];
    },
  },

  methods: {
    toggleBackgroundSound() {
      console.log(this.alfaAudio.playing());
      if (this.backgroundAudio.playing()) {
        this.backgroundAudio.pause();
        this.backgroundAudioPlaying = false;
      } else {
        this.backgroundAudio.play();
        this.backgroundAudioPlaying = true;
      }
    },

    getBackgroundColor(key) {
      const { colorSet } = this;
      let odd = (key % 2 === 0);
      if (key >= 30) odd = !odd;
      if (odd) {
        return `linear-gradient(
          18deg,
          ${colorSet.background},
          ${this.convertHexToRGBA(colorSet.background, 80)}
        )`;
      }
      return `linear-gradient(
            -98deg,
            ${this.shadeColor(colorSet.background, 10)},
            ${this.convertHexToRGBA(this.shadeColor(colorSet.background, 10), 80)}
            )`;
    },

    convertHexToRGBA(hexCode, opacity) {
      let hex = hexCode.replace('#', '');

      if (hex.length === 3) {
        hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
      }

      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);

      return `rgba(${r},${g},${b},${opacity / 100})`;
    },

    shadeColor(hexCode, percent) {
      let hex = hexCode.replace('#', '');

      if (hex.length === 3) {
        hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
      }

      let r = parseInt(hex.substring(0, 2), 16);
      let g = parseInt(hex.substring(2, 4), 16);
      let b = parseInt(hex.substring(4, 6), 16);

      r = parseInt((r * (100 + percent)) / 100, 10);
      g = parseInt((g * (100 + percent)) / 100, 10);
      b = parseInt((b * (100 + percent)) / 100, 10);

      r = (r < 255) ? r : 255;
      g = (g < 255) ? g : 255;
      b = (b < 255) ? b : 255;

      const Rr = ((r.toString(16).length === 1) ? `0${r.toString(16)}` : r.toString(16));
      const Gg = ((g.toString(16).length === 1) ? `0${g.toString(16)}` : g.toString(16));
      const Bb = ((b.toString(16).length === 1) ? `0${b.toString(16)}` : b.toString(16));

      return `#${Rr}${Gg}${Bb}`;
    },

    changeColor() {
      this.colorSet = this.colors[Math.floor(Math.random() * this.colors.length)];
    },

    letterRun(letter) {
      const self = this;
      this.activeLetter = '';
      if (this.alfaAudio.playing()) this.alfaAudio.pause();

      this.activeLetter = letter;

      ['end', 'stop'].forEach((ev) => {
        this.alfaAudio.on(ev, () => {
          self.activeLetter = '';
        });
      });

      this.alfaAudio.play(letter);
    },

    checkOrientation() {
      this.orientationIsLanding = (window.innerWidth > window.innerHeight);
    },
  },

  mounted() {
    const self = this;
    this.alfaAudio = new Howl({
      src: [
        './audio/alfa.mp3',
        './audio/alfa.webm',
      ],
      sprite: audioSprite,
      onload() {
        self.alfaAudioLoaded = true;
      },
    });

    this.backgroundAudio = new Howl({
      src: [
        './audio/background.mp3',
        './audio/background.webm',
      ],
      autoplay: true,
      loop: true,
      volume: 0.3,
      onload() {
        console.log('pip');
        self.backgroundAudioLeaded = true;

        setTimeout(() => {
          self.backgroundAudioPlaying = self.backgroundAudio.playing();
        }, 100);
      },
    });

    this.$watch((vm) => [vm.alfaAudioLoaded, vm.backgroundAudioLeaded], (val) => {
      if (val[0] && val[1]) {
        self.showLetters = true;
      }
    }, {
      immediate: true,
      deep: true,
    });

    this.changeColor();

    optimizedResize.add(() => {
      self.checkOrientation();
    });

    this.checkOrientation();
  },
};
</script>

<style lang="scss">
@font-face {
    font-family: 'Junegull';
    src: url('./assets/fonts/subset-Junegull-Regular.woff2') format('woff2'),
        url('./assets/fonts/subset-Junegull-Regular.woff') format('woff');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
}

body {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  margin: 0;
  user-select: none;
}

#app {
  width: 100vw;
  height: 100vh;

  &:not(.is-loader) {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #F6AFBB;
  }

  .loader {
    font-family: 'Junegull';
    font-size: 5vw;
    color: #4247A7;
  }

  &.is-loader {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr 1fr 1fr;
    gap: 0px 0px;
    grid-template-areas:
      ". . . . . . ."
      ". . . . . . ."
      ". . . . . . ."
      ". . . . . . ."
      "controll . . . . . controlr";

      &.is-portrait {
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
        grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
        gap: 0px 0px;
        grid-template-areas:
          ". . . . ."
          ". . . . ."
          ". . . . ."
          ". . . . ."
          ". . . . ."
          ". . . . ."
          "controll . . . controlr";
      }
  }
}
.controlr {
  // background: linear-gradient(18deg, #e37682, #a58fe9);
  background: #F6AFBB;
  grid-area: controlr;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    max-width: 50%;
    transition: all 200ms ease-in-out;

    &:not(.is-playing) {
      filter: grayscale(1);
    }
  }
}
.controll {
  // background: linear-gradient(18deg, #e37682, #a58fe9);
  background: #F6AFBB;
  grid-area: controll;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    max-width: 50%;
  }
}
.letter-box {
  // border-radius: 50%;
  cursor: pointer;
  height: calc(100vh / 5);
  font-size: calc(100vw / 14);

  @media (orientation: portrait) {
    height: calc(100vh / 7);
    font-size: calc(100vw / 10);
  }

  &__inset {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 200ms ease-in-out;
    opacity: 1;

    &--active {
      transform: scale(1.3);
    }

    &--silenced {
      opacity: .3;
    }
  }

  span {
    transition: transform 200ms ease-in-out;
    font-family: 'Junegull';
  }

  &:hover {
    > div {
      transform: scale(1.3);
    }
  }
}
</style>
