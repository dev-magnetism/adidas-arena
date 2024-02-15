<template>
  <main class="app-tonnomsurlarena">
    <div class="app-tonnomsurlarena__step grid-inner">
      <div ref="step1visual" class="app-tonnomsurlarena__visual">
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

      <div ref="step1search" class="app-tonnomsurlarena__search">
        <ERichText
          ref="title"
          :content="`<h1 class='H1 app-tonnomsurlarena__search__title confirmation regular'><span class='H1 bold'>Ça y est,</span><br/>l'Adidas Arena c'est TON Arena !</h1>`"
          tag="h1"
        />

        <ERichText
          ref="paragraph"
          :content="`<p class='app-tonnomsurlarena__search__paragraph confirmation'>Le 11 février restera inoubliable pour tous. Tu fais également partie de cette grande histoire... Comme promis, découvre ici la photo de ton prénom affiché sur la façade de l’adidas arena. Récupère ce souvenir indélébile ici, et partage-le à tous tes potes !</p>`"
          tag="p"
        />

        <vue-autosuggest
          v-model="query"
          class="app-tonnomsurlarena__autosuggest__field"
          :get-suggestion-value="getSuggestionValue"
          :should-render-suggestions="shouldRenderSuggestions"
          :input-props="{
            id: 'autosuggest__input',
            ref: 'suggestfield',
            class: 'app-tonnomsurlarena__autosuggest__input',
            placeholder: 'Recherche ton prénom...',
          }"
          component-attr-class-autosuggest-results-container="app-tonnomsurlarena__autosuggest__results-container"
          component-attr-class-autosuggest-results="app-tonnomsurlarena__autosuggest__results"
          component-attr-prefix="app-tonnomsurlarena__autosuggest"
          :suggestions="filteredOptions"
          @focus="focusMe"
          @click="clickHandler"
          @input="onInputChange"
          @selected="onSelected"
        >
          <template slot="after-input">
            <AtomsCTA class="app-tonnomsurlarena__cta" button disabled>
              Rechercher
            </AtomsCTA>
          </template>
          <div
            slot-scope="{ suggestion }"
            class="app-tonnomsurlarena__autosuggest__item"
          >
            <div style="{ display: 'flex', color: 'navyblue'}">
              {{ suggestion.item.name }}
            </div>
          </div>
        </vue-autosuggest>
      </div>
    </div>

    <div v-if="selectedUrl !== ''" class="app-tonnomsurlarena__step grid-inner">
      <div class="app-tonnomsurlarena__pictures">
        <nuxt-picture :src="selectedUrl" format="webp" :alt="`Adidas`" />
        <div class="app-tonnomsurlarena__pictures__cta-container">
          <AtomsCTA
            class="app-tonnomsurlarena__pictures__cta-container__cta"
            button
            :arrow="false"
            :download="true"
            @click.native="download()"
          >
            Telecharger
            <SvgCtaDownload />
          </AtomsCTA>
          <AtomsCTA
            class="app-tonnomsurlarena__pictures__cta-container__cta"
            button
            :arrow="false"
            @click.native="openPopin()"
          >
            Partager
            <SvgCtaShare />
          </AtomsCTA>
        </div>
      </div>
    </div>
    <AppPopinShare :popin-share-open="isPopinOpen" :on-close-popin="closePopin" :image-url="selectedUrl" />
  </main>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { VueAutosuggest } from 'vue-autosuggest'

import scroll from '@/mixins/scroll'
import pageTransition from '@/mixins/page-transition'

export default {
  mixins: [scroll],
  transition(to, from) {
    if (!to || !from) return

    return pageTransition.basic
  },
  components: {
    VueAutosuggest,
  },
  asyncData({ params, store, $axios }) {
    //  const [artist, id] = params.id.split('--')
  },
  data() {
    return {
      query: '',
      selected: '',
      selectedUrl: '',
      isPopinOpen: false
    }
  },
  computed: {
    ...mapState({
      allLoadedFake: (state) => state.allLoadedFake,
      initialHeroDisplayed: (state) => state.initialHeroDisplayed,
      concoursDatas: (state) => state.concoursDatas,
    }),
    filteredOptions() {
      return [
        {
          data: this.concoursDatas.filter((option) => {
            return option.name.toLowerCase().includes(this.query.toLowerCase())
          }),
        },
      ]
    },
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
    clickHandler(item) {
      this.selected = ''
      // event fired when clicking on the input
    },
    onSelected(item) {
      this.selected = item.item
      this.selectedUrl = `imgs/tonnomsurlarena/pics/${this.selected.name.toLowerCase()}.jpg`
    },
    onInputChange(text) {
      // event fired when the input changes
      console.log(text)
    },
    /**
     * This is what the <input/> value is set to when you are selecting a suggestion.
     */
    getSuggestionValue(suggestion) {
      return suggestion.item.name
    },
    shouldRenderSuggestions(size, loading) {
      // This is the default behavior
      return size >= 1 && this.query.length > 0 && this.selected === ''
      // && this.$refs.suggestfield.current.value !== ""
    },
    focusMe(e) {
      console.log(e) // FocusEvent
    },
    download() {
      const link = document.createElement('a')
      link.href = this.selectedUrl
      link.download = this.selected.name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
    openPopin() {
      this.isPopinOpen = true;
    },
    closePopin() {
      this.isPopinOpen = false;
    }
  },
}
</script>

<style lang="scss">
.app-tonnomsurlarena {
  @include desktop {
    padding-top: desktop-vw(200px);
    padding-bottom: desktop-vw(200px);
  }

  @include mobile {
    padding-top: mobile-vw(85px);
    grid-gap: mobile-vw(10px);
  }

  &__step {
    width: 100%;

    @include mobile {
      transition: all 500ms ease-in-out;
    }
  }

  &__visual {
    position: relative;
    display: flex;
    flex-direction: column;

    @include mobile {
      grid-column: 1 / span 11;
    }

    @include desktop {
      grid-column: 2 / span 5;
    }

    &__container {
      display: inline-block;
      overflow: hidden;

      @include mobile {
        width: 100%;
        max-height: mobile-vw(440px);
      }

      @include desktop {
        margin-top: desktop-vw(20px);
        width: 90%;
        transform: rotate(-4deg);
        max-width: desktop-vw(468px);
        max-height: desktop-vw(540px);
      }

      .app-tonnomsurlarena-image {
        @include desktop {
          transform: rotate(4deg) scale(1.1);
        }
      }
    }

    &__logo {
      @include mobile {
        display: none;
      }
      @include desktop {
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

  &__search {
    position: relative;
    display: flex;
    flex-direction: column;

    &__lottie {
      @include mobile {
        display: none;
      }

      @include desktop {
        position: absolute;
        top: desktop-vw(20px);
        left: desktop-vw(-80px);
        width: 80%;
        transform: translateY(-50%);
      }
    }

    @include mobile {
      grid-column: 1 / span 11;
    }

    @include desktop {
      grid-column: 7 / span 5;
    }

    &__title {
      width: 100%;

      &.confirmation {
        @include mobile {
          margin-bottom: mobile-vw(20px);
        }
        @include desktop {
          margin-bottom: desktop-vw(50px);
        }
      }

      &.H1.regular {
        @include mobile {
          @include font-ITCFranklinGothicLT-DmCp();
          font-size: mobile-vw(50px);
          line-height: mobile-vw(50px);
          letter-spacing: mobile-vw(0.25px);
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
          letter-spacing: mobile-vw(0.25px);
        }

        @include desktop {
          font-size: desktop-vw(90px);
          line-height: desktop-vw(90px);
          letter-spacing: 0;
        }
      }
    }

    &__paragraph {
      width: 100%;
      text-transform: uppercase;
      @include font-ITCFranklinGothicLT-BkCp();
      color: var(--c-black);

      .br-hidden {
        @include mobile {
          display: none;
        }
      }

      @include mobile {
        padding-left: mobile-vw(2px);
        font-size: mobile-vw(16px);
        line-height: mobile-vw(18px);
      }

      @include desktop {
        padding-left: desktop-vw(4px);
        font-size: desktop-vw(14px);
        line-height: desktop-vw(16px);
      }

      @include mobile-l {
        font-size: mobile-vw(12px);
        line-height: mobile-vw(18px);
      }

      @include desktop-xl {
        font-size: desktop-vw(12px);
        line-height: desktop-vw(18px);
      }

      &.confirmation {
        @include mobile {
          margin-bottom: mobile-vw(32px);
        }

        @include desktop {
          margin-bottom: desktop-vw(32px);
        }
      }

      &.regular {
        width: 100%;

        @include font-ITCFranklinGothicLT-BkCp();

        @include mobile {
          margin-top: 0;
          font-size: mobile-vw(14px);
          line-height: mobile-vw(16px);
        }

        @include desktop {
          margin-top: 0;
          font-size: desktop-vw(14px);
          line-height: desktop-vw(16px);
        }
      }

      &.list {
        list-style: none;

        li {
          position: relative;

          @include mobile {
            padding: 0 0 0 mobile-vw(12px);
          }

          @include desktop {
            padding: 0 0 0 desktop-vw(24px);
          }

          strong {
            font-family: 'ITCFranklinGothicLT-DmCp';
          }

          &:before {
            content: '';
            position: absolute;
            top: 50%;
            line-height: 0;
            font-size: 0;
            background-color: #000;
            transform: translateY(-50%);

            @include mobile {
              left: mobile-vw(5px);
              width: mobile-vw(2px);
              height: mobile-vw(2px);
            }

            @include desktop {
              left: desktop-vw(10px);
              width: desktop-vw(2px);
              height: desktop-vw(2px);
            }
          }
        }
      }
    }

    &__cta {
      width: 50%;

      @include mobile {
        margin-top: mobile-vw(30px);
        margin-bottom: mobile-vw(30px);
      }

      @include desktop {
        margin-top: desktop-vw(60px);
      }
    }
  }

  &__confirm {
    &__cta {
      width: 50%;

      @include mobile {
        margin-top: mobile-vw(16px);
        margin-bottom: mobile-vw(30px);
      }

      @include desktop {
        margin-top: desktop-vw(30px);
      }
    }
  }

  &__cta {
    position: absolute;
    right: desktop-vw(9px);
    top: desktop-vw(9px);

    .app-atoms-cta-click {
      padding: 0 desktop-vw(18px) !important;
      height: calc(100%);
    }

    .app-atoms-cta__arrow {
      width: desktop-vw(14px);
    }

    .app-atoms-cta.arrow {
      height: 100%;
    }

    .P2.bold {
      font-size: desktop-vw(18px);
      line-height: desktop-vw(10px);

      @media screen and (max-width: 768px) {
        font-size: mobile-vw(18px);
      }
    }
  }

  &__autosuggest {
    &__field {
      position: relative;

      .app-atoms-cta-click {
        padding: 0 desktop-vw(18px) !important;
        height: calc(100%);
      }
  
      .app-atoms-cta__arrow {
        width: desktop-vw(14px);

        @media screen and (max-width: 768px) {
          width: mobile-vw(14px);
        }
      }
  
      .app-atoms-cta.arrow {
        height: calc(100% - 10px);
      }

      & > div:first-child {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        border: 1px solid var(--c-black);
        padding: desktop-vw(12px);
        justify-content: space-between;
        align-items: center;
      }
    }

    &__input {
      display: inline-block;
      width: 100%;
      @include font-ITCFranklinGothicLT-BkCp();
      font-size: desktop-vw(30px);
      line-height: desktop-vw(44px);
      letter-spacing: desktop-vw(-1px);
      color: var(--c-black);
      text-transform: uppercase;

      @media screen and (max-width: 768px) {
        font-size: mobile-vw(30px);
      }
    }

    &__results {
      margin-top: desktop-vw(16px);
      &-container {
        position: absolute;
        width: 100%;
      }

      padding: desktop-vw(24px) desktop-vw(16px);
      width: 100%;
      border: 1px solid var(--c-black);

      ul {
        list-style: none;
        margin: 0;
      }

      &-item {
        margin: 0 0 desktop-vw(16px);

        &:last-child {
          margin: 0;
        }
      }
    }

    &__item {
      @include font-ITCFranklinGothicLT-BkCp();
      font-size: desktop-vw(25px);
      line-height: desktop-vw(30px);
      letter-spacing: desktop-vw(-1px);
      color: var(--c-black);
      text-transform: uppercase;
      cursor: pointer;

      @media screen and (max-width: 768px) {
        font-size: mobile-vw(25px);
        line-height: mobile-vw(30px);
      }
    }
  }

  &__pictures {
    margin-top: desktop-vw(150px);
    grid-column: 4 / span 6;
    position: relative;

    &__cta-container {
      position: absolute;
      bottom: 0;
      right: 0;
      display: flex;

      &__cta {
        .app-atoms-cta-click {
          padding: desktop-vw(15px) desktop-vw(18px);
          white-space: nowrap;
        }
      }
    }
  }
}
</style>
