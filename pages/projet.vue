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
export default {
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
