<template>
  <div
    :class="{ disabled }"
    class="app-programmation-event-dates-item"
    :style="{ 'background-color': `var(--c-${theme})` }"
  >
    <AppProgrammationEventStatus
      :status="session.session_status"
      :color="statutColor"
    />
    <div class="app-programmation-event-dates-item__wrapper">
      <TH4
        :color="whitedTexts ? 'white' : 'black'"
        class="app-programmation-event-dates-item__date"
      >
        {{ date }}
      </TH4>
      <TH2Bis
        :color="whitedTexts ? 'white' : 'black'"
        class="app-programmation-event-dates-item__artist"
      >
        {{ artist }}
      </TH2Bis>
      <TP2
        weight="medium"
        :color="whitedTexts ? 'white' : 'black'"
        class="app-programmation-event-dates-item__info"
      >
        Show complet, inscrivez-vous sur la liste d’attente !
      </TP2>
    </div>
    <AtomsCTA :color="statutColor" :layer-color="statutColor" :bg="'grey'">
      Liste d'attente
    </AtomsCTA>
  </div>
</template>

<script>
export default {
  props: {
    index: {
      type: Number,
      default: 0,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    length: {
      type: Number,
      default: 0,
    },
    date: {
      type: String,
      default: 'Date error',
    },
    artist: {
      type: String,
      default: 'Artist error',
    },
    session: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    theme() {
      return this.index % this.length === 0
        ? 'blue-adidas'
        : this.index % this.length === 1
        ? 'red-adidas'
        : 'grey'
    },
    whitedTexts() {
      return this.theme === 'blue-adidas' || this.theme === 'red-adidas'
    },
    statutColor() {
      return this.theme === 'grey' ? 'black' : this.theme
    },
  },
}
</script>

<style lang="scss">
.app-programmation-event-dates-item {
  grid-column: span 4;
  position: relative;
  border: 1px solid var(--c-black);
  position: relative;
  cursor: pointer;
  transition: opacity 0.3s var(--ease-in-out-cubic);

  @include mobile {
    grid-column: span 6;
    display: flex;
    flex-direction: column;
  }

  &::before {
    content: '';
    background-color: rgba(245, 245, 243, 0);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 999999;
    transition: background-color 0.3s var(--ease-in-out-cubic);
    pointer-events: none;
  }

  &.disabled {
    opacity: 0.3;

    @include hover {
      &:hover {
        opacity: 0.35 !important;

        &::before {
          background-color: rgba(245, 245, 243, 0.5) !important;
        }
      }
    }

    .app-programmation-event-dates-item__wrapper,
    .app-atoms-cta {
      pointer-events: none;
    }

    &::before {
      background-color: rgba(245, 245, 243, 0.8);
      // backdrop-filter: blur(2px);
    }
  }

  &__wrapper {
    height: 100%;
    width: 100%;
    padding: desktop-vw(25px) desktop-vw(25px) desktop-vw(15px) desktop-vw(25px);
    display: flex;
    flex-direction: column;

    @include mobile {
      height: auto;

      padding: mobile-vw(25px) mobile-vw(15px) mobile-vw(15px) mobile-vw(15px);
    }
  }

  .app-programmation-event-status {
    position: absolute;
    right: 0;
    top: 0;
    border-top: none;
    border-right: none;
  }

  .app-atoms-cta {
    position: absolute;
    bottom: 0;
    right: 0;
    border-right: none;
    border-bottom: none;
    width: 52.5%;

    @include mobile {
      position: relative;
      width: 70%;
      align-self: flex-end;
    }
  }

  &__date {
    width: 75%;

    @include mobile {
      width: 45%;
    }
  }

  &__artist {
    margin-bottom: desktop-vw(75px);
    user-select: none;

    @include mobile {
      margin-bottom: mobile-vw(60px);
    }
  }

  &__info {
    margin-top: auto;
    width: 45%;

    @include mobile {
      width: 85%;
    }
  }
}
</style>
