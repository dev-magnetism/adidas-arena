<template>
  <main class="app-programmation-event">
    <AtomsCTABack
      :class="{
        reduced: headerReduced,
        hide: !appearCTABack,
      }"
      class="app-programmation-event__cta-back"
      @click.native="onBack()"
    >
      Retour
    </AtomsCTABack>

    <AppProgrammationEventHero ref="hero" :event="event" />

    <AppProgrammationEventCancelation
      v-if="event.status_code === 'H'"
      :content="contentCancelation"
    />

    <AppProgrammationEventMoreInformation :event="event" />

    <AppProgrammationEventDates
      v-if="event.sessions.length - 1 >= 1"
      :content="contentDates"
      :event="event"
      @onSelectDate="onSelectDate"
    />

    <AppProgrammationEventTicketing
      :event="event"
      :content="contentTicketing"
      :index-date="event.sessions.length - 1 > 0 ? indexDate : 0"
    />

    <!-- <AppProgrammationEventOffers ref="offers" /> -->
    <AppProgrammationEventSafetyInstructions :content="contentSafety" />

    <AppProgrammationEventAboutArtist :event="event" />

    <AppProgrammationEventMoreEvents :content="contentMoreEvents" />

    <AppFooter :contents="appContent" :logos="partnersContent.data" />

    <AppProgrammationEventBar :event="event" :class="{ hide: !appearBar }" />
  </main>
</template>

<script>
import { mapState } from 'vuex'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { gsap } from 'gsap'

import scroll from '@/mixins/scroll'
import pageTransition from '@/mixins/page-transition'

const convertToKebabCase = (string) => {
  return string
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
}

export default {
  mixins: [scroll],
  validate({ params, $axios, store }) {
    const [artist, id] = params.id.split('--')

    return store.state.programmes.some(
      (element) =>
        convertToKebabCase(artist) ===
          convertToKebabCase(element.content.url) && element.id === Number(id)
    )
  },
  transition(to, from) {
    if (!to || !from) return

    return pageTransition.basic
  },
  asyncData({ params, store, $axios }) {
    const [artist, id] = params.id.split('--')

    const payload = store.state.programmes.find(
      (element) =>
        convertToKebabCase(artist) ===
          convertToKebabCase(element.content.url) && element.id === Number(id)
    )

    return { event: payload }
  },
  data() {
    return {
      appearBar: false,
      appearCTABack: true,
      indexDate: null,
    }
  },
  head({ $seo }) {
    return $seo({
      templateTitle: '%title% - %name%',
      title: `${this.event.content.title} ${this.formattedDateStart} - Programmation`,
      description: this.event.content.metaDescription,
      openGraph: {
        title: this.appContent.data.seo_title,
        description: this.event.content.metaDescription,
      },
      twitter: {
        title: this.appContent.data.seo_title,
        description: this.event.content.metaDescription,
      },
    })
  },
  computed: {
    ...mapState({
      partnersContent: (state) => state.partnersContent,
      appContent: (state) => state.appContent,
      programmationsEventContent: (state) => state.programmationsEventContent,
      headerReduced: (state) => state.headerReduced,
    }),
    contentCancelation() {
      return {
        title: this.programmationsEventContent.cancelation_title,
        body: this.programmationsEventContent.cancelation_body,
      }
    },
    contentDates() {
      return {
        title: this.programmationsEventContent.dates_title,
      }
    },
    contentTicketing() {
      return {
        title: this.programmationsEventContent.ticketing_title,
      }
    },
    contentSafety() {
      const externalItems =
        !this.event.instruction_id || this.event.instruction_id.length > 0

      return {
        title: this.programmationsEventContent.safety_instructions_title,
        externalItems,
        items: externalItems
          ? this.event.instruction_id
          : this.programmationsEventContent.safety_instructions_items,
      }
    },
    contentMoreEvents() {
      return {
        title: this.programmationsEventContent.also_like_title,
        category: this.event.content.category,
        id: this.event.id,
      }
    },
    formattedDateStart() {
      const date = new Date(this.event.start)
      const options = { day: 'numeric', month: 'short', year: 'numeric' }

      return date.toLocaleDateString('fr-FR', options)
    },
  },

  mounted() {
    console.log('event', this.event, this.event.status_code)

    this.initScrollTrigger()
    this.initMatchMedia()
  },
  beforeDestroy() {
    this.scrollTriggerCTA?.kill()
    this.scrollTrigger?.kill()
    this.mm?.kill()
  },
  methods: {
    onBack() {
      this.$router.push({ path: '/programmation' })
    },
    onSelectDate(index) {
      this.indexDate = index
    },
    initScrollTrigger() {
      this.scrollTriggerCTA = ScrollTrigger.create({
        trigger: this.$el,
        start: 'top top',
        end: 'top center-=25%',
        endTrigger: '.app-footer',
        fastScrollEnd: true,
        onEnterBack: (e) => {
          this.appearCTABack = true
        },
        onLeave: () => {
          this.appearCTABack = false
        },
      })
    },
    initMatchMedia() {
      this.mm = gsap.matchMedia()

      this.mm.add('(min-width: 768px)', (context) => {
        const trigger =
          this.event.sessions.length - 1 >= 1
            ? '.app-programmation-event-dates'
            : '.app-programmation-event-hero'

        this.scrollTrigger = ScrollTrigger.create({
          trigger,
          start: 'bottom top',
          fastScrollEnd: true,
          end: 'top bottom',
          endTrigger: '.app-footer',
          onToggle: (self) => {
            this.appearBar = self.isActive
          },
        })

        return () => {
          this.appearBar = false
          this.scrollTrigger?.kill()
        }
      })
    },
  },
}
</script>

<style lang="scss">
.app-programmation-event {
  padding-top: desktop-vw(165px);

  @include mobile {
    padding-top: mobile-vw(85px);
  }

  &__cta-back {
    position: fixed;
    top: 65px;
    left: var(--layout-margin);
    z-index: 3;
    transition: transform 0.65s var(--ease-out-cubic),
      opacity 0.35s var(--ease-in-out-cubic);
    will-change: transform;

    @include mobile {
      top: mobile-vw(25px);
    }

    &.reduced {
      transform: translate(0%, -40px);

      @include mobile {
        transform: translate(0%, 0%);
      }
    }

    &.hide {
      opacity: 0;
      pointer-events: none;
    }
  }

  .app-footer {
    margin-top: desktop-vw(120px);

    @include mobile {
      margin-top: mobile-vw(70px);
    }
  }
}
</style>
