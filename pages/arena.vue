<template>
  <main class="app-arena">
    <AppArenaParisBasketClub />
    <EFullwidth></EFullwidth>
    <AppArenaPartners></AppArenaPartners>
    <AppArenaGallery />
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
}
</style>
