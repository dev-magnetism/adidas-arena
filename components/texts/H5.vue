<template>
  <component
    :is="tag"
    class="H5"
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
      default: 'h5',
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
          'H5--noselect': !this.selectable,
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
.H5 {
  @include h5();

  &--type {
  }
}
</style>
