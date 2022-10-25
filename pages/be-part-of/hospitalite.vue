<template>
  <main class="page-be-part-of-hospitalite">
    <ETwoColumnsStick
      :left-content="contentTwoColumns.left"
      :right-content="contentTwoColumns.right"
    />
    <AppBepartofHospitalitePresentation />
    <ESlider />
    <AppContactQuestion />
    <AppContactNewsletter />
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

    const content = await $directus.items('Hospitalite_page').readByQuery({
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
    contentTwoColumns() {
      return {
        left: this.content.data.two_columns_left,
        right: this.content.data.two_columns_right,
      }
    },
  },

  mounted() {},
}
</script>

<style lang="scss">
.page-be-part-of-hospitalite {
  .app-two-columns-stick {
    .app-element-lottie-word {
      &.Trait_2 svg {
        position: absolute;
        left: 50%;
        width: 100%;
        height: auto !important;
        bottom: -35px;
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
  .app-contact-question {
    margin-top: desktop-vw(280px);
  }
  .app-contact-newsletter {
    margin-bottom: desktop-vw(180px);
  }
}
</style>
