<template>
  <div :style="styles" class="app-programmation-slider-card">
    <AppProgrammationEventStatus
      :presale="event.presale"
      :reported="event.reported"
      :status="event.status_code"
      :color="statutColor"
    />
    <div class="app-programmation-slider-card__visual">
      <div class="app-programmation-slider-card__visual__wrapper">
        <div
          :class="{ visible }"
          class="app-programmation-slider-card__layer"
        />
        <AppProgrammationImage
          class="app-programmation-slider-card__visual__picture"
          :src="event?.presentation_event?.filename_disk"
          :alt="`slider-image-${event.artist_reference}`"
          :lazy="true"
          :sizes="{
            desktop: 'w600,h600,fcrop,q85',
            mobile: 'w600,h600,fcrop,q85',
          }"
        />
      </div>
    </div>

    <div class="app-programmation-slider-card__informations">
      <div class="app-programmation-slider-card__head">
        <TP2 class="type" weight="bold" :color="whitedTexts" tag="h3">
          {{
            event.content.category.toLowerCase() !== 'no cat'
              ? event.content.category
              : ''
          }}
        </TP2>
        <TP2
          v-if="event.sessions"
          class="date"
          weight="medium"
          :color="whitedTexts"
        >
          {{ $formatDate(event.sessions) }}
        </TP2>
      </div>
      <TH2 :color="whitedTexts" weight="bold">
        {{ event.artist_reference }}
      </TH2>

      <TP2
        v-if="
          event.min_price &&
          event.status_code !== 'K' &&
          event.status_code !== 'B' &&
          event.status_code !== 'C' &&
          event.status_code !== 'H'
        "
        class="app-programmation-slider-card__from-price"
        weight="medium"
        :color="whitedTexts"
      >
        {{ programmationsEventContent.glossary_from_price }}
        {{ event.min_price }}€
      </TP2>

      <TP2
        v-else-if="event.status_code === 'K'"
        weight="medium"
        :color="whitedTexts"
        class="app-programmation-slider-card__from-price"
      >
        Show complet, inscrivez-vous sur la liste d’attente !
      </TP2>

      <TP2
        v-else-if="event.status_code === 'B' && event.presale"
        weight="medium"
        :color="whitedTexts"
        class="app-programmation-slider-card__from-price"
      >
        Inscrivez-vous sur la liste d’attente !
      </TP2>

      <AtomsCTA
        v-if="
          event.status_code === 'H' ||
          (event.status_code === 'B' && !event.presale) ||
          event.status_code === 'C'
        "
        :color="statutColor"
        :layer-color="statutColor"
        :bg="'grey'"
        :href="{
          name: 'programmation-id',
          params: {
            id: `${$convertToKebabCase(event.content.url)}--${event.id}`,
          },
        }"
        :gtm-click="{
          id: `${event.id}`,
          name: `${event.artist_reference}`,
          category: `${event.content.category}`,
          category2: `${event.content.sub_category}`,
          price: `${event.min_price}`,
        }"
        class="app-programmation-slider-card__cta"
        @mouseenter.native="onMouseEnter"
        @mouseleave.native="onMouseLeave"
      >
        En savoir +
      </AtomsCTA>
      <AtomsCTA
        v-else
        :color="statutColor"
        :layer-color="statutColor"
        :bg="'grey'"
        :href="{
          name: 'programmation-id',
          params: {
            id: `${$convertToKebabCase(event.content.url)}--${event.id}`,
          },
        }"
        :gtm-click="{
          id: `${event.id}`,
          name: `${event.artist_reference}`,
          category: `${event.content.category}`,
          category2: `${event.content.sub_category}`,
          price: `${event.min_price}`,
        }"
        class="app-programmation-slider-card__cta"
        @mouseenter.native="onMouseEnter"
        @mouseleave.native="onMouseLeave"
      >
        {{
          event.status_code === 'K' ||
          (event.status_code === 'B' && event.presale)
            ? `Liste d'attente`
            : `Réserver`
        }}
      </AtomsCTA>
    </div>
    <span
      :class="{ full: event.status_code === 'K' }"
      class="app-programmation-slider-card__full"
    >
      <TP2 weight="bold" :color="ctaColor">Complet</TP2>
    </span>
  </div>
</template>

<script>
//  import { gsap } from 'gsap'
import { mapState, mapMutations } from 'vuex'

export default {
  props: {
    event: {
      type: Object,
      default: () => {},
    },
    theme: {
      type: String,
      default: 'red',
    },
    rotateNegative: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      visible: false,
    }
  },
  computed: {
    ...mapState({
      programmationsEventContent: (state) => state.programmationsEventContent,
    }),
    styles() {
      return {
        '--bg':
          this.theme === 'blue'
            ? 'var(--c-blue-adidas)'
            : this.theme === 'red'
            ? 'var(--c-red-adidas)'
            : 'var(--c-grey)',
        '--rotation': `${
          this.genRand(1, 2.5, 2) * (this.rotateNegative ? -1 : 1)
        }deg`,
      }
    },
    statutColor() {
      return this.theme === 'blue'
        ? 'blue-adidas'
        : this.theme === 'red'
        ? 'red-adidas'
        : 'black'
    },
    ctaColor() {
      return this.theme === 'blue'
        ? 'blue-adidas'
        : this.theme === 'red'
        ? 'red-adidas'
        : 'black'
    },
    whitedTexts() {
      return this.theme === 'blue' || this.theme === 'red' ? 'white' : 'black'
    },
  },
  mounted() {
    if (this.$viewport.isMobile) return

    console.log('event', this.event)

    this.initTimelineArrow()
  },
  beforeDestroy() {
    //  this.tlArrow?.kill()
  },
  methods: {
    onMouseEnter() {
      if (this.$viewport.isMobile) return

      this.setCursorState('hide')

      //  this.tlArrow?.play()
    },
    onMouseLeave() {
      if (this.$viewport.isMobile) return

      this.setCursorState('slider')

      //  this.tlArrow?.reverse()
    },
    initTimelineArrow() {
      //  if (this.$viewport.isMobile) return
      // this.tlArrow = gsap.timeline({ paused: true })
      /*
      this.tlArrow.to(this.$refs.arrow.$el, {
        x: `${this.$viewport.width * 0.048611111111}px`, // width cta
        duration: 0.5,
        ease: 'power3.inOut',
      })

      this.tlArrow.set(this.$refs.arrow.$el, {
        x: `${this.$viewport.width * -0.048611111111}px`, // width cta
      })

      this.tlArrow.to(this.$refs.arrow.$el, {
        x: 0,
        duration: 0.25,
        ease: 'power3.out',
      })
      */
    },
    genRand(min, max, decimalPlaces) {
      const rand = Math.random() * (max - min) + min
      const power = Math.pow(10, decimalPlaces)
      return Math.floor(rand * power) / power
    },
    ...mapMutations({
      setCursorState: 'setCursorState',
      setCursorSliderHold: 'setCursorSliderHold',
    }),
  },
}
</script>

<style lang="scss">
.app-programmation-slider-card {
  display: flex;
  flex-direction: column;
  background-color: var(--bg);
  position: relative;
  border: 1px solid var(--c-black);
  transform: rotate(var(--rotation));
  flex: 0 0 32.5%;
  min-width: 0;

  &:nth-child(2n + 2) {
    top: desktop-vw(50px);

    @include mobile {
      top: mobile-vw(30px);
    }
  }

  &:first-child {
    margin-left: var(--layout-margin);

    @include mobile {
      margin-left: var(--layout-margin);
    }
  }

  &:last-child {
    margin-right: var(--layout-margin);

    @include mobile {
      margin-right: var(--layout-margin);
    }
  }

  @include mobile {
    flex: 0 0 75%;
  }

  @include desktop-l {
    flex: 0 0 25%;
  }

  .app-programmation-event-status {
    position: absolute;
    right: 0;
    border-right: none;
    border-top: none;
    top: 0;
    z-index: 10;
  }

  &__full {
    position: absolute;
    top: 0;
    right: 0;
    background: var(--c-grey);
    border: 1px solid var(--c-black);
    border-top: none;
    border-right: none;
    padding: desktop-vw(5px) desktop-vw(8px);
    display: none;

    &.full {
      display: block;
    }

    @include mobile {
      padding: mobile-vw(5px) mobile-vw(8px);
    }

    .P2 {
      text-transform: uppercase;
    }
  }

  &__visual {
    width: 100%;
    display: block;
    position: relative;
    z-index: 0;
  }

  &__visual__wrapper {
    aspect-ratio: 435/435;
    width: 100%;
    display: block;
    position: relative;
    overflow: hidden;
    overflow: hidden;
  }

  picture {
    width: 100%;
    display: block;
    position: relative;
    height: 100%;
    @include noise();
    will-change: transform;

    img {
      display: block;
      transform: scale(1.1);
      transition: transform 0.95s var(--ease-out-quart);
    }
  }

  &__informations {
    display: flex;
    flex-direction: column;
    padding: desktop-vw(15px) desktop-vw(25px);
    height: 100%;
    border-top: 1px solid var(--c-black);

    @include mobile {
      padding: mobile-vw(15px) mobile-vw(15px) mobile-vw(65px);
      margin-top: mobile-vw(0px);
    }
  }

  &__head {
    display: flex;
    justify-content: space-between;

    .P2 {
      text-transform: uppercase;
    }

    // .type {
    // }

    // .date {
    // }
  }

  .H2.bold {
    font-size: desktop-vw(64px);
    line-height: desktop-vw(58px);
    margin-top: desktop-vw(5px);
    margin-bottom: desktop-vw(40px);
    user-select: none;

    @include mobile {
      margin-top: mobile-vw(5px);
      margin-bottom: mobile-vw(40px);
      font-size: mobile-vw(46px);
      line-height: mobile-vw(42px);
    }

    @include desktop-l {
      font-size: desktop-vw(48px);
      line-height: desktop-vw(42px);
    }
  }

  &__from-price.P2 {
    margin-top: auto;
    max-width: 50%;

    @include mobile {
      margin-left: auto;
      max-width: 100%;
    }
  }

  &__cta.app-atoms-cta {
    position: absolute;
    bottom: 0;
    height: desktop-vw(55px);
    background: var(--c-grey);
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border: 1px solid var(--c-black);
    border-right: none;
    border-bottom: none;
    overflow: hidden;

    @include mobile {
      padding: mobile-vw(15px) mobile-vw(20px) mobile-vw(15px) mobile-vw(20px);
      height: mobile-vw(55px);
    }
  }
}
</style>
