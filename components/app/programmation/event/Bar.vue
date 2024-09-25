<template>
  <div class="app-programmation-event-bar block-inner">
    <div class="app-programmation-event-bar__event">
      <TP2 weight="medium" color="grey">{{ $formatDate(event.sessions) }}</TP2>
      <TH4 color="grey">{{ event.artist_reference }}</TH4>
    </div>
    <div class="app-programmation-event-bar__book">
      <TP2
        v-if="
          event.min_price &&
          event.status_code !== 'B' &&
          event.status_code !== 'C' &&
          event.status_code !== 'H' &&
          event.status_code !== 'K'
        "
        weight="medium"
        class="app-programmation-event-bar__book__info"
        color="grey"
      >
        {{ programmationsEventContent.glossary_exclu_france_price }}
        {{ event.min_price }}€</TP2
      >
      <TP2
        v-else-if="event.status_code === 'K'"
        weight="medium"
        color="grey"
        class="app-programmation-slider-card__from-price"
      >
        Show complet, inscrivez-vous sur la liste d’attente !
      </TP2>
      <AtomsCTA
        v-if="event.sessions.length - 1 >= 1"
        button
        @click.native="scrollToDates()"
      >
        Voir les dates
      </AtomsCTA>

      <AtomsCTA
        v-else-if="
          event.sessions.length - 1 < 1 &&
          event.sessions[0].content.url &&
          !event.sessions[0].content.url_premium &&
          event.status_code === 'D'
        "
        :href="(event.ticketing_main_url)?event.ticketing_main_url:event.sessions[0].content.url"
      >
        Réserver mon billet
      </AtomsCTA>

      <AtomsCTAForm
        v-else-if="
          event.status_code === 'K' ||
          (event.status_code === 'B' && event.presale)
        "
        :session="event.sessions[0]"
        :event-id="event.id"
        :event-name="event.artist_reference"
        :event-date="event.sessions[0].date"
        :status-code="event.status_code"
      >
        Liste d'attente
      </AtomsCTAForm>

      <AtomsCTA
        v-else-if="
          event.sessions.length - 1 < 1 && event.sessions[0].content.url_premium
        "
        button
        @click.native="scrollToDates()"
      >
        Voir les dates
      </AtomsCTA>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: {
    event: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    ...mapState({
      programmationsEventContent: (state) => state.programmationsEventContent,
    }),
  },
  methods: {
    scrollToDates() {
      if (!window.lenis) return

      window.lenis.scrollTo('.app-programmation-event-dates', {
        lock: true,
        duration: 0.75,
        offset: -35,
      })
    },
  },
}
</script>

<style lang="scss">
.app-programmation-event-bar {
  width: 100vw;
  position: fixed;
  bottom: 0;
  left: 0;
  background: var(--c-black);
  z-index: 10;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-top: desktop-vw(8px);
  padding-bottom: desktop-vw(8px);
  transition: transform 0.5s var(--ease-in-out-cubic);

  @include mobile {
    display: none;
  }

  &.hide {
    transform: translateY(100%);
  }

  &__event {
    display: flex;
    flex-direction: column;
    margin-left: desktop-vw(40px);

    .P2 {
      text-transform: uppercase;
      margin-bottom: desktop-vw(2px);
    }
  }

  &__book {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;

    &__info {
      width: 28.5%;
      margin-right: desktop-vw(10px);
    }

    .app-atoms-cta {
      width: auto;
    }
  }
}
</style>
