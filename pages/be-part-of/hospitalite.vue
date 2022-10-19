<template>
  <main class="page-be-part-of-hospitalite">
    <!-- <ETwoColumnsStick
      :left-content="partners.data.Key_words_left"
      :right-content="partners.data.Key_words_right"
    /> -->
    <AppBepartofHospitalitePresentation />
    <ESlider />
    <AppContactQuestion />
    <AppContactNewsletter />
    <AppFooter :contents="app" />
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

    return {
      app,
    }
  },
  data() {
    return {}
  },

  mounted() {},
}
</script>

<style lang="scss">
.page-be-part-of-hospitalite {
  .app-contact-question {
    margin-top: desktop-vw(280px);
  }
  .app-contact-newsletter {
    margin-bottom: desktop-vw(180px);
  }
}
</style>
