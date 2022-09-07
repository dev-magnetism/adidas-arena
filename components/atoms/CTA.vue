<template>
  <div
    class="app-atoms-cta"
    :class="classes"
    :style="{ 'background-color': `var(--c-${bg})` }"
  >
    <TP2 weight="bold" :color="color"><slot /></TP2>
    <SvgCtaUnion v-if="link" :color="color" />
  </div>
</template>

<script>
export default {
  props: {
    link: {
      type: Boolean,
      required: false,
      default: true,
    },
    bg: {
      type: String,
      required: false,
      default: 'blue-adidas',
    },
    color: {
      type: String,
      required: false,
      default: 'beige',
    },
  },
  computed: {
    classes() {
      return [
        {
          'no-link': !this.link,
          // medium: this.weight === 'medium',
        },
      ]
    },
  },
}
</script>

<style lang="scss">
.app-atoms-cta {
  border: 1px solid var(--c-black);
  padding: 15px 26px;
  display: inline-flex;
  align-items: center;

  @include hover {
    cursor: pointer;
  }

  .P2 {
    font-size: 24px;
    line-height: 32px;
    @include font-adihausDIN-cn-bold();
  }

  svg {
    margin-left: 80px;
  }
}
</style>
