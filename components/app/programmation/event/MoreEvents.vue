<template>
  <div class="app-programmation-event-more-events block-inner">
    <TH2 weight="bold" class="app-programmation-event-more-events__title">
      {{ content.title }}
    </TH2>
    <div class="app-programmation-event-more-events__items grid">
      <AppProgrammationCard
        v-for="(event, index) in events"
        :key="index"
        :event="event"
        :theme="
          index === 0 ? 'blue-adidas' : index === 1 ? 'red-adidas' : 'grey'
        "
        :webview="webview"
      />
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  props: {
    content: {
      type: Object,
      default: () => {},
    },
    webview: {
      type: String,
      required: false,
      default: '',
    }
  },
  data() {
    return {}
  },
  computed: {
    ...mapGetters({
      programmesCategories: 'programmesCategories',
    }),
    ...mapState({
      programmes: (state) => state.programmes,
    }),
    events() {
      // Filter programmes based on category and exclude the current programme
      const filteredProgrammes = this.programmes.filter(
        (programme) =>
          programme.content.category === this.content.category &&
          programme.id !== this.content.id
      )

      // Calculate the number of missing elements needed to reach a total of 3 elements
      const missingElements = Math.max(0, 3 - filteredProgrammes.length)

      // If there are missing elements
      if (missingElements > 0) {
        // Filter programmes from other categories
        const otherCategoryProgrammes = this.programmes.filter(
          (programme) => programme.content.category !== this.content.category
        )

        // Filter unique programmes from other categories not already in filteredProgrammes
        const uniqueOtherCategoryProgrammes = otherCategoryProgrammes.filter(
          (programme) => !filteredProgrammes.includes(programme)
        )

        // Add unique programmes from other categories to fill missingElements, up to a maximum of 3 elements
        filteredProgrammes.push(
          ...uniqueOtherCategoryProgrammes.slice(
            0,
            Math.min(missingElements, 3)
          )
        )
      }

      // Return up to 3 elements from filteredProgrammes
      return filteredProgrammes.slice(0, 3)
    },
  },
  mounted() {},
}
</script>

<style lang="scss">
.app-programmation-event-more-events {
  margin-top: desktop-vw(115px);

  &__title {
    margin-bottom: desktop-vw(30px);
  }

  &__items {
  }
}
</style>
