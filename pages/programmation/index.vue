<template>
  <main class="app-programmation">
    <AppProgrammationHero :contents="contentHero" />

    <AppProgrammationTest />

    <AppFooter :contents="appContent" :logos="partnersContent.data" />
  </main>
</template>

<script>
/* eslint-disable */

import { mapState, mapMutations, mapGetters } from 'vuex'

import scroll from '@/mixins/scroll'
import pageTransition from '@/mixins/page-transition'

export default {
  mixins: [scroll],
  transition(to, from) {
    if (!to || !from) return

    return pageTransition.basic
  },
  async asyncData({ $directus }) {
    const content = await $directus.items('Programmation_page').readByQuery({
      limit: -1,
    })

    return {
      content,
    }
  },
  data() {
    return {
      inputCategory: 'tout',
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
    ...mapGetters({
      programmesCategories: 'programmesCategories',
      programmesMonths: 'programmesMonths',
    }),
    ...mapState({
      partnersContent: (state) => state.partnersContent,
      appContent: (state) => state.appContent,
      allLoadedFake: (state) => state.allLoadedFake,
      programmationsContent: (state) => state.programmationsContent,
      programmes: (state) => state.programmes,
    }),
    // contentProgrammationEvents() {
    //   return this.programmationsContent.filter((el) => !el.main_event)
    // },
    contentHero() {
      return {
        title: this.content.data.hero_title,
        paragraph: this.content.data.hero_paragraph,
      }
    },
    monthfileters() {
      if (this.inputCategory === 'tout') {
        return this.programmesMonths
      } else {
        return this.programmesMonths
          .map((month) => {
            const filteredMonthEvents = month.events.filter(
              (event) =>
                event.content.category.toLowerCase() === this.inputCategory
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
  },
  mounted() {},

  methods: {
    ...mapMutations({
      setExteriorVisible: 'setExteriorVisible',
    }),
  },
}
</script>

<style lang="scss">
.app-programmation {
  padding-top: desktop-vw(200px);

  @include mobile {
    padding-top: mobile-vw(120px);
  }

  .app-footer {
    margin-top: desktop-vw(50px);

    @include mobile {
      margin-top: mobile-vw(80px);
    }
  }
}
</style>
