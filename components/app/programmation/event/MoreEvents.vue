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

        // Add unique programmes from other categories to fill missingElements
        filteredProgrammes.push(
          ...uniqueOtherCategoryProgrammes.slice(0, missingElements)
        )

        // Calculate the remaining missing elements after adding unique programmes
        const remainingMissingElements =
          missingElements - uniqueOtherCategoryProgrammes.length

        // If there are still remaining missing elements
        if (remainingMissingElements > 0) {
          // Filter remaining unique programmes from other categories not already in filteredProgrammes
          const remainingProgrammes = this.programmes.filter(
            (programme) =>
              programme.content.category !== this.content.category &&
              !filteredProgrammes.includes(programme) &&
              !uniqueOtherCategoryProgrammes.includes(programme)
          )

          // Add the remaining missing elements from other categories to filteredProgrammes
          filteredProgrammes.push(
            ...remainingProgrammes.slice(0, remainingMissingElements)
          )
        }
      }

      return filteredProgrammes
    },
  },
  mounted() {
    const filteredProgrammes = this.programmes.filter(
      (programme) =>
        programme.content.category === this.content.category &&
        programme.id !== this.content.id
    )

    const missingElements = Math.max(0, 3 - filteredProgrammes.length)

    if (missingElements > 0) {
      const otherCategoryProgrammes = this.programmes.filter(
        (programme) => programme.content.category !== this.content.category
      )

      const uniqueOtherCategoryProgrammes = otherCategoryProgrammes.filter(
        (programme) => !filteredProgrammes.includes(programme)
      )

      const additionalProgrammes = uniqueOtherCategoryProgrammes.slice(
        0,
        missingElements
      )

      if (additionalProgrammes.length < missingElements) {
        const remainingMissingElements =
          missingElements - additionalProgrammes.length
        const allOtherProgrammes = otherCategoryProgrammes.filter(
          (programme) =>
            !filteredProgrammes.includes(programme) &&
            !additionalProgrammes.includes(programme)
        )
        additionalProgrammes.push(
          ...allOtherProgrammes.slice(0, remainingMissingElements)
        )
      }

      filteredProgrammes.push(...additionalProgrammes)
    }
  },
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
