<template>
  <main class="page-cchapelle">

    <div class="page-cchapelle-content">

      <div class="page-cchapelle__title__block">

        <ERichText
          ref="title"
          class="page-cchapelle__title__block__title"
          :content="chapelleContent.tmp_title"
          tag="h1"
        />
        <ERichText
          ref="title"
          class="page-cchapelle__title__block__subtitle"
          :content="chapelleContent.tmp_subtitle"
          tag="h4"
        />
      </div>

      <ETwoColumnsStick
        :left-content="contentTwoColumns.left"
        :right-content="contentTwoColumns.right"
      />

      <AppCchapelleEdito v-if="edito?.text" :content="edito" />

      <AppCchapelleComingSoon>
        <TH1 tag="p" weight="bold">
          {{ contentMarquees.firstRow }}
        </TH1>
      </AppCchapelleComingSoon>
      <AppCchapelleComingSoon :inverted="true">
        <TH1 tag="p" weight="bold">
          {{ contentMarquees.secondRow }}
        </TH1>
      </AppCchapelleComingSoon>

    </div>

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
  data() {
    return {
      selectedCategory: null,
      selectContents: [],
      edito: null,
    }
  },
  computed: {
    ...mapState({
      allLoadedFake: (state) => state.allLoadedFake,
      appContent: (state) => state.appContent,
      chapelleContent: (state) => state.chapelleContent,
      partnersContent: (state) => state.partnersContent,
      webview: (state) => state.webview,
    }),
    contentTwoColumns() {
      return {
        left: this.chapelleContent.tmp_two_columns_left,
        right: this.chapelleContent.tmp_two_columns_right,
      }
    },
    contentMarquees() {
      return {
        firstRow: 'Coming&nbsp;Soon Coming&nbsp;Soon Coming&nbsp;Soon Coming&nbsp;Soon Coming&nbsp;Soon Coming&nbsp;Soon Coming&nbsp;Soon Coming&nbsp;Soon',
        secondRow: 'Coming&nbsp;Soon Coming&nbsp;Soon Coming&nbsp;Soon Coming&nbsp;Soon Coming&nbsp;Soon Coming&nbsp;Soon Coming&nbsp;Soon Coming&nbsp;Soon',
      }
    },
  },
  mounted() {
    console.log('chapelleContent', this.chapelleContent);
    this.setAllowScroll(true)

    this.edito = {
      title:this.chapelleContent.tmp_edito_title,
      text:this.chapelleContent.tmp_edito_text,
      video_url:this.chapelleContent.tmp_edito_video_url,
      video_cover:this.chapelleContent.tmp_edito_video_cover,
      image1:this.chapelleContent.tmp_edito_image_1,
      image2:this.chapelleContent.tmp_edito_image_2,
    }
  },
  methods: {
    ...mapMutations({
      setAllowScroll: 'setAllowScroll',
    }),
  },
}
</script>

<style lang="scss">
.page-cchapelle {
  @include mobile {
    // background: green;
  }

  &-content{

    background: linear-gradient(
        rgba(251, 245, 238, 0.8) 0.1em,
        transparent 0.1em
      ),
      linear-gradient(90deg, rgba(251, 245, 238, 0.8) 0.1em, transparent 0.1em),
      white;
    background-size: 1.2em 1.2em;

    @include desktop {
      padding: desktop-vw(150px) 0 desktop-vw(80px);
    }

    @include mobile {
      padding: mobile-vw(90px) 0 mobile-vw(40px);
    }

  }

  &__title{
    @include desktop {
      margin: 0;
    }

    @include mobile {
      margin: 0 0 mobile-vw(16px);
    }

    &__block{

      &__title{
       display: flex;
       flex-wrap: wrap;
       justify-content: center;

        @include desktop {
          margin: 0;
        }

        @include mobile {
          margin: 0 0 mobile-vw(16px);
        }

        .H2{
          color: var(--c-black)!important;

          @include desktop {
            margin-bottom: 0;
            font-size: desktop-vw(100px);
            line-height: desktop-vw(90px);
            letter-spacing: desktop-vw(-3px);
          }

          @include mobile {
            margin-bottom: mobile-vw(10px);
            font-size: mobile-vw(64px);
            line-height: mobile-vw(57px);
            letter-spacing: mobile-vw(-1.92px);
            text-align: center;
          }

          .app-element-lottie-word svg{
            @include desktop {
              bottom: desktop-vw(15px);
              width: 66%!important;
            }
            @include mobile {
              bottom: mobile-vw(10px);
            }
            

          }

        }

        .app-atoms-stroke-text {
          -webkit-text-stroke: 1px var(--c-black);
          -webkit-text-fill-color: transparent;
        }

      }

      &__subtitle{
       display: flex;
       flex-wrap: wrap;
       justify-content: center;

        @include desktop {
          margin: 0;
        }
      }
    }
  }
  .app-two-columns-stick {
    .app-element-lottie-word {
      &.Trait_2 svg {
        position: absolute;
        left: 50%;
        width: 100%;
        height: auto !important;
        bottom: -75%;
        transform: translate(-50%, -50%) !important;

        @include mobile {
          bottom: -50px;
        }
      }
      &.Cercle_1 svg {
        position: absolute;
        width: 135% !important;
        height: auto !important;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%) rotate(5deg) !important;
      }
    }
  }
  .app-footer {
    margin-top: desktop-vw(25px);

    @include mobile {
      margin-top: mobile-vw(80px);
    }
  }
}
</style>
