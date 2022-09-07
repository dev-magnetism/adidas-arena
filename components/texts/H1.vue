<template>
  <component
    :is="tag"
    class="H1"
    :class="classes"
    :style="{ color: `var(--c-${color})` }"
  >
    <slot />
  </component>
</template>

<script>
export default {
  props: {
    tag: {
      type: String,
      required: false,
      default: 'h1',
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
      default: 'medium',
    },
  },
  computed: {
    classes() {
      return [
        {
          'H1--noselect': !this.selectable,
          bold: this.weight !== 'medium',
          medium: this.weight === 'medium',
        },
      ]
    },
  },
}
</script>

<style lang="scss">
.H1 {
  @include h1();

  &--type {
  }
}
</style>
