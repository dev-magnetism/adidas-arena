<template>
  <main class="app-home">
    <AppHomeHero :contents="contentHero" />
    <AppHomePresentation :contents="contentPresentation" />
    <EMarqueeScroll>
      <TH1 color="red-adidas">
        {{ contentMarquees.firstRow }}
      </TH1>
    </EMarqueeScroll>
    <EMarqueeScroll :inverted="true">
      <TH1 color="red-adidas">
        {{ contentMarquees.secondRow }}
      </TH1>
    </EMarqueeScroll>
    <AppHomeProjet />
    <!-- <AppHomeLeBloc /> -->
    <AppHomePartners />
    <AppFooter />
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

    return {
      content,
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
  mounted() {
    console.log(this.content)
  },
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
