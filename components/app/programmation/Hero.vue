<template>
  <div class="app-programmation-hero grid-inner">
    <div class="app-programmation-hero__texts">
      <ERichText
        ref="title"
        :class="{ hide: exteriorFullwidth }"
        class="app-programmation-hero__title"
        :content="contents.title"
      />
      <TP2 weight="bold" class="app-programmation-hero__paragraph">
        {{ contents.paragraph }}
      </TP2>
    </div>

    <div class="app-programmation-hero__main-card">
      <AtomsCornerPoints :size-points="8" />
      <div class="app-programmation-hero__main-card__wrapper">
        <nuxt-picture
          sizes="sm:100vw md:65vw"
          src="/imgs/placeholder.png"
          alt="test"
        />

        <div class="app-programmation-hero__main-card__content">
          <TH3 class="app-programmation-hero__main-card__name">
            Nekfeu
            <span class="app-programmation-hero__main-card__full">Complet</span>
          </TH3>
          <TH4 class="app-programmation-hero__main-card__date">
            30 MAI 2023 À 20H30
          </TH4>
          <TP2
            weight="medium"
            class="app-programmation-hero__main-card__from-price"
          >
            À partir de 48,50€
          </TP2>
        </div>
      </div>
      <AtomsCTA class="app-programmation-hero__main-card__cta" button>
        Liste d'attente
      </AtomsCTA>
    </div>
    <div class="app-programmation-hero__visual-back-transparent" />
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
.app-programmation-hero {
  position: relative;
  margin-bottom: desktop-vw(100px);

  &__texts {
    grid-column: 2 / span 5;
  }

  &__title {
    width: 100%;
  }

  &__paragraph {
    width: 85%;
    text-transform: uppercase;
    margin-top: desktop-vw(25px);
  }

  &__main-card {
    position: relative;
    grid-column: 8 / span 5;
    width: 100%;
    background: var(--c-white);
    left: -5%;
    transform: rotate(3deg);
    z-index: 1;

    &__wrapper {
      padding: desktop-vw(15px) desktop-vw(15px) desktop-vw(25px)
        desktop-vw(15px);
    }

    &__content {
      display: flex;
      flex-direction: column;
    }

    &__name {
      margin-top: desktop-vw(10px);
      display: flex;
      flex-direction: row;
    }

    &__full {
      font-size: desktop-vw(14px);
      line-height: desktop-vw(16px);
      letter-spacing: -0.02em;
      @include font-adihausDIN-bold();
      color: var(--c-red-adidas);
      margin-left: desktop-vw(20px);
      align-self: flex-start;
      margin-top: desktop-vw(10px);
    }

    &__date {
      margin-top: desktop-vw(15px);
    }

    &__from-price {
      margin-top: desktop-vw(30px);
      align-self: flex-end;
    }

    picture {
      aspect-ratio: 540/480;
      width: 100%;
      display: block;
      @include noise();
    }

    &__cta {
      min-width: 50%;
      margin-left: auto;
      display: flex;
      border-bottom: none;
      border-right: none;
    }
  }
  &__visual-back-transparent {
    @include fake-transparent();
    grid-column: 7 / span 2;
    position: absolute;
    aspect-ratio: 185 / 230;
    width: 100%;
    bottom: 5%;
    z-index: 0;
    transform: rotate(-5deg);
  }
}
</style>
