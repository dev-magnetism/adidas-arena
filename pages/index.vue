<template>
  <main class="app-home">
    <AppHomeHero :contents="contentHero" />
    <!-- <AppHomePresentation :contents="contentPresentation" />
    <EMarqueeScroll>
      <TH1 weight="bold">
        {{ contentMarquees.firstRow }}
      </TH1>
    </EMarqueeScroll>
    <EMarqueeScroll :inverted="true">
      <TH1 weight="bold">
        {{ contentMarquees.secondRow }}
      </TH1>
    </EMarqueeScroll>
    <AppHomeProjet :contents="contentProjet" />
    <AppHomePartners :contents="contentPartners" />
    <AppFooter /> -->
  </main>
</template>

<script>
import scroll from '@/mixins/scroll'

export default {
  mixins: [scroll],
  async asyncData({ $directus }) {
    const content = await $directus.items('Homepage').readByQuery({
      limit: -1,
    })

    const partners = await $directus.items('Partners').readByQuery({
      limit: -1,
    })

    return {
      content,
      partners,
    }
  },
  computed: {
    contentPresentation() {
      return {
        content: this.content.data.content,
        pictureFramed: this.content.data.picture_framed,
        pictureFramedAlt: this.content.data.picture_framed_alt,
        pictureBorder: this.content.data.picture_border,
        pictureBorderAlt: this.content.data.picture_border_alt,
        pictureBigVisual: this.content.data.picture_big_visual,
        pictureBigVisualAlt: this.content.data.picture_big_visual_alt,
      }
    },
    contentPartners() {
      return {
        title: this.content.data.partners_title,
        subtitle: this.content.data.partners_subtitle,
        paragraph: this.content.data.partners_paragraph,
        list: this.partners.data,
      }
    },
    contentProjet() {
      return {
        bigTitle: this.content.data.projet_big_title,
        headerContentLeft: this.content.data.projet_header_content_left,
        headerContentRight: {
          title: this.content.data.projet_header_description_title,
          surtitle: this.content.data.projet_header_description_surtitle,
        },
        projetTag1: this.content.data.projet_tag_1,
        projetTag2: this.content.data.projet_tag_2,
        projetTag3: this.content.data.projet_tag_3,
        projetTag4: this.content.data.projet_tag_4,
        projetTag5: this.content.data.projet_tag_5,
        projetPicture1: this.content.data.projet_picture_1,
        projetPicture2: this.content.data.projet_picture_2,
        projetPicture3: this.content.data.projet_picture_3,
        projetPicture4: this.content.data.projet_picture_4,
        projetPicture5: this.content.data.projet_picture_5,
        projetCtaTitle: this.content.data.projet_cta_title,
      }
    },
    contentHero() {
      return {
        title: this.content.data.hero_title,
        city: this.content.data.hero_place_city,
        localisation: this.content.data.hero_place_localisation,
        pictureTop: {
          src: this.content.data.hero_picture_top,
          alt: this.content.data.hero_picture_top_alt,
        },
        pictureBottom: {
          src: this.content.data.hero_picture_bottom,
          alt: this.content.data.hero_picture_bottom_alt,
        },
      }
    },
    contentMarquees() {
      return {
        firstRow: this.content.data.marquee_first_row,
        secondRow: this.content.data.marquee_second_row,
      }
    },
  },
  mounted() {},
}
</script>

<style lang="scss">
.app-home {
  .app-footer {
    margin-top: desktop-vw(205px);

    @include mobile {
      margin-top: mobile-vw(130px);
    }
  }
  @include mobile {
    // background: green;
  }
}
</style>
