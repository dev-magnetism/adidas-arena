<template>
  <div class="app-header" @click="onClickBurger">
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
      menuOpen: (state) => state.menuOpen,
      menuActive: (state) => state.menuActive,
      exteriorVisible: (state) => state.exteriorVisible,
      interiorVisible: (state) => state.interiorVisible,
      allLoadedFake: (state) => state.allLoadedFake,
      allLoadedActual: (state) => state.allLoadedActual,
      preloaderHidden: (state) => state.preloaderHidden,
      appContent: (state) => state.appContent,
      fontsLoaded: (state) => state.fontsLoaded,
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
      setMenuOpen: 'setMenuOpen',
      setMenuActive: 'setMenuActive',
    }),
  },
}
</script>

<style lang="scss">
.app-header {
  position: fixed;
  top: desktop-vw(70px);
  right: calc(var(--layout-margin) + 25px);
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  @include mobile {
    right: var(--layout-margin);
    top: mobile-vw(25px);
  }

  &__menu {
    font-size: 16px;
    line-height: 16px;
    @include font-adihausDIN-cn-medium();
    text-transform: uppercase;
    margin-right: 20px;
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
    background: transparent;

    &:before,
    &:after {
      content: '';
      width: 30px;
      height: 2px;
      position: absolute;
      background: black;
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
