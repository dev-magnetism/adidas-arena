<template>
  <main class="page-be-part-of-configurations">
    <AppBepartofConfigurationsIntroduction />
    <AppBepartofConfigurationsArena />
    <AppContactQuestion />
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
.page-be-part-of-configurations {
  margin-top: desktop-vw(300px);
}
</style>
