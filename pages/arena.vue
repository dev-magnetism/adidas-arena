<template>
  <main class="app-arena">
    <AppArenaHero />
    <AppArenaIntroduction :contents="contentIntroduction" />
    <AppArenaCatchPhrase :contents="contentCatchphrase" />
    <AppArenaParisBasketClub :contents="contentParisBasketClub" />
    <ESlider :contents="contentSlider" />
    <!-- EFullwidth :contents="contentFullwidth" / -->
    <!-- AppArenaPartners :contents="contentPartners" / -->
    <EVideosList :contents="contentVideos" />
    <AppArenaPlan :contents="contentPlan" />
    <AppArenaTwoColumns :contents="contentTwoColumns"/>
    <AppGallery :contents="contentGallery" />
    <AppFooter v-if="this.webview !== 'ok'" :contents="appContent" :logos="partnersContent.data" />
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
  props: {
    webview: {
      type: String,
      required: true,
      default: 'ko',
    },
  },
  async asyncData({ $directus }) {
    const content = await $directus.items('Arena_page').readByQuery({
      limit: -1,
    })

    const galerie = await $directus.items('Galerie_arena').readByQuery({
      limit: -1,
    })

    const slider = await $directus.items('Arena_slider').readByQuery({
      limit: -1,
    })

    const videos = await $directus.items('Arena_videos').readByQuery({
      limit: -1,
    })

    return {
      content,
      galerie,
      slider,
      videos,
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
      meta: [
        {
          name: 'apple-itunes-app',
          content: `app-id=${this.$config.apiKeyAppstore}, app-argument=${this.$config.baseURL}`
        },
      ],
    })
  },

  computed: {
    ...mapState({
      partnersContent: (state) => state.partnersContent,
      appContent: (state) => state.appContent,
    }),
    contentCatchphrase() {
      return {
        catchphrase: this.content.data.arena_catchphrase,
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
        title: this.content.data.arena_introduction_title,
        subtitle: this.content.data.arena_introduction_subtitle,
        whyTitle: this.content.data.arena_introduction_why_title,
        whyParagraph: this.content.data.arena_introduction_why_paragraph,
        pictureFramedImage:
          this.content.data.arena_introduction_picture_framed_image,
        pictureFramedAlt:
          this.content.data.arena_introduction_picture_framed_alt,
        pictureLabelImage:
          this.content.data.arena_introduction_picture_label_image,
        pictureLabelAlt:
          this.content.data.arena_introduction_picture_label_alt,
        pictureLabelText:
          this.content.data.arena_introduction_picture_label_text,
        pictureLogoImage:
          this.content.data.arena_introduction_picture_logo_image,
        pictureLogoAlt: this.content.data.arena_introduction_picture_logo_alt,
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
        title: this.content.data.arena_plan_title,
        subtitle: this.content.data.arena_plan_subtitle,
        paragraph: this.content.data.arena_plan_paragraph,
        chapelle: this.content.data.arena_plan_chapelle_place,
        basilique: this.content.data.arena_plan_basilique_place,
      }
    },
    contentSlider() {
      return {
        title: this.content.data.slider_title,
        totalText: this.content.data.slider_total_text,
        items: this.slider.data,
      }
    },
    contentTwoColumns() {
      return {
        firstRow: {
          title: this.content.data.arena_two_columns_first_row_title,
          paragraph: this.content.data.arena_two_columns_first_row_paragraph,
          cardTitle: this.content.data.arena_two_columns_first_row_card_title,
          cardSubtitle:
            this.content.data.arena_two_columns_first_row_card_subtitle,
          cardParagraph:
            this.content.data.arena_two_columns_first_row_card_paragraph,
          cardCtaText:
            this.content.data.arena_two_columns_first_row_card_cta_text,
        },
        secondRow: {
          title: this.content.data.arena_two_columns_second_row_title,
          paragraph: this.content.data.arena_two_columns_second_row_paragraph,
          picture: this.content.data.arena_two_columns_second_row_picture,
          pictureAlt:
            this.content.data.arena_two_columns_second_row_picture_alt,
          cardTitle: this.content.data.arena_two_columns_second_row_card_title,
          cardSubtitle:
            this.content.data.arena_two_columns_second_row_card_subtitle,
          cardParagraph:
            this.content.data.arena_two_columns_second_row_card_paragraph,
        },
      }
    },
    contentVideos() {
      return {
        title: this.content.data.videos_title,
        items: this.videos.data,
      }
    },
  },
  mounted() {
  },
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
  .app-element-slider{
    @include mobile{
      margin: mobile-vw(60px) 0;
    }
  }
}
</style>
