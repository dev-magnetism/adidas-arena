<template>
  <main class="app-home">
    <AppHomeHero :contents="contentHero" />
    <ESliderProgrammation :content="contentSlider" />
    <AppActusBlockYoutube v-if="contentVideo.url" :content="contentVideo" />
    <AppHomePresentation :contents="contentPresentation" />
    <EMarqueeScroll>
      <TH1 tag="p" weight="bold">
        {{ contentMarquees.firstRow }}
      </TH1>
    </EMarqueeScroll>
    <EMarqueeScroll :inverted="true">
      <TH1 tag="p" weight="bold">
        {{ contentMarquees.secondRow }}
      </TH1>
    </EMarqueeScroll>
    <AppHomeProjet :contents="contentProjet" />
    <AppHomeArticles :content="contentArticles" />
    <AppHomePartners :contents="contentPartners" />
    <AppFooter v-if="this.webview !== 'ok'" :contents="appContent" :logos="partnersContent.data" />
  </main>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

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
    const content = await $directus.items('Homepage').readByQuery({
      limit: -1,
    })

    return {
      content,
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
          hid: 'apple-itunes-app',
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
      allLoadedFake: (state) => state.allLoadedFake,
      exteriorVisible: (state) => state.exteriorVisible,
      webview: (state) => state.webview,
    }),
    contentPresentation() {
      return {
        content: this.content.data.content,
        pictureFramed: this.content.data.picture_framed,
        pictureFramedAlt: this.content.data.picture_framed_alt,
        pictureBorder: this.content.data.picture_border,
        pictureBorderAlt: this.content.data.picture_border_alt,
        pictureBigVisual: this.content.data.picture_big_visual,
        pictureBigVisualAlt: this.content.data.picture_big_visual_alt,
      }
    },
    contentPartners() {
      return {
        title: this.content.data.partners_title,
        subtitle: this.content.data.partners_subtitle,
        totalText: this.content.data.partners_total_text,
        paragraph: this.content.data.partners_paragraph,
        ctaTitle: this.content.data.partners_cta_title,
        ctaLink: this.content.data.partners_cta_link,
        list: this.partnersContent.data,
      }
    },
    contentProjet() {
      return {
        bigTitle: this.content.data.projet_big_title,
        headerContentLeft: this.content.data.projet_header_content_left,
        headerContentRight: {
          title: this.content.data.projet_header_description_title,
          surtitle: this.content.data.projet_header_description_surtitle,
        },
        projetTag1: this.content.data.projet_tag_1,
        projetTag2: this.content.data.projet_tag_2,
        projetTag3: this.content.data.projet_tag_3,
        projetTag4: this.content.data.projet_tag_4,
        projetTag5: this.content.data.projet_tag_5,
        projetPicture1: this.content.data.projet_picture_1,
        projetPicture2: this.content.data.projet_picture_2,
        projetPicture3: this.content.data.projet_picture_3,
        projetPicture4: this.content.data.projet_picture_4,
        projetPicture5: this.content.data.projet_picture_5,
        projetCtaTitle: this.content.data.projet_cta_title,
        projetCtaHref: this.content.data.projet_cta_link,
        projetMapTitle: this.content.data.projet_map_title,
        projetMapRef: this.content.data.projet_map_ref,
        projetMapRefNumber: this.content.data.projet_map_ref_number,
      }
    },
    contentHero() {
      return {
        title: this.content.data.hero_title,
        city: this.content.data.hero_place_city,
        localisation: this.content.data.hero_place_localisation,
        coordinate: this.content.data.hero_coordinate,
        visit: this.content.data.hero_visit,
        scroll: this.content.data.hero_scroll,
        pictureTop: {
          src: this.content.data.hero_picture_top,
          alt: this.content.data.hero_picture_top_alt,
        },
        pictureBottom: {
          src: this.content.data.hero_picture_bottom,
          alt: this.content.data.hero_picture_bottom_alt,
        },
      }
    },
    contentVideo() {
      return {
        url: this.content.data.video_url,
        poster: this.content.data.video_poster,
        vertical_video: this.content.data.video_vertical_video,
      }
    },
    contentSlider() {
      return {
        title: this.content.data.slider_programmation_title,
        cta: this.content.data.slider_programmation_cta,
        spotifyLink: this.content.data.slider_programmation_spotify_link,
        spotifyLabel: this.content.data.slider_programmation_spotify_label
      }
    },
    contentArticles() {
      return {
        title: this.content.data.articles_title,
        cta: this.content.data.articles_cta_title,
        ctaHref: this.content.data.articles_cta_link,
      }
    },
    contentMarquees() {
      return {
        firstRow: this.content.data.marquee_first_row,
        secondRow: this.content.data.marquee_second_row,
      }
    },
  },
  mounted() { },
  methods: {
    ...mapMutations({
      setExteriorVisible: 'setExteriorVisible',
    }),
  },
}
</script>

<style lang="scss">
.app-home {
  .app-footer {
    margin-top: desktop-vw(25px);

    @include mobile {
      margin-top: mobile-vw(80px);
    }
  }
  @include mobile {
    // background: green;
  }
}
</style>
