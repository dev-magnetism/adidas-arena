<template>
  <main class="app-programmation">
    <AppProgrammationHero :contents="contentHero" />
    <AppProgrammationGrid />
    <AppFooter :contents="appContent" :logos="partnersContent.data" />
  </main>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

import scroll from '@/mixins/scroll'
import pageTransition from '@/mixins/page-transition'

export default {
  mixins: [scroll],
  transition(to, from) {
    if (!to || !from) return

    console.log(from, to)

    return pageTransition.basic
  },
  async asyncData({ $directus }) {
    const content = await $directus.items('Programmation_page').readByQuery({
      limit: -1,
    })

    return {
      content,
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
    ...mapState({
      partnersContent: (state) => state.partnersContent,
      appContent: (state) => state.appContent,
      allLoadedFake: (state) => state.allLoadedFake,
    }),

    contentHero() {
      return {
        title: this.content.data.hero_title,
        paragraph: this.content.data.hero_paragraph,
      }
    },
  },
  watch: {
    // allLoadedFake() {
    //   this.setExteriorVisible(true)
    // },
  },
  mounted() {
    // if (!this.exteriorVisible) this.setExteriorVisible(true)
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
    margin-top: desktop-vw(25px);

    @include mobile {
      margin-top: mobile-vw(80px);
    }
  }
}
</style>
