<template>
  <div class="app-element-enter-arena">
    <div class="app-element-enter-arena__title">
      <AtomsCornerPoints :size-points="8" />
      <p>L’ARENA</p>
      <!-- <p>{{ content.title }}</p> -->
    </div>
    <AtomsCTA ref="cta" button class="app-element-enter-arena__cta">
      <!-- {{ content.cta }} -->
      Découvrir le lieu
    </AtomsCTA>
  </div>
</template>

<script>
export default {
  // props: {
  //   content: {
  //     type: Object,
  //     default: () => {},
  //   },
  // },
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
    .app-element-enter-arena__cta,
    .app-element-enter-arena__title {
      opacity: 0;
    }
    .app-element-enter-arena__cta {
      transition-delay: 0s;
    }
  }

  &__title {
    position: relative;
    padding: min(25px, desktop-vw(25px)) min(30px, desktop-vw(30px));
    background-color: var(--c-white);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 65%;
    transition: opacity 0.4s var(--ease-in-out-cubic);

    p {
      font-size: min(54px, desktop-vw(54px));
      line-height: min(54px, desktop-vw(54px));
      @include font-adihausDIN-cn-bold();
      text-transform: uppercase;
    }
  }

  &__cta {
    left: 25%;
    transition: opacity 0.4s var(--ease-in-out-cubic);
    transition-delay: 0.15s;
  }
}
</style>
