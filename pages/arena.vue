<template>
  <main class="app-arena">
    <AppArenaParisBasketClub />
    <EFullwidth />
    <AppArenaPartners />
    <AppArenaGallery />
    <AppFooter />
  </main>
</template>

<script>
import scroll from '@/mixins/scroll'

export default {
  mixins: [scroll],
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
