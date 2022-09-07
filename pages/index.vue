<template>
  <main class="app-home">
    <AppHomeHero />
  </main>
</template>

<script>
export default {}
</script>

<style lang="scss">
.test {
  height: 50vh;
  width: 100%;
  background: red;

  @include mobile {
    background: green;
  }
}
</style>
