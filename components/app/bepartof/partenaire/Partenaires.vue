<template>
  <div class="app-be-part-of-partenaire-partenaires block-inner">
    <TH1 class="app-be-part-of-partenaire-partenaires__title"
      >Déjà 12 partenaires</TH1
    >
    <AppBepartofPartenairePartenairesLogos :rows="6" :cols="10" />
  </div>
</template>

<style lang="scss">
.app-be-part-of-partenaire-partenaires {
  position: relative;
  margin-bottom: desktop-vw(120px);

  &__title.H1 {
    margin-bottom: desktop-vw(20px);
  }
}
</style>
