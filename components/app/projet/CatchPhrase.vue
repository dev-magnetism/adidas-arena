<template>
  <div class="app-projet__catch-phrase grid-inner">
    <ERichText :content="contents.catchphrase" :split="true" :scrub="true" />
    <div class="app-projet__catch-phrase__lottie">
      <ELottie id="Fleche_Match" start="center bottom" end="bottom center" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    contents: {
      type: Object,
      default: () => {},
    },
  },
}
</script>

<style lang="scss">
.app-projet__catch-phrase {
  position: relative;
  padding-top: desktop-vw(30px);

  @include mobile {
    padding-top: mobile-vw(120px);
    overflow: hidden;
  }

  .app-element-rich-text {
    grid-column: 3 / span 8;
    text-align: center;

    @include mobile {
      grid-column: 1 / span 6;
    }

    .H2.wysiwyg-text {
      line-height: desktop-vw(110px);

      @include mobile {
        line-height: mobile-vw(78px);
      }
    }

    .app-element-lottie-word {
      svg {
        left: 50%;
        width: 130% !important;
        height: auto !important;
        top: 50%;
        transform: translate(-50%, -50%) !important;
      }
    }
  }

  &__lottie {
    grid-column: 10 / span 2;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    aspect-ratio: 190 / 300;
    transform: translateY(-50%);

    @include mobile {
      grid-column: 5 / span 2;
      left: 20%;
      aspect-ratio: 80 / 175;
      transform: translateY(0%) rotate(-15deg);
    }
  }
}
</style>
