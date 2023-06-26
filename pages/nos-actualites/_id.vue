<template>
  <main class="app-actualite">
    <AppActusHero ref="hero" :content="content" />
    <AppActusAccessibility ref="hero" :content="content" />
    <div class="app-actualite__spacer" />
    <AppActusDynamicComponent
      v-for="(component, i) in content.body"
      :key="`dynamic-component-${i}`"
      :content="component"
    />
    <AppFooter :contents="appContent" :logos="partnersContent.data" />
  </main>
</template>

<script>
import { mapState } from 'vuex'

import scroll from '@/mixins/scroll'
import pageTransition from '@/mixins/page-transition'

const convertToKebabCase = (string) => {
  return string
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
}

export default {
  mixins: [scroll],
  validate({ params, $axios, store }) {
    const slug = params.id

    return store.state.actualites.some(
      (element) =>
        convertToKebabCase(slug) === convertToKebabCase(element.title)
    )
  },
  transition(to, from) {
    if (!to || !from) return

    return pageTransition.basic
  },
  asyncData({ params, store, $axios }) {
    const slug = params.id

    const payload = store.state.actualites.find(
      (element) =>
        convertToKebabCase(slug) === convertToKebabCase(element.title)
    )

    return { content: payload }
  },
  data() {
    return {}
  },
  head({ $seo }) {
    // return $seo({
    //   templateTitle: '%title% - %name%',
    //   title: `${this.event.content.title} ${this.formattedDateStart} - Programmation`,
    //   description: this.event.content.metaDescription,
    //   openGraph: {
    //     title: this.appContent.data.seo_title,
    //     description: this.event.content.metaDescription,
    //   },
    //   twitter: {
    //     title: this.appContent.data.seo_title,
    //     description: this.event.content.metaDescription,
    //   },
    // })
  },
  computed: {
    ...mapState({
      partnersContent: (state) => state.partnersContent,
      appContent: (state) => state.appContent,
      programmationsEventContent: (state) => state.programmationsEventContent,
      headerReduced: (state) => state.headerReduced,
    }),
  },

  mounted() {},
  beforeDestroy() {
    this.scrollTriggerCTA?.kill()
    this.scrollTrigger?.kill()
    this.mm?.kill()
  },
  methods: {
    onBack() {
      this.$router.push({ path: '/programmation' })
    },
  },
}
</script>

<style lang="scss">
.app-actualite {
  padding-top: desktop-vw(165px);

  @include mobile {
    padding-top: mobile-vw(85px);
  }

  &__cta-back {
    position: fixed;
    top: 65px;
    left: var(--layout-margin);
    z-index: 3;
    transition: transform 0.65s var(--ease-out-cubic),
      opacity 0.35s var(--ease-in-out-cubic);
    will-change: transform;

    @include mobile {
      top: mobile-vw(25px);
    }

    &.reduced {
      transform: translate(0%, -40px);

      @include mobile {
        transform: translate(0%, 0%);
      }
    }

    &.hide {
      opacity: 0;
      pointer-events: none;
    }
  }

  &__spacer {
    margin-top: desktop-vw(65px);
    margin-bottom: desktop-vw(65px);
    position: relative;
    display: inline-flex;
    width: 100%;
  }

  .app-footer {
    margin-top: desktop-vw(120px);

    @include mobile {
      margin-top: mobile-vw(70px);
    }
  }
}
</style>
