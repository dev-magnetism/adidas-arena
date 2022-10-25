<template>
  <main class="app-le-bloc">
    <ETwoColumnsStick
      :left-content="contentTwoColumns.left"
      :right-content="contentTwoColumns.right"
    />
    <AppLeblocPresentation :contents="contentPresentation" />
    <div class="app-le-bloc__marquees">
      <EMarqueeScroll>
        <TH1 color="red-adidas">
          {{ contentMarquees.firstRow }}
        </TH1>
      </EMarqueeScroll>
      <EMarqueeScroll :inverted="true">
        <TH1 color="red-adidas">
          {{ contentMarquees.secondRow }}
        </TH1>
      </EMarqueeScroll>
    </div>
    <EFullwidth :contents="contentFullwidth" />
    <AppFooter :contents="app" />
  </main>
</template>

<script>
import scroll from '@/mixins/scroll'

export default {
  mixins: [scroll],
  async asyncData({ $directus }) {
    const app = await $directus.items('App').readByQuery({
      limit: -1,
    })

    const content = await $directus.items('Le_Bloc_page').readByQuery({
      limit: -1,
    })

    return {
      app,
      content,
    }
  },
  data() {
    return {}
  },

  computed: {
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
  }
}
</style>
