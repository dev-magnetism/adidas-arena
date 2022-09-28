<template>
  <main class="page-be-part-of-hospitalite">
    <ETwoColumnsStick
      :left-content="partners.data.Key_words_left"
      :right-content="partners.data.Key_words_right"
    />
    <AppBepartofHospitalitePresentation />
    <ESlider />
    <AppContactQuestion />
    <AppContactNewsletter />
    <AppFooter />
  </main>
</template>

<script>
import scroll from '@/mixins/scroll'

export default {
  mixins: [scroll],
  async asyncData({ $directus }) {
    const partners = await $directus.items('le_bloc_page').readByQuery({
      limit: -1,
    })

    return {
      partners,
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
