<template>
  <div class="app-element-corner-points-picture">
    <AtomsCornerPoints :size-points="sizePoints" :position="position" />
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    position: {
      type: String,
      default: '1,2,3,4',
      require: false,
    },
    sizePoints: {
      type: Number,
      require: false,
      default: 10,
    },
  },
}
</script>

<style lang="scss">
.app-element-corner-points-picture {
}
</style>
