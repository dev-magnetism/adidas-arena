<template>
  <div :class="{ hidden: hidden || menuActive }" class="app-scrollbar">
    <span ref="indicator" />
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      hidden: true,
    }
  },
  computed: {
    ...mapState({
      menuOpen: (state) => state.menuOpen,
      menuActive: (state) => state.menuActive,
    }),
  },
  mounted() {
    if (this.$viewport.isMobile) return

    this.$nuxt.$on('app:scroll', this.onScroll)
  },
  beforeDestroy() {
    if (this.$viewport.isMobile) return

    this.$nuxt.$off('app:scroll', this.onScroll)
  },
  methods: {
    onScroll({ progress, velocity }) {
      if (this.$viewport.isMobile) return

      this.hidden = Math.abs(velocity) <= 0.25

      this.$refs.indicator.style.transform = `translate3d(0,${
        progress * (this.$viewport.height - 65)
      }px,0)` // 65 === indicator height
    },
  },
}
</script>

<style lang="scss">
.app-scrollbar {
  position: fixed;
  right: 4px;
  width: 8px;
  height: 100vh;
  z-index: 9;
  transition: opacity 0.25s var(--ease-in-out-cubic);

  @include mobile {
    display: none;
  }

  &.hidden {
    opacity: 0;
  }

  span {
    width: 100%;
    height: 65px;
    background: var(--c-black);
    display: block;
  }
}
</style>
