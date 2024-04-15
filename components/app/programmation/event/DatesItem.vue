<template>
  <div
    :class="{ disabled }"
    class="app-programmation-event-dates-item"
    :style="{ 'background-color': `var(--c-${theme})` }"
    >
      
    <div class="app-programmation-event-dates-item__wrapper">
      <AppProgrammationEventStatusShort
        :status="session.session_status"
        :color="statutColor"
      />

      <TH4
        :color="whitedTexts ? 'white' : 'black'"
        class="app-programmation-event-dates-item__date"
      >
        {{ date }}
      </TH4>
      
      <!-- TH2Bis
        :color="whitedTexts ? 'white' : 'black'"
        class="app-programmation-event-dates-item__artist"
      >
        {{ artist }}
      </TH2Bis -->

      <TP2
        v-if="session.session_status === 'K'"
        weight="medium"
        :color="whitedTexts ? 'white' : 'black'"
        class="app-programmation-event-dates-item__info"
      >
        Show complet, inscrivez-vous sur la liste d’attente !
      </TP2>

      <AtomsCTAForm
        v-if="
          session.session_status === 'K' ||
          session.session_status === 'B' ||
          session.session_status === 'C'
        "
        :session="session"
        :event-dd="eventId"
        :event-name="artist"
        :event-date="date"
        :status-code="session.session_status"
        :color="statutColor"
        :layer-color="statutColor"
        :bg="'grey'"
      >
        Liste d'attente
      </AtomsCTAForm>

      <AtomsCTA
        v-else-if="session.session_status === 'H'"
        :href="session.content.url"
        :color="statutColor"
        :layer-color="statutColor"
        :bg="'grey'"
      >
        En savoir +
      </AtomsCTA>

      <AtomsCTA
        v-else
        :href="session.content.url"
        :color="statutColor"
        :layer-color="statutColor"
        :bg="'grey'"
      >
        Réserver
      </AtomsCTA>
    </div>
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
    filteredDate: {
      type: String,
      default: 'Date error',
    },
    totalItems: {
      type: Number,
      default: 0,
    },
    date: {
      type: String,
      default: 'Date error',
    },
    day: {
      type: String,
      default: 'Date error',
    },
    artist: {
      type: String,
      default: 'Artist error',
    },
    eventId: {
      type: Number,
      default: 0,
    },
    session: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    theme() {
      
      if(this.$viewport.isMobile){
        return this.index % 3 === 0
          ? 'blue-adidas'
          : this.index % 3 === 1
          ? 'red-adidas'
          : 'grey'
      } else  if(this.totalItems <= 6){
          return this.index % 3 === 0
            ? 'blue-adidas'
            : this.index % 3 === 1
            ? 'red-adidas'
            : 'grey'
      } else {
        return this.index % 6 < 2
          ? 'blue-adidas'
          : this.index % 6 < 4
          ? 'red-adidas'
          : 'grey'
      }
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
  grid-column: span 6;
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
    .app-atoms-cta,
    .app-atoms-cta-form,
    {
      pointer-events: none;
    }

    &::before {
      background-color: rgba(245, 245, 243, 0.8);
      // backdrop-filter: blur(2px);
    }
  }

  &__wrapper {
    // height: 100%;
    width: 100%;
    padding: 0 desktop-vw(24px) 0 0;
    display: flex;
    flex-wrap: wrap;
    min-height: desktop-vw(94px);
    align-items: center;
    justify-content: space-between;

    @include mobile {
      padding: 0 0 mobile-vw(13px) 0;
      min-height: unset;
      justify-content: center;
    }
  }

  .app-programmation-event-status-short {
    position: absolute;
    top: 50%;
    left: desktop-vw(-29px);
    display: inline-block;
    flex: 0 0 auto;
    border-top: none;
    border-right: none;
    border-left: none;
    width: desktop-vw(94px);
    overflow: hidden;
    white-space: nowrap;
    transform: translateY(-50%) rotate(-90deg);
    font-size: desktop-vw(17px);
    line-height: desktop-vw(24px);
    text-align: center;

    @include mobile {
      top: 0;
      left: 0;
      width: 100%;
      transform: unset;
      font-size: mobile-vw(24px);
      line-height: mobile-vw(24px);
    }
  }

  .app-atoms-cta,
  .app-atoms-cta-form{
    display: inline-block;
    flex: 0 0 auto;
    // width: 36.85%;

    @include mobile {
      position: relative;
      margin: 0 auto;
      width: auto;
      align-self: flex-end;
    }
  }

  &__date {
    display: inline-block;
    width: auto;
    padding: 0 0 0 desktop-vw(16px);

    @include mobile {
      display: inline-block;
      flex: 0 0 100%;
      width: 100%;
      padding: mobile-vw(16px) 0;
      text-align: center;
    }
  }
  .app-programmation-event-status-short + .app-programmation-event-dates-item__date{
     padding: 0 0 0 desktop-vw(49px);

     @include mobile{
      padding: mobile-vw(49px) 0 mobile-vw(16px) 0;
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
    width: 15%;

    @include mobile {
      width: 85%;
      text-align: center;
      margin-bottom: mobile-vw(16px);
    }
  }
}
</style>
