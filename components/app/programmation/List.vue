<template>
  <div class="app-programmation-list">
    <div ref="bar" class="app-programmation-list-bar">
      <div
        ref="barWrapper"
        class="app-programmation-list-bar__wrapper grid-inner"
      >
        <div class="filters-bar-mobile">
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

          <div ref="searchBar" class="app-programmation-list-bar__search-bar">
            <form @submit.prevent="onSearch">
              <input
                v-model="searchText"
                type="text"
                placeholder="Rechercher"
                name="search"
              />
              <button type="submit"><SvgSearch /></button>
            </form>
          </div>
        </div>

        <div class="app-programmation-list-bar__filters">
          <div
            v-for="(cat, catIndex) in programmesCategories"
            :key="`key-${cat.category}-${catIndex}`"
            class="app-programmation-list-bar__filters__radio"
            :class="{ 'search-active': searchInProgress }"
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
          <div ref="searchBar" class="app-programmation-list-bar__search-bar">
            <form @submit.prevent="onSearch">
              <input
                v-model="searchText"
                type="text"
                placeholder="Rechercher un évènement"
                name="search"
              />
              <button type="submit"><SvgSearch /></button>
            </form>
          </div>
        </div>

        <AtomsSpotifyPlaylist
          v-if="content.spotifyLink !== '' && content.spotifyLink !== null"
          :cta-link="content.spotifyLink"
          :cta-label="content.spotifyLabel"
          :barsticky="barSticky"
          ref="spotify"
          />

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
          :list-current-month="currentMonth"
          :list-selected-category="selectedCategory"
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
  props: {
    content: {
      type: Object,
      default: () => {},
    }
  },
  data() {
    return {
      selectedCategory: 'tout',
      animatedFilterChange: true,
      barActive: true,
      barSticky: false,
      scrollTriggerMonths: [],
      currentMonth: null,
      directionMonth: 'up',
      filteringInProgress: false,
      searchText: null,
      lastSearchText: null,
      searchInProgress: false,
      isRestoringSession: false
    }
  },
  computed: {
    ...mapGetters({
      programmesCategories: 'programmesCategories',
      programmesMonths: 'programmesMonths',
    }),
    monthFilters() {
      if (this.selectedCategory === 'reports' && !this.lastSearchText) {
        return this.programmesMonths
          .map((month) => {
            const filteredMonthEvents = month.events.filter( _v => _v.reported )
            console.log('filteredMonthEvents', filteredMonthEvents);
            return {
              month: month.month,
              year: month.year,
              events: filteredMonthEvents,
            }
          })
          .filter((month) => month.events.length > 0);
      }

      if (this.selectedCategory === 'tout' || !this.lastSearchText) {
        return this.programmesMonths
      }

      if (this.lastSearchText) {
        return this.programmesMonths
          .map((month) => {
            const filteredMonthEvents = month.events.filter((item) => {
              const normalizeText = (text) =>
                text
                  .toLowerCase()
                  .normalize('NFD')
                  .replace(/[\u0300-\u036F]/g, '')

              const itemTitle = normalizeText(item.content.title)
              const itemDescription = normalizeText(item.content.description)
              const searchText = normalizeText(this.searchText)

              return (
                itemTitle.includes(searchText) || itemDescription.includes(searchText)
              )
            })

            return {
              month: month.month,
              year: month.year,
              events: filteredMonthEvents,
            }
          })
          .filter((month) => month.events.length > 0);
      }

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
    },
    monthsVisible() {
      if (this.lastSearchText) {
        return this.programmesMonths
          .map((month) => {
            return month.events.some((item) => {
              const normalizeText = (text) =>
                text
                  .toLowerCase()
                  .normalize('NFD')
                  .replace(/[\u0300-\u036F]/g, '')

              const itemTitle = normalizeText(item.content.title)
              const itemDescription = normalizeText(item.content.description)
              const searchText = normalizeText(this.searchText)

              return (
                itemTitle.includes(searchText) || itemDescription.includes(searchText)
              )
            })
          })
      }

      const _m =  this.programmesMonths.map((month) =>
        this.selectedCategory === 'tout'
          ? true
          :  this.selectedCategory === 'reports'
          ?  month.events.some(
              (event) =>
                event.reported === true
            )

          : month.events.some(
              (event) =>
                event.content.category.toLowerCase() === this.selectedCategory
            )
      )

      console.log('monthsVisible', _m);

      return _m;
    },
  },
  watch: {
    selectedCategory() {
      if (this.isRestoringSession || this.searchInProgress) return

      const url = new URL(window.location)

      if (this.selectedCategory !== 'tout') {
        const categorySlug = this.programmesCategories.find((cat) => cat.category === this.selectedCategory).slug
        url.searchParams.set('categorie', categorySlug)
      } else {
        url.searchParams.delete('categorie')
      }

      history.pushState(null, '', url);
      this.updateFilters()
    },
    searchText(newVal) {
      if (
        (newVal === null || !newVal.length) &&
        this.$refs.searchBar.classList.contains('wrong-search')
      ) {
        this.$refs.searchBar.classList.remove('wrong-search')
      }
    }
  },
  mounted() {
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    const urlCategory = urlParams.get('categorie')
    const category = this.programmesCategories.find((cat) => cat.slug === urlCategory)

    if (category) {
      this.animatedFilterChange = false
      this.selectedCategory = category.category
    }

    this.initScrollTrigger()
    this.restoreScrollPosition()
    this.scrollToMonthFromUrl()
  },
  beforeDestroy() {
    this.scrollTriggerBar?.kill()
    this.scrollTriggerBarWrapper?.kill()

    this.scrollTriggerMonths?.forEach((st) => {
      st?.kill()
    })
  },
  methods: {
    monthKeyToSlug(monthKey) {
      if (!monthKey) return ''
      return monthKey
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036F]/g, '')
    },
    slugToMonthKey(slug) {
      if (!slug || !this.programmesMonths?.length) return null
      const normalized = slug.toLowerCase()
      const found = this.programmesMonths.find((m) => {
        const key = `${m.month}-${m.year}`
        return this.monthKeyToSlug(key) === normalized
      })
      return found ? `${found.month}-${found.year}` : null
    },
    updateUrlMonth(monthKey) {
      const slug = this.monthKeyToSlug(monthKey)
      if (!slug) return
      const url = new URL(window.location.href)
      url.searchParams.set('mois', slug)
      history.replaceState(null, '', url)
    },
    restoreScrollPosition() {
      try {
        const saved = sessionStorage.getItem('programmationListRestore')
        if (!saved) return
        const data = JSON.parse(saved)
        const {
          scrollPosition,
          currentMonth: savedMonth,
          selectedCategory: savedCategory,
        } = data
        this.isRestoringSession = true
        if (
          savedCategory != null &&
          savedCategory !== '' &&
          this.programmesCategories?.some((c) => c.category === savedCategory)
        ) {
          this.animatedFilterChange = false
          this.selectedCategory = savedCategory
          const url = new URL(window.location.href)
          const cat = this.programmesCategories.find(
            (c) => c.category === savedCategory
          )
          if (cat?.slug) {
            url.searchParams.set('categorie', cat.slug)
          } else {
            url.searchParams.delete('categorie')
          }
          history.replaceState(null, '', url)
          this.$nextTick(() => {
            this.updateFilters(false, { skipScroll: true })
          })
        }
        if (savedMonth != null && savedMonth !== '') {
          this.currentMonth = savedMonth
        }
        const doRestore = () => {
          const hasLenis = typeof window !== 'undefined' && window.lenis
          if (hasLenis) {
            window.lenis.scrollTo(scrollPosition, { immediate: true })
          }
          if (typeof window.scrollTo === 'function' && typeof scrollPosition === 'number' && scrollPosition >= 0) {
            window.scrollTo(0, scrollPosition)
          }
          if (hasLenis || (typeof scrollPosition === 'number' && scrollPosition > 0)) {
            ScrollTrigger.refresh()
          }
          sessionStorage.removeItem('programmationListRestore')
          this.filteringInProgress = false
          this.isRestoringSession = false
          return true
        }
        this.filteringInProgress = true
        this.$nextTick(() => {
          const tryRestore = (attempt = 0) => {
            if (doRestore()) return
            if (attempt < 50) setTimeout(() => tryRestore(attempt + 1), 100)
            else {
              this.filteringInProgress = false
              this.isRestoringSession = false
            }
          }
          setTimeout(() => tryRestore(), 350)
        })
      } catch (e) {
        this.isRestoringSession = false
      }
    },
    scrollToMonthFromUrl() {
      const moisSlug =
        this.$route?.query?.mois ||
        (typeof window !== 'undefined' &&
          new URLSearchParams(window.location.search).get('mois'))
      if (!moisSlug) return
      const monthKey = this.slugToMonthKey(moisSlug)
      if (!monthKey) return
      this.filteringInProgress = true
      this.currentMonth = monthKey
      this.$nextTick(() => {
        const doScrollOnce = () => {
          if (!window.lenis || !this.$refs.eventsContainer?.length) return false
          const escapedMonth =
            typeof CSS !== 'undefined' && CSS.escape
              ? CSS.escape(monthKey)
              : monthKey.replace(/([^\w-])/g, '\\$1')
          const el = this.$el.querySelector(
            `.app-programmation-list-events__month.${escapedMonth}`
          )
          if (!el) return false
          this.scrollToMonthElement(el)
          return true
        }
        const tryScroll = (attempt = 0) => {
          if (doScrollOnce()) {
            setTimeout(() => {
              doScrollOnce()
              this.filteringInProgress = false
            }, 350)
            return
          }
          if (attempt < 50) setTimeout(() => tryScroll(attempt + 1), 100)
          else this.filteringInProgress = false
        }
        setTimeout(() => tryScroll(), 350)
      })
    },
    scrollToMonthElement(el) {
      if (!window.lenis) return
      const valueInVw = this.$viewport.isMobile
        ? (85 * 100) / 375
        : (85 * 100) / 1400
      const valueInPx = (this.$viewport.width * valueInVw) / 100
      const currentScroll = window.lenis.scroll ?? window.scrollY ?? 0
      const top = el.getBoundingClientRect().top + currentScroll - valueInPx
      const targetY = Math.max(0, Math.round(top))
      window.lenis.scrollTo(targetY, { immediate: true })
      if (typeof window.scrollTo === 'function') {
        window.scrollTo(0, targetY)
      }
      ScrollTrigger.refresh()
    },
    scrollToMonth(monthKey) {
      if (!window.lenis) return
      const valueInVw = this.$viewport.isMobile
        ? (85 * 100) / 375
        : (85 * 100) / 1400
      const valueInPx = (this.$viewport.width * valueInVw) / 100
      window.lenis.scrollTo(
        `.app-programmation-list-events__month.${monthKey}`,
        {
          duration: 0.8,
          offset: valueInPx * -1,
          immediate: false,
          onComplete: () => {
            this.filteringInProgress = false
          },
        }
      )
    },
    onSearch() {
      if (this.searchText !== this.lastSearchText) {
        this.updateFilters(true)
      }
    },
    initScrollTrigger() {
      this.scrollTriggerBar = ScrollTrigger.create({
        trigger: this.$refs.bar,
        start: 'top bottom',
        end: 'bottom bottom',
        onLeave: (e) => {
          if (this.filteringInProgress || this.searchInProgress) return

          this.barActive = false
        },
        onEnterBack: (e) => {
          if (this.filteringInProgress || this.searchInProgress) return

          this.barActive = true
        },
      })

      this.scrollTriggerBarWrapper = ScrollTrigger.create({
        trigger: this.$refs.barWrapper,
        start: 'top top',
        end: 'bottom bottom',
        onEnter: (e) => {
          this.barSticky = true

          console.log('scrollTriggerBarWrapper Enter')
        },
        onEnterBack: (e) => {
          this.barSticky = false

          console.log('scrollTriggerBarWrapper Enter Back')
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
    updateFilters(search = false, options = {}) {
      const skipScroll = options.skipScroll === true
      if (search) {
        if (!this.searchText) {
          this.selectedCategory = 'tout'
          return
        }

        console.log(this.$refs.events)
        const searchExist = this.$refs.events.some((item) => {
          console.log(item)
          const normalizeText = (text) =>
            text
              .toLowerCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036F]/g, '')

          const itemTitle = normalizeText(item.event.content.title)
          const itemDescription = normalizeText(item.event.content.description)
          const searchText = normalizeText(this.searchText)

          return (
            itemTitle.includes(searchText) || itemDescription.includes(searchText)
          )
        })

        if (searchExist) {
          this.$refs.searchBar.classList.remove('wrong-search')
        } else {
          this.$refs.searchBar.classList.add('wrong-search')
        }

        if (!searchExist) {
          return
        }
      }

      if (!skipScroll) {
        window.lenis?.stop()
      }

      this.directionMonth = 'down'
      this.barActive = this.scrollTriggerBar.isActive

      const layerBlue = document.querySelector('.app-transition-layer.blue')
      const layerRed = document.querySelector('.app-transition-layer.red')

      const filterItems = () => {
        this.filteringInProgress = true

        if (!skipScroll) {
          this.currentMonth = `${this.monthFilters[0]?.month}-${this.monthFilters[0]?.year}`

          if (window.lenis) {
            const container = document.querySelector('.app-programmation-list-events')
            const filters = document.querySelector('.app-programmation-list-bar__wrapper')
            const top = container.getBoundingClientRect().top + window.scrollY - filters.clientHeight - 100 - window.innerHeight * 0.021333333333

            window.lenis?.scrollTo?.(top, {
              immediate: true,
              force: true,
            })
          }
        }

        this.$refs.events.forEach((item) => {
          let isMatch = false

          if (search) {
            this.searchInProgress = true

            isMatch =
              item.event.content.title
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036F]/g, '')
                .includes(
                  this.searchText
                    .toLowerCase()
                    .normalize('NFD')
                    .replace(/[\u0300-\u036F]/g, '')
                ) ||
              item.event.content.description
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036F]/g, '')
                .includes(
                  this.searchText
                    .toLowerCase()
                    .normalize('NFD')
                    .replace(/[\u0300-\u036F]/g, '')
                )
          } else {
            isMatch =
              this.selectedCategory === 'tout' ||
              (this.selectedCategory === 'reports' && item.event.reported) ||
              item.event.content.category === this.selectedCategory

            this.searchText = null
            this.lastSearchText = null
          }

          if (search) {
            this.selectedCategory = null
          }

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

        this.$nextTick(() => {
          this.filteringInProgress = false
          this.searchInProgress = false
          this.lastSearchText = this.searchText
          ScrollTrigger.refresh()
          if (this.$viewport?.isMobile && typeof window?.scrollTo === 'function') {
            window.scrollTo(0, 0)
          }
        })
      }

      if (!this.animatedFilterChange) {
        filterItems()
      } else {
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
          .add(filterItems)
          .to([layerRed, layerBlue], {
            scaleY: 0,
            transformOrigin: 'center bottom',
            duration: 0.85,
            delay: 0.25,
            onComplete: () => {
              window.lenis?.start()
              if (this.$viewport?.isMobile && typeof window?.scrollTo === 'function') {
                window.scrollTo(0, 0)
              }
            },
            ease: 'power3.inOut',
          })
          .set([layerRed, layerBlue], {
            transformOrigin: 'center top',
          })
      }

      this.animatedFilterChange = true
    },
  },
}
</script>

<style lang="scss">
.filters-bar-mobile {
  display: none;

  @include mobile {
    display: flex;
    flex-direction: row-reverse;
    gap: var(--layout-margin);
    justify-content: flex-start;
  }
}
.app-programmation-list {
  margin-top: desktop-vw(110px);
  padding-top: desktop-vw(160px);
  padding-bottom: desktop-vw(110px);
  position: relative;

  @include mobile {
    margin-top: mobile-vw(120px);
    padding-top: mobile-vw(100px);
    padding-bottom: mobile-vw(90px);
  }

  &-events {
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: desktop-vw(120px) desktop-vw(0px);
    position: relative;

    @include mobile {
      grid-gap: mobile-vw(0px) mobile-vw(0px);
    }

    &__month {
      display: grid;
      grid-template-columns: repeat(12, 1fr);
      grid-gap: desktop-vw(25px);
      position: relative;

      @include mobile {
        grid-template-columns: repeat(6, 1fr);
        grid-gap: var(--layout-margin);
        margin-bottom: mobile-vw(18px);
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
        display: flex;
        flex-direction: column-reverse;

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
      order: 2;
      position: relative;

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
      grid-column: 1 / span 6;
      order: 1;

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

    .app-atoms-spotify-playlist{
      order: 2;

      @include mobile{
      position: absolute;
      top: mobile-vw(-20px);
       order: 1;
       margin-top: 0;
       margin-bottom: mobile-vw(16px);

       &.hide{
        margin-bottom: 0;
       }
      }
    }

    &__months {
      grid-column: 9 / span 4;
      position: relative;
      order: 3;

      @include mobile {;
        grid-column: 3 / span 4;
        margin-bottom: mobile-vw(5px);
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
        top: desktop-vw(32px);
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

    &__search-bar {
        grid-column: 10 / span 3;
        width: desktop-vw(280px);
        justify-self: flex-end;
        border: 1px solid var(--c-black);
        align-self: flex-start;
        background: var(--c-grey);
        margin-bottom: 0;

        @include mobile {
          grid-column: 3 / span 4;
          width: auto;
          margin-bottom: 0;
        }

        &.wrong-search {
          border: 1px solid var(--c-red-adidas);

          input {
            border-right: 1px solid var(--c-red-adidas);
          }

          svg {
            path {
              fill: var(--c-red-adidas);
              stroke: var(--c-red-adidas);
            }
          }
        }

        form {
          display: flex;
          justify-content: center;
          align-items: center;

          @include mobile {
            align-items: stretch;
            height: 100%;
          }
        }

        input {
          width: 85%;
          padding: desktop-vw(10px) desktop-vw(15px);
          border-right: 1px solid var(--c-black);
          @include p1();
          @include font-ITCFranklinGothicLT-DmCp();

          @include mobile {
            padding: mobile-vw(8px) mobile-vw(12px);
          }

          &::placeholder {
            opacity: 1;
            color: var(--c-black);
          }
        }

        button {
          width: 15%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          position: relative;
          align-self: stretch;
        }
      }
  }
}

.article {
  grid-column: span 4;
}
</style>
