<template>
  <div class="app-politique-de-confidentialite grid-inner">
    <AtomsCTABack @click.native="onBack()"> Retour </AtomsCTABack>

    <div class="app-politique-de-confidentialite__inner">
      <TH2 class="app-politique-de-confidentialite__title">{{
        content.data.title
      }}</TH2>
      <TP2 weight="bold" class="app-politique-de-confidentialite__subtitle">{{
        content.data.subtitle
      }}</TP2>
      <TP2
        weight="medium"
        class="app-politique-de-confidentialite__content"
        v-html="content.data.content"
      ></TP2>
    </div>
  </div>
</template>

<script>
import scroll from '@/mixins/scroll'
import pageTransition from '@/mixins/page-transition'

export default {
  mixins: [scroll],
  transition(to, from) {
    if (!to || !from) return

    return pageTransition.basic
  },
  async asyncData({ $directus }) {
    const content = await $directus
      .items('Politique_de_confidentialite')
      .readByQuery({
        limit: -1,
      })

    return {
      content,
    }
  },
  head({ $seo }) {
    return $seo({
      title: this.content.data.page_title,
      description: this.content.data.page_description_seo,
      openGraph: {
        title: this.content.data.page_title,
        description: this.content.data.page_description_seo,
      },
      twitter: {
        title: this.content.data.page_title,
        description: this.content.data.page_description_seo,
      },
    })
  },
  mounted() {
    this.lenis.start()
  },
  methods: {
    onBack() {
      this.$router.push({ path: '/' })
    },
  },
}
</script>

<style lang="scss">
.app-politique-de-confidentialite {
  padding-top: desktop-vw(180px);
  padding-bottom: desktop-vw(130px);
  z-index: 8;
  background-color: var(--c-grey);

  @include mobile {
    padding-top: mobile-vw(100px);
    padding-bottom: mobile-vw(60px);
  }

  .app-atoms-cta-back {
    position: fixed;
    left: desktop-vw(65px);
    top: desktop-vw(65px);
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
