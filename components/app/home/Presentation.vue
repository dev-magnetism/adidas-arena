<template>
  <div class="app-home-presentation grid-inner">
    <TH3 class="app-home-presentation__title">
      Futur lieu de référence des cultures urbaines, l'ADIDAS ARENA fait se
      rencontrer musique, sport, culture & lifestyle pour tous.
    </TH3>

    <EParallax :speed="1.35" class="app-home-presentation__visual-bigger">
      <EKinesis :speed="20">
        <nuxt-picture src="imgs/placeholder.png" format="webp" alt="alt" />
      </EKinesis>
    </EParallax>

    <EParallax :speed="0.7" class="app-home-presentation__visual-framed">
      <EKinesis :speed="20">
        <EFramedPicture color="red-adidas">
          <EKinesis :speed="-10">
            <nuxt-picture src="imgs/placeholder.png" format="webp" alt="alt" />
          </EKinesis>
        </EFramedPicture>
      </EKinesis>
    </EParallax>

    <EParallax :speed="1" class="app-home-presentation__picture-corner-points">
      <EKinesis :speed="50">
        <ECornerPointsPicture :size-points="6">
          <nuxt-picture
            class="app-home-presentation__visual-smaller picture-absolute"
            src="imgs/placeholder.png"
            format="webp"
            alt="alt"
          />
        </ECornerPointsPicture>
      </EKinesis>
    </EParallax>
  </div>
</template>

<style lang="scss" scoped>
.app-home-presentation {
  width: 100%;
  margin-top: desktop-vw(130px);
  position: relative;
  // height: 150vh;
  // padding-bottom: 55vw;
  padding-bottom: desktop-vw(800px);

  &__visual-framed {
    position: absolute;
    aspect-ratio: 545 / 670;
    top: 28vw;
    left: 20px;
    grid-column: 7 / span 5;
    width: 100%;
    transform: translateY(-50%) rotate(2deg);
    z-index: 1;

    .app-element-framed-picture {
      width: 100%;
      height: 100%;
    }
  }

  &__visual-bigger {
    position: absolute;
    aspect-ratio: 520 / 650;
    top: 27vw;
    grid-column: 3 / span 5;
    width: 100%;
    transform: rotate(-2deg);
    z-index: 0;
  }

  &__picture-corner-points {
    position: absolute;
    aspect-ratio: 320 / 210;
    top: 40vw;
    grid-column: 6 / span 3;
    left: columns(1);
    width: 100%;
    transform: rotate(5deg);
    z-index: 2;

    .app-element-corner-points-picture {
      width: 100%;
      height: 100%;
      display: block;
    }

    .app-home-presentation__visual-smaller {
      position: absolute;
      width: 100%;
      height: 100%;
    }
  }

  &__title {
    grid-column: 1 / span 6;
    z-index: 1;
  }
}
</style>
