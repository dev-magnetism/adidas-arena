<template>
  <div class="app-programmation-event-bar block-inner">
    <div class="app-programmation-event-bar__event">
      <TP2 weight="medium" color="grey">11 mars 2023</TP2>
      <TH4 color="grey">36ème Festival des Arts Martiaux</TH4>
    </div>
    <div class="app-programmation-event-bar__book">
      <TP2
        weight="medium"
        class="app-programmation-event-bar__book__info"
        color="grey"
      >
        Exclusivité en France, à partir de 29,00€</TP2
      >
      <AtomsCTA>Réserver mon billet</AtomsCTA>
    </div>
  </div>
</template>

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
