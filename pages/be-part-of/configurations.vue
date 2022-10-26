<template>
  <main class="page-be-part-of-configurations">
    <AppBepartofConfigurationsIntroduction :contents="contentIntroduction" />
    <AppBepartofConfigurationsArena :contents="contentArena" />
    <AppContactQuestion :contents="contentContactQuestion" />
    <AppFooter :contents="app" :logos="partners.data" />
  </main>
</template>

<script>
import scroll from '@/mixins/scroll'

export default {
  mixins: [scroll],
  async asyncData({ $directus }) {
    const app = await $directus.items('App').readByQuery({
      limit: -1,
    })

    const content = await $directus.items('Configurations_page').readByQuery({
      limit: -1,
    })

    const partners = await $directus.items('Partners').readByQuery({
      limit: -1,
    })

    return {
      app,
      content,
      partners,
    }
  },
  data() {
    return {}
  },

  computed: {
    contentIntroduction() {
      return {
        title: this.content.data.presentation_title,
        subtitle: this.content.data.presentation_subtitle,
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
.page-be-part-of-configurations {
  margin-top: desktop-vw(300px);

  @include mobile {
    margin-top: mobile-vw(115px);
  }
}
</style>
