<template>
  <div class="app-programmation-list">
    <div ref="bar" class="app-programmation-list-bar">
      <div
        ref="barWrapper"
        class="app-programmation-list-bar__wrapper grid-inner"
      >
        <AppProgrammationEventTag
          class="app-programmation-list-bar__filters-mobile"
        >
          FILTRER
          <select v-model="selectedCategory">
            <option
              v-for="(cat, catIndex) in actualitesCategories"
              :key="`key-${cat.category}-${catIndex}`"
              :value="cat.category.toLowerCase()"
            >
              {{ cat.category }} ({{ cat.count.toString().padStart(2, '0') }})
            </option>
          </select>
        </AppProgrammationEventTag>
        <div class="app-programmation-list-bar__filters">
          <div
            v-for="(cat, catIndex) in actualitesCategories"
            :key="`key-${cat.category}-${catIndex}`"
            class="app-programmation-list-bar__filters__radio"
          >
            <input
              :id="`${cat.category.toLowerCase()}`"
              ref="radioButtons"
              v-model="selectedCategory"
              type="radio"
              name="filters-radio"
              :value="cat.category.toLowerCase()"
            />

            <label :for="`${cat.category.toLowerCase()}`">
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

    <div
      ref="container"
      class="container app-programmation-list-events grid-inner"
    >
      <AppActusCard
        v-for="(actu, index) in actualites"
        :key="`article-${index}`"
        ref="events"
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
      scrollTriggerMonths: [],
      currentMonth: null,
      directionMonth: 'up',
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

    this.scrollTriggerMonths?.forEach((st) => {
      st?.kill()
    })
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
    onChangeMonth(e) {
      if (e.target.value === this.currentMonth) return

      const oldest = this.compareDates(this.currentMonth, e.target.value)

      this.directionMonth = oldest ? 'down' : 'up'
      this.filteringInProgress = true
      this.currentMonth = e.target.value

      const valueInVw = this.$viewport.isMobile
        ? (85 * 100) / 375
        : (85 * 100) / 1400
      const valueInPx = (this.$viewport.width * valueInVw) / 100

      window.lenis?.scrollTo?.(
        `.app-programmation-list-events__month.${e.target.value}`,
        {
          duration: 1.5,
          offset: valueInPx * -1,
          lock: true,
          onComplete: () => {
            this.filteringInProgress = false
          },
        }
      )
    },
    compareDates(date1, date2) {
      const months = {
        janvier: '01',
        février: '02',
        mars: '03',
        avril: '04',
        mai: '05',
        juin: '06',
        juillet: '07',
        août: '08',
        septembre: '09',
        octobre: '10',
        novembre: '11',
        décembre: '12',
      }

      const [month1, year1] = date1.split('-')
      const [month2, year2] = date2.split('-')

      const d1 = new Date(`${year1}-${months[month1]}-01`)
      const d2 = new Date(`${year2}-${months[month2]}-01`)

      return d1 > d2
    },
    updateFilters() {
      window.lenis?.stop()

      this.directionMonth = 'down'
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

          this.currentMonth = `${this.monthFilters[0].month}-${this.monthFilters[0].year}`

          if (window.lenis) {
            window.lenis?.scrollTo?.(this.$el, {
              immediate: true,
              force: true,
              offset: -25,
            })
          }

          this.$refs.events.forEach((item) => {
            const isMatch =
              this.selectedCategory === 'tout' ||
              item.event.content.category === this.selectedCategory

            if (isMatch) {
              if (!item.isAppear) item.scrollTrigger.enable()

              item.scrollTriggerInView?.enable()
            } else {
              item.scrollTrigger.disable()

              item.scrollTriggerInView?.disable()
              item.inView = false
            }

            item.$el.style.display = isMatch ? 'inline-flex' : 'none'
          })

          this.$refs.eventsContainer.forEach((month) => {
            const cards = month.querySelectorAll('.app-programmation-card')

            const visibleArticles = Object.values(cards).filter(
              (article) => article.style.display !== 'none'
            )

            if (visibleArticles.length <= 0) {
              month.style.position = 'absolute'
            } else if (
              visibleArticles.length > 0 &&
              month.style.position === 'absolute'
            ) {
              month.style.position = 'relative'
            }
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
.app-programmation-list {
  margin-top: desktop-vw(110px);
  padding-top: desktop-vw(110px);
  padding-bottom: desktop-vw(110px);
  position: relative;

  @include mobile {
    margin-top: mobile-vw(120px);
    padding-top: mobile-vw(70px);
    padding-bottom: mobile-vw(90px);
  }

  &-events {
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: desktop-vw(120px) desktop-vw(0px);
    position: relative;

    @include mobile {
      grid-gap: mobile-vw(120px) mobile-vw(0px);
    }

    &__month {
      display: grid;
      grid-template-columns: repeat(12, 1fr);
      grid-gap: desktop-vw(25px);
      position: relative;

      @include mobile {
        grid-template-columns: repeat(6, 1fr);
        grid-gap: mobile-vw(20px);
      }
    }

    .app-actualites-card {
      width: auto;
      height: auto;
      grid-column: span 4;
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

.article {
  grid-column: span 4;
}
</style>
