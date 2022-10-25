<template>
  <div class="app-be-part-of-partenaire-partenaires block-inner">
    <ERichText
      class="app-be-part-of-partenaire-partenaires__title"
      :content="contents.title"
    />

    <AppBepartofPartenairePartenairesLogos
      :logos="contents.list"
      :rows="6"
      :cols="10"
    />
  </div>
</template>

<script>
export default {
  props: {
    contents: {
      type: Object,
      default: () => {},
    },
  },
}
</script>

<style lang="scss">
.app-be-part-of-partenaire-partenaires {
  position: relative;
  margin-bottom: desktop-vw(120px);

  &__title.H1 {
    margin-bottom: desktop-vw(20px);
  }
}
</style>
