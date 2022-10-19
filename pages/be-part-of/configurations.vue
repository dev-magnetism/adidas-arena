<template>
  <main class="page-be-part-of-configurations">
    <AppBepartofConfigurationsIntroduction />
    <AppBepartofConfigurationsArena />
    <AppContactQuestion />
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
.page-be-part-of-configurations {
  margin-top: desktop-vw(300px);
}
</style>
