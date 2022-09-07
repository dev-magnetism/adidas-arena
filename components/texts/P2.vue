<template>
  <component
    :is="tag"
    class="P2"
    :class="classes"
    :style="{ color: `var(--c-${color})` }"
  >
    <slot></slot>
  </component>
</template>

<script>
export default {
  props: {
    tag: {
      type: String,
      required: false,
      default: 'p',
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
      default: 'regular',
    },
  },
  computed: {
    classes() {
      return [
        {
          'P2--noselect': !this.selectable,
          bold: this.weight !== 'regular',
          regular: this.weight === 'regular',
        },
      ]
    },
  },
}
</script>

<style lang="scss">
.P2 {
  @include p2();

  &--type {
  }
}
</style>
