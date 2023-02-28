<template>
  <main class="page-be-part-of-partenaire">
    <AppBepartofPartenaireIntroduction :contents="contentIntroduction" />
    <AppBepartofPartenairePartenaires :contents="contentPartners" />
    <AppContactQuestion :contents="contentContactQuestion" />
    <AppContactNewsletter :contents="contentContactNewsletter" />
    <!-- <AppGallery :contents="contentGallery" /> -->
    <AppFooter :contents="appContent" :logos="partnersContent.data" />
  </main>
</template>

<script>
import { mapState } from 'vuex'

import scroll from '@/mixins/scroll'
import pageTransition from '@/mixins/page-transition'

export default {
  mixins: [scroll],
  transition(to, from) {
    if (!to || !from) return

    return pageTransition.basic
  },
  async asyncData({ $directus }) {
    const content = await $directus.items('Partenaire_page').readByQuery({
      limit: -1,
    })

    // const galerie = await $directus.items('Galerie_partenaire').readByQuery({
    //   limit: -1,
    // })

    return {
      content,
      // galerie,
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
    // contentGallery() {
    //   return {
    //     items: this.galerie.data,
    //   }
    // },
    contentPartners() {
      return {
        title: this.content.data.partenaires_title,
        list: this.partnersContent.data,
      }
    },
    contentContactQuestion() {
      return {
        title: this.content.data.contact_question,
        cta: this.content.data.contact_question_cta,
        email: this.content.data.contact_question_email,
        emailSubject: this.content.data.contact_question_email_sujet,
        formType: this.content.data.contact_question_form_type,
      }
    },
    contentContactNewsletter() {
      return {
        title: this.content.data.contact_newsletter,
        placeholder: this.appContent.data.footer_input_placeholder,
        text: this.content.data.contact_newsletter_text,
        ctaText: this.content.data.contact_newsletter_cta_text,
        ctaHref: this.content.data.contact_newsletter_cta_href,
      }
    },
    contentIntroduction() {
      return {
        title: this.content.data.introduction_title,
        subtitle: this.content.data.introduction_subtitle,
        secondTitle: this.content.data.introduction_second_title,
        secondSubtitle: this.content.data.introduction_second_subtitle,
        picture: {
          src: this.content.data.introduction_picture,
          alt: this.content.data.introduction_picture_alt,
        },
        pictureFramed: {
          src: this.content.data.introduction_picture_framed,
          alt: this.content.data.introduction_picture_framed_alt,
        },
      }
    },
  },
  mounted() {},
}
</script>

<style lang="scss">
.page-be-part-of-partenaire {
  margin-top: desktop-vw(300px);

  @include mobile {
    margin-top: mobile-vw(120px);
  }

  .app-contact-question {
    margin-top: desktop-vw(280px);

    @include mobile {
      margin-top: mobile-vw(60px);
    }

    &__title.app-element-rich-text {
      grid-column: 2 / span 10;

      @include mobile {
        grid-column: 1 / span 6;
      }

      .app-element-lottie-word.Cercle_3 svg {
        position: absolute;
        width: 135% !important;
        height: auto !important;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%) rotate(5deg) !important;
      }

      .app-element-lottie-word.Croix_01 {
        svg {
          position: absolute;
          left: 0;
          width: 100%;
          height: 60% !important;
          width: auto !important;
          right: 0;
          left: initial;
          transform: translate(50%, 20%) !important;
          bottom: 0;

          @include mobile {
            height: 100% !important;
            transform: translate(50%, 65%) !important;
          }
        }
      }
    }
  }
  .app-contact-actus {
    margin-bottom: desktop-vw(180px);

    @include mobile {
      margin-bottom: mobile-vw(100px);
    }
  }
}
</style>
