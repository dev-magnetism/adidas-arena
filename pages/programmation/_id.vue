<template>
  <main class="app-programmation-event">
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
    />
    <!-- <AppProgrammationEventOffers ref="offers" /> -->
    <AppProgrammationEventSafetyInstructions :content="contentSafety" />
    <AppProgrammationEventAboutArtist :event="event" />
    <AppProgrammationEventMoreEvents :content="contentMoreEvents" />
    <AppFooter :contents="appContent" :logos="partnersContent.data" />
    <AppProgrammationEventBar :event="event" :class="{ hide: !appearBar }" />
    <!-- <AppProgrammationPopinWaitingLine /> -->
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
      return {
        title: this.programmationsEventContent.safety_instructions_title,
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
    console.log('event', this.event)

    this.initMatchMedia()
  },
  beforeDestroy() {
    this.scrollTrigger?.kill()
    this.mm?.kill()
  },
  methods: {
    onSelectDate(index) {
      console.log('onSelectDate', index)
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

  .app-footer {
    margin-top: desktop-vw(120px);

    @include mobile {
      margin-top: mobile-vw(70px);
    }
  }
}
</style>
