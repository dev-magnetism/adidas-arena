<template>
  <div class="app-atoms-stroke-text" :style="styles"><slot /></div>
</template>

<script>
export default {
  props: {
    strokeWidth: {
      type: String,
      required: false,
      default: '1px',
    },
    strokeColor: {
      type: String,
      required: false,
      default: 'black',
    },
    fill: {
      type: String,
      required: false,
      default: 'transparent',
    },
  },
  computed: {
    styles() {
      return [
        {
          '-webkit-text-stroke': `${this.strokeWidth} var(--c-${this.strokeColor})`,
          '-webkit-text-fill-color': `var(--c-${this.fill})`,
        },
      ]
    },
  },
}
</script>

<style lang="scss">
.app-atoms-stroke-text {
  -webkit-text-stroke: 3px darkgrey;
  -webkit-text-fill-color: white;
  display: inline-block;
}
</style>
