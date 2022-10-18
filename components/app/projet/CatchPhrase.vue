<template>
  <div class="app-projet__catch-phrase grid-inner">
    <ERichText :content="contents.catchphrase" :split="true" :scrub="true" />
    <EParallax :speed="0.25" class="app-projet__catch-phrase__lottie">
      <ELottie id="Fleche_Match" start="center bottom" end="bottom center" />
    </EParallax>
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
  margin-top: desktop-vw(30px);

  .app-element-rich-text {
    grid-column: 3 / span 8;
    text-align: center;

    .H2.wysiwyg-text {
      line-height: desktop-vw(110px);
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
  }
}
</style>
