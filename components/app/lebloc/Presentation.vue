<template>
  <div class="app-le-bloc-presentation grid-inner">
    <TH2 class="app-le-bloc-presentation__title">
      Au cœur du lieu de vie : <br />
      le Bloc !
    </TH2>
    <EKinesis class="app-le-bloc-presentation__visual" :speed="5">
      <nuxt-picture
        src="imgs/placeholder.png"
        format="webp"
        alt="placeholder"
        loading="lazy"
        preload
        class="picture-absolute"
      />
    </EKinesis>

    <EKinesis class="app-le-bloc-presentation__framed-visual" :speed="20">
      <EFramedPicture color="blue-adidas">
        <EKinesis :speed="-10">
          <nuxt-picture
            class="picture-absolute"
            src="imgs/placeholder.png"
            format="webp"
            alt="alt"
          />
        </EKinesis>
      </EFramedPicture>
    </EKinesis>
    <EKinesis :speed="5" class="app-le-bloc-presentation__text">
      <TH4>Le visiteur du bloc</TH4>
      <TP2 weight="medium"
        >C’est le lieu de vie et d’expériences pour tous : spectateurs et
        visiteurs s’y rencontrent. <br /><br />
        Un espace expérientiel pour s’élever au sens propre et figuré.<br /><br />
        Des activités & services viennent animer ce lieu à différents moments de
        la journée.</TP2
      >
    </EKinesis>
  </div>
</template>

<style lang="scss">
.app-le-bloc-presentation {
  position: relative;
  padding-bottom: desktop-vw(950px);

  &__title {
    grid-column: 1 / span 4;
  }

  &__visual {
    position: absolute;
    grid-column: 4 / span 4;
    width: 100%;
    aspect-ratio: 440 / 545;
    top: desktop-vw(250px);
    transform: rotate(-2deg);
    height: auto;
  }

  &__framed-visual {
    position: absolute;
    grid-column: 7 / span 4;
    width: 100%;
    aspect-ratio: 405 / 500;
    top: desktop-vw(550px);
    height: auto;

    .app-element-framed-picture {
      transform: rotate(4deg);
    }
  }

  &__text {
    margin-top: desktop-vw(150px);
    grid-column: 9 / span 3;

    .H4 {
      margin-bottom: desktop-vw(30px);
    }

    .P2 {
      text-transform: initial;
    }
  }
}
</style>
