<template>
  <main class="app-arena">
    <AppArenaParisBasketClub />
    <EFullwidth />
    <AppArenaPartners :contents="contentPartners" />
    <AppArenaGallery />
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
}
</script>

<style lang="scss">
.app-arena {
  .app-arena-gallery {
    margin-top: desktop-vw(130px);
  }
  .app-footer {
    margin-top: desktop-vw(165px);
  }
}
</style>
