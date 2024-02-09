<template>
  
  <main class="app-tonnomsurlarena">

    <div 
      class="app-tonnomsurlarena__step grid-inner"
      >

      <div
        ref="step1visual"
        class="app-tonnomsurlarena__visual">
        <EKinesis :speed="5">
          <div class="app-tonnomsurlarena__visual__container">
            <AppTonnomsurlarenaImage
              :src="`adidas-arena-vue-ext.jpg`"
              :alt="`Test`"
              :lazy="true"
              :sizes="{
                desktop: 'w600,h600,fcrop,q85',
                mobile: 'w600,h600,fcrop,q85',
              }"
              />
          </div>
        </EKinesis>

        <EParallax
          ref="visualTransparent"
          :speed="0.6"
          class="app-tonnomsurlarena__visual__logo"
        >
          <EKinesis :speed="10">
            <nuxt-picture
              :src="`/imgs/tonnomsurlarena/logo_adidas.webp`"
              format="webp"
              :alt="`Adidas`"
            />
            <AtomsCornerPoints :size-points="6" />
          </EKinesis>
        </EParallax>
      </div>

      <div 
        ref="step1intro"
        class="app-tonnomsurlarena__intro">
        <ERichText
          ref="title"
          :content="`<h1 class='H1 app-tonnomsurlarena__intro__title confirmation regular'><span class='H1 bold'>Trop tard...</span></h1>`"
          tag="h1"
        />
        <ERichText
          ref="paragraph"
          :content="`<p class='app-tonnomsurlarena__intro__paragraph confirmation'>L'inscription pour mettre ton prénom sur l'Adidas Arena est maintenant close.</p>`"
          tag="p"
        />

          <AtomsCTA
            class="app-tonnomsurlarena__confirm__cta"
            href="/programmation"
          >
            Je découvre la programmation
          </AtomsCTA>
      </div>

    </div>
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
      initialHeroDisplayed: (state) => state.initialHeroDisplayed,
    }),
  },
  watch: {
    initialHeroDisplayed(newVal) {
      if (!newVal) return

      this.setAllowScroll(true)
    },
  },
  mounted() {
    if (this.allLoadedFake) {
      this.setAllowScroll(true)
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
.app-tonnomsurlarena{

  @include desktop {
    padding-top: desktop-vw(130px);
    height: 100vH;
    overflow: hidden;
  }

  @include mobile {
    padding-top: mobile-vw(85px);
    grid-gap: mobile-vw(10px);
  }

  &__step{
    width: 100%;

    @include mobile{
      transition: all 500ms ease-in-out;
    }


    @include desktop{
      height: 100vH;
    }

    &.hidden{
      
      @include mobile{
        height: 0px;
        opacity: 0;
        overflow: hidden;
      }
    }
  }

  &__visual{
    position: relative;
    display: flex;
    flex-direction: column;

    @include mobile{
      grid-column: 1 / span 11;
    }

    @include desktop{
      grid-column: 2 / span 5;
    }

    &__container{
      display: inline-block;
      overflow: hidden;


      @include mobile{
        width: 100%;
        max-height: mobile-vw(440px);
      }

      @include desktop{
        margin-top: desktop-vw(20px);
        width: 90%;
        transform: rotate(-4deg);
        max-width: desktop-vw(468px);
        max-height: desktop-vw(540px);
      }

      .app-tonnomsurlarena-image{
        @include desktop{
         transform: rotate(4deg) scale(1.1);
        }
      }
    }

    &__logo{
      @include mobile{
        display: none;
      }
      @include desktop{
        position: absolute;
        grid-row: 2;
        width: 30%;
        max-width: 30%;
        grid-column: 6 / span 2;
        top: 35%;
        transform: rotate(-9deg);
        aspect-ratio: 200 / 130;
        left: 70%;
        display: flex;
        align-items: center;
        justify-content: center;
        height: auto;
        transform-origin: center center;


        .app-element-kinesis {
          display: flex;
          justify-content: center;
          align-items: center;

          @include fake-transparent();
        }

        picture {
          display: block;
          width: 55%;
          height: auto;
        }
      }
    }
  }

  &__intro{
    position: relative;
    display: flex;
    flex-direction: column;


    &__lottie{
      @include mobile{
        display: none;
      }

      @include desktop{
        position: absolute;
        top: desktop-vw(20px);
        left: desktop-vw(-80px);
        width: 80%;
        transform: translateY(-50%);
      }

    }

    @include mobile{
      grid-column: 1 / span 11;
    }

    @include desktop{
      grid-column: 7 / span 5;
    }

    &__title {
      width: 100%;

      &.confirmation{
        @include mobile{
          margin-bottom: mobile-vw(20px);
        }
        @include desktop{
          margin-bottom: desktop-vw(50px);
        }
      }

      &.H1.regular{


        @include mobile {
          @include font-ITCFranklinGothicLT-DmCp();
          font-size: mobile-vw(50px);
          line-height: mobile-vw(50px);
          letter-spacing: mobile-vw(.25px);
        }

        @include desktop {
          @include font-ITCFranklinGothicLT-BkCp();
          font-size: desktop-vw(90px);
          line-height: desktop-vw(90px);
          letter-spacing: 0;
        }

      }


      .H1.bold {

        @include mobile {
          @include font-ITCFranklinGothicLT-BkCp();
          font-size: mobile-vw(50px);
          line-height: mobile-vw(50px);
          letter-spacing: mobile-vw(.25px);
        }

        @include desktop {
          font-size: desktop-vw(90px);
          line-height: desktop-vw(90px);
          letter-spacing: 0;
        }
      }
    }

    &__paragraph{
      width: 80%;
      text-transform: uppercase;
      @include font-ITCFranklinGothicLT-DmCp();
      color: var(--c-black);

      .br-hidden{
        @include mobile{
          display: none;
        }
      }

      @include mobile{
        padding-left: mobile-vw(2px);
        margin-top: mobile-vw(16px);
        font-size: mobile-vw(16px);
        line-height: mobile-vw(18px);
      }

      @include desktop{
        padding-left: desktop-vw(4px);
        margin-top: desktop-vw(20px);
        font-size: desktop-vw(17px);
        line-height: desktop-vw(20px);
      }

      @include mobile-l {
        font-size: mobile-vw(12px);
        line-height: mobile-vw(18px);
      }

      @include desktop-xl {
        font-size: desktop-vw(12px);
        line-height: desktop-vw(18px);
      }

      &.confirmation{

        @include mobile{
          margin-bottom: mobile-vw(32px);
        }

        @include desktop{
          margin-bottom: desktop-vw(32px);
        }
      }

      &.regular{
        width: 100%;

        @include font-ITCFranklinGothicLT-BkCp();

        @include mobile{
          margin-top: 0;
          font-size: mobile-vw(14px);
          line-height: mobile-vw(16px);
        }

        @include desktop{
          margin-top: 0;
          font-size: desktop-vw(14px);
          line-height: desktop-vw(16px);
        }
      }

      &.list{
        list-style: none;

        li{
          position: relative;

          @include mobile{
            padding: 0 0 0 mobile-vw(12px);
          }

          @include desktop{
            padding: 0 0 0 desktop-vw(24px);
          }

          strong{
           font-family:'ITCFranklinGothicLT-DmCp';
          }

          &:before{
            content:'';
            position: absolute;
            top: 50%;
            line-height: 0;
            font-size: 0;
            background-color: #000;
            transform: translateY(-50%);

            @include mobile{
              left: mobile-vw(5px);
              width: mobile-vw(2px);
              height: mobile-vw(2px);
            }

            @include desktop{
              left: desktop-vw(10px);
              width: desktop-vw(2px);
              height: desktop-vw(2px);
            }
          }
        }
      }

    }

    &__cta{
      width: 50%;

      @include mobile{
        margin-top: mobile-vw(30px);
        margin-bottom: mobile-vw(30px);

      }

      @include desktop{
        margin-top: desktop-vw(60px);
      }
    }

  }

  &__confirm{


    &__cta{
      width: 50%;

      @include mobile{
        margin-top: mobile-vw(16px);
        margin-bottom: mobile-vw(30px);

      }

      @include desktop{
        margin-top: desktop-vw(30px);
      }
    }
  }

}

</style>
