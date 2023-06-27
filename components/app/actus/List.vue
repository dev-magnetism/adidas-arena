<template>
  <div class="app-actualites-list">
    <div ref="bar" class="app-actualites-list-bar">
      <div ref="barWrapper" class="app-actualites-list-bar__wrapper grid-inner">
        <AppProgrammationEventTag
          class="app-actualites-list-bar__filters-mobile"
        >
          FILTRER
          <select v-model="selectedCategory">
            <option
              v-for="(cat, catIndex) in actualitesCategories"
              :key="`key-${cat.category}-${catIndex}`"
              :value="$convertToKebabCase(cat.category)"
            >
              {{ cat.category }} ({{ cat.count.toString().padStart(2, '0') }})
            </option>
          </select>
        </AppProgrammationEventTag>

        <div class="app-actualites-list-bar__filters">
          <div
            v-for="(cat, catIndex) in actualitesCategories"
            :key="`key-${cat.category}-${catIndex}`"
            class="app-actualites-list-bar__filters__radio"
          >
            <input
              :id="`${$convertToKebabCase(cat.category)}`"
              ref="radioButtons"
              v-model="selectedCategory"
              type="radio"
              name="filters-radio"
              :value="$convertToKebabCase(cat.category)"
            />

            <label :for="`${$convertToKebabCase(cat.category)}`">
              <TP1 weight="bold">
                {{ cat.category }}
              </TP1>

              <TP1 weight="regular">
                {{ cat.count.toString().padStart(2, '0') }}
              </TP1>
            </label>
          </div>
        </div>
      </div>
    </div>

    <div ref="container" class="container app-actualites-list-actus grid-inner">
      <AppActusCard
        v-for="(actu, index) in actualites"
        :key="`article-${index}`"
        ref="actus"
        :content="actu"
        :theme="index % 2 ? 'red-adidas' : 'blue-adidas'"
      />
    </div>
  </div>
</template>

<script>
import { gsap } from 'gsap'
// import { Flip } from 'gsap/Flip'
import { mapState, mapGetters } from 'vuex'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default {
  data() {
    return {
      selectedCategory: 'tout',
      barActive: true,
      filteringInProgress: false,
    }
  },
  computed: {
    ...mapGetters({
      actualitesCategories: 'actualitesCategories',
    }),
    ...mapState({
      actualites: (state) => state.actualites,
    }),
  },
  watch: {
    selectedCategory() {
      this.updateFilters()
    },
  },
  mounted() {
    this.initScrollTrigger()
  },
  beforeDestroy() {
    this.scrollTriggerBar?.kill()
  },
  methods: {
    initScrollTrigger() {
      this.scrollTriggerBar = ScrollTrigger.create({
        trigger: this.$refs.bar,
        start: 'top bottom',
        end: 'bottom bottom',
        onLeave: (e) => {
          if (this.filteringInProgress) return

          this.barActive = false
        },
        onEnterBack: (e) => {
          if (this.filteringInProgress) return

          this.barActive = true
        },
      })
    },
    updateFilters() {
      window.lenis?.stop()

      this.barActive = this.scrollTriggerBar.isActive

      const layerBlue = document.querySelector('.app-transition-layer.blue')
      const layerRed = document.querySelector('.app-transition-layer.red')

      gsap
        .timeline({
          delay: 0.15,
        })
        .fromTo(
          layerBlue,
          { scaleY: 0 },
          {
            scaleY: 1,
            duration: 1,
            ease: 'power3.inOut',
          }
        )
        .fromTo(
          layerRed,
          { scaleY: 0 },
          {
            scaleY: 1,
            duration: 1,
            ease: 'power3.inOut',
          },
          '<10%'
        )
        .add(() => {
          this.filteringInProgress = true

          if (window.lenis) {
            window.lenis?.scrollTo?.(this.$el, {
              immediate: true,
              force: true,
              offset: -25,
            })
          }

          this.$refs.actus.forEach((item) => {
            const isMatch =
              this.selectedCategory === 'tout' ||
              this.$convertToKebabCase(item.content.category) ===
                this.selectedCategory

            if (isMatch) {
              if (!item.isAppear) item.scrollTrigger?.enable()

              item.scrollTriggerInView?.enable()
            } else {
              item.scrollTrigger?.disable()

              item.scrollTriggerInView?.disable()
              item.inView = false
            }

            item.$el.style.display = isMatch ? 'inline-flex' : 'none'
          })

          this.filteringInProgress = false

          this.$nextTick(() => {
            ScrollTrigger.refresh()
          })
        })
        .to([layerRed, layerBlue], {
          scaleY: 0,
          transformOrigin: 'center bottom',
          duration: 0.85,
          delay: 0.25,
          onComplete: () => {
            window.lenis?.start()
          },
          ease: 'power3.inOut',
        })
        .set([layerRed, layerBlue], {
          transformOrigin: 'center top',
        })
    },
  },
}
</script>

<style lang="scss">
.app-actualites-list {
  margin-top: desktop-vw(110px);
  padding-top: desktop-vw(110px);
  padding-bottom: desktop-vw(110px);
  position: relative;

  @include mobile {
    margin-top: mobile-vw(0px);
    padding-top: mobile-vw(70px);
    padding-bottom: mobile-vw(90px);
  }

  &-actus {
    position: relative;

    @include mobile {
      grid-gap: mobile-vw(20px) mobile-vw(0px);
    }

    .app-actualites-card {
      width: auto;
      height: auto;
      grid-column: span 4;

      @include mobile {
        grid-column: span 6;
      }
    }
  }

  &-bar {
    position: absolute;
    top: 0;
    z-index: 99999;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    pointer-events: none;

    &__wrapper {
      position: sticky;
      bottom: 25px;
      align-self: self-end;
      width: 100%;
      row-gap: 0;
      pointer-events: all;

      @include mobile {
        bottom: 10px;

        &::after {
          content: '';
          width: 100%;
          height: calc(100% + 10px);
          position: absolute;
          // background: rgb(255 255 255);
          // background: linear-gradient(
          //   0deg,
          //   rgb(255 255 255) 10%,
          //   rgba(255, 255, 255, 0) 100%
          // );
          z-index: -1;
          top: 0;
          left: 0;
          pointer-events: none;
        }
      }
    }

    &__filters-mobile.app-programmation-event-tag {
      grid-column: 1 / span 2;
      justify-content: center;
      padding: mobile-vw(8px) mobile-vw(15px);

      @include desktop {
        display: none;
      }

      .P1 {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      select {
        margin: 0;
        padding: 0;
        opacity: 0;
        position: absolute;
        display: block;
        top: 0;
        right: 0;
        width: 100%;
        height: 100%;
        -webkit-appearance: none;
        z-index: 1;
      }
    }

    &__filters {
      display: flex;
      flex-flow: row wrap;
      gap: desktop-vw(10px);
      grid-column: 1 / span 8;

      @include mobile {
        display: none;
      }

      &__radio {
        display: flex;
        align-items: center;
        justify-content: center;

        input[type='radio'] {
          opacity: 0;
          position: absolute;
          width: 0;
        }

        label {
          display: flex;
          flex-direction: row;
          background-color: var(--c-grey);
          border: 1px solid var(--c-black);
          transition: background-color 0.4s 1s var(--ease-out-cubic),
            border-color 0.4s 1s var(--ease-out-cubic);

          @include hover {
            &:hover {
              cursor: pointer;
            }
          }
        }

        .P1 {
          padding: desktop-vw(10px) desktop-vw(12px);
          transition: color 0.4s 1s var(--ease-out-cubic),
            border-color 0.4s 1s var(--ease-out-cubic);
        }

        .P1.regular {
          border-left: 1px solid var(--c-black);
        }

        input[type='radio']:checked + label {
          background-color: var(--c-blue-adidas);
          border-color: var(--c-white);

          .P1 {
            color: var(--c-white) !important;
          }

          .P1.regular {
            border-color: var(--c-white);
          }
        }
      }
    }
  }
}
</style>
