<template>
  <div
    :class="{
      reduced: headerReduced,
      hide: headerHided || overlayContactOpen,
    }"
    class="app-header"
  >
    <nuxt-link
      :class="{ reduced: headerReduced, white: headerWhite }"
      class="app-header__logo"
      to="/"
    >
      <SvgArenaLogo />
    </nuxt-link>

    <div
      :class="{ reduced: headerReduced, white: headerWhite }"
      class="app-header__burger"
      @click="onClickBurger"
    >
      <TP1
        v-if="!$viewport.isMobile"
        weight="bold"
        class="app-header__burger__menu"
      >
        {{ menuName }}
      </TP1>
      <div class="app-header__burger__icon" />
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      menuActive: (state) => state.menuActive,
      appContent: (state) => state.appContent,
      headerReduced: (state) => state.headerReduced,
      headerWhite: (state) => state.headerWhite,
      headerHided: (state) => state.headerHided,
      overlayContactOpen: (state) => state.overlayContactOpen,
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
  left: 50%;
  display: flex;
  width: 50%;
  justify-content: space-between;
  transition: transform 0.65s var(--ease-out-cubic),
    opacity 0.35s 0.4s var(--ease-in-out-cubic);
  will-change: transform;
  z-index: 2;
  height: 40px;

  @include mobile {
    top: mobile-vw(25px);
  }

  &.reduced {
    transform: translate(0%, -125%);

    @include mobile {
      transform: translate(0%, 0%);
    }
  }

  &.hide {
    transition-delay: 0s;
    opacity: 0;
    pointer-events: none;
  }

  &__logo {
    z-index: 2;
    transform: translateX(-50%);

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
      margin-right: var(--layout-margin);
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

    &__menu.P1 {
      font-size: 16px;
      line-height: 16px;
      text-transform: uppercase;
      margin-right: 20px;
      transition: color 0.4s var(--ease-out-cubic);
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
