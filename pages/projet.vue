<template>
  <main ref="main" class="app-projet">
    <div ref="mainWrapper" class="app-projet__wrapper">
      <AppProjetIntroduction :contents="contentIntroduction" />
      <AppProjetCatchPhrase :contents="contentCatchphrase" />
      <AppProjetGallery :contents="contentGallery" />
      <AppProjetWorkProgress />
      <AppProjetPlan :contents="contentPlan" />
      <AppProjetTwoColumns :contents="contentTwoColumns" />
      <AppFooter :contents="app" :logos="partners.data" />
    </div>
  </main>
</template>

<script>
import scroll from '@/mixins/scroll'

export default {
  mixins: [scroll],
  async asyncData({ $directus }) {
    const content = await $directus.items('Projet_page').readByQuery({
      limit: -1,
    })

    const partners = await $directus.items('Partners').readByQuery({
      limit: -1,
    })

    const app = await $directus.items('App').readByQuery({
      limit: -1,
    })

    return {
      content,
      partners,
      app,
    }
  },
  computed: {
    contentIntroduction() {
      return {
        title: this.content.data.projet_introduction_title,
        subtitle: this.content.data.projet_introduction_subtitle,
        whyTitle: this.content.data.projet_introduction_why_title,
        whyParagraph: this.content.data.projet_introduction_why_paragraph,
        pictureFramedImage:
          this.content.data.projet_introduction_picture_framed_image,
        pictureFramedAlt:
          this.content.data.projet_introduction_picture_framed_alt,
        pictureLabelImage:
          this.content.data.projet_introduction_picture_label_image,
        pictureLabelAlt:
          this.content.data.projet_introduction_picture_label_alt,
        pictureLabelText:
          this.content.data.projet_introduction_picture_label_text,
        pictureLogoImage:
          this.content.data.projet_introduction_picture_logo_image,
        pictureLogoAlt: this.content.data.projet_introduction_picture_logo_alt,
      }
    },
    contentCatchphrase() {
      return {
        catchphrase: this.content.data.projet_catchphrase,
      }
    },
    contentGallery() {
      return {
        leftPicture: this.content.data.projet_gallery_left_picture,
        leftPictureAlt: this.content.data.projet_gallery_left_picture_alt,
        leftTitle: this.content.data.projet_gallery_left_title,
        leftSubtitle: this.content.data.projet_gallery_left_subtitle,
        leftParagraph: this.content.data.projet_gallery_left_paragraph,
        rightPicture: this.content.data.projet_gallery_right_picture,
        rightPictureAlt: this.content.data.projet_gallery_right_picture_alt,
        rightTitle: this.content.data.projet_gallery_right_title,
        rightSubtitle: this.content.data.projet_gallery_right_subtitle,
        rightParagraph: this.content.data.projet_gallery_right_paragraph,
      }
    },
    contentPlan() {
      return {
        title: this.content.data.projet_plan_title,
        subtitle: this.content.data.projet_plan_subtitle,
        paragraph: this.content.data.projet_plan_paragraph,
        chapelle: this.content.data.projet_plan_chapelle_place,
        basilique: this.content.data.projet_plan_basilique_place,
      }
    },
    contentTwoColumns() {
      return {
        firstRow: {
          title: this.content.data.projet_two_columns_first_row_title,
          paragraph: this.content.data.projet_two_columns_first_row_paragraph,
          cardTitle: this.content.data.projet_two_columns_first_row_card_title,
          cardSubtitle:
            this.content.data.projet_two_columns_first_row_card_subtitle,
          cardParagraph:
            this.content.data.projet_two_columns_first_row_card_paragraph,
          cardCtaText:
            this.content.data.projet_two_columns_first_row_card_cta_text,
        },
        secondRow: {
          title: this.content.data.projet_two_columns_second_row_title,
          paragraph: this.content.data.projet_two_columns_second_row_paragraph,
          picture: this.content.data.projet_two_columns_second_row_picture,
          pictureAlt:
            this.content.data.projet_two_columns_second_row_picture_alt,
          cardTitle: this.content.data.projet_two_columns_second_row_card_title,
          cardSubtitle:
            this.content.data.projet_two_columns_second_row_card_subtitle,
          cardParagraph:
            this.content.data.projet_two_columns_second_row_card_paragraph,
        },
      }
    },
  },
  mounted() {},
}
</script>

<style lang="scss">
.app-projet {
  // background: black;
  padding-top: desktop-vw(200px);

  .app-footer {
    margin-top: desktop-vw(80px);
  }
}
</style>
