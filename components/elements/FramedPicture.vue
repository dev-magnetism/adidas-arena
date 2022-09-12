<template>
  <div
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
  },
}
</script>

<style lang="scss">
.app-element-framed-picture {
  padding: desktop-vw(20px);
  position: relative;
}
</style>
