<template>
  <button
    v-if="facilitiAvailable"
    type="button"
    class="faciliti-button"
    data-faciliti-popin
    aria-label="FACIL'iti : Adaptez l'affichage"
  >
    <img
      src="/faciliti.svg"
      alt="Gérer les options d'affichage"
      width="56"
      height="56"
    >
  </button>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      facilitiAvailable: (state) => state.facilitiAvailable,
    }),
  },
}
</script>

<style lang="scss" scoped>
.faciliti-button {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 50;
  margin: 0;
  padding: 0;
  border: 0;
  background: unset;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
  cursor: pointer;
  transition: opacity 0.2s ease, transform 0.2s ease;

  img {
    display: block;
    width: 56px;
    height: 56px;
    object-fit: contain;
  }

  &:hover {
    opacity: 0.9;
    transform: scale(1.05);
  }

  &:focus {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }
}
</style>
