<template>
  <div
    :class="{
      reduced: headerReduced,
      hide: headerHided || overlayContactOpen,
    }"
    class="app-header"
    @click.stop="() => {}"
  >
    <nuxt-link
      :class="{ reduced: headerReduced, white: headerWhite }"
      class="app-header__logo"
      to="/"
    >
      <h1>Adidas Arena</h1>
      <SvgArenaLogo />
    </nuxt-link>

    <nuxt-link
      :class="{ reduced: headerReduced, white: headerWhite }"
      class="app-header__programmation"
      to="/programmation"
    >
      <TP1 weight="bold" :color="headerWhite ? 'grey' : 'black'">
        {{ programmationName }}
      </TP1>
    </nuxt-link>

    <div
      :class="{ reduced: headerReduced, white: headerWhite }"
      class="app-header__burger"
      @click="onClickBurger"
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
    programmationName() {
      return this.appContent.data.menu_programmation
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
  z-index: 3;
  height: 40px;

  @include mobile {
    top: mobile-vw(25px);
  }

  &.reduced {
    transform: translate(0%, calc(-#{desktop-vw(10px)} - 40px));

    @include mobile {
      transform: translate(0%, 0%);
    }
  }

  &.hide {
    transition-delay: 0s;
    opacity: 0;
    pointer-events: none;
  }

  &__programmation {
    margin-left: auto;
    margin-right: desktop-vw(25px);
    align-self: center;
    cursor: pointer;

    @include mobile {
      display: none;
    }

    .P1.bold {
      font-size: 16px;
      line-height: 16px;
      text-transform: uppercase;
      transition: color 0.4s var(--ease-out-cubic);
    }
  }

  &__logo {
    z-index: 2;
    transform: translateX(-50%);

    h1 {
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
