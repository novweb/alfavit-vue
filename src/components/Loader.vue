<script>
export default {
  name: 'LoaderVue',
  inheritAttrs: false,
  customOptions: {}
}
</script>

<template>
  <div class="flex items-center justify-center w-full h-full font-joy loader__text">
    Загружаемся...
  </div>
</template>

<style scoped>
.loader__text {
  font-size: 2rem;
  text-align: center;
  line-height: 100vh;
  color: #fcedd8;
  font-weight: 700;
  text-shadow: 0.05em 0.05em 0px #eb452b,
               0.1em 0.1em 0px #efa032,
               0.15em 0.15em 0px #46b59b,
               0.2em 0.2em 0px #017e7f,
               0.25em 0.25em 0px #052939,
               0.3em 0.3em 0px #c11a2b,
               0.35em 0.35em 0px #c11a2b,
               0.4em 0.4em 0px #c11a2b,
               0.45em 0.45em 0px #c11a2b;
}
</style>
