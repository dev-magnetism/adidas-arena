<template>
  <nuxt-link class="app-header__logo" to="/">
    <SvgArenaLogo />
  </nuxt-link>
</template>

<style lang="scss">
.app-header__logo {
  position: fixed;
  top: desktop-vw(60px);
  left: 50%;
  z-index: 2;
  transform: translateX(-50%);

  @include mobile {
    top: mobile-vw(25px);
  }

  svg {
    cursor: pointer;

    @include mobile {
      width: 80%;
    }
  }
}
</style>
