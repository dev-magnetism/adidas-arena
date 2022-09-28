<template>
  <div class="app-contact-question grid-inner">
    <TH2 class="app-contact-question__title"
      >des questions ? contactez-nous pour en savoir plus</TH2
    >
    <div class="app-contact-question__ask">
      <AtomsCTA>Poser une question</AtomsCTA>
    </div>
  </div>
</template>

<style lang="scss">
.app-contact-question {
  margin-bottom: desktop-vw(140px);
  position: relative;
  row-gap: 0;

  &__title {
    grid-column: 4 / span 6;
    text-align: center;
  }

  &__ask {
    grid-column: 5 / span 4;
    display: flex;
    justify-content: center;
    margin-top: desktop-vw(90px);

    .app-atoms-cta {
      width: 75%;
    }
  }
}
</style>
