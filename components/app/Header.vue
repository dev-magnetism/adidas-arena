<template>
  <div
    :class="{ reduced: headerReduced, white: headerWhite }"
    class="app-header"
    @click="onClickBurger"
  >
    <TP1 v-if="!$viewport.isMobile" weight="bold" class="app-header__menu">
      {{ menuName }}
    </TP1>
    <div class="app-header__burger" />
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      menuActive: (state) => state.menuActive,
      exteriorVisible: (state) => state.exteriorVisible,
      interiorVisible: (state) => state.interiorVisible,
      allLoadedFake: (state) => state.allLoadedFake,
      allLoadedActual: (state) => state.allLoadedActual,
      preloaderHidden: (state) => state.preloaderHidden,
      appContent: (state) => state.appContent,
      fontsLoaded: (state) => state.fontsLoaded,
      headerReduced: (state) => state.headerReduced,
      headerWhite: (state) => state.headerWhite,
    }),
    menuName() {
      return this.appContent.data.menu_name
    },
    headerNameMobile() {
      return this.appContent.data.header_name_mobile
    },
  },
  methods: {
    onClickBurger() {
      this.setMenuActive(!this.menuActive)
    },
    ...mapMutations({
      setMenuActive: 'setMenuActive',
    }),
  },
}
</script>

<style lang="scss">
.app-header {
  position: fixed;
  top: desktop-vw(75px);
  right: calc(var(--layout-margin) + 25px);
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: transform 0.65s var(--ease-out-cubic);
  will-change: transform;

  &.reduced {
    transform: translate(0%, -150%);
  }

  &.white {
    .app-header__menu.P1 {
      color: var(--c-grey) !important;
    }
    .app-header__burger::after,
    .app-header__burger::before {
      background-color: var(--c-grey);
    }
  }

  @include mobile {
    right: var(--layout-margin);
    top: mobile-vw(40px);
  }

  &__menu.P1 {
    font-size: 16px;
    line-height: 16px;
    text-transform: uppercase;
    margin-right: 20px;
    transition: color 0.4s var(--ease-out-cubic);
  }

  &__burger {
    display: flex;
    justify-content: center;
    align-items: center;
    outline: none;
    height: 20px;
    width: 30px;
    border: 0px;
    padding: 0px;
    background-color: transparent;

    &:before,
    &:after {
      content: '';
      width: 30px;
      height: 2px;
      position: absolute;
      background-color: black;
      transition: background-color 0.4s var(--ease-out-cubic);
    }

    &:before {
      transform: translateY(-4px);
    }

    &:after {
      transform: translateY(4px);
    }
  }
}
</style>
