<template>
  <div
    :class="{
      reduced: headerReduced,
      hide: headerHide || overlayContactOpen,
    }"
    class="app-header"
    @click.stop="() => {}"
  >
    <a
      v-if="this.webview !== 'ok'"
      :class="{ reduced: headerReduced, white: headerWhite }"
      class="app-header__logo"
      href="/"
    >
      <TH1 :tag="$route.name === 'index' ? 'h1' : 'p'">Adidas Arena</TH1>
      <SvgArenaLogo />
    </a>

    <div
      v-else
      :class="{ reduced: headerReduced, white: headerWhite }"
      class="app-header__logo"
      >
      <TH1 :tag="$route.name === 'index' ? 'h1' : 'p'">Adidas Arena</TH1>
      <SvgArenaLogo />
    </div>

    <div class="app-header__nav" v-if="this.webview !== 'ok'">
      <nuxt-link
        :class="{ reduced: headerReduced, white: headerWhite }"
        class="pbb"
        to="/paris-basketball"
      >
        <img v-if="headerWhite" src="/imgs/logo-pbb-white.svg" alt="Paris Basketball" />
        <img v-else src="/imgs/logo-pbb-color.svg" alt="Paris Basketball" />
      </nuxt-link>
      <nuxt-link
        v-for="(item, i) in navItems"
        :key="i"
        :class="{ reduced: headerReduced, white: headerWhite }"
        :to="item.Link"
      >
        <TP1 weight="bold" :color="headerWhite ? 'grey' : 'black'">
          {{ item.Label }}
        </TP1>
      </nuxt-link>
    </div>

    <div
      v-if="this.webview !== 'ok'"
      :class="{ reduced: headerReduced, white: headerWhite }"
      class="app-header__burger"
      @click="setMenuActive(true)"
    >
      <TP1
        weight="bold"
        class="app-header__burger__menu"
        :color="headerWhite ? 'grey' : 'black'"
      >
        {{ menuName }}
      </TP1>
      <div class="app-header__burger__icon" />
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default {
  computed: {
    ...mapState({
      menuContent: (state) => state.menuContent,
      menuActive: (state) => state.menuActive,
      appContent: (state) => state.appContent,
      headerReduced: (state) => state.headerReduced,
      headerWhite: (state) => state.headerWhite,
      headerHide: (state) => state.headerHide,
      overlayContactOpen: (state) => state.overlayContactOpen,
      interiorVisible: (state) => state.interiorVisible,
      exteriorVisible: (state) => state.exteriorVisible,
      webview: (state) => state.webview
    }),
    menuName() {
      return this.appContent.data.menu_name
    },
    menuBusiness() {
      return this.menuContent.data.find((el) => el.business)
    },
    menuProgrammation() {
      return this.menuContent.data.find((el) => el.programmation)
    },
    navItems() {
      return this.appContent.data.header_nav
    },
    headerNameMobile() {
      return this.appContent.data.header_name_mobile
    },
  },

  mounted() {
    this.$nuxt.$on(
      'global:forceInitScrollTrigger',
      this.onForceInitScrollTrigger
    )

    this.initScrollTrigger()
  },
  beforeDestroy() {
    this.$nuxt.$off(
      'global:forceInitScrollTrigger',
      this.onForceInitScrollTrigger
    )

    this.scrollTrigger?.kill()
  },
  methods: {
    onForceInitScrollTrigger() {
      this.scrollTrigger?.kill()
      this.initScrollTrigger()
    },
    initScrollTrigger() {
      this.scrollTrigger = ScrollTrigger.create({
        trigger: this.$el,
        start: 'top+=20px top',
        end: 'max',
        fastScrollEnd: true,
        onEnter: (e) => {
          this.setHeaderReduced(true)
        },
        onLeaveBack: (e) => {
          this.setHeaderReduced(false)
        },
      })
    },
    ...mapMutations({
      setMenuActive: 'setMenuActive',
      setHeaderReduced: 'setHeaderReduced',
    }),
  },
}
</script>

<style lang="scss">
.app-header {
  position: fixed;
  top: 60px;
  left: 50%;
  display: flex;
  width: 50%;
  justify-content: space-between;
  transition: transform 0.65s var(--ease-out-cubic),
    opacity 0.35s 0.4s var(--ease-in-out-cubic);
  will-change: transform;
  z-index: 3;
  height: 40px;

  @include mobile {
    top: mobile-vw(25px);
  }

  &.reduced {
    transform: translate(0%, -40px);

    @include mobile {
      transform: translate(0%, 0%);
    }
  }

  &.hide {
    transition-delay: 0s;
    opacity: 0;
    pointer-events: none;
  }

  &__nav {
    margin-left: auto;
    margin-right: desktop-vw(25px);
    align-self: center;
    cursor: pointer;
    display: flex;
    gap: desktop-vw(25px);
    align-items: center;

    @include mobile {
      display: none;
    }

    .pbb {
      width: 3rem;
    }

    .P1.bold {
      font-size: 16px;
      line-height: 16px;
      text-transform: uppercase;
      transition: color 0.4s var(--ease-out-cubic);
      user-select: none;
    }
  }

  &__logo {
    z-index: 2;
    transform: translateX(-50%);

    h1,
    p {
      position: absolute;
      pointer-events: none;
      opacity: 0;
    }

    &.white {
      svg g {
        fill: #f5f5f3;
      }
    }

    svg {
      cursor: pointer;

      g {
        transition: fill 0.4s var(--ease-out-cubic);
      }

      @include mobile {
        width: 100%;
        display: block;
      }
    }
  }
  &__burger {
    z-index: 2;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    margin-right: desktop-vw(60px);
    align-self: center;

    @include mobile {
      margin-right: calc(var(--layout-margin) + 10px);
    }

    &.white {
      .app-header__burger__icon::after,
      .app-header__burger__icon::before {
        background-color: var(--c-grey);
      }
    }

    &__menu.P1 {
      font-size: 16px;
      line-height: 16px;
      text-transform: uppercase;
      margin-right: 20px;
      transition: color 0.4s var(--ease-out-cubic);
      user-select: none;

      @include mobile {
        display: none;
      }
    }

    &__icon {
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
}
</style>
