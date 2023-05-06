<template>
  <TH4 :color="color" class="app-programmation-event-statut"> Complet </TH4>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: 'white',
    },
    statut: {
      type: String,
      default: '',
    },
  },
}
</script>

<style lang="scss">
.app-programmation-event-statut {
  padding: desktop-vw(5px) desktop-vw(8px);
  display: inline-flex;
  background-color: #fbf5ee;
  border: 1px solid var(--c-black);
  z-index: 3;

  @include mobile {
    padding: mobile-vw(5px) mobile-vw(8px);
  }
}
</style>
