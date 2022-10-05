<template>
  <div class="app-contact-newsletter grid-inner">
    <div class="app-contact-newsletter__newsletter">
      <AtomsCornerPoints :size-points="8" />
      <TH4>Trop tôt pour vous engager ? </TH4>
      <TH4> découvrez les actus de L’ADIDAS ARENA</TH4>

      <form action="#" class="app-contact-newsletter__newsletter__form">
        <input
          v-model="email"
          class="app-contact-newsletter__newsletter__form__field-mail"
          placeholder="email@email.com"
          type="email"
          name="name"
          required
        />
        <button
          :class="{ valid: validateForm }"
          class="app-contact-newsletter__newsletter__form__submit"
          type="submit"
          @mouseenter="onMouseEnter"
          @mouseleave="onMouseLeave"
        >
          <span class="app-footer__newsletter__submit__overlay" />
          <SvgFooterUnion ref="union" />
        </button>
      </form>
    </div>

    <div class="app-contact-newsletter__visual-transparent"></div>
  </div>
</template>

<script>
import { gsap } from 'gsap'

export default {
  data() {
    return {
      email: '',
    }
  },
  computed: {
    validateForm() {
      /* eslint-disable-next-line */ const reg =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/

      return reg.test(this.email)
    },
  },
  mounted() {
    this.tl = gsap.timeline({
      paused: true,
    })

    this.tl.to(this.$refs.union.$el, {
      xPercent: 100,
      duration: 0.25,
      ease: 'power1.out',
    })

    this.tl.set(this.$refs.union.$el, {
      xPercent: -100,
    })

    this.tl.to(this.$refs.union.$el, {
      xPercent: 0,
      duration: 0.25,
      ease: 'power1.out',
    })
  },
  beforeDestroy() {
    this.tl?.kill()
  },
  methods: {
    onMouseEnter() {
      if (!this.validateForm) return

      this.tl.play()
    },
    onMouseLeave() {
      if (!this.validateForm) return

      this.tl.reverse()
    },
  },
}
</script>

<style lang="scss">
.app-contact-newsletter {
  row-gap: 0;
  position: relative;

  &__visual-transparent {
    @include fake-transparent();

    position: absolute;
    grid-column: 3 / span 2;
    width: 100%;
    aspect-ratio: 185 / 230;
    bottom: desktop-vw(80px);
    transform: rotate(5.6deg);
  }

  &__newsletter {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    grid-column: 4 / span 7;
    position: relative;
    transform: rotate(-3deg);
    padding: desktop-vw(45px) desktop-vw(0px) desktop-vw(35px) desktop-vw(0px);
    background: linear-gradient(
        rgba(251, 245, 238, 0.8) 0.1em,
        transparent 0.1em
      ),
      linear-gradient(90deg, rgba(251, 245, 238, 0.8) 0.1em, transparent 0.1em),
      white;
    background-size: 1.3em 1.3em;
    z-index: 1;

    &__form {
      display: flex;
      flex-flow: row wrap;
      align-items: center;
      margin-top: desktop-vw(20px);
      justify-content: center;
      width: 85%;

      &__field-mail {
        @include font-adihausDIN-cn-medium();
        text-transform: uppercase;
        font-size: desktop-vw(82px);
        line-height: desktop-vw(106px);
        letter-spacing: -0.04em;
        width: 75%;

        &::placeholder {
          color: rgba(24, 24, 24, 0.25);
        }
      }

      &__submit {
        border: 1px solid rgb(24 24 24 / 25%);
        width: desktop-vw(55px);
        height: desktop-vw(55px);
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: desktop-vw(40px);
        cursor: not-allowed;
        overflow: hidden;
        align-self: center;
        position: relative;

        &.valid {
          cursor: pointer;

          .app-footer__newsletter__submit__overlay {
            transform: scaleY(1);
          }

          svg {
            opacity: 1;

            path {
              fill: var(--c-white);
            }
          }
        }

        &__overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: var(--c-black);
          z-index: 0;
          transform: scaleY(0);
          transform-origin: top center;
          transition: transform 0.4s var(--ease-out-cubic);
        }

        svg {
          width: 100%;
          padding: desktop-vw(15px);
          height: auto;
          opacity: 0.25;
          z-index: 1;
          transition: opacity 0.2s var(--ease-out-cubic);
        }
      }
    }
  }
}
</style>
