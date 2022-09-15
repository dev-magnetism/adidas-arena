<template>
  <div class="app-home-projet__header">
    <div class="app-home-projet__header__infos">
      <div class="app-home-projet__header__info">
        <TP1>Titre</TP1>
        <TP2>La chapelle district</TP2>
      </div>
      <div class="app-home-projet__header__info">
        <TP1>Titre</TP1>
        <TP2>La chapelle district</TP2>
      </div>
    </div>
    <div class="app-home-projet__header__description">
      <TP1>Titre</TP1>
      <TP2>La chapelle district</TP2>
    </div>
  </div>
</template>

<style lang="scss">
.app-home-projet__header {
  grid-column: 1 / span 5;
  align-self: flex-start;
  display: flex;
  position: absolute;
  width: 90%;
  left: 0;
  top: desktop-vw(25px);

  &__infos {
    flex: 2;
    display: flex;
    flex-direction: column;
  }

  &__info {
    padding: desktop-vw(10px) desktop-vw(12px);
    border: 1px solid var(--c-black);
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    border-left: none;

    &:first-child {
      border-top: none;
    }
    &:not(:first-child) {
      border-top: none;
    }
  }

  &__description {
    flex: 1;
    padding: desktop-vw(10px) desktop-vw(12px);
    border-right: 1px solid var(--c-black);
    border-bottom: 1px solid var(--c-black);
  }
}
</style>
