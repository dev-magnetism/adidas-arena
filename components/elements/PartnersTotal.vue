<template>
  <div class="app-element-partners-total">
    <div class="app-element-partners-total__number">
      <TH1 weight="bold" v-for="(char, index) in totalFinal" :key="index">{{
        char
      }}</TH1>
    </div>
    <TH2 class="app-element-partners-total__partners">partenaires</TH2>
  </div>
</template>

<script>
export default {
  data() {
    return {
      total: 8,
    }
  },
  computed: {
    totalFinal() {
      const value = ('0' + this.total).slice(-2)
      return value.split('')
    },
  },
}
</script>

<style lang="scss">
.app-element-partners-total {
  grid-column: 11 / span 2;
  text-align: right;
  justify-self: flex-end;
  align-self: start;
  display: flex;
  flex-direction: column;

  &__number {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;

    .H1 {
      display: inline-block;

      &:first-child {
        -webkit-text-stroke: 1.5px var(--c-black);
        -webkit-text-fill-color: transparent;
      }
    }
  }

  .H2 {
    font-size: desktop-vw(24px);
    line-height: desktop-vw(24px);
    opacity: 0.35;
  }
}
</style>
