<template>
  <div class="app-atoms-cta-back">
    <SvgBackArrow />
    <TP1 weight="bold" color="grey"><slot /></TP1>
  </div>
</template>

<script>
export default {
  computed: {},
  mounted() {},
}
</script>

<style lang="scss">
.app-atoms-cta-back {
  padding: desktop-vw(10px) desktop-vw(18px);
  display: inline-flex;
  align-items: center;
  background: var(--c-black);
  z-index: 1;

  @include hover {
    cursor: pointer;
  }

  @include mobile {
    padding: mobile-vw(10px) mobile-vw(12px);
  }

  svg {
    margin-right: desktop-vw(15px);
  }

  .P1 {
    @include font-adihausDIN-cn-bold();
  }
}
</style>
