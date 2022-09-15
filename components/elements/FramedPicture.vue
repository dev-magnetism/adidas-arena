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

  picture {
    position: relative;
    height: 100%;
    width: 100%;
    display: block;
  }

  &.fake-transparent {
    background-image: linear-gradient(45deg, #b0b0b0 25%, transparent 25%),
      linear-gradient(-45deg, #b0b0b0 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, #b0b0b0 75%),
      linear-gradient(-45deg, transparent 75%, #b0b0b0 75%) !important;
    background-size: 20px 20px;
    background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
  }
}
</style>
