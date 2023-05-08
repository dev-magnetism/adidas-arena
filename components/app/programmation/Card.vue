<template>
  <div :style="bgColor" class="app-programmation-card">
    <div ref="layerFiltering" class="app-programmation-card__layer-filtering" />

    <div class="app-programmation-card__visual">
      <AppProgrammationEventStatut :color="statutColor">
        Complet
      </AppProgrammationEventStatut>
      <div :class="{ visible }" class="app-programmation-card__layer" />

      <AppProgrammationImage
        :src="event.list_image.filename_disk"
        :alt="`card-image-${event.id}-${event.artist_reference}`"
        :lazy="true"
        :tiny="true"
      />
    </div>

    <div class="app-programmation-card__informations">
      <div class="app-programmation-card__head">
        <TP2 class="type" weight="bold" :color="whitedTexts" tag="h3">
          {{ event.content.category }}
        </TP2>
        <TP2 class="date" weight="medium" :color="whitedTexts" tag="h3">
          {{ $formatDate(event.sessions, true) }}
        </TP2>
      </div>
      <TH2 :color="whitedTexts" weight="bold" tag="h2">
        {{ event.artist_reference }}
      </TH2>

      <TP2
        v-if="event.min_price"
        class="app-programmation-card__from-price"
        weight="medium"
        :color="whitedTexts"
      >
        À partir de
        {{ event.min_price }}€
      </TP2>

      <AtomsCTA
        :color="statutColor"
        :layer-color="statutColor"
        :bg="'grey'"
        :href="`programmation/${$convertToKebabCase(event.content.url)}--${
          event.id
        }`"
        class="app-programmation-card__cta"
        >coucou</AtomsCTA
      >
    </div>
  </div>
</template>

<script>
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default {
  props: {
    event: {
      type: Object,
      default: () => {},
    },
    theme: {
      type: String,
      default: 'grey',
    },
  },
  data() {
    return {
      visible: false,
      hideInListing: false,
    }
  },
  computed: {
    bgColor() {
      return {
        '--bg': `var(--c-${this.theme})`,
      }
    },
    statutColor() {
      return this.theme === 'blue-adidas'
        ? 'blue-adidas'
        : this.theme === 'red-adidas'
        ? 'red-adidas'
        : 'black'
    },
    ctaColor() {
      return this.theme === 'blue-adidas'
        ? 'blue-adidas'
        : this.theme === 'red-adidas'
        ? 'red-adidas'
        : 'black'
    },
    whitedTexts() {
      return this.theme === 'blue-adidas' || this.theme === 'red-adidas'
        ? 'white'
        : 'black'
    },
  },

  mounted() {
    this.initMatchMedia()
  },
  beforeDestroy() {
    this.mm?.kill()
    this.scrollTrigger?.kill()
  },
  methods: {
    initMatchMedia() {
      this.mm = gsap.matchMedia()

      this.mm.add('(min-width: 768px)', (context) => {
        this.scrollTrigger = ScrollTrigger.create({
          trigger: this.$el,
          start: 'top+=20% bottom',
          toggleActions: 'play none none none',
          onToggle: () => {
            this.visible = true
          },
        })

        return () => {
          this.scrollTrigger?.kill()
        }
      })
    },
  },
}
</script>

<style lang="scss">
.app-programmation-card {
  grid-column: span 4;
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  border: 1px solid var(--c-black);
  background-color: var(--bg);

  @include mobile {
    grid-column: span 6;
  }

  &__layer-filtering {
    position: absolute;
    width: calc(100% + 5px);
    height: calc(100% + 5px);
    background: var(--c-grey);
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%) scaleY(0);
    z-index: 2;
    transform-origin: center top;
  }

  &:nth-child(3n + 1) {
    .app-programmation-card__layer {
      transition-delay: 0.1s;
    }
  }
  &:nth-child(3n + 2) {
    .app-programmation-card__layer {
      transition-delay: 0.3s;
    }
  }
  &:nth-child(3n + 3) {
    .app-programmation-card__layer {
      transition-delay: 0.5s;
    }
  }

  &__layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--bg);
    z-index: 9999;
    transform: scaleY(1);
    transform-origin: center bottom;
    transition: transform 0.8s var(--ease-in-out-cubic);

    &.visible {
      transform: scaleY(0);
    }

    @include mobile {
      display: none;
    }
  }

  &__visual {
    width: 100%;
    display: block;
    position: relative;
    z-index: 0;

    .app-programmation-event-statut {
      position: absolute;
      right: 0;
      border-right: none;
      border-top: none;
      top: 0;
      z-index: 10;
    }
  }

  picture {
    aspect-ratio: 435 / 435;
    width: 100%;
    display: block;
    position: relative;
    @include noise();

    img {
      display: block;
    }
  }

  &__informations {
    display: flex;
    flex-direction: column;
    padding: desktop-vw(15px) desktop-vw(25px);
    height: 100%;
    border-top: 1px solid var(--c-black);

    @include mobile {
      padding: mobile-vw(15px) mobile-vw(15px) mobile-vw(10px) mobile-vw(15px);
    }
  }

  &__head {
    display: flex;
    justify-content: flex-start;

    .P2 {
      text-transform: uppercase;
    }
    .type {
    }

    .date {
      margin-left: desktop-vw(30px);
    }
  }

  .H2.bold {
    font-size: desktop-vw(64px);
    line-height: desktop-vw(58px);
    margin-top: desktop-vw(5px);
    margin-bottom: desktop-vw(70px);

    @include mobile {
      margin-top: mobile-vw(5px);
      margin-bottom: mobile-vw(85px);
      font-size: mobile-vw(46px);
      line-height: mobile-vw(42px);
    }
  }

  &__from-price.P2 {
    margin-top: auto;
  }

  &__cta {
    position: absolute;
    bottom: 0;
    background: var(--c-grey);
    right: 0;
    border-right: none;
    border-bottom: none;
    overflow: hidden;
  }
}
</style>
