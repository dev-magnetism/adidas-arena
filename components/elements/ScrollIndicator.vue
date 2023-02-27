<template>
  <div class="app-element-scroll-indicator" @click.stop="() => {}">
    <SvgScrollIndicatorDoubleArrow />
  </div>
</template>

<style lang="scss">
.app-element-scroll-indicator {
  background: var(--c-blue-adidas);
  padding: desktop-vw(20px) desktop-vw(25px);
  display: flex;
  align-items: center;
  justify-content: center;
  outline: 1px solid var(--c-black);
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  cursor: pointer;

  @include mobile {
    padding: mobile-vw(20px) mobile-vw(20px);
  }
}
</style>
