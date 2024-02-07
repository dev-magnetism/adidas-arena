<template>
  <div
    :class="{ 'is-appear': isAppear, 'in-view': inView }"
    :style="bgColor"
    class="app-programmation-card"
    @click="onRouterPush"
  >
    <div ref="layerFiltering" class="app-programmation-card__layer-filtering" />

    <div class="app-programmation-card__visual">
      <AppProgrammationEventStatus
        v-if="event.status_code !== 'C'"
        :presale="event.presale"
        :reported="event.reported"
        :status="event.status_code"
        :color="statutColor"
      />

      <div
        :class="{ 'is-appear': isAppear }"
        class="app-programmation-card__layer"
      />

      <AtomsSpotifyCardLink
        v-if="event.spotify_link !== '' && event.spotify_link !== null"
        :cta-link="event.spotify_link"
        />

      <AppProgrammationImage
        :src="event?.presentation_event?.filename_disk"
        :alt="`card-image-${event.id}-${event.artist_reference}`"
        :lazy="true"
        :sizes="{
          desktop: 'w600,h600,fcrop,q85',
          mobile: 'w600,h600,fcrop,q85',
        }"
      />
    </div>

    <div class="app-programmation-card__informations">
      <div class="app-programmation-card__head">
        <TP2 class="type" weight="bold" :color="whitedTexts" tag="h3">
          {{
            event.content.category.toLowerCase() !== 'no cat'
              ? event.content.category
              : ''
          }}
        </TP2>
        <TP2 class="date" weight="medium" :color="whitedTexts" tag="h3">
          {{ $formatDate(event.sessions, true) }}
        </TP2>
      </div>
      <TH2 :color="whitedTexts" weight="bold" tag="h2">
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
        class="app-programmation-card__from-price"
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
        class="app-programmation-card__from-price"
      >
        Show complet, inscrivez-vous sur la liste d’attente !
      </TP2>

      <TP2
        v-else-if="event.status_code === 'B' && event.presale"
        weight="medium"
        :color="whitedTexts"
        class="app-programmation-card__from-price"
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
        class="app-programmation-card__cta"
        >En savoir +</AtomsCTA
      >

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
        class="app-programmation-card__cta"
      >
        {{
          event.status_code === 'K' ||
          (event.status_code === 'B' && event.presale)
            ? `Liste d'attente`
            : `Réserver`
        }}
      </AtomsCTA>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
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
      isVisible: false, // If the card is visible in the listing
      isAppear: false, // If the layer card has already appeared
      inView: false, // If the card is present in the viewport zone
    }
  },
  computed: {
    ...mapState({
      programmationsEventContent: (state) => state.programmationsEventContent,
    }),
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
  watch: {},
  mounted() {
    // console.log('event', this.event);
    this.initMatchMedia()
  },
  beforeDestroy() {
    this.mm?.revert()
    this.scrollTrigger?.kill()
    this.scrollTriggerInView?.kill()
  },
  methods: {
    onRouterPush() {
      this.$router.push({
        name: 'programmation-id',
        params: {
          id: `${this.$convertToKebabCase(this.event.content.url)}--${
            this.event.id
          }`,
        },
      })
    },
    initMatchMedia() {
      this.mm = gsap.matchMedia()

      this.mm.add('(min-width: 768px)', (context) => {
        this.scrollTrigger = ScrollTrigger.create({
          trigger: this.$el,
          start: 'top+=20% bottom',
          toggleActions: 'play none play none',
          once: true,
          onEnter: () => {
            if (this.isAppear) return

            this.isAppear = true
          },
          onEnterBack: () => {
            if (this.isAppear) return

            this.isAppear = true
          },
        })

        // this.scrollTriggerInView = ScrollTrigger.create({
        //   trigger: this.$el,
        //   start: 'top bottom',
        //   end: 'bottom top',
        //   onToggle: (e) => {
        //     this.inView = e.isActive
        //   },
        // })

        return () => {
          this.scrollTrigger?.kill()
          this.scrollTriggerInView?.kill()
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
  cursor: pointer;

  @include mobile {
    grid-column: span 6;
  }

  @include mobile-l {
    grid-column: span 3;
  }

  @include desktop-l {
    grid-column: span 3;
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

    &.is-appear {
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

    .app-programmation-event-status {
      position: absolute;
      right: 0;
      border-right: none;
      border-top: none;
      top: 0;
      z-index: 10;

      @include mobile-l {
        font-size: mobile-vw(15px);
        line-height: mobile-vw(15px);
      }

      @include desktop-l {
        font-size: desktop-vw(25px);
        line-height: desktop-vw(25px);
      }
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
      padding: mobile-vw(15px) mobile-vw(15px) mobile-vw(76px) mobile-vw(15px);
    }

    @include mobile-l {
      padding: mobile-vw(8px) mobile-vw(8px) mobile-vw(4px) mobile-vw(8px);
    }

    @include desktop-l {
      padding: desktop-vw(12px) desktop-vw(18px);
    }
  }

  &__head {
    display: flex;
    justify-content: flex-start;

    .P2 {
      text-transform: uppercase;

      @include mobile-l {
        font-size: mobile-vw(10px);
        line-height: mobile-vw(8px);
      }
    }
    .type {
    }

    .date {
      margin-left: desktop-vw(30px);
    }
  }

  .H2.bold {
    @include font-ITCFranklinGothicLT-DmXtraCp();
    font-size: desktop-vw(64px);
    line-height: desktop-vw(58px);
    margin-top: desktop-vw(5px);
    margin-bottom: desktop-vw(70px);
    letter-spacing:0;

    @include mobile {
      margin-top: mobile-vw(5px);
      margin-bottom: mobile-vw(85px);
      font-size: mobile-vw(46px);
      line-height: mobile-vw(42px);
    }

    @include mobile-l {
      margin-bottom: mobile-vw(40px);
      font-size: mobile-vw(24px);
      line-height: mobile-vw(20px);
    }

    @include desktop-l {
      font-size: desktop-vw(32px);
      line-height: desktop-vw(26px);
    }
  }

  &__from-price.P2 {
    margin-top: auto;
    width: 50%;

    @include mobile {
      width: 100%;
      text-align: right;
    }

    @include mobile-l {
      width: 35%;
      text-align: left;
      font-size: mobile-vw(10px);
      line-height: mobile-vw(10px);
    }

    @include desktop-l {
      font-size: desktop-vw(12px);
      line-height: desktop-vw(16px);
      width: 40%;
    }
  }

  &__cta.app-atoms-cta {
    position: absolute;
    bottom: 0;
    background: var(--c-grey);
    right: 0;
    border-right: none;
    border-bottom: none;
    overflow: hidden;

    @include mobile-l {
      padding: mobile-vw(5px) mobile-vw(12px) mobile-vw(5px) mobile-vw(12px);
    }

    .app-atoms-cta__arrow {
      @include mobile-l {
        margin-left: mobile-vw(8px);
        width: mobile-vw(8px);
      }
    }

    .P2 {
      @include mobile-l {
        font-size: mobile-vw(10px);
        line-height: mobile-vw(8px);
      }
    }
  }
}
</style>
