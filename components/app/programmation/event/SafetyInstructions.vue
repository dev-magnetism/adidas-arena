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
        {{ content.title }}
      </TH2Bis>
      <div
        v-if="content.externalItems"
        class="app-programmation-event-safety-instructions__list"
      >
        <div
          v-for="(instruction, index) in content.items"
          :key="`instruction-external-${index}`"
          class="app-programmation-event-safety-instructions__item"
        >
          <TH4 weight="medium">
            <ERichTextEvent 
              :component="{ name: 'H4', weight: 'medium', tagTarget: 'p', tag: 'h4'}"
              :content="instruction.content.description"
            />
          </TH4>
        </div>
      </div>
      <div v-else class="app-programmation-event-safety-instructions__list">
        <div
          v-for="(instruction, index) in content.items"
          :key="`instruction-external-${index}`"
          class="app-programmation-event-safety-instructions__item"
        >
          <TH4 weight="medium">
            {{ instruction.safety_instructions_item }}
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
    content: {
      type: Object,
      default: () => {},
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
          rotate: 4,
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
.app-programmation-event-safety-instructions {
  margin-top: desktop-vw(160px);

  @include mobile {
    margin-top: mobile-vw(70px);
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

  &__lottie-bottom-left.app-element-lottie {
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
    max-width: 1280px;
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
    transform: translate(0, 20%) rotate(8deg);
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
      @include font-ITCFranklinGothicLT-DmXtraCp();
      .p{
        margin: 0;
        @include h4();
        @include font-ITCFranklinGothicLT-DmXtraCp();

        @include mobile {
          @include font-ITCFranklinGothicLT-DmXtraCp();
          font-size: mobile-vw(14px);
          line-height: mobile-vw(20px);
        }

      }
      @include mobile {
        font-size: mobile-vw(14px);
        line-height: mobile-vw(20px);

        @include font-ITCFranklinGothicLT-DmXtraCp();


      }
    }
  }
}
</style>
