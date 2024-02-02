<template>
  <main class="app-actualite">
    <AtomsCTABack
      :class="{
        reduced: headerReduced,
        hide: !appearCTABack,
      }"
      class="app-actualite__cta-back"
      @click.native="onBack()"
    >
      Retour
    </AtomsCTABack>

    <AppActusActuHero ref="hero" :content="content" />
    <AppActusAccessibility ref="hero" :content="content" />
    <div class="app-actualite__spacer" />
    <AppActusDynamicComponent
      v-for="(el, index) in content.body"
      :key="`dynamic-component-${index}`"
      :content="el"
    />
    <AppActusMoreActus :content="contentMoreArticles" />
    <AppFooter :contents="appContent" :logos="partnersContent.data" />
  </main>
</template>

<script>
import { mapState } from 'vuex'

import scroll from '@/mixins/scroll'
import pageTransition from '@/mixins/page-transition'

export default {
  mixins: [scroll],

  validate({ params, $axios, store, $convertToKebabCase, $removeSpecialChar }) {
    const slug = params.id

    return store.state.actualites.some(
      (element) =>
        $convertToKebabCase(slug) === $convertToKebabCase($removeSpecialChar(element.title))
    )
  },
  transition(to, from) {
    if (!to || !from) return

    return pageTransition.basic
  },
  props: {
    webview: {
      type: String,
      required: true,
      default: 'ko',
    },
  },
  data() {
    return {
      appearCTABack: true,
    }
  },
  head({ $seo }) {
    return $seo({
      templateTitle: '%title% - %name%',
      title: `${this.content.title} - Nos actualités`,
      description: this.content.page_description_seo,
      openGraph: {
        title: this.appContent.data.seo_title,
        description: this.content.page_description_seo,
      },
      twitter: {
        title: this.appContent.data.seo_title,
        description: this.content.page_description_seo,
      },
    })
  },

  computed: {
    ...mapState({
      partnersContent: (state) => state.partnersContent,
      appContent: (state) => state.appContent,
      actualitesArticleContent: (state) => state.actualitesArticleContent,
      headerReduced: (state) => state.headerReduced,
      actualites: (state) => state.actualites,
    }),
    content() {
      return this.actualites.find(
        (element) =>
          this.$convertToKebabCase(this.$route.params.id) ===
          this.$convertToKebabCase(this.$removeSpecialChar(element.title))
      )
    },
    contentMoreArticles() {
      return {
        title: this.actualitesArticleContent.also_like_title,
        id: this.content.id,
        slug: this.content.slug,
      }
    },
  },
  beforeDestroy() {
    this.scrollTriggerCTA?.kill()
    this.scrollTrigger?.kill()
    this.mm?.revert()
  },
  methods: {
    onBack() {
      this.$router.push({ path: '/nos-actualites' })
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

    @include mobile {
      margin-top: mobile-vw(40px);
      margin-bottom: mobile-vw(40px);
    }
  }

  .app-footer {
    margin-top: desktop-vw(120px);

    @include mobile {
      margin-top: mobile-vw(70px);
    }
  }
}
</style>
