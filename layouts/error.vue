<template>
  <div class="app-error">
    <div class="app-error__content">
      <TH1 weight="bold" class="app-error__content__title-stroke">Désolé !</TH1>
      <TH2 weight="bold" class="app-error__content__subtitle"
        >la page que <br />
        vous recherchez</TH2
      >
      <TH1 class="app-error__content__title"> n’existe pas.</TH1>
    </div>
    <AtomsCTA class="app-error__cta" link="/"> Page d'accueil </AtomsCTA>
  </div>
</template>

<script>
export default {
  layout: 'error',
  props: {
    error: {
      type: Object,
      default: () => {},
    },
  },
}
</script>

<style lang="scss">
.app-error {
  height: 100vh;
  background: var(--c-grey);
  z-index: 3 !important;
  position: fixed;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  &__content {
    margin-bottom: desktop-vh(70px);
    width: 40%;
    text-align: center;

    &__title-stroke.H1,
    &__title.H1 {
    }
    &__title-stroke.H1 {
      -webkit-text-stroke: 1px var(--c-black);
      -webkit-text-fill-color: transparent;
    }
    &__title.H1 {
    }
    &__subtitle.H2 {
    }
  }

  &__cta.app-atoms-cta {
    width: 25%;
  }
}
</style>
