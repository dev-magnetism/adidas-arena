<template>
  <div class="app-home-projet__plan">
    <div class="app-home-projet__plan__header">
      <TP2 class="app-home-projet__plan__header__f-c">Plan n°34</TP2>
      <div class="app-home-projet__plan__header__s-c">
        <TP2>Ref</TP2>
        <span class="app-home-projet__plan__header__dot" />
        <TP2>908765</TP2>
      </div>
    </div>
    <div class="app-home-projet__plan__bottom">
      <ELottieTest />
      <nuxt-picture src="imgs/projet/plan.png" format="webp" alt="alt" />
    </div>
  </div>
</template>

<style lang="scss">
.app-home-projet__plan {
  position: absolute;
  grid-column: 5 / span 5;
  width: 92.5%;
  aspect-ratio: 495/475;
  bottom: 40%;
  left: columns(0.5);
  transform: rotate(-6deg);
  transform: translateY(50%) rotate(4deg);
  z-index: -1;
  border: 1px solid var(--c-black);
  background: var(--c-white);

  .app-element-lottie {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 70%;
    left: 0;
    display: block;
    height: auto;
  }

  &__bottom {
    aspect-ratio: 375 / 425;
    display: block;
    width: 100%;
    height: 100%;
    padding: desktop-vw(20px) desktop-vw(40px) desktop-vw(45px) desktop-vw(40px);

    transform: rotate(5deg);
  }

  &__header {
    display: flex;
    flex-direction: row;

    &__f-c {
      flex: 1;
      padding: desktop-vw(12px);
      border-bottom: 1px solid var(--c-black);
      border-right: 1px solid var(--c-black);
      font-size: desktop-vw(24px);
      line-height: desktop-vw(20px);
      display: flex;
      align-items: center;
      justify-content: center;

      &.P2 {
        text-transform: uppercase;
        @include font-adihausDIN-cn-bold();
      }
    }

    &__s-c {
      flex: 3;
      padding: 12px;
      border-bottom: 1px solid var(--c-black);
      display: flex;
      justify-content: flex-end;
      align-items: center;

      .P2 {
        font-size: desktop-vw(18px);
        line-height: desktop-vw(20px);
        text-transform: uppercase;
        @include font-adihausDIN-cn-bold();
      }
    }

    &__dot {
      width: 5px;
      height: 5px;
      display: block;
      background: var(--c-black);
      margin: 0 desktop-vw(10px);
      border-radius: 50%;
    }
  }
}
</style>
