<template>
  <div
    :class="{
      hide: !popinWaitingLineOpen,
    }"
    class="app-programmation-popin-waiting-line"
    @click.stop="() => {}"
  >
    <div class="app-programmation-popin-waiting-line__wrapper">
      <span
        class="app-programmation-popin-waiting-line__close"
        @click="onClosePopin()"
      >
        Fermer
      </span>
      <AtomsCornerPoints :size-points="8" />

      <ERichText tag="p" :content="appContent.data.popin_newsletter_title" />

      <form
        :class="{ submited }"
        class="app-programmation-popin-waiting-line__form"
        @submit.prevent="onSubmit"
      >
        <div class="app-programmation-popin-waiting-line__form__successful">
          <TH2 tag="p" weight="bold">{{
            appContent.data.newsletter_big_text
          }}</TH2>
          <TH4 tag="p">{{ appContent.data.newsletter_text }}</TH4>
        </div>

        <div class="app-programmation-popin-waiting-line__field-group">
          <input
            v-model="nom"
            placeholder=" "
            required
            class="app-programmation-popin-waiting-line__field"
            type="text"
          />
          <TH4>Nom</TH4>
        </div>
        <div class="app-programmation-popin-waiting-line__field-group">
          <input
            v-model="prenom"
            placeholder=" "
            required
            class="app-programmation-popin-waiting-line__field"
            type="text"
          />
          <TH4>Prénom</TH4>
        </div>
        <div class="app-programmation-popin-waiting-line__field-group">
          <input
            v-model="email"
            placeholder=" "
            required
            class="app-programmation-popin-waiting-line__field"
            type="email"
          />
          <TH4>Email</TH4>
        </div>

        <div class="app-programmation-popin-waiting-line__accept-politic">
          <input
            id="accept-politic-waiting-line"
            v-model="accept"
            type="checkbox"
            required
          />
          <label for="accept-politic-waiting-line">
            <TP2 color="black">
              {{ appContent.data.popin_newsletter_text }}
              <AtomsLink :href="appContent.data.popin_newsletter__cta_href">
                {{ appContent.data.popin_newsletter_cta_text }}
              </AtomsLink>
            </TP2>
          </label>
          <span class="checkmark" />
        </div>
        <AtomsCTA
          :class="{ disabled: !validateForm }"
          type="submit"
          aria-label="popin-newsletter-submit"
          class="app-programmation-popin-waiting-line__cta"
          button
        >
          coucou
        </AtomsCTA>
      </form>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  data() {
    return {
      submited: false,
      prenom: '',
      nom: '',
      email: '',
      accept: false,
    }
  },

  computed: {
    ...mapState({
      appContent: (state) => state.appContent,
      popinWaitingLineOpen: (state) => state.popinWaitingLineOpen,
    }),
    validateForm() {
      /* eslint-disable-next-line */ const reg =
        /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

      return reg.test(this.email) && this.prenom && this.nom && this.accept
    },
  },
  watch: {
    $route() {
      this.setPopinWaitingLineOpen(false)
    },
    popinWaitingLineOpen(newVal) {
      if (newVal) {
        document.addEventListener('keyup', this.onKeyUp)
      } else {
        document.removeEventListener('keyup', this.onKeyUp)
      }
    },
  },

  beforeDestroy() {
    document.removeEventListener('keyup', this.onKeyUp)
  },
  methods: {
    onClosePopin() {
      this.setPopinWaitingLineOpen(false)
    },
    onSubmit() {
      if (!this.validateForm) return
      console.log('here')

      this.submited = true
    },
    onKeyUp(e) {
      if (e.target.tagName.toLowerCase() === 'input') return

      if (e.key === 'Escape' && this.popinWaitingLineOpen) {
        this.onClosePopin()
      }
    },

    ...mapMutations({
      setPopinWaitingLineOpen: 'setPopinWaitingLineOpen',
    }),
  },
}
</script>

<style lang="scss">
.app-programmation-popin-waiting-line {
  position: fixed;
  width: 100vw;
  height: 100vh;
  z-index: 99;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  left: 0;

  @include mobile {
    height: calc(100 * var(--vh, 1vh));
  }

  &.hide {
    pointer-events: none;

    * {
      pointer-events: none;
    }

    &::after {
      opacity: 0;
      transition-duration: 0s;
      transition-delay: 0s;
    }
    .app-programmation-popin-waiting-line__wrapper {
      opacity: 0;
      transition-duration: 0s;
      transition-delay: 0s;
    }
  }

  &::after {
    content: '';
    position: absolute;
    left: 0;
    width: 100%;
    height: 100%;
    top: 0;
    background: var(--c-grey);
    opacity: 0.7;
    transition: opacity 0.35s var(--ease-in-out-cubic);

    @include mobile {
      opacity: 0.85;
    }
  }

  &__wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    transform: rotate(-3deg);
    padding: desktop-vw(60px) desktop-vw(0px) desktop-vw(0px) desktop-vw(0px);
    background: linear-gradient(
        rgba(251, 245, 238, 0.8) 0.1em,
        transparent 0.1em
      ),
      linear-gradient(90deg, rgba(251, 245, 238, 0.8) 0.1em, transparent 0.1em),
      white;
    background-size: 1.3em 1.3em;
    z-index: 1;
    width: 52%;
    margin: 0 auto;
    transition: opacity 0.35s 0.25s var(--ease-in-out-cubic);

    @include mobile {
      padding: mobile-vw(30px) mobile-vw(0px) mobile-vw(0px) mobile-vw(0px);
      aspect-ratio: 340 / 280;
      width: 90%;
      left: 0;
      background-size: 1em 1em;
    }

    .app-element-rich-text {
      @include mobile {
        width: 75%;
      }

      .H4.wysiwyg-text {
        text-align: center;

        @include mobile {
          font-size: mobile-vw(14px);
          line-height: mobile-vw(20px);
          @include font-adihausDIN-bold();
        }

        .app-element-lottie-word.Trait_1 {
          svg {
            width: 70% !important;
            left: 50%;
            top: 100%;
            transform: translate(-50%, -20%) !important;
          }
        }
      }
    }
  }

  &__field-group {
    position: relative;
    display: flex;
    width: 100%;
    padding: min(10px, desktop-vw(10px)) min(20px, desktop-vw(20px))
      min(10px, desktop-vw(10px)) min(20px, desktop-vw(20px));
    flex-direction: row-reverse;

    @include mobile {
      flex-direction: column-reverse;
      padding: min(15px, mobile-vw(15px)) var(--layout-margin)
        min(15px, mobile-vw(15px)) var(--layout-margin);
    }

    &:first-of-type {
      margin-top: desktop-vw(20px);

      @include mobile {
        margin-top: mobile-vw(30px);
      }
    }

    .H4 {
      align-self: flex-end;
      margin-right: desktop-vw(20px);

      @include mobile {
        align-self: flex-start;
        margin-right: 0px;
      }
    }

    &:focus-within {
      & > .app-programmation-popin-waiting-line__field {
        border-bottom: 2px solid;
      }
    }
  }

  &__field {
    position: relative;
    z-index: 1;
    flex: 1 1 auto;
    display: block;
    width: 100%;
    border-bottom: 2px dashed var(--c-black);
    padding: 0 0 0 desktop-vw(15px);
    @include h2();
    font-size: desktop-vw(54px);
    line-height: desktop-vw(50px);
    @include font-adihausDIN-cn-bold();

    @include mobile {
      font-size: mobile-vw(24px);
      line-height: mobile-vw(18px);
      padding: mobile-vw(10px) 0 mobile-vw(5px) mobile-vw(5px);
    }

    &.textarea {
      @include p1();
      @include font-adihausDIN-medium();
      height: desktop-vw(125px);
      text-transform: initial;

      @include mobile {
        height: mobile-vw(125px);
      }
    }

    &:required:valid {
      border-bottom: 2px solid var(--c-black);
    }

    &:required:invalid:not(:placeholder-shown) {
      border-bottom: 2px solid var(--c-red-adidas);

      & + .H4 {
        color: var(--c-red-adidas) !important;
      }
    }
  }

  &__cta.app-atoms-cta {
    position: absolute;
    bottom: 0;
    right: 0;
    z-index: 2;
  }

  &__close {
    position: absolute;
    top: 0;
    transform: translateY(-50%) rotate(-6deg);
    padding: 10px 25px;
    background: var(--c-black);
    color: var(--c-grey);
    z-index: 10;
    display: block;
    @include font-adihausDIN-cn-bold();
    font-size: desktop-vw(14px);
    line-height: desktop-vw(18px);
    text-transform: uppercase;
    letter-spacing: -0.04em;
    display: inline-block;
    cursor: pointer;

    @include mobile {
      font-size: mobile-vw(14px);
      line-height: mobile-vw(18px);
    }
  }

  &__accept-politic {
    flex-basis: 100%;
    display: flex;
    align-items: center;
    position: relative;
    padding-left: desktop-vw(25px);
    margin-left: min(20px, desktop-vw(20px));
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    margin-top: desktop-vw(35px);

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
      order: 1;

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

  &__form {
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    margin-top: desktop-vw(20px);
    justify-content: center;
    width: 100%;
    position: relative;
    padding: desktop-vw(0px) desktop-vw(40px) desktop-vw(80px) desktop-vw(40px);

    @include mobile {
      margin-top: mobile-vw(30px);
      display: flex;
      flex-flow: column wrap;
      width: 100%;
      padding: mobile-vw(0px) mobile-vw(20px) mobile-vw(100px) mobile-vw(20px);
    }

    &.submited {
      .app-programmation-popin-waiting-line__field-group,
      .app-programmation-popin-waiting-line__accept-politic,
      .app-programmation-popin-waiting-line__cta {
        opacity: 0;
        pointer-events: none;

        transition: opacity 0.35s var(--ease-in-out-cubic);
      }

      .app-programmation-popin-waiting-line__form__successful {
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
  }
}
</style>
