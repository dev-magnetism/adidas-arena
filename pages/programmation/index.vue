<template>
  <main class="app-programmation">
    <AppProgrammationHero :content="contentHero" />

    <AppProgrammationList 
      :content="contentList"
      />

    <AppFooter :contents="appContent" :logos="partnersContent.data" />
  </main>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex'

import scroll from '@/mixins/scroll'
import pageTransition from '@/mixins/page-transition'

export default {
  mixins: [scroll],
  transition(to, from) {
    if (!to || !from) return

    return pageTransition.basic
  },
  props: {
    webview: {
      type: String,
      required: true,
      default: 'ko',
    },
  },
  async asyncData({ $directus }) {
    const content = await $directus.items('Programmation_page').readByQuery({
      limit: -1,
    })

    return {
      content,
    }
  },
  data() {
    return {
      inputCategory: 'tout',
    }
  },

  head({ $seo }) {
    return $seo({
      title: this.content.data.page_title,
      description: this.content.data.page_description_seo,
      openGraph: {
        title: this.appContent.data.seo_title,
        description: this.content.data.page_description_seo,
      },
      twitter: {
        title: this.appContent.data.seo_title,
        description: this.content.data.page_description_seo,
      },
    })
  },

  computed: {
    ...mapGetters({
      programmesCategories: 'programmesCategories',
      programmesMonths: 'programmesMonths',
    }),
    ...mapState({
      partnersContent: (state) => state.partnersContent,
      appContent: (state) => state.appContent,
      allLoadedFake: (state) => state.allLoadedFake,
      programmationsContent: (state) => state.programmationsContent,
      programmes: (state) => state.programmes,
    }),
    contentMainCard() {
      return (
        this.programmes.find((event) => event.main_event) || this.programmes[0]
      )
    },
    contentHero() {
      return {
        title: this.content.data.hero_title,
        paragraph: this.content.data.hero_paragraph,
        event: this.contentMainCard,
      }
    },
    contentList() {
      return {
        spotifyLink: this.content.data.spotify_link
      }
    }
  },
  methods: {
    ...mapMutations({
      setExteriorVisible: 'setExteriorVisible',
    }),
  },
}
</script>

<style lang="scss">
.app-programmation {
  padding-top: desktop-vw(200px);

  @include mobile {
    padding-top: mobile-vw(120px);
  }

  .app-footer {
    margin-top: desktop-vw(100px);

    @include mobile {
      margin-top: mobile-vw(80px);
    }
  }
}
</style>
