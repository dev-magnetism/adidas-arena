<template>
  <main class="app-le-bloc">
    <!-- <ETwoColumnsStick
      :left-content="partners.data.Key_words_left"
      :right-content="partners.data.Key_words_right"
    /> -->

    <AppLeblocPresentation />

    <div class="app-le-bloc__marquees">
      <EMarqueeScroll>
        <TH1 color="red-adidas">
          HYBRIDATION INCLUSIVITé co-création elevation
        </TH1>
      </EMarqueeScroll>
      <EMarqueeScroll :inverted="true">
        <TH1 color="red-adidas">
          HYBRIDATION INCLUSIVITé co-création elevation
        </TH1>
      </EMarqueeScroll>
    </div>

    <EFullwidth></EFullwidth>

    <AppFooter />
  </main>
</template>

<script>
import scroll from '@/mixins/scroll'

export default {
  mixins: [scroll],
  async asyncData({ $directus }) {
    // const partners = await $directus.items('le_bloc_page').readByQuery({
    //   limit: -1,
    // })
    // return {
    //   partners,
    // }
  },
  data() {
    return {}
  },

  mounted() {},
}
</script>

<style lang="scss">
.app-le-bloc {
  padding-top: 80vh;

  &__marquees {
    margin-bottom: desktop-vw(200px);
  }
}
</style>
