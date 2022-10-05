<template>
  <div class="app-home-projet grid-inner">
    <div class="app-home-projet__rotated">
      <div ref="wrapper" class="app-home-projet__wrapper">
        <AtomsCornerPoints border-color="beige" points-color="beige" />

        <div class="app-home-projet__inner">
          <AppHomeProjetHeader />
          <AppHomeProjetBigVisual />
          <AppHomeProjetPlan />

          <EFramedPicture
            :fake-transparent="true"
            color="white"
            class="app-home-projet__framed-picture projet-visual"
          >
            <nuxt-picture
              class="projet-visual"
              src="imgs/placeholder.png"
              format="webp"
              alt="alt"
            />
          </EFramedPicture>
          <AtomsTitleTag
            class="app-home-projet__tag-top app-projet-tag-5"
            bg="beige"
            color="black"
            >80% des surfaces du bâtiment végétalisées.
          </AtomsTitleTag>
          <nuxt-picture
            class="app-home-projet__visual__top-upper projet-visual"
            src="imgs/placeholder.png"
            format="webp"
            alt="alt"
          />

          <TH2 ref="title" weight="bold" class="app-home-projet__title"
            >Projet</TH2
          >
        </div>
        <div ref="fakeVisual" class="app-home-projet__fake-visual"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'

export default {
  mounted() {
    const split = new SplitText(this.$refs.title.$el, {
      type: 'chars',
    })

    console.log(split)

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: this.$el,
        // markers: true,
        start: 'top+=30% center',
        end: 'center center',
        scrub: 0.5,
      },
    })

    tl.fromTo(
      [this.$refs.wrapper, this.$refs.fakeVisual],
      {
        scale: 0,
      },
      {
        transformOrigin: 'left bottom',
        scale: 1,
        stagger: 0.05,
      }
    )

    tl.fromTo(
      '.app-projet-tag-1',
      {
        opacity: 0,
        yPercent: 25,
        rotate: -12,
      },
      {
        opacity: 1,
        yPercent: 0,
        rotate: -6,
      },
      '<50%'
    )

    tl.fromTo(
      '.projet-visual',
      {
        scale: 0,
      },
      {
        transformOrigin: 'left bottom',
        scale: 1,
        stagger: 0.3,
      },
      '>-100%'
    )

    tl.addLabel('projet-2-3', '<25%')
    tl.fromTo(
      '.app-projet-tag-2',
      {
        opacity: 0,
        yPercent: 150,
        rotate: -6,
      },
      {
        opacity: 1,
        yPercent: 0,
        rotate: 1.45,
        transformOrigin: 'center',
      },
      'projet-2-3'
    )

    tl.fromTo(
      '.app-projet-tag-3',
      {
        opacity: 0,
        yPercent: 100,
        rotate: 4,
      },
      {
        opacity: 1,
        yPercent: 0,
        rotate: -2.5,
      },
      'projet-2-3'
    )

    tl.fromTo(
      '.app-projet-tag-4',
      {
        opacity: 0,
        yPercent: 35,
        rotate: 12,
      },
      {
        opacity: 1,
        yPercent: 0,
        rotate: 9,
      },
      '>-75%'
    )
    tl.addLabel('charsHeader', '<65%')
    tl.fromTo(
      split.chars,
      {
        xPercent: -105,
      },
      {
        xPercent: 0,
        stagger: 0.09,
      },
      'charsHeader'
    )
    tl.to(
      ['.header-line-1', '.header-line-2'],

      {
        scaleX: 1,
        stagger: 0.05,
      },
      'charsHeader'
    )
    tl.to(
      ['.header-line-3', '.header-line-4'],

      {
        scaleY: 1,
        stagger: 0.2,
      },
      'charsHeader+=55%'
    )

    tl.fromTo(
      '.app-projet-tag-5',
      {
        opacity: 0,
        yPercent: 50,
        rotate: -6,
      },
      {
        opacity: 1,
        yPercent: 0,
        rotate: 0,
      },
      'charsHeader+=100%'
    )
  },
}
</script>

<style lang="scss">
.app-home-projet {
  width: 100%;
  height: 100%;
  position: relative;
  background: radial-gradient(50% 50% at 50% 50%, #3a4f68 0%, #15191e 100%);
  margin-top: desktop-vw(200px);
  margin-bottom: desktop-vw(70px);
  padding-top: desktop-vw(135px);
  padding-bottom: desktop-vw(135px);

  &__wrapper {
    width: 100%;
    height: 100%;
    display: block;
    transform: scale(0.7);
    transform-origin: left bottom;

    position: relative;

    &::after {
      content: '';
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      background: linear-gradient(
          rgba(251, 245, 238, 0.5) 0.1em,
          transparent 0.1em
        ),
        linear-gradient(
          90deg,
          rgba(251, 245, 238, 0.5) 0.1em,
          transparent 0.1em
        ),
        var(--c-white);
      background-size: 1em 1em;
      width: 100%;
      height: 100%;
      z-index: -3;
    }
  }

  &__rotated {
    height: 100%;
    width: 105%;
    grid-column: 2 / span 10;
    aspect-ratio: 1165/760;
    position: relative;
    transform: translateX(-2.5%) rotate(-2deg);
  }

  &__inner {
    position: relative;
    width: 100%;
    height: 100%;
    padding: desktop-vw(35px) desktop-vw(25px);
    display: grid;
    grid-template-columns: repeat(10, minmax(0, 1fr));
    grid-gap: var(--layout-columns-gap);
    overflow: hidden;
  }

  &__fake-visual {
    @include fake-transparent();
    background-size: 8px 8px;
    background-position: 0 0, 0 4px, 4px -4px, -4px 0px;
    aspect-ratio: 130 / 30;
    position: absolute;
    bottom: 0;
    left: 0;
    width: desktop-vw(110px);
    height: desktop-vw(110px);
  }

  &__visual__top-upper {
    position: absolute;
    grid-column: 5 / span 2;
    aspect-ratio: 200/95;
    transform: rotate(-5deg);
    top: 4%;
    left: 20%;
    width: 100%;
  }
  &__tag-top {
    position: absolute;
    grid-column: 6 / span 4;
    top: 15%;
    padding: desktop-vw(10px);

    > .P2 {
      text-transform: uppercase;
      font-size: desktop-vw(18px);
      line-height: desktop-vw(20px);
    }
  }

  &__framed-picture {
    background-color: var(--c-white);
    grid-column: 8 / span 3;
    aspect-ratio: 250/315;
    width: 82%;
    left: 18%;
    z-index: -2;
    padding: desktop-vw(35px) desktop-vw(35px);
    transform: rotate(-2deg);

    > :first-child {
      transform: rotate(-2deg);
    }
  }

  &__find-out-more {
    width: desktop-vw(200px);
  }

  &__title.H2 {
    writing-mode: vertical-rl;
    transform: scale(-1);
    display: inline-block;
    position: absolute;
    bottom: desktop-vw(30px);
    right: desktop-vw(5px);
    font-size: desktop-vw(180px);
    line-height: desktop-vw(180px);
  }
}
</style>
