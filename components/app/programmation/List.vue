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
              v-for="(cat, catIndex) in programmesCategories"
              :key="`key-${cat.category}-${catIndex}`"
              :value="cat.category.toLowerCase()"
            >
              {{ cat.category }} ({{ cat.count.toString().padStart(2, '0') }})
            </option>
          </select>
        </AppProgrammationEventTag>
        <div class="app-programmation-list-bar__filters">
          <div
            v-for="(cat, catIndex) in programmesCategories"
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

        <div class="app-programmation-list-bar__months">
          <select @change="onChangeMonth">
            <option
              v-for="month in monthFilters"
              :key="`select-${month.month}-${month.year}`"
              :value="`${month.month}-${month.year}`"
              :selected="currentMonth === `${month.month}-${month.year}`"
            >
              {{ month.month }} - {{ month.year }}
            </option>
          </select>

          <transition-group
            tag="div"
            :name="`${directionMonth}-bar-month`"
            class="app-programmation-list-bar__months__wrapper"
          >
            <TH3
              v-for="(year, index) in programmesMonths"
              v-show="currentMonth === `${year.month}-${year.year}`"
              :key="`bar-month-${year.month}-${year.year}-${index}`"
              tag="p"
            >
              {{ year.month }} '{{ year.year.toString().substr(-2) }}
            </TH3>
          </transition-group>
          <SvgArrowFilter />
        </div>
      </div>
    </div>

    <div
      ref="container"
      class="container app-programmation-list-events grid-inner"
    >
      <div
        v-for="(year, indexMonth) in programmesMonths"
        :key="`month-${indexMonth}`"
        ref="eventsContainer"
        :class="`${year.month}-${year.year}`"
        class="app-programmation-list-events__month"
      >
        <AppProgrammationCard
          v-for="(event, indexEvent) in year.events"
          :key="indexEvent"
          ref="events"
          :class="$convertToKebabCase(event.content.category.toLowerCase())"
          :event="event"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { gsap } from 'gsap'
// import { Flip } from 'gsap/Flip'
import { mapGetters } from 'vuex'
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
      programmesCategories: 'programmesCategories',
      programmesMonths: 'programmesMonths',
    }),
    monthFilters() {
      if (this.selectedCategory === 'tout') {
        return this.programmesMonths
      } else {
        return this.programmesMonths
          .map((month) => {
            const filteredMonthEvents = month.events.filter(
              (event) =>
                event.content.category.toLowerCase() === this.selectedCategory
            )
            return {
              month: month.month,
              year: month.year,
              events: filteredMonthEvents,
            }
          })
          .filter((month) => month.events.length > 0)
      }
    },
    monthsVisible() {
      return this.programmesMonths.map((month) =>
        this.selectedCategory === 'tout'
          ? true
          : month.events.some(
              (event) =>
                event.content.category.toLowerCase() === this.selectedCategory
            )
      )
    },
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

      this.$refs?.eventsContainer?.forEach((month, index) => {
        const lastIndex = this.$refs.eventsContainer.length - 1 === index

        const scrolltrigger = ScrollTrigger.create({
          trigger: month,
          start: !index ? 'top bottom' : 'top bottom-=50%',
          endTrigger: lastIndex ? '.app-footer' : null,
          end: lastIndex
            ? 'top bottom'
            : !index
            ? 'bottom bottom-=50%'
            : 'bottom bottom-=50%',
          id: `${this.programmesMonths[index].month}-${this.programmesMonths[index].year}`,
          month: this.programmesMonths[index].month,
          year: this.programmesMonths[index].year,
          onEnter: (e) => {
            if (this.filteringInProgress || !this.monthsVisible[index]) return

            this.directionMonth = 'up'
            this.currentMonth = `${e.vars.month}-${e.vars.year}`
          },
          onEnterBack: (e) => {
            if (this.filteringInProgress || !this.monthsVisible[index]) return

            this.directionMonth = 'down'
            this.currentMonth = `${e.vars.month}-${e.vars.year}`
          },
        })

        this.scrollTriggerMonths.push(scrolltrigger)
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
              if (!item.isAppear) item.scrollTrigger?.enable()

              item.scrollTriggerInView?.enable()
            } else {
              item.scrollTrigger?.disable()

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

    .app-programmation-card {
      width: auto;
      height: auto;
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
      top: 100px;
      align-self: self-start;
      width: 100%;
      row-gap: 0;
      pointer-events: all;

      @include mobile {

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
            padding-top: desktop-vw(16px);
            font-size: desktop-vw(20px);
            line-height: desktop-vw(20px);
        }

        .P1.bold{
          padding-top: desktop-vw(16px);
          font-size: desktop-vw(20px);
          line-height: desktop-vw(20px);
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

    &__months {
      grid-column: 9 / span 4;
      position: relative;

      @include mobile {
        grid-column: 3 / span 4;
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

      svg {
        position: absolute;
        right: 0;
        top: 50%;
        transform: translate(0%, -50%);
      }

      &__wrapper {
        text-align: right;
        position: relative;
        height: desktop-vw(65px);
        overflow: hidden;

        @include mobile {
          height: mobile-vw(40px);
        }

        .H3 {
          position: absolute;
          right: 45px;

          @include mobile {
            right: 35px;
          }

          @include desktop-xl{
            font-size: desktop-vw(56px);
            line-height: desktop-vw(49px);
          }

          &.up-bar-month-enter-active,
          &.up-bar-month-leave-active,
          &.down-bar-month-enter-active,
          &.down-bar-month-leave-active {
            transition: transform 0.45s var(--ease-in-out-cubic);
          }

          &.up-bar-month-enter,
          &.down-bar-month-leave-to {
            transform: translate(0%, 100%);
          }

          &.up-bar-month-enter-to,
          &.up-bar-month-leave,
          &.down-bar-month-enter-to,
          &.down-bar-month-leave {
            transform: translate(0%, 0%);
          }

          &.up-bar-month-leave-to,
          &.down-bar-month-enter {
            transform: translate(0%, -100%);
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
