<template>
  <div
    :class="{ 'fake-transparent': fakeTransparent }"
    class="app-element-framed-picture"
    :style="{ 'background-color': `var(--c-${color})` }"
  >
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      require: true,
      default: 'red-adidas',
    },
    fakeTransparent: {
      type: Boolean,
      require: true,
      default: false,
    },
  },
}
</script>

<style lang="scss">
.app-element-framed-picture {
  padding: desktop-vw(20px);
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;

  @include mobile {
    padding: mobile-vw(10px);
  }

  picture {
    position: relative;
    height: 100%;
    width: 100%;
    display: block;
  }

  &.fake-transparent {
    @include fake-transparent();
  }
}
</style>
