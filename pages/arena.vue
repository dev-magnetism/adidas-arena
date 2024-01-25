<template>
  <main class="app-arena">
    <AppArenaHero />
    <AppArenaIntroduction :contents="contentIntroduction" />
    <AppArenaCatchPhrase :contents="contentCatchphrase" />
    <AppArenaParisBasketClub :contents="contentParisBasketClub" />
    <ESlider :contents="contentSlider" />
    <AppArenaPlan :contents="contentPlan" />
    <!-- EFullwidth :contents="contentFullwidth" / -->
    <!-- AppArenaPartners :contents="contentPartners" / -->
    <AppArenaTwoColumns :contents="contentTwoColumns" />
    <AppGallery :contents="contentGallery" />
    <AppFooter :contents="appContent" :logos="partnersContent.data" />
  </main>
</template>

<script>
import { mapState } from 'vuex'

import scroll from '@/mixins/scroll'
import pageTransition from '@/mixins/page-transition'

export default {
  mixins: [scroll],
  transition(to, from) {
    if (!to || !from) return

    return to.name === 'arena' && to.params.enterArena
      ? pageTransition.fromIndexToArena
      : pageTransition.basic
  },
  async asyncData({ $directus }) {
    const content = await $directus.items('Arena_page').readByQuery({
      limit: -1,
    })

    const contentProject = await $directus.items('Projet_page').readByQuery({
      limit: -1,
    })

    const galerie = await $directus.items('Galerie_arena').readByQuery({
      limit: -1,
    })

    const slider = await $directus.items('Projet_slider').readByQuery({
      limit: -1,
    })

    return {
      content,
      contentProject,
      galerie,
      slider,
    }
  },

  head({ $seo }) {
    return $seo({
      title: this.content.data.page_title,
      description: this.content.data.page_description_seo,
      openGraph: {
        title: this.appContent.data.seo_title,
        description: this.content.data.page_description_seo,
      },
      twitter: {
        title: this.appContent.data.seo_title,
        description: this.content.data.page_description_seo,
      },
    })
  },

  computed: {
    ...mapState({
      partnersContent: (state) => state.partnersContent,
      appContent: (state) => state.appContent,
    }),
    contentCatchphrase() {
      return {
        catchphrase: this.contentProject.data.projet_catchphrase,
      }
    },
    contentFullwidth() {
      return {
        src: this.content.data.fullwidth_picture,
        alt: this.content.data.fullwidth_picture_alt,
      }
    },
    contentGallery() {
      return {
        items: this.galerie.data,
      }
    },
    contentIntroduction() {
      return {
        title: this.contentProject.data.projet_introduction_title,
        subtitle: this.contentProject.data.projet_introduction_subtitle,
        whyTitle: this.contentProject.data.projet_introduction_why_title,
        whyParagraph: this.contentProject.data.projet_introduction_why_paragraph,
        pictureFramedImage:
          this.contentProject.data.projet_introduction_picture_framed_image,
        pictureFramedAlt:
          this.contentProject.data.projet_introduction_picture_framed_alt,
        pictureLabelImage:
          this.contentProject.data.projet_introduction_picture_label_image,
        pictureLabelAlt:
          this.contentProject.data.projet_introduction_picture_label_alt,
        pictureLabelText:
          this.contentProject.data.projet_introduction_picture_label_text,
        pictureLogoImage:
          this.contentProject.data.projet_introduction_picture_logo_image,
        pictureLogoAlt: this.contentProject.data.projet_introduction_picture_logo_alt,
      }
    },
    contentParisBasketClub() {
      return {
        title: this.content.data.paris_basket_club_title,
        subtitle: this.content.data.paris_basket_club_subtitle,
        paragraph: this.content.data.paris_basket_club_paragraph,
        pictureFramed: {
          src: this.content.data.paris_basket_club_picture_framed,
          alt: this.content.data.paris_basket_club_picture_framed_alt,
        },
        picture: {
          src: this.content.data.paris_basket_club_picture,
          alt: this.content.data.paris_basket_club_picture_alt,
        },
        pictureLogo: {
          src: this.content.data.paris_basket_club_picture_logo,
          alt: this.content.data.paris_basket_club_picture_logo_alt,
        },
        linkText: this.content.data.paris_basket_club_link_text,
        linkHref: this.content.data.paris_basket_club_link,
      }
    },
    contentPartners() {
      return {
        list: this.partnersContent.data,
        title: this.content.data.partners_title,
        subtitle: this.content.data.partners_subtitle,
        paragraph: this.content.data.partners_paragraph,
        totalText: this.content.data.partners_total_text,
        ctaTitle: this.content.data.partners_cta_title,
        ctaLink: this.content.data.partners_cta_link,
      }
    },
    contentPlan() {
      return {
        title: this.contentProject.data.projet_plan_title,
        subtitle: this.contentProject.data.projet_plan_subtitle,
        paragraph: this.contentProject.data.projet_plan_paragraph,
        chapelle: this.contentProject.data.projet_plan_chapelle_place,
        basilique: this.contentProject.data.projet_plan_basilique_place,
      }
    },
    contentSlider() {
      return {
        title: this.contentProject.data.slider_title,
        totalText: this.contentProject.data.slider_total_text,
        items: this.slider.data,
      }
    },
    contentTwoColumns() {
      return {
        firstRow: {
          title: this.contentProject.data.projet_two_columns_first_row_title,
          paragraph: this.contentProject.data.projet_two_columns_first_row_paragraph,
          cardTitle: this.contentProject.data.projet_two_columns_first_row_card_title,
          cardSubtitle:
            this.contentProject.data.projet_two_columns_first_row_card_subtitle,
          cardParagraph:
            this.contentProject.data.projet_two_columns_first_row_card_paragraph,
          cardCtaText:
            this.contentProject.data.projet_two_columns_first_row_card_cta_text,
        },
        secondRow: {
          title: this.contentProject.data.projet_two_columns_second_row_title,
          paragraph: this.contentProject.data.projet_two_columns_second_row_paragraph,
          picture: this.contentProject.data.projet_two_columns_second_row_picture,
          pictureAlt:
            this.contentProject.data.projet_two_columns_second_row_picture_alt,
          cardTitle: this.contentProject.data.projet_two_columns_second_row_card_title,
          cardSubtitle:
            this.contentProject.data.projet_two_columns_second_row_card_subtitle,
          cardParagraph:
            this.contentProject.data.projet_two_columns_second_row_card_paragraph,
        },
      }
    },
  },
  mounted() {},
  beforeDestroy() {},
  methods: {},
}
</script>

<style lang="scss">
.app-arena {
  .app-arena-gallery {
    margin-top: desktop-vw(130px);
  }
  .app-footer {
    margin-top: desktop-vw(165px);
  }
}
</style>
