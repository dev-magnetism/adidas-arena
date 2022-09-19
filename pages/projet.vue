<template>
  <main class="app-projet">
    <AppProjetIntroduction />
    <AppProjetCatchPhrase />
    <AppProjetGallery />
    <AppProjetWorkProgress />
    <AppProjetPlan />
    <AppProjetTwoColumns />
  </main>
</template>

<script>
import scroll from '@/mixins/scroll'

export default {
  mixins: [scroll],

  mounted() {},
}
</script>

<style lang="scss">
.app-projet {
  // background: black;
  padding-top: desktop-vw(200px);
  padding-bottom: desktop-vw(80px);
}
</style>
