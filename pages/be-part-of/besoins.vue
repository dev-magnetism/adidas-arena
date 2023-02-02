<template>
  <main class="page-be-part-of-besoins">
    <AppBepartofBesoinsIntroduction :contents="contentIntroduction" />
    <AppBepartofBesoinsArena :contents="contentArena" />
    <AppContactQuestion
      :urltemporaire="'arenaforbusiness@adidasarena.com'"
      :contents="contentContactQuestion"
    />
    <AppFooter :contents="appContent" :logos="partnersContent.data" />
  </main>
</template>

<script>
import { mapState } from 'vuex'

import scroll from '@/mixins/scroll'
import pageTransition from '@/mixins/page-transition'

export default {
  mixins: [scroll],
  transition(to, from) {
    if (!to || !from) return

    return pageTransition.basic
  },
  async asyncData({ $directus, $seo, store }) {
    const content = await $directus.items('Configurations_page').readByQuery({
      limit: -1,
    })

    $seo({
      title: content.data.page_title,
      description: content.data.page_description_seo,
      openGraph: {
        title: store.state.appContent.data.seo_title,
        description: content.data.page_description_seo,
      },
      twitter: {
        title: store.state.appContent.data.seo_title,
        description: content.data.page_description_seo,
      },
    })

    return {
      content,
    }
  },
  data() {
    return {}
  },

  computed: {
    ...mapState({
      partnersContent: (state) => state.partnersContent,
      appContent: (state) => state.appContent,
    }),
    contentIntroduction() {
      return {
        title: this.content.data.presentation_title,
        subtitle: this.content.data.presentation_subtitle,
        subtitleList: this.content.data.presentation_subtitle_list,
        secondTitle: this.content.data.presentation_second_title,
        paragraph: this.content.data.presentation_paragraph,
        pictureFramed: {
          src: this.content.data.presentation_picture_framed,
          alt: this.content.data.presentation_picture_framed_alt,
        },
        picture: {
          src: this.content.data.presentation_picture,
          alt: this.content.data.presentation_picture_alt,
        },
      }
    },
    contentArena() {
      return {
        title: this.content.data.arena_title,
        columnLeft: this.content.data.arena_column_left,
        columnRight: this.content.data.arena_column_right,
        items: this.content.data.arena_slider,
      }
    },
    contentContactQuestion() {
      return {
        title: this.content.data.contact_question,
      }
    },
  },

  mounted() {},
}
</script>

<style lang="scss">
.page-be-part-of-besoins {
  margin-top: desktop-vw(200px);

  @include mobile {
    margin-top: mobile-vw(115px);
  }
}
</style>
