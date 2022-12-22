<template>
  <div class="app-header">
    <nuxt-link v-if="!$viewport.isMobile" to="/">
      <SvgArenaLogo class="app-header__logo" />
    </nuxt-link>

    <TH3 v-else class="app-header__mobile-logo">
      <nuxt-link to="/">{{ headerNameMobile }}</nuxt-link>
    </TH3>
    <div class="app-header__cta" @click="onClickBurger">
      <p v-if="!$viewport.isMobile" class="app-header__menu">{{ menuName }}</p>
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

  &__mobile-logo {
    font-size: mobile-vw(26px);
    line-height: mobile-vw(26px);
  }

  &__logo {
    // margin-left: auto;
    cursor: pointer;
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
    @include font-tuskerGrotesk-medium();
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

  a {
    @include p1();
    text-transform: uppercase;
    @include font-adihausDIN-bold();

    margin-right: desktop-vw(10px);

    &:last-child {
      margin-right: 0px;
    }
  }
}
</style>
