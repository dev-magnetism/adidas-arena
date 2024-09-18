<template>
  <div 
    v-if="elHide" 
    class="app-programmation-event-additional-informations block-inner"
  >
    <div
      ref="wrapper"
      class="app-programmation-event-additional-informations__wrapper"
    >
      <ELottie
        id="404_Fleche_Rouge_01"
        class="app-programmation-event-additional-informations__lottie-top-left"
        start="top center+=25%"
        end="bottom center-=5%"
      />

      <ELottie
        id="Trait_2"
        class="app-programmation-event-additional-informations__lottie-top-center"
        start="top center+=0%"
        end="bottom center-=100%"
      />

      <ELottie
        id="Fleche_2"
        class="app-programmation-event-additional-informations__lottie-middle-right"
        start="top center+=25%"
        end="bottom center-=5%"
      />

      <AtomsCornerPoints :size-points="8" />

      <TH2Bis
        weight="bold"
        class="app-programmation-event-additional-informations__title"
      >
        {{ content.title }}
      </TH2Bis>
      <div class="app-programmation-event-additional-informations__list">
        <div
          v-for="(info, index) in event.additional_informations_list"
          :key="`additional_informations-${index}`"
          class="app-programmation-event-additional-informations__item"
        >
          <TH4 weight="medium">
            {{ info.additional_informations_label }}
          </TH4>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { gsap } from 'gsap'

export default {
  props: {
    event: {
      type: Object,
      default: () => {},
    },
    content: {
      type: Object,
      default: () => {},
    },
  },
  computed: {

    elHide() {
      return (
            this.event.additional_informations_list?.length > 0
          )
      },

  },
  mounted() {
    this.initMatchMedia()
  },

  beforeDestroy() {
    this.tween?.kill()
    this.mm?.revert()
  },

  methods: {
    initMatchMedia() {
      this.mm = gsap.matchMedia()

      this.mm.add('(min-width: 768px)', (context) => {
        this.tween = gsap.to(this.$refs.wrapper, {
          rotate: -3,
          opacity: 1,
          y: '0%',
          ease: 'power2.inOut',
          duration: 0.5,
          scrollTrigger: {
            toggleActions: 'play none none play',
            trigger: this.$refs.wrapper,
            start: 'top bottom-=10%',
          },
        })

        return () => {
          this.tween?.kill()
        }
      })
    },
  },
}
</script>

<style lang="scss">
.app-programmation-event-additional-informations {
  // margin-top: desktop-vw(160px);

  @include mobile {
    // margin-top: mobile-vw(70px);
  }

  &__lottie-top-left.app-element-lottie {
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

  &__lottie-top-center.app-element-lottie {
    position: absolute;
    width: desktop-vw(307px);
    height: auto;
    top: 25%;
    right: 12%;

    @include mobile {
      transform: scale(-1, -1) rotate(95deg);
      width: mobile-vw(65px);
      height: mobile-vw(100px);
      right: 90%;
    }
  }

  &__lottie-middle-right.app-element-lottie {
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
    max-width: 782px;
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
    transform: translate(0, 20%) rotate(0);
    opacity: 0;
    height: 100%;

    @include mobile {
      opacity: 1;
      width: 100%;
      transform: rotate(0deg);
      padding: mobile-vw(25px) mobile-vw(20px) mobile-vw(50px) mobile-vw(20px);
    }
  }

  &__title {
    margin-bottom: desktop-vw(40px);
    text-align: center;
    font-size: desktop-vw(64px);


    @include mobile{
      font-size: mobile-vw(44px);
      margin-bottom: mobile-vw(40px);
    }
    
  }

  &__list {
  }

  &__item {
    margin-bottom: desktop-vw(16px);
    list-style-type: none;
    display: flex;

    @include desktop-l{
     margin-bottom: desktop-vw(16px);
    }

    @include mobile {
      margin-bottom: mobile-vw(10px);
    }

    &::before {
      content: '';
      width: desktop-vw(4px);
      min-width: desktop-vw(4px);
      height: desktop-vw(4px);
      min-height: desktop-vw(4px);
      display: flex;
      background: var(--c-black);
      margin-right: desktop-vw(10px);
      transform: translateY(desktop-vw(12px));

      @include desktop-l{
        margin-right: desktop-vw(10px);
        transform: translateY(desktop-vw(5px));
      }


      @include mobile {
        content: '';
        width: mobile-vw(4px);
        min-width: mobile-vw(4px);
        height: mobile-vw(4px);
        min-height: mobile-vw(4px);
        margin-right: mobile-vw(4px);
        transform: translateY(mobile-vw(8px));
      }
    }

    &:last-child {
      margin-bottom: 0px;
    }

    .H4 {
      @include font-ITCFranklinGothicLT-BkCp();
      font-size: desktop-vw(32px);
      line-height: desktop-vw(32px);
      .p{
        margin: 0;
        @include h4();
        @include font-ITCFranklinGothicLT-BkCp();
        font-size: desktop-vw(16px);
        line-height: desktop-vw(16px);

        @include desktop-l{
          font-size: desktop-vw(16px);
          line-height: desktop-vw(16px);
        }

        @include mobile {
          @include font-ITCFranklinGothicLT-BkCp();
          font-size: mobile-vw(12px);
          line-height: mobile-vw(14px);
        }

      }

      @include desktop-l{
        font-size: desktop-vw(32px);
        line-height: desktop-vw(32px);
      }

      @include mobile {
        font-size: mobile-vw(24px);
        line-height: mobile-vw(24px);

        @include font-ITCFranklinGothicLT-BkCp();


      }
    }
  }
}
</style>
