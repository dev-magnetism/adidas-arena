<template>
  <div class="app-contact-question grid-inner">
    <ERichText
      tag="div"
      class="app-contact-question__title"
      :content="contents.title"
    />

    <div class="app-contact-question__ask">
      <AtomsCTA button @click.native="onClick()">{{ contents.cta }}</AtomsCTA>
    </div>

    <EContactOverlay
      :form-type="contents.formType"
      :subject="contents.emailSubject"
      :mail-to="contents.email"
    />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  props: {
    contents: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    ...mapState({
      overlayContactOpen: (state) => state.overlayContactOpen,
    }),
  },
  methods: {
    onClick() {
      if (this.overlayContactOpen) return

      this.setOverlayContactOpen(true)
    },
    ...mapMutations({
      setOverlayContactOpen: 'setOverlayContactOpen',
    }),
  },
}
</script>

<style lang="scss">
.app-contact-question {
  margin-bottom: desktop-vw(140px);
  position: relative;
  row-gap: 0;

  @include mobile {
    margin-bottom: mobile-vw(70px);
  }

  &__title.app-element-rich-text {
    grid-column: 3 / span 8;
    text-align: center;

    @include mobile {
      grid-column: 1 / span 6;
    }

    .H2.wysiwyg-text {
      .app-element-lottie-word.Cercle_3 {
        svg {
          position: absolute;
          width: 100% !important;
          height: auto !important;
          top: 40%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(5deg) !important;

          @include mobile {
            width: 90% !important;
          }

          path {
            stroke: var(--c-blue-adidas);
          }
        }
      }
    }
  }

  &__ask {
    grid-column: 5 / span 4;
    display: flex;
    justify-content: center;
    margin-top: desktop-vw(90px);

    @include mobile {
      grid-column: 1 / span 6;
      margin-top: mobile-vw(80px);
    }

    .app-atoms-cta {
      width: 75%;

      @include mobile {
        width: 100%;
      }
    }
  }
}
</style>
