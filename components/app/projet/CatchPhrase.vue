<template>
  <div class="app-projet__catch-phrase grid-inner">
    <TH2>
      <EKinesis :speed="10">
        Un terrain de jeu laissant place aux rencontres, à la création et à la
        fête.
      </EKinesis>
    </TH2>
    <EParallax :speed="0.3" class="app-projet__catch-phrase__lottie">
      <EKinesis :speed="20">
        <ELottie id="Fleche_Match" start="center bottom" end="bottom center" />
      </EKinesis>
    </EParallax>
  </div>
</template>

<style lang="scss">
.app-projet__catch-phrase {
  position: relative;
  margin-top: desktop-vw(30px);

  .H2 {
    grid-column: 3 / span 8;
    text-align: center;
    line-height: desktop-vw(110px);
  }
  &__lottie {
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
