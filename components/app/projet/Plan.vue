<template>
  <div class="app-projet-plan">
    <div class="app-projet-plan__inner grid-inner">
      <div class="app-projet-plan__content">
        <TH4 class="app-projet-plan__content__title"
          >ADIDAS ARENA <br />
          NORD EST PARISIEN <br />
          PORTE DE LA CHAPELLE</TH4
        >
        <TP1 weight="bold" class="app-projet-plan__content__subtitle"
          >Smart, inspirante, lumineuse,
        </TP1>
        <TP2 weight="medium" class="app-projet-plan__content__paragraph"
          >Cette Arena nouvelle génération va transformer tout un quartier.
          <br />
          <br />
          Participez au renouveau d’un territoire à travers ce nouveau lieu de
          vie hybride qui fera émerger des talents !</TP2
        >
      </div>
      <div class="app-projet-plan__visual">
        <AtomsCornerPoints :size-points="8" />

        <SvgPlan ref="svg" />
      </div>
    </div>
  </div>
</template>

<script>
import { gsap } from 'gsap'

export default {
  mounted() {
    const outside = this.$refs.svg.$el.getElementById('outside').children.length
      ? this.$refs.svg.$el
          .getElementById('outside')
          .querySelectorAll('path, rect, circle, ellipse, polyline')
      : this.$refs.svg.$el.getElementById('outside')

    const border = this.$refs.svg.$el.getElementById('border').children.length
      ? this.$refs.svg.$el
          .getElementById('border')
          .querySelectorAll('path, rect, circle, ellipse, polyline')
      : this.$refs.svg.$el.getElementById('border')

    const inside = this.$refs.svg.$el.getElementById('inside').children.length
      ? this.$refs.svg.$el
          .getElementById('inside')
          .querySelectorAll('path, rect, circle, ellipse, polyline')
      : this.$refs.svg.$el.getElementById('inside')

    const arena = this.$refs.svg.$el.getElementById('arena').children.length
      ? this.$refs.svg.$el
          .getElementById('arena')
          .querySelectorAll('path, rect, circle, ellipse, polyline')
      : this.$refs.svg.$el.getElementById('arena')

    this.tl = gsap.timeline({
      scrollTrigger: {
        trigger: this.$el,
        markers: true,
        start: 'top+=15% bottom',
        end: 'bottom bottom',
        scrub: 0.5,
      },
    })

    this.tl.fromTo(
      outside,
      { opacity: 0 },
      {
        opacity: 1,
      }
    )

    this.tl.fromTo(
      [border, inside],
      { drawSVG: false },
      {
        drawSVG: true,
        stagger: 0.05,
      }
    )

    this.tl.fromTo(
      arena,
      { opacity: 0 },
      {
        opacity: 1,
      }
    )
  },
  beforeDestroy() {
    this.tween?.kill()
  },
}
</script>

<style lang="scss">
.app-projet-plan {
  height: 250vh;
  position: relative;
  width: 100%;

  &__inner {
    padding-top: desktop-vw(190px);
    position: sticky;
    top: 0;
  }

  &__content {
    grid-column: 1 / span 4;
    margin-top: desktop-vw(50px);

    &__title.H4 {
      margin-bottom: desktop-vw(25px);
      @include font-adihausDIN-cn-bold();
    }

    &__subtitle {
      margin-bottom: desktop-vw(25px);
    }

    &__paragraph.P2 {
      text-transform: initial;
      width: 65%;
    }
  }

  &__visual {
    grid-column: 5 / span 7;
    aspect-ratio: 860/540;
    transform: rotate(4deg);
    width: 107.5%;
    position: relative;

    &::after {
      content: '';
      background: url('/imgs/projet/plan-bg.webp');
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-repeat: no-repeat;
      background-size: cover;
      mix-blend-mode: multiply;
      pointer-events: none;
    }

    svg {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
    }
  }
}
</style>
