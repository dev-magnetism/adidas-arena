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

    return {
      app,
    }
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
