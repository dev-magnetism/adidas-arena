<template>
  <div class="app-programmation-event-safety-instructions block-inner">
    <div
      ref="wrapper"
      class="app-programmation-event-safety-instructions__wrapper"
    >
      <ELottie
        id="404_Fleche_Rouge_01"
        class="app-programmation-event-safety-instructions__lottie-top-left"
        start="top center+=25%"
        end="bottom center-=5%"
      />

      <ELottie
        id="Fleche_2"
        class="app-programmation-event-safety-instructions__lottie-middle-right"
        start="top center+=25%"
        end="bottom center-=5%"
      />

      <ELottie
        id="404_Fleche_Bleu_01"
        class="app-programmation-event-safety-instructions__lottie-bottom-left"
        start="top center+=25%"
        end="bottom center-=2.5%"
      />

      <AtomsCornerPoints :size-points="8" />

      <TH2Bis
        weight="bold"
        class="app-programmation-event-safety-instructions__title"
      >
        Consignes de sécurité
      </TH2Bis>
      <ul class="app-programmation-event-safety-instructions__list">
        <li class="app-programmation-event-safety-instructions__item">
          <TH4 weight="medium">
            Les appareils photos “professionnels” sont interdits.
          </TH4>
        </li>
        <li class="app-programmation-event-safety-instructions__item">
          <TH4 weight="medium">
            Les boissons & la nourriture extérieures ne sont pas autorisées.
          </TH4>
        </li>
        <li class="app-programmation-event-safety-instructions__item">
          <TH4 weight="medium">
            Les valises et sacs de voyage sont interdits. LEs sacs à dos sont
            autorisés. Les sacs à dos de plus de 10l sont autorisés uniquement
            en consigne.
          </TH4>
        </li>
        <li class="app-programmation-event-safety-instructions__item">
          <TH4 weight="medium">
            Les casques sont autorisés uniquement en consigne.
          </TH4>
        </li>
        <li class="app-programmation-event-safety-instructions__item">
          <TH4 weight="medium">
            Les appareils photos “professionnels” sont interdits.
          </TH4>
        </li>
        <li class="app-programmation-event-safety-instructions__item">
          <TH4 weight="medium">
            Les boissons & la nourriture extérieures ne sont pas autorisées.
          </TH4>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { gsap } from 'gsap'

export default {
  mounted() {
    this.initScrollTrigger()
  },

  methods: {
    initScrollTrigger() {
      if (this.$viewport.isMobile) return

      gsap.fromTo(
        this.$refs.wrapper,
        {
          rotate: 8,
          opacity: 0,
          y: '20%',
        },
        {
          rotate: 4,
          opacity: 1,
          y: '0%',
          ease: 'power2.inOut',
          duration: 0.5,
          scrollTrigger: {
            toggleActions: 'play none none none',
            trigger: this.$refs.wrapper,
            start: 'top bottom-=20%',
          },
        }
      )
    },
  },
}
</script>

<style lang="scss">
.app-programmation-event-safety-instructions {
  margin-top: desktop-vw(160px);

  @include mobile {
    margin-top: mobile-vw(70px);
  }

  &__lottie-top-left {
    position: absolute;
    transform: scale(-1, -1) rotate(80deg);
    width: desktop-vw(65px);
    height: desktop-vw(100px);
    right: 95%;

    @include mobile {
      transform: scale(-1, -1) rotate(95deg);
      width: mobile-vw(65px);
      height: mobile-vw(100px);
      right: 90%;
    }
  }

  &__lottie-bottom-left {
    position: absolute;
    transform: scale(1, 1) rotate(160deg);
    width: desktop-vw(150px);
    height: auto;
    right: 95%;
    bottom: 15%;

    @include mobile {
      transform: scale(1, 1) rotate(160deg);
      width: mobile-vw(70px);
      height: auto;
      right: 80%;
      bottom: -2.5%;
    }
  }

  &__lottie-middle-right {
    position: absolute;
    transform: scale(1, 1) rotate(70deg);
    height: auto;
    width: desktop-vw(80px);
    left: 100%;
    top: 30%;

    @include mobile {
      transform: scale(1, 1) rotate(70deg);
      height: auto;
      width: mobile-vw(45px);
      left: 95%;
      top: 45%;
    }

    svg {
      path {
        stroke: var(--c-red-adidas);
      }
    }
  }

  &__wrapper {
    width: 58%;
    margin: 0 auto;
    background: linear-gradient(
        rgba(251, 245, 238, 0.8) 0.1em,
        transparent 0.1em
      ),
      linear-gradient(90deg, rgba(251, 245, 238, 0.8) 0.1em, transparent 0.1em),
      white;
    background-size: 1.2em 1.2em;
    padding: desktop-vw(50px) desktop-vw(50px) desktop-vw(65px) desktop-vw(50px);
    position: relative;
    transform: rotate(4deg);

    @include mobile {
      width: 100%;
      transform: rotate(0deg);
      padding: mobile-vw(25px) mobile-vw(20px) mobile-vw(50px) mobile-vw(20px);
    }
  }

  &__title {
    margin-bottom: desktop-vw(100px);
    text-align: center;
  }

  &__list {
  }

  &__item {
    margin-bottom: desktop-vw(40px);
    list-style-type: none;
    display: flex;

    @include mobile {
      margin-bottom: mobile-vw(25px);
    }

    &::before {
      content: '';
      width: desktop-vw(8px);
      min-width: desktop-vw(8px);
      height: desktop-vw(8px);
      min-height: desktop-vw(8px);
      display: flex;
      background: var(--c-black);
      margin-right: desktop-vw(30px);
      transform: translateY(desktop-vw(12.5px));

      @include mobile {
        content: '';
        width: mobile-vw(8px);
        min-width: mobile-vw(8px);
        height: mobile-vw(8px);
        min-height: mobile-vw(8px);
        margin-right: mobile-vw(8px);
        transform: translateY(mobile-vw(7px));
      }
    }

    &:last-child {
      margin-bottom: 0px;
    }

    .H4 {
      @include mobile {
        font-size: mobile-vw(14px);
        line-height: mobile-vw(20px);

        @include font-adihausDIN-medium();
      }
    }
  }
}
</style>
