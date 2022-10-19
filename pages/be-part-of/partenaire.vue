<template>
  <main class="page-be-part-of-partenaire">
    <AppBepartofPartenaireIntroduction />
    <AppBepartofPartenairePartenaires :contents="contentPartners" />
    <AppArenaGallery />
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
    const partners = await $directus.items('Partners').readByQuery({
      limit: -1,
    })

    const app = await $directus.items('App').readByQuery({
      limit: -1,
    })

    return {
      partners,
      app,
    }
  },

  computed: {
    contentPartners() {
      return {
        list: this.partners.data,
      }
    },
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
