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
import { mapState } from 'vuex'

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
    ...mapState({
      programmes: (state) => state.programmes,
    }),
    events() {
      return this.programmes.slice(0, 3)
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
