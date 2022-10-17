<template>
  <main class="app-arena">
    <AppArenaParisBasketClub />
    <EFullwidth />
    <AppArenaPartners :contents="contentPartners" />
    <AppArenaGallery />
    <AppFooter />
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

    return {
      partners,
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
