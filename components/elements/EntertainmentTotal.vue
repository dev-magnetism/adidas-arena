<template>
  <div class="app-element-entertainment-total">
    <div class="app-element-entertainment-total__number">
      <TH1
        v-for="(char, index) in totalFinal"
        :key="index"
        ref="numbers"
        tag="p"
        weight="bold"
        >{{ char }}</TH1
      >
    </div>
    <TH2 ref="text" tag="p" class="app-element-entertainment-total__text">{{
      text
    }}</TH2>
  </div>
</template>

<script>
import { gsap } from 'gsap'

export default {
  props: {
    total: {
      type: Number,
      default: 0,
    },
    text: {
      type: String,
      default: 'activités',
    },
  },

  computed: {
    totalFinal() {
      const value = ('0' + this.total).slice(-2)
      return value.split('')
    },
  },
  mounted() {
    if (this.$viewport.isMobile) return

    this.tl = gsap.timeline({
      scrollTrigger: {
        trigger: this.$el,
        start: 'bottom bottom',
        toggleActions: 'play none none none',
      },
    })

    const els = this.$refs.numbers.map((el) => el.$el)

    this.tl.to(
      els,

      {
        delay: 0.1,
        y: 0,
        stagger: 0.2,
        duration: 1.2,
        ease: 'expo.out',
      }
    )
    this.tl.to(
      this.$refs.text.$el,

      {
        y: 0,
        opacity: 0.35,
        duration: 1.2,
        ease: 'expo.out',
      },
      '<30%'
    )
  },
  beforeDestroy() {
    this.tl?.kill()
  },
}
</script>

<style lang="scss">
.app-element-entertainment-total {
  grid-column: 11 / span 2;
  text-align: right;
  justify-self: flex-end;
  align-self: start;
  display: flex;
  flex-direction: column;

  @include mobile {
    grid-row: 2;
  }

  &__number {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    overflow: hidden;

    .H1 {
      display: inline-block;
      will-change: transform;
      transform: translateY(-100%);
      font-size: desktop-vw(135px);
      line-height: desktop-vw(135px);
      letter-spacing: desktop-vw(-6.75px);

      @include mobile {
        transform: translateY(0%);
        font-size: mobile-vw(80px);
        line-height: mobile-vw(80px);
        letter-spacing: mobile-vw(-4px);
      }

     
    }
  }

  &__text.H2 {
    font-size: desktop-vw(24px);
    line-height: desktop-vw(24px);
    opacity: 0.35;
    will-change: transform;
    transform: translateY(-65%);

    @include mobile{
      font-size: mobile-vw(24px);
      line-height: mobile-vw(24px);
    }
  }
}
</style>
