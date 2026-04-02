<template>
  <main class="app-arena">

    <div class="app-arena__nav">
      <button
        class="app-arena__nav__btn"
        :class="{active: this.navArenaActive === 'arena'}"
        @click="scrollToSection('arena')"
        >
        {{this.content.data.arena_navsticky_btn1}}
      </button>
      <button
        class="app-arena__nav__btn"
        :class="{active: this.navArenaActive === 'pbb'}"
        @click="scrollToSection('pbb')"
        >
        {{this.content.data.arena_navsticky_btn2}}
      </button>
      <button
        class="app-arena__nav__btn"
        :class="{active: this.navArenaActive === 'gymnases'}"
        @click="scrollToSection('gymnases')"
        >
        {{this.content.data.arena_navsticky_btn3}}
      </button>
      <button
        class="app-arena__nav__btn"
        :class="{active: this.navArenaActive === 'lieudevie'}"
        @click="scrollToSection('lieudevie')"
        >
        {{this.content.data.arena_navsticky_btn4}}
      </button>
    </div>
    <AppArenaHero ref="arena" />
    <AppArenaIntroduction :contents="contentIntroduction" />
    <AppArenaCatchPhrase :contents="contentCatchphrase" />
    <AppArenaPlan :contents="contentPlan" />
    <AppArenaPresentation :contents="contentPresentation" />
    <AppArenaTwoColumns :contents="contentTwoColumns"/>
    <AppArenaParisBasketClub ref="pbb" :contents="contentParisBasketClub" />
    <AppArenaGymnases ref="gymnases" :contents="contentGymnases" />
    <ESlider ref="lieudevie" :contents="contentSlider" />
    <AppGallery :contents="contentGallery" />
    <AppFooter v-if="this.webview !== 'ok'" :contents="appContent" :logos="partnersContent.data" />
  </main>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

import scroll from '@/mixins/scroll'

import pageTransition from '@/mixins/page-transition'

export default {
  mixins: [scroll],
  transition(to, from) {
    if (!to || !from) return

    return to.name === 'arena' && to.params.enterArena
      ? pageTransition.fromIndexToArena
      : pageTransition.basic
  },
  async asyncData({ $directus }) {
    const content = await $directus.items('Arena_page').readByQuery({
      limit: -1,
    })

    const galerie = await $directus.items('Galerie_arena').readByQuery({
      limit: -1,
    })

    const slider = await $directus.items('Arena_slider').readByQuery({
      limit: -1,
    })

    const videos = await $directus.items('Arena_videos').readByQuery({
      limit: -1,
    })

    return {
      content,
      galerie,
      slider,
      videos,
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
      meta: [
        {
          name: 'apple-itunes-app',
          content: `app-id=${this.$config.apiKeyAppstore}, app-argument=${this.$config.baseURL}`
        },
      ],
    })
  },

  computed: {
    ...mapState({
      partnersContent: (state) => state.partnersContent,
      appContent: (state) => state.appContent,
      webview: (state) => state.webview,
      navArenaActive: (state) => state.navArenaActive,
      arenaGymnases: (state) => state.arenaGymnases,
    }),
    contentCatchphrase() {
      return {
        catchphrase: this.content.data.arena_catchphrase,
      }
    },
    contentFullwidth() {
      return {
        src: this.content.data.fullwidth_picture,
        alt: this.content.data.fullwidth_picture_alt,
      }
    },
    contentGallery() {
      return {
        items: this.galerie.data,
      }
    },
    contentGymnases() {
      return {
        title: this.content.data.arena_gymnases_title,
        subtitle: this.content.data.arena_gymnases_subtitle,
        paragraph: this.content.data.arena_gymnases_paragraph,
        list: this.arenaGymnases?.data,
      }
    },
    contentIntroduction() {
      return {
        title: this.content.data.arena_introduction_title,
        paragraph: this.content.data.arena_introduction_paragraph,
        pictureFramedImage:
          this.content.data.arena_introduction_picture_framed_image,
        pictureFramedAlt:
          this.content.data.arena_introduction_picture_framed_alt,
        video_url: this.content.data.arena_introduction_video_url,
        video_cover: this.content.data.arena_introduction_video_cover
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
    contentPlan() {
      return {
        title: this.content.data.arena_plan_title,
        subtitle: this.content.data.arena_plan_subtitle,
        paragraph: this.content.data.arena_plan_paragraph,
        chapelle: this.content.data.arena_plan_chapelle_place,
        basilique: this.content.data.arena_plan_basilique_place,
      }
    },
    contentPresentation() {
      return {
        title: this.content.data.arena_presentation_title,
        subtitle: this.content.data.arena_presentation_subtitle,
        whyTitle: this.content.data.arena_presentation_why_title,
        whyParagraph: this.content.data.arena_presentation_why_paragraph,
        pictureFramedImage:
          this.content.data.arena_presentation_picture_framed_image,
        pictureFramedAlt:
          this.content.data.arena_presentation_picture_framed_alt,
        pictureLabelImage:
          this.content.data.arena_presentation_picture_label_image,
        pictureLabelAlt:
          this.content.data.arena_presentation_picture_label_alt,
        pictureLabelText:
          this.content.data.arena_presentation_picture_label_text,
        pictureLogoImage:
          this.content.data.arena_presentation_picture_logo_image,
        pictureLogoAlt: this.content.data.arena_presentation_picture_logo_alt,
      }
    },
    contentSlider() {
      return {
        title: this.content.data.slider_title,
        text: this.content.data.slider_paragraph,
        totalText: this.content.data.slider_total_text,
        items: this.slider.data,
      }
    },
    contentTwoColumns() {
      return {
        firstRow: {
          title: this.content.data.arena_two_columns_first_row_title,
          paragraph: this.content.data.arena_two_columns_first_row_paragraph,
          cardTitle: this.content.data.arena_two_columns_first_row_card_title,
          cardSubtitle:
            this.content.data.arena_two_columns_first_row_card_subtitle,
          cardParagraph:
            this.content.data.arena_two_columns_first_row_card_paragraph,
          cardCtaText:
            this.content.data.arena_two_columns_first_row_card_cta_text,
        },
        secondRow: {
          title: this.content.data.arena_two_columns_second_row_title,
          paragraph: this.content.data.arena_two_columns_second_row_paragraph,
          picture: this.content.data.arena_two_columns_second_row_picture,
          pictureAlt:
            this.content.data.arena_two_columns_second_row_picture_alt,
          cardTitle: this.content.data.arena_two_columns_second_row_card_title,
          cardSubtitle:
            this.content.data.arena_two_columns_second_row_card_subtitle,
          cardParagraph:
            this.content.data.arena_two_columns_second_row_card_paragraph,
        },
      }
    },
    contentVideos() {
      return {
        title: this.content.data.videos_title,
        items: this.videos.data,
      }
    },
  },
  mounted() {

    this.setAllowScroll(true);

    window.addEventListener('scroll', this.checkScroll.bind(this));

  },
  beforeDestroy() {},
  methods: {
    ...mapMutations({
      setAllowScroll: 'setAllowScroll',
      setNavArenaActive: 'setNavArenaActive',
    }),

    checkScroll(e){
      const _wT = window.scrollY;
      const _wH = window.outerHeight;

      const _section1 = this.$refs.arena.$el;
      //  console.log('_section1', _section1);
      const _section1T = _section1.offsetTop;
      //  const _section1H = _section1.offsetHeight;
      const _section2 = this.$refs.pbb.$el;
      //  console.log('_section2', _section2);
      const _section2T = _section2.offsetTop;
      const _section2H = _section2.offsetHeight;
      const _section3 = this.$refs.gymnases.$el;
      //  console.log('_section3', _section3);
      const _section3T = _section3.offsetTop;
      const _section3H = _section3.offsetHeight;
      const _section4 = this.$refs.lieudevie.$el;
      //  console.log('_section4', _section4);
      const _section4T = _section4.offsetTop;
      const _section4H = _section4.offsetHeight;


      //  console.log('_section1H', _section1H);
      //  console.log('_section2H', _section2H);
      //  console.log('_section3H', _section3H);

      if(_wT + (_wH/2) >= _section1T && _wT + (_wH/2) <= _section2T){
        this.setNavArenaActive('arena');
      } else if(_wT + (_wH/2) >= _section2T && _wT <= _section2T+_section2H){
        this.setNavArenaActive('pbb');
      } else if(_wT + (_wH/2) >= _section3T && _wT <= _section3T+_section3H){
         this.setNavArenaActive('gymnases');
      } else if(_wT + (_wH/2) >= _section4T && _wT <= _section4T+_section4H){
         this.setNavArenaActive('lieudevie');
      } else {
        this.setNavArenaActive(false);
      }

    },

    scrollToSection(_section){
      //  console.log('scrollToSection/ _section', _section);
      const _el = this.$refs[_section].$el;
      //  console.log('scrollToSection/ _el', _el);
      _el.scrollIntoView({ 
        behavior: 'smooth' 
      });

    }
  },
}
</script>

<style lang="scss">
.app-arena {
  .app-arena-gallery {
    margin-top: desktop-vw(130px);

    @include mobile{
       margin-top: mobile-vw(60px);
    }

  }
  .app-footer {
    margin-top: desktop-vw(165px);

    @include mobile{
       margin-top: mobile-vw(80px);
    }
  }
  .app-element-slider{
    @include mobile{
      margin: mobile-vw(60px) 0;
    }

    &__heading__title{
      .H1.medium{
        @include font-ITCFranklinGothicLT-BkCp();

        strong{
          @include font-ITCFranklinGothicLT-DmCp();
        }
      }
    }
  }

  &__nav{
    position: fixed;
    display: flex;
    flex-wrap: nowrap;
    z-index: 200;
    bottom: desktop-vw(42px);
    left: desktop-vw(40px);
    border: 1px solid var(--c-black);
    background-color: var(--c-black);

    @include mobile{
      bottom: mobile-vw(14px);
      left: mobile-vw(16px);
    }

    &__btn{
      display: block;
      flex: 0 0 auto;
      width: auto;
      margin: 0 1px 0 0;
      padding: desktop-vw(12px) desktop-vw(12px) desktop-vw(8px);
      border: none;
      background-color: var(--c-white);
      @include font-ITCFranklinGothicLT-DmXtraCp();
      font-size: desktop-vw(16px);
      line-height: desktop-vw(12px);
      font-weight: 600;
      color: var(--c-black);
      text-align: center;
      text-transform: uppercase;
      transition: all 360ms ease-in-out;
      cursor: pointer;

      @include mobile{
        padding: mobile-vw(12px) mobile-vw(12px) mobile-vw(8px);
        font-size: mobile-vw(16px);
        line-height: mobile-vw(12px);
      }

      &:hover{
        background-color: #FF4A48;
      }

      &.active{
         background-color: #FF4A48;
      }

      &:last-child{
        margin: 0;
      }
    }
  }
}
</style>
