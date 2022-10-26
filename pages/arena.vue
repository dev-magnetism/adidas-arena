<template>
  <main class="app-arena">
    <AppArenaParisBasketClub :contents="contentParisBasketClub" />
    <EFullwidth :contents="contentFullwidth" />
    <AppArenaPartners :contents="contentPartners" />
    <AppArenaGallery :contents="contentGallerie" />
    <AppFooter :contents="app" :logos="partners.data" />
  </main>
</template>

<script>
import scroll from '@/mixins/scroll'

export default {
  mixins: [scroll],
  async asyncData({ $directus }) {
    const partners = await $directus.items('Partners').readByQuery({
      limit: -1,
    })

    const app = await $directus.items('App').readByQuery({
      limit: -1,
    })

    const content = await $directus.items('Arena_page').readByQuery({
      limit: -1,
    })

    const gallerie = await $directus.items('Gallerie').readByQuery({
      limit: -1,
    })

    return {
      partners,
      app,
      content,
      gallerie,
    }
  },

  computed: {
    contentPartners() {
      return {
        list: this.partners.data,
        title: this.content.data.partners_title,
        subtitle: this.content.data.partners_subtitle,
        paragraph: this.content.data.partners_paragraph,
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
