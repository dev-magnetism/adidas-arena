<template>
  <main class="page-cchapelle">

    <div class="page-cchapelle__nav">
      <button
        class="page-cchapelle__nav__btn"
        :class="{active: this.navCCActive === 'about'}"
        @click="scrollToSection('about')"
        >
        {{this.chapelleContent.nav_btn1_label}}
      </button>
      <button
        class="page-cchapelle__nav__btn"
        :class="{active: this.navCCActive === 'music'}"
        @click="scrollToSection('music')"
        >
        {{this.chapelleContent.nav_btn2_label}}
      </button>
      <button
        class="page-cchapelle__nav__btn"
        :class="{active: this.navCCActive === 'food'}"
        @click="scrollToSection('food')"
        >
        {{this.chapelleContent.nav_btn3_label}}
      </button>
    </div>

    <AppCchapelleIntroduction
      :contents="introduction"
      />
    
    <AppCchapelleAbout
      :contents="about"
      ref="about"
      />
    
    <AppCchapelleProgrammation
      :contents="programmation"
      ref="music"
      />
    
    <AppCchapelleCoeur
      :contents="coeur"
      />

    <AppCchapelleCentralcourt
      :contents="centralcourt"
      />

    <AppCchapelleFood
      :contents="food"
      ref="food"
      />

    <AppCchapelleNewsletter
      :contents="newsletter"
      />


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

    return pageTransition.basic
  },
  computed: {
    ...mapState({
      allLoadedFake: (state) => state.allLoadedFake,
      appContent: (state) => state.appContent,
      chapelleContent: (state) => state.chapelleContent,
      chapelleFoodContent: (state) => state.chapelleFoodContent,
      partnersContent: (state) => state.partnersContent,
      webview: (state) => state.webview,
      navCCActive: (state) => state.navCCActive,
    }),

    about(){
      const _content = {
        floatlabel1: this.chapelleContent.about_floatlabel1,
        floatlabel2: this.chapelleContent.about_floatlabel2,
        floatlabel3: this.chapelleContent.about_floatlabel3,
        text: this.chapelleContent.about_text,
        visual: this.chapelleContent.about_visual,
        socials_facebook:  this.chapelleContent.about_socials_facebook,
        socials_linkedin:  this.chapelleContent.about_socials_linkedin,
        socials_instagram:  this.chapelleContent.about_socials_instagram,
        socials_tiktok:  this.chapelleContent.about_socials_tiktok,
      }
      return _content;
    },

    centralcourt(){
      const _content = {
        introduction: this.chapelleContent.centralcourt_introduction,
        paragraph1: {
          title: this.chapelleContent.centralcourt_paragraph1_title,
          text: this.chapelleContent.centralcourt_paragraph1_text,
          card: {
            title: this.chapelleContent.centralcourt_paragraph1_card_title,
            subtitle: this.chapelleContent.centralcourt_paragraph1_card_subtitle,
            text: this.chapelleContent.centralcourt_paragraph1_card_text,
          } 
        },
        paragraph2: {
          title: this.chapelleContent.centralcourt_paragraph2_title,
          text: this.chapelleContent.centralcourt_paragraph2_text,
          card: {
            title: this.chapelleContent.centralcourt_paragraph2_card_title,
            subtitle: this.chapelleContent.centralcourt_paragraph2_card_subtitle,
            text: this.chapelleContent.centralcourt_paragraph2_card_text,
          },
          cta:{
            label: this.chapelleContent.centralcourt_paragraph2_cta_label,
            url: this.chapelleContent.centralcourt_paragraph2_cta_url,
          },
          visual: this.chapelleContent.centralcourt_paragraph2_visual,
        },
      }

      return _content;
    },

    coeur(){
      const _content = {
        title: this.chapelleContent.coeur_title,
        text: this.chapelleContent.coeur_text,
        map: {
          zone1:{
            title: this.chapelleContent.coeur_zone1_title,
            text: this.chapelleContent.coeur_zone1_text,
          },
          zone2:{
            title: this.chapelleContent.coeur_zone2_title,
            text: this.chapelleContent.coeur_zone2_text,
          },
          zone3:{
            title: this.chapelleContent.coeur_zone3_title,
            text: this.chapelleContent.coeur_zone3_text,
          },
          zone4:{
            title: this.chapelleContent.coeur_zone4_title,
            text: this.chapelleContent.coeur_zone4_text,
          },
          zone5:{
            title: this.chapelleContent.coeur_zone5_title,
            text: this.chapelleContent.coeur_zone5_text,
          },
          originals:{
            title: this.chapelleContent.coeur_originals_title,
            text: this.chapelleContent.coeur_originals_text,
          },
        }
      }
      return _content;
    },

    food(){
      const _content = {
        title: this.chapelleContent.foodactivity_title,
        items: this.chapelleFoodContent,
      }
      return _content;
    },

    introduction(){
      const _content = {
        logo: this.chapelleContent.logo,
        title: this.chapelleContent.title,
        opening_date: this.chapelleContent.opening_date,
        visual: this.chapelleContent.introduction_visual
      }
      return _content;
    },

    newsletter(){
      const _content = {
        title: this.chapelleContent.newsletter_title,
        text: this.chapelleContent.newsletter_text,
        placeholder: this.chapelleContent.newsletter_placeholder,
        optin: this.chapelleContent.newsletter_optin,
        confirmation: this.chapelleContent.newsletter_confirmation,
      }
      return _content;
    },

    programmation(){
      const _content = {
        title: this.chapelleContent.programmation_title,
        cta_label: this.chapelleContent.programmation_cta_label,
        cta_link: "#",
        list:[

        ]
      }
      return _content;
    }

  },
  mounted() {
    //  console.log('chapelleContent', this.chapelleContent);
    this.setAllowScroll(true);

    window.addEventListener('scroll', this.checkScroll.bind(this));

    //  console.log('about ref', this.$refs.about.$el);

  },
  methods: {
    ...mapMutations({
      setAllowScroll: 'setAllowScroll',
      setNavCCActive: 'setNavCCActive',
    }),

    checkScroll(e){
      const _wT = window.scrollY;
      const _wH = window.outerHeight;

      const _section1 = this.$refs.about.$el;
      const _section1T = _section1.offsetTop;
      const _section1H = _section1.offsetHeight;
      const _section2 = this.$refs.music.$el;
      const _section2T = _section2.offsetTop;
      const _section2H = _section2.offsetHeight;
      const _section3 = this.$refs.food.$el;
      const _section3T = _section3.offsetTop;
      const _section3H = _section3.offsetHeight;


      //  console.log('_section1H', _section1H);
      //  console.log('_section2H', _section2H);
      //  console.log('_section3H', _section3H);

      if(_wT + (_wH/2) >= _section1T && _wT <= _section1T+_section1H){
        this.setNavCCActive('about');
      } else if(_wT + (_wH/2) >= _section2T && _wT <= _section2T+_section2H){
        this.setNavCCActive('music');
      } else if(_wT + (_wH/2) >= _section3T && _wT <= _section3T+_section3H){
         this.setNavCCActive('food');
      } else {
        this.setNavCCActive(false);
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
.page-cchapelle {
  margin-top: desktop-vw(208px);

  @include mobile {
      margin-top: mobile-vw(56px);
  }

  &__nav{
    position: fixed;
    display: flex;
    flex-wrap: nowrap;
    z-index: 10;
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
        background-color: #FFE400;
      }

      &.active{
         background-color: #FFE400;
      }

      &:last-child{
        margin: 0;
      }
    }
  }

}
</style>
