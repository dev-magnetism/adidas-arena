<template>
  <main class="page-be-part-of-besoins">
    <AppBepartofBesoinsIntroduction :contents="contentIntroduction" />
    <!-- AppBepartofBesoinsArena :contents="contentArena" / -->
    <EVideosList :contents="contentVideos" />
    <AppContactQuestion ref="questform" :contents="contentContactQuestion" />
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
  async asyncData({ $directus }) {
    const content = await $directus.items('Configurations_page').readByQuery({
      limit: -1,
    })

    const videos = await $directus.items('Configurations_videos').readByQuery({
      limit: -1,
    })

    return {
      content,
      videos,
    }
  },
  data() {
    return {}
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
        cta: this.content.data.contact_question_cta,
        email: this.content.data.contact_question_email,
        emailSubject: this.content.data.contact_question_email_sujet,
        formType: this.content.data.contact_question_form_type,
      }
    },
    contentVideos() {
      return {
        title: this.content.data.videos_title,
        items: this.videos.data,
      }
    },
  },

  mounted() {
    // Trigger Question open
    const _url = document.location.href;
    if(_url.includes('#contact')){
      this.$refs.questform.onClick();
    }
  },
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
