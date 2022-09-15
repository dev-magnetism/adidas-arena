<template>
  <SmartLink
    class="app-atoms-cta"
    :class="classes"
    :style="{ 'background-color': `var(--c-${bg})` }"
    :href="link"
    :internal="!external"
    :external="external"
    :blank="target"
  >
    <TP2 weight="bold" :color="color"><slot /></TP2>
    <SvgCtaUnion v-if="arrow" :color="color" />
  </SmartLink>
</template>

<script>
export default {
  props: {
    arrow: {
      type: Boolean,
      required: false,
      default: true,
    },
    bg: {
      type: String,
      required: false,
      default: 'blue-adidas',
    },
    external: {
      type: Boolean,
      required: false,
      default: false,
    },
    link: {
      type: String,
      required: false,
      default: undefined,
    },
    color: {
      type: String,
      required: false,
      default: 'beige',
    },
    target: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  computed: {
    classes() {
      return [
        {
          // 'no-link': !this.link,
          // medium: this.weight === 'medium',
        },
      ]
    },
  },
  mounted() {},
}
</script>

<style lang="scss">
.app-atoms-cta {
  border: 1px solid var(--c-black);
  padding: desktop-vw(15px) desktop-vw(25px);
  display: inline-flex;
  align-items: center;
  justify-content: space-between;

  @include hover {
    cursor: pointer;
  }

  .P2 {
    font-size: desktop-vw(24px);
    line-height: desktop-vw(32px);
    @include font-adihausDIN-cn-bold();
  }

  svg {
    margin-left: desktop-vw(20px);
  }
}
</style>
