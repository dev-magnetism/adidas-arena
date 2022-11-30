<template>
  <main ref="main" class="app-projet">
    <div ref="mainWrapper" class="app-projet__wrapper">
      <AppProjetIntroduction :contents="contentIntroduction" />
      <!-- <AppProjetCatchPhrase :contents="contentCatchphrase" /> -->
      <AppProjetGallery :contents="contentGallery" />
      <AppProjetWorkProgress :contents="contentWorkProgress" />
      <AppProjetPlan :contents="contentPlan" />
      <AppProjetTwoColumns :contents="contentTwoColumns" />
      <AppFooter :contents="appContent" :logos="partnersContent.data" />
    </div>
  </main>
</template>

<script>
import { mapState } from 'vuex'

import scroll from '@/mixins/scroll'

export default {
  mixins: [scroll],
  async asyncData({ $directus }) {
    const content = await $directus.items('Projet_page').readByQuery({
      limit: -1,
    })

    return {
      content,
    }
  },
  computed: {
    ...mapState({
      partnersContent: (state) => state.partnersContent,
      appContent: (state) => state.appContent,
    }),
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
    contentWorkProgress() {
      return {
        title: this.content.data.work_progress_title,
        description: this.content.data.work_progress_description,
        items: this.content.data.work_progress_items,
        firstRow: {
          surtitle: this.content.data.work_progress_first_row_surtitle,
          title: this.content.data.work_progress_first_row_title,
        },
        secondRow: {
          surtitle: this.content.data.work_progress_second_row_surtitle,
          title: this.content.data.work_progress_second_row_title,
        },
        column: {
          surtitle: this.content.data.work_progress_column_surtitle,
          description: this.content.data.work_progress_column_description,
        },
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

  @include mobile {
    padding-top: mobile-vw(80px);
  }

  .app-footer {
    margin-top: desktop-vw(80px);

    @include mobile {
      margin-top: mobile-vw(130px);
    }
  }
}
</style>
