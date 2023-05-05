<template>
  <component :is="tag" :class="classes" :style="{ color: `var(--c-${color})` }">
    <slot></slot>
  </component>
</template>

<script>
export default {
  props: {
    tag: {
      type: String,
      required: false,
      default: 'h2',
    },
    color: {
      type: String,
      required: false,
      default: 'black',
    },
    selectable: {
      required: false,
      type: Boolean,
      default: true,
    },
    weight: {
      required: false,
      type: String,
      default: 'bold',
    },
  },
  computed: {
    classes() {
      return [
        'H2-bis',
        {
          'H2-bis--noselect': !this.selectable,
          bold: this.weight !== 'medium',
          medium: this.weight === 'medium',
        },
      ]
    },
  },
}
</script>

<style lang="scss">
.H2-bis {
  @include h2-bis();

  &--type {
  }
}
</style>
