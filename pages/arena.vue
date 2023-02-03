<template>
  <main class="app-arena">
    <AppArenaHero />
    <AppArenaParisBasketClub :contents="contentParisBasketClub" />
    <EFullwidth :contents="contentFullwidth" />
    <AppArenaPartners :contents="contentPartners" />
    <!-- <AppGallery :contents="contentGallerie" /> -->
    <AppFooter :contents="appContent" :logos="partnersContent.data" />
  </main>
</template>

<script>
import { mapState } from 'vuex'

import scroll from '@/mixins/scroll'
import pageTransition from '@/mixins/page-transition'
// import useWebGL from '~/hooks/webgl'

export default {
  mixins: [scroll],
  transition(to, from) {
    if (!to || !from) return

    return pageTransition.basic
  },
  async asyncData({ $directus }) {
    const content = await $directus.items('Arena_page').readByQuery({
      limit: -1,
    })

    const gallerie = await $directus.items('Gallerie').readByQuery({
      limit: -1,
    })

    const galerieTest = await $directus
      .items('Galerie_partenaire')
      .readByQuery({
        limit: -1,
      })

    return {
      content,
      gallerie,
      galerieTest,
    }
  },

  head({ $seo }) {
    return $seo({
      title: this.content.data.page_title,
      description: this.content.data.page_description_seo,
      openGraph: {
        title: this.appContent.data.seo_title,
        description: this.content.data.page_description_seo,
      },
      twitter: {
        title: this.appContent.data.seo_title,
        description: this.content.data.page_description_seo,
      },
    })
  },

  computed: {
    ...mapState({
      partnersContent: (state) => state.partnersContent,
      appContent: (state) => state.appContent,
    }),
    contentPartners() {
      return {
        list: this.partnersContent.data,
        title: this.content.data.partners_title,
        subtitle: this.content.data.partners_subtitle,
        paragraph: this.content.data.partners_paragraph,
        totalText: this.content.data.partners_total_text,
        ctaTitle: this.content.data.partners_cta_title,
        ctaLink: this.content.data.partners_cta_link,
      }
    },
    contentParisBasketClub() {
      return {
        title: this.content.data.paris_basket_club_title,
        subtitle: this.content.data.paris_basket_club_subtitle,
        paragraph: this.content.data.paris_basket_club_paragraph,
        pictureFramed: {
          src: this.content.data.paris_basket_club_picture_framed,
          alt: this.content.data.paris_basket_club_picture_framed_alt,
        },
        picture: {
          src: this.content.data.paris_basket_club_picture,
          alt: this.content.data.paris_basket_club_picture_alt,
        },
        pictureLogo: {
          src: this.content.data.paris_basket_club_picture_logo,
          alt: this.content.data.paris_basket_club_picture_logo_alt,
        },
        linkText: this.content.data.paris_basket_club_link_text,
        linkHref: this.content.data.paris_basket_club_link,
      }
    },
    contentFullwidth() {
      return {
        src: this.content.data.fullwidth_picture,
        alt: this.content.data.fullwidth_picture_alt,
      }
    },
    contentGallerie() {
      return {
        items: this.gallerie.data,
      }
    },
  },
  mounted() {
    // this.$nuxt.$on('app:scroll', this.onScrollApp)
    // console.log(this.galerieTest)
  },
  beforeDestroy() {
    // this.$nuxt.$off('app:scroll', this.onScrollApp)
  },
  methods: {
    onScrollApp({ scroll, limit, velocity, direction }) {
      // const { exterior, camera } = useWebGL()
      // exterior.position.y = scroll / (camera.zoom - camera.zoom * 0.125)
      // console.log(scroll, limit, camera.position, camera.rotation)
    },
  },
}
</script>

<style lang="scss">
.app-arena {
  .app-arena-gallery {
    margin-top: desktop-vw(130px);
  }
  .app-footer {
    margin-top: desktop-vw(165px);
  }
}
</style>
