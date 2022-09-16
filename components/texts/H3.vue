<template>
  <component
    :is="tag"
    class="H3"
    :class="{ classes }"
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
      default: 'h3',
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
          'H3--noselect': !this.selectable,
        },
      ]
    },
  },
}
</script>

<style lang="scss">
.H3 {
  @include h3();

  &--type {
  }
}
</style>
