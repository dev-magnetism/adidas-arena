<template>
  <main class="app-le-bloc">
    <AppLeblocHero />

    <ETwoColumnsStick
      :left-content="contentTwoColumns.left"
      :right-content="contentTwoColumns.right"
    />
    <AppLeblocPresentation :contents="contentPresentation" />
    <div class="app-le-bloc__marquees">
      <EMarqueeScroll>
        <TH1 tag="p" weight="bold" color="red-adidas">
          {{ contentMarquees.firstRow }}
        </TH1>
      </EMarqueeScroll>
      <EMarqueeScroll :inverted="true">
        <TH1 tag="p" weight="bold" color="red-adidas">
          {{ contentMarquees.secondRow }}
        </TH1>
      </EMarqueeScroll>
    </div>
    <EFullwidth :contents="contentFullwidth" />
    <ESlider :contents="contentSlider" />
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

    return pageTransition.basic
  },
  props: {
    webview: {
      type: String,
      required: true,
      default: 'ko',
    },
  },
  async asyncData({ $directus }) {
    const content = await $directus.items('Le_Bloc_page').readByQuery({
      limit: -1,
    })

    const slider = await $directus.items('Le_Bloc_Slider').readByQuery({
      limit: -1,
    })

    return {
      content,
      slider,
    }
  },
  data() {
    return {}
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
    contentSlider() {
      return {
        title: this.content.data.slider_title,
        totalText: this.content.data.slider_total_text,
        items: this.slider.data,
      }
    },
    contentFullwidth() {
      return {
        src: this.content.data.fullwidth_picture,
        alt: this.content.data.fullwidth_picture_alt,
      }
    },
    contentTwoColumns() {
      return {
        left: this.content.data.two_columns_left,
        right: this.content.data.two_columns_right,
      }
    },
    contentMarquees() {
      return {
        firstRow: this.content.data.marquee_first_row,
        secondRow: this.content.data.marquee_second_row,
      }
    },
    contentPresentation() {
      return {
        title: this.content.data.presentation_title,
        picture: {
          src: this.content.data.presentation_picture,
          alt: this.content.data.presentation_picture_alt,
        },
        pictureFramed: {
          src: this.content.data.presentation_picture_framed,
          alt: this.content.data.presentation_picture_framed_alt,
        },
        paragraphTitle: this.content.data.presentation_paragraph_title,
        paragraph: this.content.data.presentation_paragraph,
      }
    },
  },
}
</script>

<style lang="scss">
.app-le-bloc {
  .app-two-columns-stick {
    .app-element-lottie-word {
      &.Trait_2 svg {
        position: absolute;
        left: 100%;
        width: 100%;
        height: auto !important;
        bottom: -50%;
        transform: translate(-50%, -50%) !important;

        @include mobile {
          bottom: -25px;
        }
      }
      &.Cercle_1 svg {
        position: absolute;
        width: 120% !important;
        height: auto !important;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%) rotate(5deg) !important;

        @include mobile {
          left: 50%;
        }
      }
    }
  }

  .app-element-slider {
    margin-top: desktop-vw(130px);
    margin-bottom: desktop-vw(165px);
  }

  &__marquees {
    margin-bottom: desktop-vw(200px);

    @include mobile {
      margin-bottom: mobile-vw(100px);
    }
  }
}
</style>
