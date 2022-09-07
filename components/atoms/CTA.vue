<template>
  <nuxt-link
    v-if="!isExternal && link"
    :target="target"
    class="app-atoms-cta"
    :class="classes"
    :style="{ 'background-color': `var(--c-${bg})` }"
    :to="link"
  >
    <TP2 weight="bold" :color="color"><slot /></TP2>
    <SvgCtaUnion v-if="arrow" :color="color" />
  </nuxt-link>
  <a
    v-else-if="isExternal && link"
    :target="target"
    :href="link"
    class="app-atoms-cta"
    :class="classes"
    :style="{ 'background-color': `var(--c-${bg})` }"
  >
    <TP2 weight="bold" :color="color"><slot /></TP2>
    <SvgCtaUnion v-if="arrow" :color="color" />
  </a>
  <button
    v-else-if="!link"
    class="app-atoms-cta"
    :class="classes"
    :style="{ 'background-color': `var(--c-${bg})` }"
  >
    <TP2 weight="bold" :color="color"><slot /></TP2>
    <SvgCtaUnion v-if="arrow" :color="color" />
  </button>
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
      type: String,
      required: false,
      default: '',
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
    isExternal() {
      return this.$utils.isValidHttpUrl(this.link) && this.link !== undefined
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
