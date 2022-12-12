<template>
  <main class="app-le-bloc">
    <ETwoColumnsStick
      :left-content="contentTwoColumns.left"
      :right-content="contentTwoColumns.right"
    />
    <AppLeblocPresentation :contents="contentPresentation" />
    <div class="app-le-bloc__marquees">
      <EMarqueeScroll>
        <TH1 weight="bold" color="red-adidas">
          {{ contentMarquees.firstRow }}
        </TH1>
      </EMarqueeScroll>
      <EMarqueeScroll :inverted="true">
        <TH1 weight="bold" color="red-adidas">
          {{ contentMarquees.secondRow }}
        </TH1>
      </EMarqueeScroll>
    </div>
    <EFullwidth :contents="contentFullwidth" />
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
  async asyncData({ $directus }) {
    const content = await $directus.items('Le_Bloc_page').readByQuery({
      limit: -1,
    })

    return {
      content,
    }
  },
  data() {
    return {}
  },

  computed: {
    ...mapState({
      partnersContent: (state) => state.partnersContent,
      appContent: (state) => state.appContent,
    }),
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
  beforeDestroy() {
    console.log('beforeDestroy page le-bloc')
  },
  destroyed() {
    console.log('destroyed page le-bloc')
  },
}
</script>

<style lang="scss">
.app-le-bloc {
  padding-top: 65vh;

  .app-two-columns-stick {
    .app-element-lottie-word {
      &.Trait_2 svg {
        position: absolute;
        left: 100%;
        width: 100%;
        height: auto !important;
        bottom: -15px;
        transform: translateX(-50%) !important;

        @include mobile {
          bottom: -8px;
        }
      }
      &.Cercle_1 svg {
        position: absolute;
        width: 135% !important;
        height: auto !important;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%) rotate(5deg) !important;
      }
    }
  }

  &__marquees {
    margin-bottom: desktop-vw(200px);

    @include mobile {
      margin-bottom: mobile-vw(100px);
    }
  }
}
</style>
