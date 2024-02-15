<template>
  <div
    :class="{
      hide: !popinShareOpen,
    }"
    class="app-popin-share"
  >
    <div class="app-popin-share__wrapper">
      <AtomsCornerPoints :size-points="8" />

      <ERichText
        tag="div"
        content="PARTAGER"
        class="app-popin-share__wrapper__title"
      />

      <div class="app-popin-share__wrapper__item">
        <a :href="`https://www.facebook.com/sharer/sharer.php?u=${currentOrigin + '/' + imageUrl}`" target="_blank">
          <SvgFooterFacebook />
          <ERichText
            tag="p"
            class="app-popin-share__wrapper__item__facebook"
            content="Partage sur facebook"
          />
        </a>
      </div>
      <div class="app-popin-share__wrapper__item">
        <a
          :href="`https://www.linkedin.com/sharing/share-offsite/?url=${currentOrigin + '/' + imageUrl}`"
          target="_blank"
        >
          <SvgFooterLinkedin />
          <ERichText
            tag="p"
            class="app-popin-share__wrapper__item__facebook"
            content="Partage sur Linkedin"
          />
        </a>
      </div>
      <div class="app-popin-share__wrapper__item">
        <a :href="`https://wa.me/?text=${currentOrigin + '/' + imageUrl}`" target="_blank">
          <SvgFooterWhatsapp />
          <ERichText
            tag="p"
            class="app-popin-share__wrapper__item__facebook"
            content="Partage sur Whatsapp"
          />
        </a>
      </div>
      <div class="app-popin-share__wrapper__item">
        <a
          :href="`https://twitter.com/intent/tweet?url=${currentOrigin + '/' + imageUrl}`"
          target="_blank"
        >
          <SvgFooterTwitter />
          <ERichText
            tag="p"
            class="app-popin-share__wrapper__item__facebook"
            content="Partage sur X"
          />
        </a>
      </div>

      <span class="app-popin-share__close" @click="onClosePopin()">
        Fermer
      </span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    popinShareOpen: {
      type: Boolean,
      required: false,
      default: true,
    },
    onClosePopin: {
      type: Function,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
      default: '',
    },
  },
  data() {
    return {
      currentOrigin: '',
    }
  },
  mounted() {
    this.currentOrigin = window.location.origin
  },
}
</script>

<style lang="scss">
.app-popin-share {
  position: fixed;
  width: 100vw;
  height: 100vh;
  z-index: 9;
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
    .app-popin-share__wrapper {
      opacity: 0;
      transition-duration: 0s;
      transition-delay: 0s;
    }
  }

  .app-popin-share__wrapper__item {
    a {
      padding: 22px 0;
      @include font-ITCFranklinGothicLT-DmCp();
      display: flex;
      cursor: pointer;
      text-transform: uppercase;

      p {
      }
    }
    svg {
      margin-right: 20px;
      path {
        fill: #000;
      }
    }
  }

  .app-popin-share__wrapper__title {
    margin-bottom: 64px;
    @include font-ITCFranklinGothicLT-DmCp();
    font-size: 34px;
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
    grid-column: 4 / span 7;
    position: relative;
    padding: desktop-vw(80px) desktop-vw(0px) desktop-vw(70px) desktop-vw(0px);
    background: linear-gradient(
        rgba(251, 245, 238, 0.8) 0.1em,
        transparent 0.1em
      ),
      linear-gradient(90deg, rgba(251, 245, 238, 0.8) 0.1em, transparent 0.1em),
      white;
    background-size: 1.3em 1.3em;
    z-index: 1;
    width: 400px;
    margin: 0 auto;
    transition: opacity 0.35s 0.25s var(--ease-in-out-cubic);

    @include mobile {
      grid-column: 1 / span 6;
      padding: mobile-vw(30px) mobile-vw(0px) mobile-vw(25px) mobile-vw(0px);
      aspect-ratio: 340 / 280;
      width: 90%;
      left: 0;
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
            width: 70% !important;
            left: 50%;
            top: 100%;
            transform: translate(-50%, -20%) !important;
          }
        }
      }
    }
  }

  &__close {
    position: absolute;
    top: 0;
    transform: translateY(-50%);
    padding: 10px 25px;
    background: var(--c-black);
    color: var(--c-grey);
    z-index: 10;
    display: block;
    @include font-ITCFranklinGothicLT-DmCp();
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
    margin-left: 6%;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    margin-top: desktop-vw(15px);

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
      @include font-ITCFranklinGothicLT-BkCp();
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
    width: 85%;
    position: relative;

    @include mobile {
      margin-top: mobile-vw(20px);
      display: flex;
      flex-flow: column wrap;
      width: 100%;
    }

    &.submited {
      .app-popin-share__form__field-mail,
      .app-popin-share__form__submit,
      .app-popin-share__accept-politic {
        opacity: 0;
        pointer-events: none;

        transition: opacity 0.35s var(--ease-in-out-cubic);
      }

      .app-popin-share__form__successful {
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
      @include font-ITCFranklinGothicLT-BkCp();
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

        .app-popin-share__form__submit__overlay {
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
