<template>
  <div class="app-home-articles">
    <div class="app-home-articles__heading grid">
      <ERichText
        :split="true"
        :scrub="false"
        :overflow="true"
        class="app-home-articles__heading__title"
        :content="content.title"
        tag="h3"
      />
      <AtomsCTA :href="content.ctaHref">{{ content.cta }}</AtomsCTA>
    </div>
    <div class="app-home-articles__items grid">
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
  computed: {
    ...mapState({
      actualites: (state) => state.actualites,
    }),
    articles() {
      return this.actualites.slice(0, 3)
    },
  },
}
</script>

<style lang="scss">
.app-home-articles {
  margin-bottom: desktop-vw(135px);

  &__heading {
    margin-bottom: desktop-vw(50px);

    &__title {
      grid-column: 1 / span 8;

      .app-atoms-stroke-text {
        -webkit-text-stroke: 1px var(--c-black);
        -webkit-text-fill-color: transparent;
      }

      .H2.medium {
        @include font-adihausDIN-cn-bold();
      }

      @include mobile {
        grid-column: 1 / span 6;
        grid-row: 1;
        width: 100%;
      }
    }

    .app-atoms-cta {
      grid-column: 10 / span 3;
      align-self: center;
      width: 80%;
      margin-left: auto;
    }
  }
  &__items {
    grid-row: 2;

    .app-actus-card {
      align-self: flex-start;

      &:nth-child(1) {
        margin-top: desktop-vw(35px);
      }
      &:nth-child(2) {
        margin-top: desktop-vw(150px);
      }
      &:nth-child(3) {
      }
    }
  }
}
</style>
