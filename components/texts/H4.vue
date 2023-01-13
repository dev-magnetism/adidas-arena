<template>
  <component
    :is="tag"
    class="H4"
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
      default: 'h4',
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
        {
          'H4--noselect': !this.selectable,
          bold: this.weight === 'bold',
          medium: this.weight === 'medium',
          regular: this.weight === 'regular',
          'bold-normal': this.weight === 'bold-normal',
        },
      ]
    },
  },
}
</script>

<style lang="scss">
.H4 {
  @include h4();

  &--type {
  }
}
</style>
