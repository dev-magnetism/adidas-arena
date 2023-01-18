<template>
  <div class="app-element-enter-arena">
    <div class="app-element-enter-arena__title">
      <AtomsCornerPoints :size-points="8" />
      <p>{{ content.title }}</p>
    </div>
    <AtomsCTA ref="cta" button class="app-element-enter-arena__cta">
      {{ content.cta }}
    </AtomsCTA>
  </div>
</template>

<script>
export default {
  props: {
    content: {
      type: Object,
      default: () => {},
    },
  },
}
</script>

<style lang="scss">
.app-element-enter-arena {
  position: absolute;
  grid-column: 8 / span 3;
  top: 20%;
  display: flex;
  flex-direction: column;
  width: 100%;
  transition: opacity 0.35s var(--ease-in-out-cubic);

  &.hide {
    opacity: 0;
    pointer-events: none;
  }

  &__cta {
    left: 25%;
  }

  &__title {
    position: relative;
    padding: min(25px, desktop-vw(25px)) min(30px, desktop-vw(30px));
    background-color: var(--c-white);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 65%;

    p {
      font-size: min(54px, desktop-vw(54px));
      line-height: min(54px, desktop-vw(54px));
      @include font-adihausDIN-cn-bold();
      text-transform: uppercase;
    }
  }
}
</style>
