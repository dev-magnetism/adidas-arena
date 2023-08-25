<template>
  <div class="app-programmation-event-cancelation grid-inner">
    <div class="app-programmation-event-cancelation__wrapper">
      <AtomsCornerPoints :size-points="8" />

      <TH4 weight="bold" class="app-programmation-event-cancelation__title">
        <ELottie
          id="Circle_3"
          start="top center+=25%"
          end="bottom center-=10%"
        />

        {{ content.title }}
      </TH4>
      <ERichTextEvent
        :component="{ name: 'TP2', weight: 'medium', tagTarget: 'p', tag: 'p' }"
        :content="content.body"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    content: {
      type: Object,
      default: () => {},
    },
  },
}
</script>

<style lang="scss">
.app-programmation-event-cancelation {
  margin-top: desktop-vw(75px);

  @include mobile {
    margin-top: mobile-vw(50px);
  }

  &__title {
    margin-bottom: desktop-vw(15px);
    position: relative;
    display: inline-flex;

    @include mobile {
      margin-bottom: mobile-vw(15px);
    }

    .app-element-lottie {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -55%) rotate(5deg);
      height: auto;
      width: 140%;
    }
  }

  &__wrapper {
    grid-column: 2 / span 10;
    position: relative;
    padding: desktop-vw(20px) desktop-vw(25px);
    background: linear-gradient(
        rgba(251, 245, 238, 0.8) 0.1em,
        transparent 0.1em
      ),
      linear-gradient(90deg, rgba(251, 245, 238, 0.8) 0.1em, transparent 0.1em),
      white;
    background-size: 1.1em 1.1em;

    @include mobile {
      grid-column: 1 / span 6;
      padding: mobile-vw(15px) mobile-vw(20px);
    }
  }
}
</style>
