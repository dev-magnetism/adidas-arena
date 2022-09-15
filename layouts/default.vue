<template>
  <div class="app">
    <AppHeader />
    <AppScroller>
      <nuxt />
    </AppScroller>
    <AppFooter />
    <AppPreloadLayer />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  layout: 'DefaultLayout',
  data() {
    return {}
  },
  computed: {
    ...mapState({
      //   background: (state) => state.background,
    }),
  },

  watch: {},

  mounted() {},

  beforeDestroy() {},
  methods: {
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
