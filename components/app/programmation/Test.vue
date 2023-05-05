<template>
  <div class="app-programmation-list">
    <div class="app-programmation-list-bar grid-inner">
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
              {{ cat.count }}
            </TP1>
          </label>
        </div>
      </div>

      <!-- <div class="app-programmation-bar__months">
        <TH3 v-for="(year, index) in programmesMonths" :key="index">
          {{ year.month }} {{ year.year }}
        </TH3>
      </div> -->
    </div>

    <div
      ref="container"
      class="container app-programmation-list-events grid-inner"
    >
      <div
        v-for="(year, indexMonth) in programmesMonths"
        :key="`month-${indexMonth}`"
        ref="eventsContainer"
        class="app-programmation-list-events__month"
      >
        <AppProgrammationCard
          v-for="(event, indexEvent) in year.events"
          :key="indexEvent"
          ref="events"
          :class="event.content.category.toLowerCase()"
          :event="event"
        />

        <!-- <div
          v-for="(event, indexEvent) in year.events"
          :key="indexEvent"
          ref="events"
          class="article"
          :class="event.content.category.toLowerCase()"
        >
          <AppProgrammationCard :event="event" />
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */

import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'
import { mapState, mapMutations, mapGetters } from 'vuex'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default {
  data() {
    return {
      selectedCategory: 'tout',
    }
  },
  computed: {
    ...mapGetters({
      programmesCategories: 'programmesCategories',
      programmesMonths: 'programmesMonths',
    }),
  },
  watch: {
    selectedCategory() {
      this.updateFilters()
    },
  },
  methods: {
    updateFilters() {
      if (window.lenis) {
        window.lenis.scrollTo(this.$el, {
          duration: 2,
          lock: true,
        })
      }

      const containerState = Flip.getState(this.$refs.container)

      // const items = this.$refs.events
      const items = this.$refs.events.map((event) => event.$el)
      const state = Flip.getState(items)

      const filteredItems = []

      this.$refs.events.forEach((item) => {
        const isMatch =
          this.selectedCategory === 'tout' ||
          item.event.content.category === this.selectedCategory
        item.$el.style.display = isMatch ? 'inline-flex' : 'none'

        // if (!isMatch) item.hideInListing = true
        // else if (isMatch && item.hideInListing) item.hideInListing = false
      })

      // console.log(filteredItems)

      // const months = this.$refs.eventsContainer

      // months.forEach((month) => {
      //   const test = month.querySelectorAll('.article')

      //   const visibleArticles = items.filter(
      //     (article) => article.style.display !== 'none'
      //   )

      //   if (visibleArticles.length <= 0) {
      //     month.style.position = 'absolute'
      //   } else if (
      //     visibleArticles.length > 0 &&
      //     month.style.position === 'absolute'
      //   ) {
      //     month.style.position = 'relative'
      //   }
      // })

      this.$nextTick(() => {
        ScrollTrigger.refresh()

        Flip.from(state, {
          duration: 1,
          ease: 'power1.inOut',
          absoluteOnLeave: true,
          simple: true,
        })

        // Flip.from(containerState, {
        //   duration: 0.75,
        //   ease: 'power1.inOut',
        // })

        // Flip.from(state, {
        //   duration: 3,
        //   ease: 'power1.inOut',
        //   absoluteOnLeave: true,
        //   zIndex: 2,
        //   onEnter: (elements) => {
        //     const test = elements.map((el) =>
        //       el.querySelector('.app-programmation-card__layer-filtering')
        //     )
        //     return gsap.fromTo(
        //       test,
        //       { scaleY: 1, transformOrigin: 'center bottom' },
        //       {
        //         scaleY: 0,
        //         duration: 1,
        //         delay: 1,
        //         transformOrigin: 'center bottom',
        //       }
        //     )
        //   },
        //   onLeave: (elements) => {
        //     const test = elements.map((el) =>
        //       el.querySelector('.app-programmation-card__layer-filtering')
        //     )
        //     return gsap.to(test, {
        //       scaleY: 1,
        //       duration: 1,
        //     })
        //   },
        // })
      })
    },
  },
  mounted() {
    this.updateFilters()
  },
}
</script>

<style lang="scss">
.app-programmation-list {
  padding-top: desktop-vw(225px);

  @include mobile {
    padding-top: mobile-vw(150px);
  }

  &-events {
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: desktop-vw(85px) desktop-vw(0px);
    position: relative;

    &__month {
      display: grid;
      grid-template-columns: repeat(12, 1fr);
      grid-gap: desktop-vw(25px);
      position: relative;
    }

    .app-programmation-card {
      width: auto;
      height: 100%;
    }
  }

  &-bar {
    position: fixed;
    bottom: 0;
    z-index: 99999;
    width: 100%;

    &__filters {
      display: flex;
      flex-flow: row wrap;
      column-gap: desktop-vw(10px);
      grid-column: 1 / span 9;

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
          transition: background-color 0.4s var(--ease-out-cubic),
            border-color 0.4s var(--ease-out-cubic);

          @include hover {
            &:hover {
              cursor: pointer;
            }
          }
        }

        .P1 {
          padding: desktop-vw(10px) desktop-vw(12px);
          transition: color 0.4s var(--ease-out-cubic),
            border-color 0.4s var(--ease-out-cubic);
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

    &__months {
      grid-column: 10 / span 3;
    }
  }
}

.article {
  grid-column: span 4;
}
</style>
