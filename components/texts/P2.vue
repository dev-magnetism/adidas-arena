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
    uppercase: {
      required: false,
      type: Boolean,
      default: true,
    },
  },
  computed: {
    classes() {
      return [
        {
          'P2--noselect': !this.selectable,
          bold: this.weight === 'bold',
          medium: this.weight === 'medium',
          regular: this.weight === 'regular',
          uppercase:
            this.uppercase ||
            this.weight === 'medium' ||
            this.weight === 'bold',
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
