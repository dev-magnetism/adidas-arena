<template>
  <div :style="bgColor" class="app-programmation-card">
    <nuxt-picture
      sizes="sm:100vw md:40vw"
      src="/imgs/placeholder.png"
      alt="test"
    />
    <div class="app-programmation-card__informations">
      <div class="app-programmation-card__head">
        <TP2
          class="type"
          weight="bold"
          :color="whitedTexts ? 'white' : 'black'"
        >
          Sport
        </TP2>
        <TP2
          class="date"
          weight="medium"
          :color="whitedTexts ? 'white' : 'black'"
        >
          22 JANV. AU 09 AVR.
        </TP2>
      </div>
      <TH2 :color="whitedTexts ? 'white' : 'black'" weight="bold">
        paris basket ball games 2023
      </TH2>

      <TP2
        class="app-programmation-card__from-price"
        weight="medium"
        :color="whitedTexts ? 'white' : 'black'"
      >
        À partir de 48,50€
      </TP2>

      <button><SvgCtaUnion :color="ctaColor" /></button>
    </div>
    <span class="app-programmation-card__full">
      <TP2 weight="bold" :color="ctaColor">Complet</TP2>
    </span>
  </div>
</template>

<script>
export default {
  props: {
    theme: {
      type: String,
      default: 'red',
    },
  },
  computed: {
    bgColor() {
      return {
        'background-color':
          this.theme === 'blue'
            ? 'var(--c-blue-adidas)'
            : this.theme === 'red'
            ? 'var(--c-red-adidas)'
            : 'var(--c-grey)',
      }
    },
    ctaColor() {
      return this.theme === 'blue'
        ? 'blue-adidas'
        : this.theme === 'red'
        ? 'red-adidas'
        : 'black'
    },
    whitedTexts() {
      return this.theme === 'blue' || this.theme === 'red'
    },
  },
}
</script>

<style lang="scss">
.app-programmation-card {
  grid-column: span 4;
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  border: 1px solid var(--c-black);

  &__full {
    position: absolute;
    top: 0;
    right: 0;
    background: var(--c-grey);
    border: 1px solid var(--c-black);
    display: block;
    border-top: none;
    border-right: none;
    padding: desktop-vw(5px) desktop-vw(8px);

    .P2 {
      text-transform: uppercase;
    }
  }

  picture {
    aspect-ratio: 435 / 435;
    width: 100%;
    display: block;
    @include noise();
  }

  &__informations {
    display: flex;
    flex-direction: column;
    padding: desktop-vw(15px) desktop-vw(25px);
  }

  &__head {
    display: flex;
    justify-content: space-between;

    .P2 {
      text-transform: uppercase;
    }
    .type {
    }

    .date {
    }
  }

  .H2.bold {
    font-size: desktop-vw(64px);
    line-height: desktop-vw(58px);
    margin-top: desktop-vw(5px);
    margin-bottom: desktop-vw(40px);
  }

  button {
    position: absolute;
    bottom: 0;
    height: desktop-vw(55px);
    width: desktop-vw(70px);
    background: var(--c-grey);
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border: 1px solid var(--c-black);
    border-right: none;
    border-bottom: none;
  }
}
</style>
