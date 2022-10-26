<template>
  <div class="app-projet-gallery grid-inner">
    <div class="app-projet-gallery__item">
      <nuxt-picture
        provider="directus"
        class="app-projet-gallery__item__visual"
        :src="contents.leftPicture"
        format="webp"
        :alt="contents.leftPictureAlt"
      />
      <div class="app-projet-gallery__item__content">
        <div class="app-projet-gallery__item__infos">
          <TH3>{{ contents.leftTitle }}</TH3>
          <TH4 weight="medium">{{ contents.leftSubtitle }}</TH4>
        </div>
        <TP1 weight="regular">{{ contents.leftParagraph }} </TP1>
      </div>
    </div>
    <div class="app-projet-gallery__item">
      <nuxt-picture
        provider="directus"
        class="app-projet-gallery__item__visual"
        :src="contents.rightPicture"
        format="webp"
        :alt="contents.rightPictureAlt"
      />
      <div class="app-projet-gallery__item__content">
        <div class="app-projet-gallery__item__infos">
          <TH3>{{ contents.rightTitle }}</TH3>
          <TH4 weight="medium">{{ contents.rightSubtitle }}</TH4>
        </div>
        <TP1 weight="regular">{{ contents.rightParagraph }} </TP1>
      </div>
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
  mounted() {},
}
</script>

<style lang="scss">
.app-projet-gallery {
  margin-top: desktop-vw(230px);

  &__item {
    grid-column: span 6;

    &__visual {
      display: block;
      aspect-ratio: 670 / 680;
      position: relative;

      @include mobile {
        aspect-ratio: 345 / 350;
      }

      @include noise();
    }

    &__content {
      display: flex;
      justify-content: space-between;
      margin-top: desktop-vw(35px);

      @include mobile {
        margin-top: mobile-vw(25px);
        flex-direction: column;
      }

      .P1 {
        width: 65%;

        @include mobile {
          width: 70%;
          margin-left: auto;
          margin-top: mobile-vw(20px);
        }
      }
    }

    &__infos {
      .H3 {
        font-size: desktop-vw(48px);
        line-height: desktop-vw(42px);
        letter-spacing: -0.04em;

        @include mobile {
          font-size: mobile-vw(40px);
          line-height: mobile-vw(40px);
        }
      }
      .H4 {
        font-size: desktop-vw(28px);
        line-height: desktop-vw(36px);
        letter-spacing: -0.04em;
        margin-top: desktop-vw(10px);

        @include mobile {
          font-size: mobile-vw(28px);
          line-height: mobile-vw(28px);
          margin-top: mobile-vw(10px);
        }
      }
    }
  }
}
</style>
