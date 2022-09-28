<template>
  <component
    :is="tag"
    class="P1"
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
          'P1--noselect': !this.selectable,
          bold: this.weight === 'bold',
          medium: this.weight === 'medium',
          regular: this.weight === 'regular',
        },
      ]
    },
  },
}
</script>

<style lang="scss">
.P1 {
  @include p1();

  &--type {
  }
}
</style>
