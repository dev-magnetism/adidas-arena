<template>
  <div class="app-programmation-event-bar block-inner">
    <div class="app-programmation-event-bar__event">
      <TP2 weight="medium" color="grey">{{ $formatDate(event.sessions) }}</TP2>
      <TH4 color="grey">{{ event.artist_reference }}</TH4>
    </div>
    <div class="app-programmation-event-bar__book">
      <TP2
        weight="medium"
        class="app-programmation-event-bar__book__info"
        color="grey"
      >
        Exclusivité en France, à partir de {{ event.min_price }}€</TP2
      >
      <AtomsCTA
        v-if="event.sessions.length - 1 >= 1"
        button
        @click.native="scrollToDates()"
      >
        Voir les dates
      </AtomsCTA>
      <AtomsCTA v-else :href="event.sessions[0].content.url">
        Réserver mon billet
      </AtomsCTA>
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
  },
  mounted() {
    console.log(this.event)
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
      width: 27.5%;
      margin-right: desktop-vw(10px);
    }

    .app-atoms-cta {
      width: 60%;
    }
  }
}
</style>
