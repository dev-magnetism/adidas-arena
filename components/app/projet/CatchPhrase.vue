<template>
  <div class="app-projet__catch-phrase grid-inner">
    <TH2>
      Un terrain de jeu laissant place aux rencontres, à la création et à la
      fête.
    </TH2>
    <ELottie id="crossArrowCircle"></ELottie>
  </div>
</template>

<style lang="scss">
.app-projet__catch-phrase {
  position: relative;

  .H2 {
    grid-column: 3 / span 8;
    text-align: center;
    line-height: desktop-vw(110px);
  }
  .app-element-lottie {
    grid-column: 10 / span 2;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    aspect-ratio: 190 / 300;
    transform: translateY(-50%);
  }
}
</style>
