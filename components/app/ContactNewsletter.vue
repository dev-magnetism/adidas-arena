<template>
  <div class="app-contact-actus grid-inner">
    <div class="app-contact-actus__wrapper">
      <AtomsCornerPoints :size-points="8" />

      <ERichText :content="contents.title" />

      <form
        :class="{ submited }"
        class="app-contact-actus__form"
        @submit.prevent="onSubmit"
      >
        <div class="app-contact-actus__form__successful">
          <TH2 weight="bold">{{ appContent.data.newsletter_big_text }}</TH2>
          <TH4>{{ appContent.data.newsletter_text }}</TH4>
        </div>
        <input
          v-model="email"
          class="app-contact-actus__form__field-mail"
          :placeholder="contents.placeholder"
          type="email"
          name="name"
          required
        />
        <button
          :class="{ valid: validateForm }"
          class="app-contact-actus__form__submit"
          type="submit"
          @mouseenter="onMouseEnter"
          @mouseleave="onMouseLeave"
        >
          <span class="app-contact-actus__form__submit__overlay" />
          <SvgFooterUnion ref="union" />
        </button>
        <div class="app-contact-actus__accept-politic">
          <input
            id="accept-politic"
            v-model="accept"
            type="checkbox"
            required
          />
          <label for="accept-politic">
            <TP2 color="black">
              {{ contents.text }}
              <AtomsLink :href="contents.ctaHref">
                {{ contents.ctaText }}
              </AtomsLink>
            </TP2>
          </label>
          <span class="checkmark" />
        </div>
      </form>
    </div>

    <div class="app-contact-actus__visual-transparent"></div>
  </div>
</template>

<script>
import { gsap } from 'gsap'
import { mapState } from 'vuex'

export default {
  props: {
    contents: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      email: '',
      accept: false,
      // email: 'AMMGM@GMAIL.COM',
      // accept: true,
      submited: false,
    }
  },
  computed: {
    ...mapState({
      appContent: (state) => state.appContent,
    }),
    validateForm() {
      /* eslint-disable-next-line */ const reg =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/

      return reg.test(this.email) && this.accept
    },
  },
  mounted() {
    console.log(this.appContent)
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
    onSubmit() {
      this.submited = true
      console.log('here submit', this)

      // const url = 'https://hooks.delight-data.com/v1/contacts'

      // const xhr = new XMLHttpRequest()
      // xhr.open('POST', url)

      // xhr.setRequestHeader('Content-Type', 'application/json')
      // xhr.setRequestHeader('x-api-key', 'MMcR9vQkDKfuug')

      // xhr.onreadystatechange = function () {
      //   if (xhr.readyState === 4) {
      //     console.log(xhr.status)
      //     console.log(xhr.responseText)
      //   }
      // }

      // const data =
      //   '[{"email": "testemail@email.com", "listname": "test_list", "misc": { optin_nl: 1 }}]'

      // xhr.send(data)

      const misc = { optin_nl: 1 }

      this.$axios.$post(
        '/api/',
        JSON.stringify([{ listname: 'newsletter', email: this.email, misc }]),
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': this.$config.apiKeyDelight,
          },
        }
      )
    },
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
.app-contact-actus {
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

    @include mobile {
      grid-column: 1 / span 3;
      top: 0;
      aspect-ratio: 135/170;
      width: 75%;
      top: mobile-vw(-30px);
    }
  }

  &__accept-politic {
    flex-basis: 100%;
    display: flex;
    align-items: center;
    position: relative;
    padding-left: desktop-vw(25px);
    margin-left: 6%;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    margin-top: desktop-vw(5px);

    @include mobile {
      padding-left: mobile-vw(25px);
      margin-top: mobile-vw(20px);
    }

    @include hover {
      &:hover {
        input {
          &:not(:checked) ~ .checkmark {
            &::after {
              content: '';
              transform: translate(-50%, -50%) scale(0.35);
            }
          }
        }
      }
    }

    .P2 {
      font-size: desktop-vw(16px);
      line-height: desktop-vw(21px);
      color: var(--c-black);
      cursor: pointer;
      transition: color 0.4s var(--ease-out-cubic);

      @include mobile {
        font-size: mobile-vw(14px);
        line-height: mobile-vw(16px);
      }
    }

    a {
      text-decoration: underline;
      @include font-adihausDIN-medium();
      position: relative;
    }

    input {
      opacity: 0;
      position: absolute;
      width: desktop-vw(25px);
      height: 100%;
      top: 0;
      left: 0;
      cursor: pointer;

      &:checked ~ .checkmark {
        // background-color: var(--c-black);

        &::after {
          content: '';
          transform: translate(-50%, -50%) scale(1);
        }
      }
    }

    .checkmark {
      position: absolute;
      left: 0;
      height: 12px;
      width: 12px;
      background-color: transparent;
      border: 1px solid var(--c-black);
      pointer-events: none;
      cursor: pointer;

      &::after {
        content: '';
        width: 75%;
        height: 75%;
        background: var(--c-black);
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0);
        transform-origin: center;
        transition: transform 0.3s var(--ease-out-cubic);
        will-change: transform;
      }
    }
  }

  &__wrapper {
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

    @include mobile {
      grid-column: 1 / span 6;
      padding: mobile-vw(30px) mobile-vw(0px) mobile-vw(25px) mobile-vw(0px);
      aspect-ratio: 340 / 280;
      width: 95%;
      left: 2.5%;
      background-size: 1em 1em;
    }

    .app-element-rich-text {
      .H4.wysiwyg-text {
        text-align: center;

        @include mobile {
          font-size: mobile-vw(14px);
          line-height: mobile-vw(20px);
          @include font-adihausDIN-bold();
        }

        .app-element-lottie-word.Trait_1 {
          svg {
            width: 110% !important;
            left: 55%;
            top: 50%;
            transform: translate(-50%, -50%) !important;
          }
        }
      }
    }
  }

  &__form {
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    margin-top: desktop-vw(20px);
    justify-content: center;
    width: 85%;
    position: relative;

    @include mobile {
      margin-top: mobile-vw(20px);
      display: flex;
      flex-flow: column wrap;
      width: 100%;
    }

    &.submited {
      .app-contact-actus__form__field-mail,
      .app-contact-actus__form__submit,
      .app-contact-actus__accept-politic {
        opacity: 0;
        pointer-events: none;

        transition: opacity 0.35s var(--ease-in-out-cubic);
      }

      .app-contact-actus__form__successful {
        opacity: 1;
      }
    }

    &__successful {
      position: absolute;
      text-align: center;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      opacity: 0;
      transition: opacity 0.35s 0.35s var(--ease-in-out-cubic);
    }

    &__field-mail {
      @include font-adihausDIN-cn-medium();
      text-transform: uppercase;
      font-size: desktop-vw(82px);
      line-height: desktop-vw(106px);
      letter-spacing: -0.04em;
      width: 75%;

      @include mobile {
        font-size: mobile-vw(40px);
        line-height: mobile-vw(40px);
        text-align: center;
      }

      &::placeholder {
        color: rgba(24, 24, 24, 0.25);
      }
    }

    &__submit {
      border: 1px solid rgb(24 24 24 / 25%);
      width: desktop-vw(56px);
      height: desktop-vw(56px);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: desktop-vw(40px);
      cursor: not-allowed;
      overflow: hidden;
      align-self: center;
      position: relative;

      @include mobile {
        width: mobile-vw(56px);
        height: mobile-vw(56px);
        margin-left: 0px;
        margin-top: mobile-vw(20px);
      }

      &.valid {
        cursor: pointer;

        .app-contact-actus__form__submit__overlay {
          transform: scaleY(1);
        }

        svg {
          opacity: 1;

          path {
            fill: var(--c-black);
          }
        }
      }

      &__overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--c-grey);
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

        path {
          fill: var(--c-black);
        }

        @include mobile {
          padding: mobile-vw(15px);
        }
      }
    }
  }
}
</style>
