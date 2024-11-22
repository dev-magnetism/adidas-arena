<template>
  <div
    :class="{ open: overlayContactOpen }"
    class="app-element-offrescontact-overlay"
  >
    <AtomsCTABack
      :class="{ submited }"
      @click.native="setOverlayContactOpen(false)"
    >
      Retour
    </AtomsCTABack>
    <div :class="{ submited }" class="app-element-offrescontact-overlay__successful">
      <TH2 tag="p">{{ appContent.data.contact_overlay_successful_title }}</TH2>
      <TH4 tag="p">{{
        appContent.data.contact_overlay_successful_subtitle
      }}</TH4>
    </div>
    <AtomsCornerPoints :size-points="8" />
    <div data-lenis-prevent class="app-element-offrescontact-overlay__wrapper">
      <TH2
        tag="p"
        :class="{ submited }"
        class="app-element-offrescontact-overlay__title"
      >
        {{ appContent.data.contact_overlay_title }}
      </TH2>
      <TP1
        :class="{ submited }"
        weight="medium"
        class="app-element-offrescontact-overlay__subtitle"
      >
        {{ formType }}
      </TP1>

      <form
        :class="{ submited }"
        class="app-element-offrescontact-overlay__form"
        @submit.prevent="onSubmit"
      >
        <div class="app-element-offrescontact-overlay__field-group">
          <input
            v-model="nom"
            placeholder=" "
            required
            class="app-element-offrescontact-overlay__field"
            type="text"
          />
          <TH4 tag="p">Nom</TH4>
        </div>
        <div class="app-element-offrescontact-overlay__field-group">
          <input
            v-model="prenom"
            placeholder=" "
            required
            class="app-element-offrescontact-overlay__field"
            type="text"
          />
          <TH4 tag="p">Prénom</TH4>
        </div>
        <div class="app-element-offrescontact-overlay__field-group">
          <input
            v-model="email"
            placeholder=" "
            required
            class="app-element-offrescontact-overlay__field"
            type="email"
          />
          <TH4 tag="p">Email</TH4>
        </div>
        <div class="app-element-offrescontact-overlay__field-group">
          <input
            v-model="telephone"
            required
            placeholder=" "
            class="app-element-offrescontact-overlay__field"
            type="tel"
            pattern="^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,5})|(\(?\d{2,6}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$"
          />
          <TH4 tag="p">Téléphone</TH4>
        </div>
        <div class="app-element-offrescontact-overlay__field-group textarea">
          <textarea
            v-model="body"
            placeholder=" "
            class="app-element-offrescontact-overlay__field textarea"
            required
          />
          <TH4 tag="p">Votre message</TH4>
        </div>
        <div class="app-element-offrescontact-overlay__baseline">
          <TP1 weight="bold">{{ appContent.data.contact_overlay_warning }}</TP1>
          <AtomsCTA type="submit" button> Envoyer </AtomsCTA>
        </div>
      </form>
    </div>
    <div
      class="app-element-offrescontact-overlay__zone-close"
      @click="setOverlayContactOpen(false)"
    />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  props: {
    subject: {
      type: String,
      default: '#',
    },
    mailTo: {
      type: String,
      default: '#',
    },
    formType: {
      type: String,
      default: 'Type form',
    },
  },
  data() {
    return {
      submited: false,
      prenom: '',
      nom: '',
      telephone: '',
      email: '',
      body: '',
    }
  },
  computed: {
    ...mapState({
      overlayContactOpen: (state) => state.overlayContactOpen,
      appContent: (state) => state.appContent,
    }),
  },
  mounted() {
    window.addEventListener('keyup', this.onKeyUp)
  },

  beforeDestroy() {
    window.removeEventListener('keyup', this.onKeyUp)
  },

  methods: {
    onSubmit() {
      this.submited = true
      // const url = 'https://jyoxikyatc.execute-api.us-east-1.amazonaws.com/prod/contact/'

      // const xhr = new XMLHttpRequest()

      // xhr.open('POST', url)
      // xhr.setRequestHeader('Content-Type', 'application/json')

      // const data = {
      //   firstname: this.prenom,
      //   lastname: this.nom,
      //   email: this.email,
      //   phone: this.telephone,
      //   message: this.body,
      // }

      // xhr.send(JSON.stringify(data))


      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        "firstname": this.prenom,
        "lastname": this.nom,
        "email":this.email,
        "phone": this.telephone,
        "message": this.body
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };

      fetch("https://services.groupe-pec.com/special/b2b-campaign", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
      
    },
    onKeyUp(e) {
      if (!this.overlayContactOpen) return

      if (e.key === 'Escape') {
        this.setOverlayContactOpen(false)
      }
    },
    ...mapMutations({
      setOverlayContactOpen: 'setOverlayContactOpen',
    }),
  },
}
</script>

<style lang="scss">
.app-element-offrescontact-overlay {
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  width: 55vw;
  background: white;
  z-index: 9;
  background: linear-gradient(rgba(251, 245, 238, 0.8) 0.1em, transparent 0.1em),
    linear-gradient(90deg, rgba(251, 245, 238, 0.8) 0.1em, transparent 0.1em),
    white;
  background-size: 1.15em 1.15em;
  transform: translateX(calc(100% + 5px));
  transition: transform 0.65s var(--ease-in-out-cubic);

  @include mobile {
    width: 100vw;
    left: 0;
    height: calc(100 * var(--vh, 1vh));
  }

  &.open {
    transform: translateX(0%);
    transition-delay: 0.35s;

    .app-element-contact-overlay__zone-close {
      pointer-events: all;
    }
  }

  .app-atoms-corner-points {
    .app-atoms-corner-points__line--top,
    .app-atoms-corner-points__line--right,
    .app-atoms-corner-points__line--bottom,
    .app-atoms-corner-points__item--top-right,
    .app-atoms-corner-points__item--bottom-right {
      display: none;
    }
  }

  .app-atoms-cta-back {
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.5s var(--ease-in-out-cubic);
    z-index: 9;

    @include mobile {
      opacity: 1 !important;
      pointer-events: all !important;
    }

    &.submited {
      opacity: 1;
      pointer-events: all;
    }
  }

  &__successful {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.5s 0.35s var(--ease-in-out-cubic);
    text-align: center;

    &.submited {
      opacity: 1;
      pointer-events: all;
    }
  }

  &__form {
  }

  &__form,
  &__title.H2,
  &__subtitle.P1 {
    transition: opacity 0.5s var(--ease-in-out-cubic);

    &.submited {
      opacity: 0;
      pointer-events: none;
    }
  }

  &__title.H2 {
    font-size: desktop-vw(64px);
    line-height: desktop-vw(58px);
    text-align: center;

    @include mobile {
      font-size: mobile-vw(42px);
      line-height: mobile-vw(38px);
    }
  }

  &__subtitle.P1 {
    text-align: center;
    opacity: 0.5;
    margin-top: desktop-vw(10px);

    @include mobile {
      margin-top: mobile-vw(10px);
    }
  }

  &__zone-close {
    position: absolute;
    width: 45vw;
    top: 0;
    height: 100%;
    background: transparent;
    right: 100%;
    pointer-events: none;

    @include mobile {
      display: none;
    }
  }

  &__wrapper {
    padding-top: desktop-vw(40px);
    overflow-y: scroll;
    overscroll-behavior: contain;
    height: 100vh;

    @include mobile {
      height: calc(100 * var(--vh, 1vh));
      padding-top: mobile-vw(60px);
      padding-bottom: mobile-vw(30px);
    }
  }

  &__field-group {
    position: relative;
    display: flex;
    width: 100%;
    padding: min(26px, desktop-vw(20px)) min(50px, desktop-vw(50px))
      min(14px, desktop-vw(10px)) min(50px, desktop-vw(50px));
    flex-direction: row-reverse;

    @include mobile {
      flex-direction: column-reverse;
      padding: min(10px, mobile-vw(10px)) var(--layout-margin)
        min(10px, mobile-vw(10px)) var(--layout-margin);
    }

    &:first-of-type {
      margin-top: 0;

      @include mobile {
        margin-top: mobile-vw(30px);
      }
    }

    &.textarea {
      flex-direction: column-reverse;
      margin-top: desktop-vw(20px);

      .H4 {
        align-self: flex-start;
        margin-bottom: desktop-vw(20px);
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
      & > .app-element-contact-overlay__field {
        border-bottom: 2px solid;
      }
    }
  }

  &__baseline {
    position: absolute;
    right: 0;
    bottom: 0;
    display: flex;
    width: 100%;
    justify-content: flex-end;
    //  margin-top: desktop-vw(64px);
    align-items: center;

    @include mobile {
      position: unset;
      right: unset;
      botto: unset;
      flex-direction: column;
      margin-top: mobile-vw(20px);
    }
    .app-atoms-cta {
      margin-left: 30px;
      width: 25%;

      @include mobile {
        width: 85%;
        margin: 0 auto;
        margin-top: mobile-vw(10px);
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
    font-size: desktop-vw(44px);
    line-height: desktop-vw(38px);
    @include font-ITCFranklinGothicLT-DmCp();

    @include mobile {
      font-size: mobile-vw(24px);
      line-height: mobile-vw(18px);
      padding: mobile-vw(10px) 0 mobile-vw(5px) mobile-vw(5px);
    }

    &.textarea {
      @include p1();
      @include font-ITCFranklinGothicLT-BkCp();
      height: desktop-vw(85px);
      text-transform: initial;

      @include mobile {
        height: mobile-vw(65px);
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
}
</style>
