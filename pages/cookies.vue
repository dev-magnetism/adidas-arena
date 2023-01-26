<template>
  <div class="app-cookies grid-inner">
    <div class="app-cookies__inner">
      <TH2 class="app-cookies__title">{{ content.data.title }}</TH2>
      <TP2 weight="bold" class="app-cookies__subtitle">{{
        content.data.subtitle
      }}</TP2>
      <TP2
        weight="medium"
        class="app-cookies__content"
        v-html="content.data.content"
      ></TP2>
    </div>
  </div>
</template>

<script>
import scroll from '@/mixins/scroll'

export default {
  mixins: [scroll],
  layout: 'second-layout',

  async asyncData({ $directus }) {
    const content = await $directus.items('Cookies').readByQuery({
      limit: -1,
    })

    return {
      content,
    }
  },

  mounted() {
    this.lenis.start()
  },
}
</script>

<style lang="scss">
.app-cookies {
  padding-top: desktop-vw(180px);
  padding-bottom: desktop-vw(130px);

  @include mobile {
    padding-top: mobile-vw(100px);
    padding-bottom: mobile-vw(60px);
  }

  &__inner {
    grid-column: 2 / span 8;

    @include mobile {
      grid-column: 1 / span 6;
    }
  }

  &__title.H2 {
    margin-bottom: desktop-vw(40px);

    @include mobile {
      margin-bottom: mobile-vw(25px);
    }
  }

  &__subtitle.P2 {
    margin-bottom: desktop-vw(40px);
    text-transform: uppercase;
    width: 60%;

    @include mobile {
      width: 100%;
      margin-bottom: mobile-vw(25px);
    }
  }

  &__content {
    strong {
      @include font-adihausDIN-bold();
    }

    h4 {
      text-transform: uppercase;
      @include font-adihausDIN-bold();
    }

    a {
      text-decoration: underline;
      color: var(--c-red-adidas);
      cursor: pointer;
    }
  }
}
</style>
