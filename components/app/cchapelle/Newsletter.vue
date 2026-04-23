<template>
  <div class="page-cchapelle__newsletter grid-inner">
    <div class="page-cchapelle__newsletter__introduction">
       <ERichText tag="div" :content="contents.title" />
    </div>

    <div class="page-cchapelle__newsletter__wrapper">
      <AtomsCornerPoints :size-points="8" />


      <ERichText tag="div" :content="contents.text" />
     

      <form
        :class="{ submited }"
        class="page-cchapelle__newsletter__form"
        @submit.prevent="onSubmit"
      >
        <div class="page-cchapelle__newsletter__form__successful">
          <TH2 tag="p" weight="bold">{{
            contents.text
          }}</TH2>
          <TH4 tag="p">{{ contents.confirmation }}</TH4>
        </div>
        <input
          v-model="email"
          class="page-cchapelle__newsletter__form__field-mail"
          :placeholder="contents.placeholder"
          type="email"
          name="name"
          required
        />
        <button
          :class="{ valid: validateForm }"
          class="page-cchapelle__newsletter__form__submit"
          type="submit"
          aria-label="contact-newsletter-submit"
          @mouseenter="onMouseEnter"
          @mouseleave="onMouseLeave"
        >
          <span class="page-cchapelle__newsletter__form__submit__overlay" />
          <SvgFooterUnion ref="union" />
        </button>
        <div class="page-cchapelle__newsletter__accept-politic">
          <input
            id="accept-politic-contact-bloc"
            v-model="accept"
            type="checkbox"
            required
          />
          <label for="accept-politic-contact-bloc">
            <TP2 color="black">
              {{ contents.optin }}
            </TP2>
          </label>
          <span class="checkmark" />
        </div>
      </form>
    </div>

    <div class="page-cchapelle__newsletter__visual-transparent"></div>
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

      const endpoint = 'https://hooks.delight-data.com/v1/contacts'
      const misc = { optin_nl: 1 }

      const xhr = new XMLHttpRequest()
      xhr.open('POST', endpoint)
      xhr.setRequestHeader('Content-Type', 'application/json')
      xhr.setRequestHeader('x-api-key', this.$config.apiKeyDelight)
      xhr.send(
        JSON.stringify([{ listname: 'newsletter', email: this.email, misc }])
      )

      if (!localStorage.getItem('popin-newsletter'))
        localStorage.setItem('popin-newsletter', true)
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
  .page-cchapelle__newsletter {
    row-gap: 0;
    position: relative;
    margin-top: desktop-vw(214px);
    margin-bottom: desktop-vw(214px);

    @include mobile {
      margin-top: mobile-vw(140px);
      margin-bottom: mobile-vw(40px);
    }

    &__introduction{
      grid-column: 3 / span 8;
      margin-bottom: desktop-vw(120px);
      grid-row: 1;

      @include mobile {
        grid-column: 2 / span 4;
        margin-bottom: mobile-vw(120px);
      }

      .H3 {
        @include font-ITCFranklinGothicLT-BkCp();
       
        font-size: desktop-vw(100px);
        line-height: desktop-vw(90px);
        color: var(--c-black) !important;
        text-transform: uppercase;
        text-align: center;
        letter-spacing: desktop-vw(-2px);

        @include mobile{
          font-size: mobile-vw(64px);
          line-height: mobile-vw(54px);
          letter-spacing: mobile-vw(-1.92px);
        }

        strong{
           @include font-ITCFranklinGothicLT-DmCp();
        }

        u{
          position: relative;

          &:after{
            content: '';
            position: absolute;
            left: 0;
            bottom: desktop-vw(12px);
            width: 100%;
            height: 4px;
            background-color: var(--c-black);

            @include mobile{
               bottom: mobile-vw(8px);
            }
          }
         
        }

        .app-element-lottie-word.lottie-word.Cercle_2 svg{
          bottom: desktop-vw(-20px);
          @include mobile{
            bottom: mobile-vw(-20px);
          }
        }
        .app-atoms-stroke-text{
          display: unset;
          -webkit-text-stroke: 1px var(--c-white);
          -webkit-text-fill-color: transparent;
        }
      }
  }

  &__visual-transparent {
    @include fake-transparent();

    position: absolute;
    grid-column: 3 / span 2;
    width: 100%;
    aspect-ratio: 185 / 230;
    bottom: desktop-vw(80px);
    transform: rotate(5.6deg);

    @include mobile {
      position: relative;
      grid-column: 1 / span 3;
      aspect-ratio: 135/170;
      width: 75%;
      top: mobile-vw(-340px);
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
      order: 2;
      flex: 1;
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
      font-size: desktop-vw(18px);
      @include font-ITCFranklinGothicLT-BkCp();

      @include mobile{
        font-size: mobile-vw(16px);
      }
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
      order: 1;

      @include mobile{
         width: mobile-vw(25px);
      }

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
    grid-row: 2;
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
          @include font-ITCFranklinGothicLT-DmCp();
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
      .page-cchapelle__newsletter__form__field-mail,
      .page-cchapelle__newsletter__form__submit,
      .page-cchapelle__newsletter__accept-politic {
        opacity: 0;
        pointer-events: none;

        transition: opacity 0.35s var(--ease-in-out-cubic);
      }

      .page-cchapelle__newsletter__form__successful {
        pointer-events: all;
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
      pointer-events: none;
    }

    &__field-mail {
      @include font-ITCFranklinGothicLT-BkCp() ;
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
        order: 3;
      }

      &.valid {
        cursor: pointer;

        .page-cchapelle__newsletter__form__submit__overlay {
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
