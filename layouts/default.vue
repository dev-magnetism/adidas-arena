<template>
  <div class="app">
    <AppHeader />
    <!-- <AppScroller> -->
    <nuxt />
    <!-- </AppScroller>  -->
    <AppScene />
    <AppFooter />
    <AppPreloadLayer />
  </div>
</template>

<script>
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { mapState, mapMutations } from 'vuex'

export default {
  layout: 'DefaultLayout',
  // scrollToTop: true,
  data() {
    return {}
  },
  computed: {
    ...mapState({
      fontsLoaded: (state) => state.fontsLoaded,
    }),
  },

  watch: {},

  mounted() {
    this.$nuxt.$on('app:beforeEnter', this.onBeforeEnter)
  },

  beforeDestroy() {},
  methods: {
    onBeforeEnter() {
      ScrollTrigger.refresh()
      // console.log('before')
    },
    ...mapMutations({
      //   setProductGalleryOpen: 'setProductGalleryOpen',
      //   setNavbarHidden: 'setNavbarHidden',
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
  background-color: var(--c-beige);
}
</style>
