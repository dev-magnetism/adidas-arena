<template>
  <main class="app-programmation-event">
    <AppProgrammationEventHero :event="event" />
    <!-- <AppProgrammationEventCancelation v-if="event.status_code === 'H'" />
    <AppProgrammationEventMoreInformation :event="event" />
    <AppProgrammationEventDates :event="event" />
    <AppProgrammationEventTicketing /> -->
    <!-- <AppProgrammationEventOffers ref="offers" /> -->
    <!-- <AppProgrammationEventSafetyInstructions /> -->
    <AppProgrammationEventAboutArtist :event="event" />
    <!-- <AppProgrammationEventMoreEvents /> -->
    <AppFooter :contents="appContent" :logos="partnersContent.data" />
    <AppProgrammationEventBar :class="{ hide: !appearBar }" />
  </main>
</template>

<script>
import { mapState } from 'vuex'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
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
    }),
    formattedDateStart() {
      const date = new Date(this.event.start)
      const options = { day: 'numeric', month: 'short', year: 'numeric' }

      return date.toLocaleDateString('fr-FR', options)
    },
  },

  mounted() {
    console.log('hereeedddddeeee', this.event)

    this.initScrollTrigger()
  },
  beforeDestroy() {
    this.scrollTrigger?.kill()
  },
  methods: {
    initScrollTrigger() {
      if (!this.$refs.offers) return
      if (this.$viewport.isMobile) return

      this.scrollTrigger = ScrollTrigger.create({
        trigger: this.$refs.offers.$el,
        start: 'top center',
        end: 'top bottom',
        endTrigger: '.app-footer',
        onToggle: (self) => {
          this.appearBar = self.isActive
        },
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
