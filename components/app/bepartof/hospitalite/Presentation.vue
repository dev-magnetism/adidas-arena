<template>
  <div class="app-be-part-of-hospitalite-presentation grid-inner">
    <TH2 class="app-be-part-of-hospitalite-presentation__title"
      >Une expérience VIP unique & engagée</TH2
    >
    <nuxt-picture
      class="app-be-part-of-hospitalite-presentation__visual"
      src="imgs/placeholder.png"
      format="webp"
      alt="placeholder"
      loading="lazy"
      preload
    />
    <EFramedPicture
      class="app-be-part-of-hospitalite-presentation__framed-visual"
      color="blue-adidas"
    >
      <nuxt-picture
        class="picture-absolute"
        src="imgs/placeholder.png"
        format="webp"
        alt="alt"
      />
    </EFramedPicture>
    <div class="app-be-part-of-hospitalite-presentation__text">
      <TH4>LOREM IPSUM DOLOR SI AMET</TH4>
      <TP2 weight="medium">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus semper
        velit urna, finibus ornare diam commodo a. <br /><br />

        Aliquam erat volutpat. Maecenas dignissim vitae felis eget pharetra.
        Vivamus vitae facilisis massa. Sed quis posuere ipsum, quis aliquam
        diam. Nam dictum tristique leo eget venenatis.
      </TP2>
    </div>
  </div>
</template>

<style lang="scss">
.app-be-part-of-hospitalite-presentation {
  position: relative;
  padding-bottom: desktop-vw(950px);

  &__title {
    grid-column: 1 / span 5;
  }

  &__visual {
    position: absolute;
    grid-column: 4 / span 4;
    width: 100%;
    aspect-ratio: 440 / 545;
    top: desktop-vw(250px);
    transform: rotate(-2deg);
  }

  &__framed-visual.app-element-framed-picture {
    position: absolute;
    grid-column: 7 / span 4;
    width: 100%;
    aspect-ratio: 405 / 500;
    transform: rotate(4deg);
    top: desktop-vw(550px);
  }

  &__text {
    margin-top: desktop-vw(150px);
    grid-column: 8 / span 4;

    .H4 {
      margin-bottom: desktop-vw(30px);
    }

    .P2 {
      margin-left: columns(1.5);
      text-transform: initial;
    }
  }
}
</style>
