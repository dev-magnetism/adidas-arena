<template>
  <div class="app-actualites-block-quote grid-inner">
    <div class="app-actualites-block-quote__wrapper">
      <TH2
        color="blue-adidas"
        weight="medium"
        class="app-actualites-block-quote__sign top"
      >
        “
      </TH2>
      <TH2
        color="blue-adidas"
        weight="medium"
        class="app-actualites-block-quote__sign bottom"
      >
        “
      </TH2>
      <ERichText
        tag="p"
        class="app-actualites-block-quote__title"
        :content="content.body"
        :split="true"
        :scrub="true"
      />
      <TH4 class="app-actualites-block-quote__name" weight="bold">
        {{ content.name }}
      </TH4>
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
.app-actualites-block-quote {
  &__wrapper {
    grid-column: 3 / span 8;
    position: relative;
  }

  &__sign {
    position: absolute;

    &.top {
      position: absolute;
      top: -5%;
      left: -7%;
    }

    &.bottom {
      position: absolute;
      bottom: desktop-vw(70px);
      right: -5%;
      transform: rotate(180deg);
    }
  }

  &__title {
    margin-bottom: desktop-vw(70px);

    .app-element-lottie-word {
      svg {
        left: 50%;
        width: 180% !important;
        height: auto !important;
        top: 50%;
        transform: translate(-50%, -50%) !important;
      }
    }
  }

  &__name {
    text-align: center;
    opacity: 0.5;
  }
}
</style>
