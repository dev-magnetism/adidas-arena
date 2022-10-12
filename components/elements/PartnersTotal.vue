<template>
  <div class="app-element-partners-total">
    <div class="app-element-partners-total__number">
      <TH1
        v-for="(char, index) in totalFinal"
        :key="index"
        ref="numbers"
        weight="bold"
        >{{ char }}</TH1
      >
    </div>
    <TH2 ref="text" class="app-element-partners-total__text">partenaires</TH2>
  </div>
</template>

<script>
import { gsap } from 'gsap'

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
  mounted() {
    if (this.$mq === 'sm') return

    this.tl = gsap.timeline({
      scrollTrigger: {
        trigger: this.$el,
        start: 'bottom bottom',
        toggleActions: 'play none none none',
      },
    })

    const els = this.$refs.numbers.map((el) => el.$el)

    this.tl.fromTo(
      els,
      {
        yPercent: -100,
      },
      {
        delay: 0.1,
        yPercent: 0,
        stagger: 0.2,
        duration: 0.7,
        ease: 'power3.out',
      }
    )
    this.tl.fromTo(
      this.$refs.text.$el,
      {
        yPercent: -65,
        opacity: 0,
      },
      {
        yPercent: 0,
        stagger: 0.1,
        opacity: 0.35,
        duration: 0.45,
        ease: 'power3.out',
      },
      '<50%'
    )
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

  @include mobile {
    display: none;
  }

  &__number {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    overflow: hidden;

    .H1 {
      display: inline-block;

      &:first-child {
        -webkit-text-stroke: 1.5px var(--c-black);
        -webkit-text-fill-color: transparent;
      }
    }
  }

  &__text.H2 {
    font-size: desktop-vw(24px);
    line-height: desktop-vw(24px);
    opacity: 0.35;
  }
}
</style>
