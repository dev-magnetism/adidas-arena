<template>
  <div class="app-header">
    <nuxt-link class="app-header__home" to="/">
      <SvgArenaLogo class="app-header__logo" />
    </nuxt-link>

    <div class="app-header__cta" @click="onClickBurger">
      <TP1 v-if="!$viewport.isMobile" weight="bold" class="app-header__menu">
        {{ menuName }}
      </TP1>
      <div class="app-header__burger">
        <span class="app-header__burger__line top" />
        <span class="app-header__burger__line bottom" />
      </div>
    </div>
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
      // if (this.menuActive) return

      this.setMenuActive(!this.menuActive)

      // if (window.lenis) {
      //   if (this.menuActive) {
      //     window.lenis.stop()
      //   } else {
      //     window.lenis.start()
      //   }
      // }
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
  top: desktop-vw(60px);
  left: 0%;
  z-index: 2;
  width: 100vw;
  padding-left: calc(var(--layout-margin) + 25px);
  padding-right: calc(var(--layout-margin) + 25px);
  display: flex;
  align-items: center;
  justify-content: center;
  height: 35px;

  @include mobile {
    padding-left: var(--layout-margin);
    padding-right: var(--layout-margin);
    top: mobile-vw(25px);
  }

  &__logo {
    cursor: pointer;

    @include mobile {
      width: 80%;
    }
  }

  &__home {
    @include mobile {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  &__cta {
    margin-left: auto;
    display: flex;
    position: absolute;
    right: calc(var(--layout-margin) + 25px);
    cursor: pointer;

    @include mobile {
      position: absolute;
      right: var(--layout-margin);
    }
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
    flex-direction: column;
    justify-content: space-evenly;

    @include mobile {
      min-height: 15px;
    }

    &__line {
      display: block;
      width: 30px;
      height: 2px;
      background: black;
    }
  }
}
</style>
