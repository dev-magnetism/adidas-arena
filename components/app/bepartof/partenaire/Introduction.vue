<template>
  <div class="app-be-part-of-partenaire-introduction grid-inner">
    <div class="app-be-part-of-partenaire-introduction__f-row__content">
      <ERichText
        class="app-be-part-of-partenaire-introduction__f-row__content__title"
        :content="contents.title"
      />
      <TP2
        class="app-be-part-of-partenaire-introduction__f-row__content__text"
        weight="bold"
      >
        {{ contents.subtitle }}
      </TP2>
    </div>

    <nuxt-picture
      class="app-be-part-of-partenaire-introduction__f-row__visual"
      provider="directus"
      :src="contents.picture.src"
      format="webp"
      :alt="contents.picture.alt"
    />

    <EFramedPicture
      class="app-be-part-of-partenaire-introduction__s-row__visual"
      color="red-adidas"
    >
      <nuxt-picture
        provider="directus"
        :src="contents.pictureFramed.src"
        format="webp"
        :alt="contents.pictureFramed.alt"
      />
    </EFramedPicture>

    <div class="app-be-part-of-partenaire-introduction__s-row__content">
      <TH4
        class="app-be-part-of-partenaire-introduction__s-row__content__title"
      >
        {{ contents.secondTitle }}
      </TH4>

      <ERichText
        class="app-be-part-of-partenaire-introduction__s-row__content__text"
        :content="contents.secondSubtitle"
      />
    </div>
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
.app-be-part-of-partenaire-introduction {
  position: relative;
  margin-bottom: desktop-vw(-120px);

  &__f-row {
    &__content {
      grid-column: 2 / span 5;
      grid-row: 1;
      display: flex;
      flex-direction: column;
      width: 95%;

      &__title {
        text-transform: uppercase;
        margin-bottom: desktop-vw(20px);
      }
      &__text {
        text-transform: uppercase;
        width: 80%;
      }
    }
    &__visual {
      grid-column: 7 / span 6;
      grid-row: 1;
      transform: rotate(3deg);
      aspect-ratio: 650/785;
      width: 100%;
      left: columns(0);
      position: relative;
      margin-top: desktop-vw(80px);
    }
  }

  &__s-row {
    &__content {
      grid-column: 8 / span 4;
      grid-row: 2;
      display: flex;
      flex-direction: column;
      width: 100%;
      margin-top: desktop-vw(80px);

      &__title {
        margin-bottom: desktop-vw(30px);
      }
      &__text {
        width: 80%;

        .P2.wysiwyg-text {
          @include font-adihausDIN-medium();
        }
      }
    }

    &__visual {
      grid-column: 2 / span 5;
      grid-row: 2;
      //   transform: rotate(3deg);
      aspect-ratio: 545/670;
      width: 100%;
      position: relative;
      top: -60%;
      transform: rotate(-4deg);
      width: 105%;
    }
  }
}
</style>
