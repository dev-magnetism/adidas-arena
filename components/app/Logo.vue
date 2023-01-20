<template>
  <nuxt-link
    :class="{ reduced: headerReduced, white: headerWhite }"
    class="app-header__logo"
    to="/"
  >
    <SvgArenaLogo />
  </nuxt-link>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      headerReduced: (state) => state.headerReduced,
      headerWhite: (state) => state.headerWhite,
    }),
  },
}
</script>

<style lang="scss">
.app-header__logo {
  position: fixed;
  top: desktop-vw(60px);
  left: 50%;
  z-index: 2;
  transform: translate(-50%, 0%);
  transition: transform 0.65s var(--ease-out-cubic);
  will-change: transform;

  &.reduced {
    transform: translate(-50%, -85%);
  }

  &.white {
    svg g {
      fill: #f5f5f3;
    }
  }

  @include mobile {
    top: mobile-vw(25px);
  }

  svg {
    cursor: pointer;

    g {
      transition: fill 0.4s var(--ease-out-cubic);
    }

    @include mobile {
      width: 80%;
    }
  }
}
</style>
