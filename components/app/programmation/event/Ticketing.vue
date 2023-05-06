<template>
  <div class="app-programmation-event-ticketing block-inner">
    <TH2 weight="bold" class="app-programmation-event-ticketing__title">
      {{ content.title }}
    </TH2>
    <div class="app-programmation-event-tickets grid">
      <a
        v-if="event.content.url_event"
        :href="event.content.url_event"
        target="_blank"
        class="app-programmation-event-ticketing__ticket"
      >
        <div class="app-programmation-event-ticketing__infos">
          <TH2Bis>Standard</TH2Bis>
          <TP2 weight="medium">
            Achetez votre place et venez vivre une expérience inoubliable
          </TP2>
        </div>
        <div class="app-programmation-event-ticketing__scan-code">
          <TH4 color="grey">EN SAVOIR PLUS</TH4>
          <SvgScanCode />
        </div>
      </a>
      <a
        v-if="event.content.tm_ticket_office_url_premium"
        target="_blank"
        :href="event.content.tm_ticket_office_url_premium"
        class="app-programmation-event-ticketing__ticket"
      >
        <div class="app-programmation-event-ticketing__infos">
          <TH2Bis>PREMIUM</TH2Bis>
          <TP2 weight="medium">
            Achetez votre place et venez vivre une expérience inoubliable
          </TP2>
        </div>
        <div class="app-programmation-event-ticketing__scan-code">
          <TH4 color="grey">EN SAVOIR PLUS</TH4>
          <SvgScanCode />
        </div>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    content: {
      type: Object,
      default: () => {},
    },
    event: {
      type: Object,
      default: () => {},
    },
  },
}
</script>

<style lang="scss">
.app-programmation-event-ticketing {
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

  &__ticket {
    grid-column: span 5;
    width: 100%;
    display: flex;
    flex-direction: row;
    position: relative;
    cursor: pointer;

    @include mobile {
      grid-column: span 6;
    }

    &::after {
      content: '';
      border: 1px dashed var(--c-black);
      position: absolute;
      left: calc(65% - 1px);
      height: 90%;
      top: 50%;
      transform: translateY(-50%);
      pointer-events: none;

      @include mobile {
        content: '';
        left: calc(70% - 1px);
      }
    }

    &:first-child {
      .app-programmation-event-ticketing__scan-code::before {
        content: '';
        background: var(--c-blue-adidas);
      }
    }

    &:last-child {
      .app-programmation-event-ticketing__scan-code::before {
        content: '';
        background: var(--c-red-adidas);
      }
    }
  }

  &__infos {
    width: 65%;
    height: 100%;
    padding: desktop-vw(25px);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    --clip-path: polygon(100% 5%, 100% 95%, 97% 100%, 0 100%, 0 0, 97% 0);

    @include mobile {
      padding: mobile-vw(25px) mobile-vw(15px);
      width: 70%;
    }

    .H2-bis,
    .P2 {
      z-index: 1;
    }
    .P2 {
      width: 95%;
    }

    &::before,
    &::after {
      content: '';
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
    }

    &::before {
      z-index: 0;
      background-color: var(--c-white);
      clip-path: var(--clip-path);
    }

    &::after {
      z-index: -1;
      clip-path: var(--clip-path);
      background: var(--c-black);
      width: calc(100% + 2px);
      left: -1px;
      height: calc(100% + 2px);
      top: -1px;
    }
  }

  &__scan-code {
    width: 35%;
    height: 100%;
    padding: desktop-vw(20px) desktop-vw(15px);
    display: flex;
    justify-content: flex-end;
    align-items: center;
    position: relative;
    --clip-path: polygon(
      100% 0,
      100% 100%,
      50% 100%,
      5% 100%,
      0 95%,
      0 5%,
      5% 0
    );

    @include mobile {
      padding: mobile-vw(20px) mobile-vw(10px);
      width: 30%;
    }

    svg {
      width: desktop-vw(25px);
      height: 100%;
      z-index: 1;

      @include mobile {
        width: auto;
      }
    }

    .H4 {
      z-index: 1;
      writing-mode: tb-rl;
      transform: scale(-1, -1);
      margin-right: desktop-vw(25px);
      user-select: none;

      @include mobile {
        margin-right: mobile-vw(10px);
      }
    }

    &::before,
    &::after {
      content: '';
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
    }

    &::before {
      z-index: 0;
      clip-path: var(--clip-path);
    }

    &::after {
      z-index: -1;
      clip-path: var(--clip-path);
      background: var(--c-black);
      width: calc(100% + 2px);
      left: -1px;
      height: calc(100% + 2px);
      top: -1px;
    }
  }
}
</style>
