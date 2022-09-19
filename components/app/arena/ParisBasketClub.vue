<template>
  <div class="app-arena-paris-basket-club grid-inner">
    <div
      ref="frameWrapper"
      class="app-arena-paris-basket-club__visual-with-frame"
    >
      <nuxt-picture
        ref="picture"
        src="imgs/placeholder.png"
        format="webp"
        alt="placeholder"
      />
      <SvgArenaFrame ref="frame" />
    </div>
    <div class="app-arena-paris-basket-club__visual-transparent">
      <nuxt-picture
        src="imgs/placeholder-logo-home.png"
        format="webp"
        alt="placeholder"
      />
      <AtomsCornerPoints :size-points="6" />
    </div>
    <nuxt-picture
      ref="picture"
      class="app-arena-paris-basket-club__visual-without-frame"
      src="imgs/placeholder.png"
      format="webp"
      alt="placeholder"
    />
    <div class="app-arena-paris-basket-club__content">
      <TH2>PARIS BASKETBALL CLUB</TH2>
      <TP2
        >L'ADIDAS ARENA disposera de son club de basketball résident à l’année :
        le Paris Basketball. Un effectif jeune, au jeu spectaculaire et
        offensif</TP2
      >
      <TP2
        >Ce club, créé en 2018 incarne une des facettes phares du lifestyle
        urbain parisien : pour preuve, le grand Paris compte le plus grand
        nombre de licenciés en France ! Avec 35 rencontres annuelles, les matchs
        du Paris Basketball vous permettront de vibrer autour d’un sport fort en
        show, exploits techniques et émotions !
      </TP2>
    </div>
  </div>
</template>

<script>
// import { gsap } from 'gsap'

export default {
  mounted() {
    // const svgEls = this.$refs.frame.$el.querySelectorAll(
    //   'path, rect, circle, ellipse, polyline'
    // )
    // gsap.fromTo(
    //   svgEls,
    //   { drawSVG: false },
    //   {
    //     ease: 'power3.inOut',
    //     duration: 0.65,
    //     drawSVG: true,
    //     scrollTrigger: {
    //       trigger: this.$refs.frameWrapper,
    //       markers: true,
    //       start: 'top top',
    //       end: 'bottom top',
    //       scrub: 0.5,
    //     },
    //   }
    // )
  },
}
</script>

<style lang="scss">
.app-arena-paris-basket-club {
  position: relative;
  margin-top: 100vh;
  //   margin-top: desktop-vw(1080px);

  &__visual-transparent {
    position: absolute;
    width: columns(1.5);
    grid-column: 6 / span 2;
    top: desktop-vw(25px);
    transform: rotate(7deg);
    aspect-ratio: 128 / 128;
    // left: 30%;
    display: flex;
    align-items: center;
    justify-content: center;

    @include fake-transparent();

    picture {
      display: block;
      width: 55%;
      height: auto;
    }
  }

  &__visual-with-frame {
    position: relative;
    grid-column: 2 / span 4;
    aspect-ratio: 440 / 550;
    width: 100%;
    top: 0;
    left: 0;
    transform: rotate(-6deg);
    margin-bottom: desktop-vw(300px);

    svg {
      position: absolute;
      left: 50%;
      top: 50%;
      width: auto;
      height: 100%;
      transform: translate(-50%, -50%) rotate(-3deg);
    }
  }
  &__visual-without-frame {
    position: absolute;
    top: 0;
    left: 0;
    grid-column: 5 / span 3;
    aspect-ratio: 280 / 380;
    width: 100%;
    top: desktop-vw(300px);
    left: 0;
    transform: rotate(2deg);
  }

  &__content {
    grid-column: 9 / span 4;

    .H2 {
      margin-bottom: desktop-vw(25px);
    }
  }
}
</style>
