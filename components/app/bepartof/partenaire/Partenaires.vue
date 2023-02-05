<template>
  <div class="app-be-part-of-partenaire-partenaires block-inner">
    <ERichText
      class="app-be-part-of-partenaire-partenaires__title"
      :content="contents.title"
    />

    <AppBepartofPartenairePartenairesLogos
      :logos="contents.list"
      :cols="!$viewport.isMobile ? 10 : 4"
      :rows="!$viewport.isMobile ? 6 : 8"
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

  &__title.app-element-rich-text {
    margin-bottom: desktop-vw(20px);
    width: 85%;

    @include mobile {
      margin-bottom: mobile-vw(40px);
      width: 100%;
    }

    .bold {
      display: inline-block;
    }
  }
}
</style>
