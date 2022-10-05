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
  .app-footer {
  }
}
</style>
