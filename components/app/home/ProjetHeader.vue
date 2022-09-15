<template>
  <div class="app-home-projet__header">
    <div class="app-home-projet__header__infos">
      <div v-for="i in 2" :key="i" class="app-home-projet__header__info">
        <TP1 class="app-home-projet__header__info__title">Titre</TP1>
        <TH2 weight="bold" class="app-home-projet__header__info__content">
          La chapelle district
        </TH2>
      </div>
    </div>
    <div class="app-home-projet__header__description">
      <TP1 class="app-home-projet__header__description__title">Description</TP1>
      <TH3 class="app-home-projet__header__description__content">
        Un lieu de vie dans un quartier en plein mouvement
      </TH3>
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

    &__title {
      font-size: desktop-vw(12px);
      line-height: desktop-vw(16px);
      @include font-adihausDIN-cn-medium();
    }

    &__content {
      font-size: desktop-vw(24px);
      line-height: desktop-vw(20px);
      margin-top: desktop-vw(5px);
    }

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

    &__title {
      font-size: desktop-vw(12px);
      line-height: desktop-vw(16px);
      @include font-adihausDIN-cn-medium();
    }

    &__content {
      font-size: desktop-vw(12px);
      line-height: desktop-vw(20px);
      @include font-adihausDIN-regular();
      margin-top: desktop-vw(10px);
    }
  }
}
</style>
