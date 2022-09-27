<template>
  <main class="app-le-bloc">
    <ETwoColumnsStick
      :left-content="partners.data.Key_words_left"
      :right-content="partners.data.Key_words_right"
    />

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

    <EFullwidth></EFullwidth>
  </main>
</template>

<script>
import scroll from '@/mixins/scroll'

export default {
  mixins: [scroll],
  async asyncData({ $directus }) {
    const partners = await $directus.items('le_bloc_page').readByQuery({
      limit: -1,
    })

    return {
      partners,
      test: { name: 'test' },
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
}
</style>
