<template>
  <div class="app-be-part-of-partenaire-partenaires block-inner">
    <TH1 class="app-be-part-of-partenaire-partenaires__title"
      >Déjà 12 partenaires</TH1
    >
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
