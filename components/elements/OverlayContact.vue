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
      <TH2 class="app-element-overlay-contact__title">Nous contacter</TH2>

      <form
        :class="{ submited }"
        class="app-element-overlay-contact__form"
        @submit.prevent="onSubmit"
      >
        <div class="app-element-overlay-contact__field-group">
          <TH4>Nom</TH4>
          <input
            required
            class="app-element-overlay-contact__field"
            type="text"
          />
        </div>
        <div class="app-element-overlay-contact__field-group">
          <TH4>Prénom</TH4>
          <input
            required
            class="app-element-overlay-contact__field"
            type="text"
          />
        </div>
        <div class="app-element-overlay-contact__field-group">
          <TH4>Email</TH4>
          <input
            required
            class="app-element-overlay-contact__field"
            type="email"
          />
        </div>
        <div class="app-element-overlay-contact__field-group">
          <TH4>Téléphone</TH4>
          <input
            required
            class="app-element-overlay-contact__field"
            type="tel"
            pattern="[0-9]+"
          />
        </div>
        <div class="app-element-overlay-contact__field-group textarea">
          <TH4>Votre message</TH4>

          <textarea
            class="app-element-overlay-contact__field textarea"
            required
          />
        </div>
        <div class="app-element-overlay-contact__baseline">
          <TP1 weight="bold">Tous les champs sont obligatoires.</TP1>
          <AtomsCTA type="submit" button> Envoyer </AtomsCTA>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  data() {
    return {
      submited: false,
    }
  },
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
    onSubmit() {
      console.log('submit')
    },
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

  &__title.H2 {
    font-size: desktop-vw(64px);
    line-height: desktop-vw(58px);
    text-align: center;
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
    padding: desktop-vw(40px) 0px 0px 0px;
    overflow-y: scroll;
    overscroll-behavior: contain;
    height: 100vh;
  }

  &__field-group {
    position: relative;
    display: flex;
    width: 100%;
    padding: min(30px, desktop-vw(30px)) min(50px, desktop-vw(50px))
      min(20px, desktop-vw(20px)) min(50px, desktop-vw(50px));

    &:first-of-type {
      margin-top: desktop-vw(20px);
    }

    &.textarea {
      flex-direction: column;
      margin-top: desktop-vw(40px);

      .H4 {
        align-self: flex-start;
        margin-bottom: desktop-vw(20px);
      }
    }

    .H4 {
      align-self: flex-end;
      margin-right: desktop-vw(20px);
    }

    &:focus-within {
      & > .app-element-overlay-contact__field {
        border-bottom: 2px solid;
      }
    }
  }

  &__baseline {
    display: flex;
    justify-content: flex-end;
    margin-top: desktop-vw(80px);
    align-items: center;

    .app-atoms-cta {
      margin-left: 30px;
      width: 25%;
    }
  }

  &__field {
    position: relative;
    z-index: 1;
    flex: 1 1 auto;
    display: block;
    width: 100%;
    border-bottom: 2px dashed;
    padding: 0 0 0 desktop-vw(15px);
    @include h2();
    font-size: desktop-vw(64px);
    line-height: desktop-vw(58px);
    @include font-adihausDIN-cn-bold();

    &.textarea {
      @include p1();
      @include font-adihausDIN-medium();
      height: desktop-vw(125px);
      text-transform: initial;
    }

    &:valid {
      border-bottom: 2px solid;
    }
  }
}
</style>
