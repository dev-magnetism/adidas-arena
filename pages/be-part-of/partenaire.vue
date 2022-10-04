<template>
  <main class="page-be-part-of-partenaire">
    <AppBepartofPartenaireIntroduction />
    <AppBepartofPartenairePartenaires />
    <AppArenaGallery />
    <AppContactQuestion />
    <AppContactNewsletter />
    <AppFooter />
  </main>
</template>

<script>
import scroll from '@/mixins/scroll'

export default {
  mixins: [scroll],

  data() {
    return {}
  },

  mounted() {},
}
</script>

<style lang="scss">
.page-be-part-of-partenaire {
  margin-top: desktop-vw(300px);

  .app-contact-question {
    margin-top: desktop-vw(280px);
  }
  .app-contact-newsletter {
    margin-bottom: desktop-vw(180px);
  }
}
</style>
