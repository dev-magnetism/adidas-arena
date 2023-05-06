<template>
  <div class="app-programmation-event-dates block-inner">
    <TH2 weight="bold" class="app-programmation-event-dates__title">
      {{ content.title }}
    </TH2>
    <div class="app-programmation-event-dates__items grid">
      <AppProgrammationEventDatesItem
        v-for="(session, index) in event.sessions"
        :key="index"
        :index="index"
        :session="session"
        :date="$formatDate(session.date, true)"
        :artist="event.artist_reference"
        :length="event.sessions.length"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    event: {
      type: Object,
      default: () => {},
    },
    content: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {}
  },
}
</script>

<style lang="scss">
.app-programmation-event-dates {
  margin-top: desktop-vw(75px);

  @include mobile {
    margin-top: mobile-vw(65px);
  }

  &__title {
    margin-bottom: desktop-vw(30px);

    @include mobile {
      margin-bottom: mobile-vw(25px);
    }
  }

  &__items {
  }
}
</style>
