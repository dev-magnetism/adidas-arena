<template>
  <div class="app-programmation-event-dates block-inner">
    <TH2 weight="bold" class="app-programmation-event-dates__title">
      {{ content.title }}
    </TH2>
    <div class="app-programmation-event-dates__items grid">
      <AppProgrammationEventDatesItem
        v-for="(session, index) in sessions"
        :key="index"
        :index="index"
        :session="session"
        :event-id="event.id"
        :date="$formatDate(session.date, true)"
        :artist="event.artist_reference"
        :total-items="event.sessions.length"
        :disabled="indexDate !== index && indexDate !== null"
        @click.native="onSelectDate(index)"
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
    return {
      indexDate: null,
    }
  },
  computed: {
    sessions() {
      const sessions = this.event.sessions

      sessions.forEach((session) => {
        session.content = session.translations.find(
          (translation) => translation.language === 'fr'
        )
      })

      return sessions
    },
  },

  methods: {
    onSelectDate(index) {
      if (index === this.indexDate) {
        this.indexDate = null
      } else {
        this.indexDate = index
      }

      this.$emit('onSelectDate', this.indexDate)
    },
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
