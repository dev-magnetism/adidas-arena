<template>
  <main class="app-actualites">
    <AppActusHero :content="contentHero" />

    <AppActusList />

    <AppFooter v-if="this.webview !== 'ok'" :contents="appContent" :logos="partnersContent.data" />
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
  async asyncData({ $directus }) {
    const content = await $directus.items('Actualites_page').readByQuery({
      limit: -1,
    })
    return {
      content,
    }
  },
  data(){
    return{
      webview: ''
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
      actualitesCategories: 'actualitesCategories',
    }),
    ...mapState({
      partnersContent: (state) => state.partnersContent,
      appContent: (state) => state.appContent,
      programmes: (state) => state.programmes,
    }),
    contentHero() {
      return {
        title: this.content.data.hero_title,
        paragraph: this.content.data.hero_paragraph,
        frontPicture: this.content.data.hero_front_picture,
        backPicture: this.content.data.hero_back_picture,
      }
    },
  },
  mounted() {
    this.webview =  this.$route.query.webview;
  },
  methods: {
    ...mapMutations({
      setExteriorVisible: 'setExteriorVisible',
    }),
  },
}
</script>

<style lang="scss">
.app-actualites {
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
