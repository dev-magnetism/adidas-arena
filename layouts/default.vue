<template>
  <div class="app">
    <AppCursor v-if="!$viewport.isMobile" />
    <!-- <AppPreloader /> -->
    <AppHeader />
    <nuxt class="app-main" />
    <AppScene />
    <WebglInfo v-if="!$viewport.isMobile" />
  </div>
</template>

<script>
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { mapState, mapMutations } from 'vuex'

export default {
  layout: 'DefaultLayout',

  data() {
    return {}
  },
  computed: {
    ...mapState({}),
  },

  watch: {},

  mounted() {
    this.$nuxt.$on('app:beforeEnter', this.onBeforeEnter)
  },

  beforeDestroy() {},
  methods: {
    onBeforeEnter() {
      ScrollTrigger.refresh()
    },

    ...mapMutations({
      // setFontsLoaded: 'setFontsLoaded',
    }),
  },
}
</script>

<style lang="scss">
.app {
  height: 100%;
  width: 100%;
  display: flex;
  flex: 1;
  flex-direction: column;

  &-main {
    z-index: 0;
  }
}
</style>
