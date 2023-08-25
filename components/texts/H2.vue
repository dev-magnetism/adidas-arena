<template>
  <component :is="tag" :class="classes" :style="{ color: `var(--c-${color})` }">
    <slot></slot>
  </component>
</template>

<script>
import { mapState } from 'vuex'

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
      default: 'medium',
    },
  },
  computed: {
    ...mapState({
      fontSize: (state) => state.fontSize,
    }),
    classes() {
      return [
        'H2',
        {
          'H2--noselect': !this.selectable,
          bold: this.weight !== 'medium',
          medium: this.weight === 'medium',
        },
      ]
    },
  },
}
</script>

<style lang="scss">
.H2 {
  @include h2();

  &--type {
  }
}
</style>
