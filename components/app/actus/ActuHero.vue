<template>
  <div class="app-actualite-hero grid-inner">
    <div class="app-actualite-hero__left">
      <TP1 tag="div" weight="medium" class="app-actualite-hero__breadcrumb">
        <nuxt-link to="/" class="app-actualite-hero__breadcrumb-home">
          ACCUEIL
        </nuxt-link>
        /
        <nuxt-link
          to="/nos-actualites"
          class="app-actualite-hero__breadcrumb-actus"
          >NOS ACTUS</nuxt-link
        >
        /
        <span class="app-actualite-hero__breadcrumb-actual">{{
          content.title
        }}</span>
      </TP1>
      <TH4 weight="bold" class="app-actualite-hero__date timeline-text">
        {{ frenchDate }}
      </TH4>

      <TH2 ref="title" weight="bold" class="app-actualite-hero__title">
        {{ content.title }}
      </TH2>

      <TH4 weight="bold" class="app-actualite-hero__description timeline-text">
        {{ content.subtitle }}
      </TH4>
    </div>
    <div ref="rightEl" class="app-actualite-hero__right">
      <AtomsCornerPoints :size-points="10" />

      <nuxt-picture
        ref="picture"
        provider="directus"
        :src="content.cover.filename_disk"
        format="webp"
        :alt="`hero-cover-${content.title}`"
        sizes="sm:50vw md:100vw"
      />
    </div>

    <TH4
      weight="bold"
      class="app-actualite-hero__description-mobile timeline-text"
    >
      {{ content.subtitle }}
    </TH4>
  </div>
</template>

<script>
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'

import { mapState, mapMutations } from 'vuex'

export default {
  props: {
    content: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      playhead: {
        left: 0,
        top: 0,
        bottom: 0,
      },
    }
  },
  computed: {
    frenchDate() {
      const date = new Date(this.content.date)

      const options = { day: 'numeric', month: 'long', year: 'numeric' }

      return date.toLocaleDateString('fr-FR', options)
    },
    ...mapState({
      allLoadedFake: (state) => state.allLoadedFake,
      initialHeroDisplayed: (state) => state.initialHeroDisplayed,
    }),
  },
  watch: {
    initialHeroDisplayed(newVal) {
      if (!newVal) return

      this.initTimeline(0.35)
    },
  },
  mounted() {
    this.initSplitText()

    if (this.allLoadedFake) {
      this.initTimeline(0.8)
    }
  },

  beforeDestroy() {
    this.tl?.kill()
  },
  methods: {
    initTimeline(delay = 0) {
      if (this.$viewport.isMobile) {
        this.setAllowScroll(true)
      } else {
        this.tl = gsap
          .timeline({
            delay,
            onStart: () => {
              this.setAllowScroll(true)
            },
          })
          .addLabel('texts')
          .fromTo(
            this.$refs.rightEl,
            {
              '--scale-front-y': 1,
            },
            {
              '--scale-front-y': 0,
              duration: 0.7,
              ease: 'power1.inOut',
            },
            'texts'
          )
          .fromTo(
            this.$refs.rightEl,
            {
              '--scale-back-y': 1,
            },
            {
              '--scale-back-y': 0,
              duration: 0.7,
              ease: 'power1.inOut',
            },
            'texts+=20%'
          )
          .fromTo(
            ['.timeline-text', this.splitting.lines, '.timeline-block'],
            {
              y: 75,
            },
            {
              y: '0%',
              duration: 0.4,
              stagger: 0.035,
              ease: 'power1.inOut',
            },
            'texts'
          )
          .fromTo(
            ['.timeline-text', this.splitting.lines, '.timeline-block'],
            {
              opacity: 0,
            },
            {
              opacity: 1,
              duration: 0.6,
              stagger: 0.035,
              ease: 'power1.inOut',
            },
            'texts'
          )
          .addLabel('texts')
      }
    },
    initSplitText() {
      if (this.$viewport.isMobile) return

      this.splitting = new SplitText(this.$refs.title.$el, {
        type: 'lines',
        linesClass: 'line',
      })
    },

    ...mapMutations({
      setAllowScroll: 'setAllowScroll',
    }),
  },
}
</script>

<style lang="scss">
.app-actualite-hero {
  &__left {
    grid-column: 2 / 6 span;
    display: flex;
    flex-direction: column;
    width: 100%;

    @include mobile {
      grid-column: 1 / 6 span;
      grid-row: 1;
    }
  }

  &__breadcrumb {
    margin-bottom: desktop-vw(15px);

    @include mobile {
      margin-bottom: mobile-vw(15px);
    }

    &-home,
    &-actus {
      color: var(--c-blue-adidas) !important;
      cursor: pointer;
    }
  }

  &__date {
    margin-bottom: desktop-vw(15px);

    @include mobile {
      margin-bottom: mobile-vw(15px);
    }
  }

  &__title {
    margin-bottom: desktop-vw(55px);

    @include mobile {
      margin-bottom: mobile-vw(60px);
    }
  }

  &__description {
    width: 85.5%;

    @include mobile {
      display: none;
    }
  }

  &__description-mobile {
    width: 100%;
    grid-column: 1 / span 6;
    margin-top: mobile-vw(15px);

    @include desktop {
      display: none;
    }
  }

  &__right {
    grid-column: 8 / span 5;
    background: white;
    aspect-ratio: 550/ 695;
    width: 100%;
    height: auto;
    position: relative;
    --scale-back-y: 1;
    --scale-front-y: 1;

    @include mobile {
      grid-column: 1 / 6 span;
      grid-row: 2;
      aspect-ratio: 345/ 430;
    }

    &::before {
      content: '';
      width: calc(100% + 16px);
      height: calc(100% + 16px);
      background: var(--c-grey);
      display: block;
      position: absolute;
      top: 50%;
      left: 50%;
      z-index: 99;
      transform: translate(-50%, -50%) scaleY(var(--scale-front-y));
      transform-origin: center bottom;

      @include mobile {
        display: none;
      }
    }

    &::after {
      content: '';
      width: calc(100%);
      height: calc(100%);
      background: var(--c-blue-adidas);
      display: block;
      position: absolute;
      top: 50%;
      left: 50%;
      z-index: 98;
      transform: translate(-50%, -50%) scaleY(var(--scale-back-y));
      transform-origin: center bottom;

      @include mobile {
        display: none;
      }
    }

    picture.app-programmation-image {
      position: relative;
      z-index: 1;
      @include noise();
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
  }
}
</style>
