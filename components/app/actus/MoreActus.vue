<template>
  <div
    v-if="articles.length"
    class="app-actualites-event-more-actus block-inner"
  >
    <TH2 weight="bold" class="app-actualites-event-more-actus__title">
      {{ content.title }}
    </TH2>
    <div class="app-actualites-event-more-actus__items grid">
      <AppActusCard
        v-for="(article, index) in articles"
        :key="`article-${index}`"
        :content="article"
        :theme="index % 2 ? 'red-adidas' : 'blue-adidas'"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: {
    content: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {}
  },
  computed: {
    ...mapState({
      actualites: (state) => state.actualites,
    }),
    articles() {
      const filteredActus = this.actualites.filter(
        (actu) => actu.slug !== this.content.slug && actu.id !== this.content.id
      )

      return filteredActus.slice(0, 3)
    },
  },
  mounted() {},
}
</script>

<style lang="scss">
.app-actualites-event-more-actus {
  margin-top: desktop-vw(115px);

  &__title {
    margin-bottom: desktop-vw(30px);
  }

  &__items {
  }
}
</style>
