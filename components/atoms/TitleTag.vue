<template>
  <div
    class="app-atoms-title-tag"
    :class="classes"
    :style="{ 'background-color': `var(--c-${bg})` }"
  >
    <TP2 weight="bold" :color="color"><slot /></TP2>
  </div>
</template>

<script>
export default {
  props: {
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
.app-atoms-title-tag {
  border: 1px solid var(--c-black);
  padding: desktop-vw(12px) desktop-vw(20px);
  display: inline-flex;
  align-items: center;

  @include hover {
    // cursor: pointer;
  }

  .P2 {
    font-size: desktop-vw(18px);
    line-height: desktop-vw(20px);
    @include font-adihausDIN-cn-bold();
  }
}
</style>
