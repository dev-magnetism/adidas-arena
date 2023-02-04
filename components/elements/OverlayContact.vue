<template>
  <div
    :class="{ open: overlayContactOpen }"
    class="app-element-overlay-contact"
  >
    <div
      class="app-element-overlay-contact__zone-close"
      @click="setOverlayContactOpen(false)"
    />
    <AtomsCornerPoints :size-points="8" />
    <div data-lenis-prevent class="app-element-overlay-contact__wrapper">
      <TH2>Nous contacter</TH2>
      <div
        v-for="i in 6"
        :key="i"
        class="app-element-overlay-contact__field-group"
      >
        <TH4>Nom</TH4>
        <input class="app-element-overlay-contact__field" type="text" />
      </div>
      <!-- <div class="app-element-overlay-contact__field-group">
        <TH4>Nom</TH4>
        <input class="app-element-overlay-contact__field" type="text" />
      </div>
      <div class="app-element-overlay-contact__field-group">
        <TH4>Nom</TH4>
        <input class="app-element-overlay-contact__field" type="text" />
      </div>
      <div class="app-element-overlay-contact__field-group">
        <TH4>Prénom</TH4>
        <input class="app-element-overlay-contact__field" type="text" />
      </div>
      <div class="app-element-overlay-contact__field-group">
        <TH4>Email</TH4>
        <input class="app-element-overlay-contact__field" type="text" />
      </div>
      <div class="app-element-overlay-contact__field-group">
        <TH4>Téléphone</TH4>
        <input class="app-element-overlay-contact__field" type="text" />
      </div> -->
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  computed: {
    ...mapState({
      overlayContactOpen: (state) => state.overlayContactOpen,
    }),
  },
  mounted() {
    this.$nuxt.$on('contact:overlay', this.handleOverlay)
  },

  beforeDestroy() {
    this.$nuxt.$off('contact:overlay', this.handleOverlay)
  },

  methods: {
    handleOverlay(e) {
      this.setOverlayContactOpen(!this.overlayContactOpen)
      console.log('appear', e)
    },
    ...mapMutations({
      setOverlayContactOpen: 'setOverlayContactOpen',
    }),
  },
}
</script>

<style lang="scss">
.app-element-overlay-contact {
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  width: 55vw;
  background: white;
  z-index: 9;
  background: linear-gradient(rgba(251, 245, 238, 0.8) 0.1em, transparent 0.1em),
    linear-gradient(90deg, rgba(251, 245, 238, 0.8) 0.1em, transparent 0.1em),
    white;
  background-size: 1.15em 1.15em;
  transform: translateX(100%);
  transition: transform 0.55s var(--ease-in-out-cubic);

  &.open {
    transform: translateX(0%);

    .app-element-overlay-contact__zone-close {
      pointer-events: all;
    }
  }

  .app-atoms-corner-points {
    .app-atoms-corner-points__line--top,
    .app-atoms-corner-points__line--right,
    .app-atoms-corner-points__line--bottom,
    .app-atoms-corner-points__item--top-right,
    .app-atoms-corner-points__item--bottom-right {
      display: none;
    }
  }

  &__zone-close {
    position: absolute;
    width: 45vw;
    top: 0;
    height: 100%;
    background: transparent;
    right: 100%;
    pointer-events: none;
  }

  &__wrapper {
    padding: desktop-vw(40px) desktop-vw(50px);
    // overscroll-behavior: contain;
    overscroll-behavior-y: contain;
    overflow-y: auto;
  }

  &__field-group {
    position: relative;
    display: flex;
    width: 100%;
    padding: desktop-vh(40px) 0px;

    .H4 {
      align-self: flex-end;
    }

    &:focus-within {
      & > .H4 {
        color: red !important;
      }
    }
  }

  &__field {
    position: relative;
    z-index: 1;
    flex: 1 1 auto;
    width: 1%;
    margin-top: 0;
    margin-bottom: 0;
    display: block;
    width: 100%;
    @include h2();
  }
}
</style>
