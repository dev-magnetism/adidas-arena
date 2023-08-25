<template>
  <div
    :class="{ 'is-appear': isAppear, 'in-view': inView }"
    :style="bgColor"
    class="app-actualites-card"
    @click="onRouterPush"
  >
    <div ref="layerFiltering" class="app-actualites-card__layer-filtering" />

    <div class="app-actualites-card__visual">
      <div
        :class="{ 'is-appear': isAppear }"
        class="app-actualites-card__layer"
      />

      <nuxt-picture
        ref="picture"
        provider="directus"
        :src="content.cover.filename_disk"
        format="webp"
        :alt="`hero-cover-${content.title}`"
        sizes="sm:85vw md:50vw"
        loading="lazy"
      />
    </div>

    <div class="app-actualites-card__informations">
      <div class="app-actualites-card__head">
        <TP2 class="type" weight="bold" :color="'blue-adidas'" tag="h3">
          {{ frenchDate }}
        </TP2>
      </div>

      <TH4 :color="whitedTexts" weight="bold" tag="h4">
        {{ content.title }}
      </TH4>

      <TP2
        class="app-actualites-card__reading-time"
        weight="regular"
        :color="whitedTexts"
      >
        TEMPS DE LECTURE : {{ content.reading_time }}
      </TP2>

      <AtomsCTA
        :color="statutColor"
        :layer-color="statutColor"
        :bg="'grey'"
        class="app-actualites-card__cta"
        button
      >
        Lire la suite
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
    content: {
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
      actualites: (state) => state.actualites,
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
    whitedTexts() {
      return 'black'
    },
    frenchDate() {
      const date = new Date(this.content.date)

      const options = { day: 'numeric', month: 'long', year: 'numeric' }

      return date.toLocaleDateString('fr-FR', options)
    },
  },
  watch: {},
  mounted() {
    this.initMatchMedia()
  },
  beforeDestroy() {
    this.mm?.kill()
    this.scrollTrigger?.kill()
    this.scrollTriggerInView?.kill()
  },
  methods: {
    onRouterPush() {
      this.$router.push({
        name: 'nos-actualites-id',
        params: {
          id: `${this.content.slug}`,
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
.app-actualites-card {
  grid-column: span 4;
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  border: 1px solid var(--c-black);
  background-color: var(--c-grey);
  cursor: pointer;

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
    .app-actualites-card__layer {
      transition-delay: 0.1s;
    }
  }
  &:nth-child(3n + 2) {
    .app-actualites-card__layer {
      transition-delay: 0.3s;
    }
  }
  &:nth-child(3n + 3) {
    .app-actualites-card__layer {
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
  }

  picture {
    aspect-ratio: 435 / 435;
    width: 100%;
    display: block;
    position: relative;
    @include noise();

    @include mobile {
      aspect-ratio: 350 / 350;
    }

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
  }

  .H4.bold {
    margin-top: desktop-vw(15px);
    margin-bottom: desktop-vw(70px);

    @include mobile {
      margin-top: mobile-vw(5px);
      margin-bottom: mobile-vw(85px);
    }
  }

  &__reading-time.P2 {
    margin-top: auto;
    text-transform: uppercase;

    @include mobile {
      width: 35%;
    }
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
