<template>
  <div class="app-footer grid-inner">
    <div class="app-footer__principal">
      <TH2 class="app-footer__newsletter-title">
        {{ contents.data.footer_title }}
      </TH2>
      <form id="form1" action="#" class="app-footer__newsletter">
        <input
          v-model="email"
          class="app-footer__newsletter__field-mail"
          :placeholder="contents.data.footer_input_placeholder"
          type="email"
          name="name"
          required
        />
        <button
          :class="{ valid: validateForm }"
          class="app-footer__newsletter__submit"
          type="submit"
          @mouseenter="onMouseEnter"
          @mouseleave="onMouseLeave"
        >
          <span class="app-footer__newsletter__submit__overlay" />
          <SvgFooterUnion ref="union" />
        </button>

        <div
          :class="{ valid: accept }"
          class="app-footer__newsletter__accept-politic"
        >
          <input
            id="accept-politic"
            v-model="accept"
            type="checkbox"
            required
          />
          <label for="accept-politic">
            <TP2>
              J’accepte la
              <a href="https://www.magnetism.fr/" :blank="true">
                politique de confidentialité
              </a>
            </TP2>
          </label>
          <span class="checkmark" />
        </div>
      </form>
      <div class="app-footer__links">
        <TP2 weight="bold" class="app-footer__links-title"> ADIDAS ARENA </TP2>
        <div class="app-footer__links__ul first-column">
          <AtomsLink
            v-for="(item, index) in contents.data.app_footer_links_left"
            :key="index"
            :href="item.app_footer_links_left_link"
            :external="false"
          >
            <TP2 weight="bold">
              {{ item.app_footer_links_left_text }}
            </TP2>
          </AtomsLink>
        </div>
        <ul class="app-footer__links__ul second-column">
          <AtomsLink
            v-for="(item, index) in contents.data.app_footer_links_right"
            :key="index"
            :href="item.app_footer_links_right_link"
            :external="false"
          >
            <TP2 weight="bold">
              {{ item.app_footer_links_right_text }}
            </TP2>
          </AtomsLink>
        </ul>
      </div>
      <div class="app-footer__social-networks">
        <a
          v-if="contents.data.social_networks_facebook_link"
          :href="contents.data.social_networks_facebook_link"
          target="_blank"
          class="app-footer__social-network"
        >
          <SvgFooterFacebook />
        </a>
        <a
          v-if="contents.data.social_networks_linkedin_link"
          :href="contents.data.social_networks_linkedin_link"
          target="_blank"
          class="app-footer__social-network"
        >
          <SvgFooterLinkedin />
        </a>
        <a
          v-if="contents.data.social_networks_instagram_link"
          :href="contents.data.social_networks_instagram_link"
          target="_blank"
          class="app-footer__social-network"
        >
          <SvgFooterInstagram />
        </a>
        <a
          v-if="contents.data.social_networks_twitter_link"
          :href="contents.data.social_networks_twitter_link"
          target="_blank"
          class="app-footer__social-network"
        >
          <SvgFooterTwitter />
        </a>
      </div>
    </div>
    <div class="app-footer__partners">
      <TH2 class="app-footer__partners-title"> NOS PARTENAIREs </TH2>
      <EGridLogosFooter :contents="logos" />
    </div>
    <div class="app-footer__bottom">
      <TP2> ©2022 - Tous droits réservés</TP2>
      <AtomsLink href="#" :external="false">
        <TP2> Cookies</TP2>
      </AtomsLink>
      <AtomsLink href="#" :external="false">
        <TP2> Mentions légales</TP2>
      </AtomsLink>
    </div>
  </div>
</template>

<script>
import { gsap } from 'gsap'

export default {
  props: {
    contents: {
      type: Object,
      default: () => {},
    },
    logos: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      email: '',
      accept: false,
    }
  },
  computed: {
    validateForm() {
      /* eslint-disable-next-line */ const reg =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/

      return reg.test(this.email) && this.accept
    },
  },
  mounted() {
    console.log('logos', this.logos)
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
.app-footer {
  padding-top: desktop-vw(95px);
  padding-bottom: desktop-vw(40px);
  background: var(--c-red-adidas);
  background-image: url('/imgs/footer/background.webp');
  background-repeat: no-repeat;
  background-size: 85% auto;
  background-position: right bottom;

  @include mobile {
    padding-top: mobile-vw(60px);
    padding-bottom: mobile-vw(15px);
  }

  &__bottom {
    display: flex;
    grid-column: 1 / span 12;
    margin-left: auto;
    margin-top: desktop-vw(100px);

    @include mobile {
      grid-column: 1 / span 6;
      justify-content: space-between;
      margin-left: initial;
    }

    a {
      margin-left: desktop-vw(50px);
    }

    .P2 {
      @include font-adihausDIN-cn();
      letter-spacing: -0.04em;
      text-transform: uppercase;

      @include mobile {
        &:nth-child(1),
        &:nth-child(3) {
          flex: 2;
        }
        &:nth-child(2) {
          flex: 1;
          text-align: center;
        }

        &:nth-child(3) {
          text-align: right;
        }
      }
    }
  }

  &__newsletter {
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    margin-top: desktop-vw(10px);

    @include mobile {
      margin-top: mobile-vw(20px);
      justify-content: space-between;
    }

    &__accept-politic {
      flex-basis: 100%;
      display: flex;
      align-items: center;
      position: relative;
      padding-left: desktop-vw(25px);
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      margin-top: desktop-vw(10px);

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
                transform: translate(-50%, -50%) scale(0.5);
              }
            }
          }
        }
      }

      &.valid {
        .P2 {
          color: rgba(24, 24, 24, 1) !important;
        }
      }

      .P2 {
        font-size: desktop-vw(16px);
        line-height: desktop-vw(21px);
        color: rgba(24, 24, 24, 0.25) !important;
        cursor: pointer;
        transition: color 0.4s var(--ease-out-cubic);

        @include mobile {
          font-size: mobile-vw(14px);
          line-height: mobile-vw(16px);
        }
      }

      a {
        text-decoration: underline;
        color: rgba(24, 24, 24, 1);
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

    &__field-mail {
      @include font-adihausDIN-cn-medium();
      text-transform: uppercase;
      font-size: desktop-vw(82px);
      line-height: desktop-vw(106px);
      letter-spacing: -0.04em;
      width: calc(100% - (desktop-vw(90px) + 60px));

      @include mobile {
        width: calc(80% - (mobile-vw(20px)));
        font-size: mobile-vw(40px);
        line-height: mobile-vw(50px);
        @include font-adihausDIN-cn-medium();
      }

      &::placeholder {
        color: rgba(24, 24, 24, 0.25);
      }
    }

    &__submit {
      outline: 1px solid rgb(24 24 24 / 25%);
      width: desktop-vw(56px);
      height: desktop-vw(56px);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: desktop-vw(30px);
      cursor: pointer;
      align-self: center;
      position: relative;
      cursor: not-allowed;
      overflow: hidden;

      @include mobile {
        width: mobile-vw(56px);
        height: mobile-vw(56px);
        margin-left: mobile-vw(10px);
      }

      &.valid {
        cursor: pointer;

        .app-footer__newsletter__submit__overlay {
          transform: scaleY(1);
        }

        svg {
          opacity: 1;

          path {
            fill: var(--c-red-adidas);
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

        @include mobile {
          padding: mobile-vw(15px);
        }
      }
    }
  }

  &__principal {
    grid-column: 1 / span 6;

    @include mobile {
      grid-column: 1 / span 6;
    }
  }

  &__links {
    display: flex;
    flex-direction: row;
    margin-top: desktop-vw(95px);

    @include mobile {
      margin-top: mobile-vw(60px);
      flex-flow: row wrap;
    }

    &__ul {
      display: flex;
      flex-direction: column;

      &:not(:last-child) {
        @include mobile {
          margin-right: mobile-vw(70px) !important;
        }
      }

      @include mobile {
        // width: 50%;
      }

      .P2 {
        @include font-adihausDIN-cn-bold();
        text-transform: uppercase;
        display: inline-block;
      }

      &:first-of-type {
        margin-right: 70px;

        @include mobile {
          margin-right: 0px;
        }
      }

      a:not(:first-child) {
        margin-top: desktop-vw(6px);
      }
    }
  }

  &__social-networks {
    display: flex;
    margin-top: desktop-vw(120px);

    @include mobile {
      margin-top: mobile-vw(55px);
    }
  }

  &__social-network {
    width: 56px;
    height: 56px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-top: 1px solid var(--c-black);
    border-left: 1px solid var(--c-black);
    border-bottom: 1px solid var(--c-black);
    cursor: pointer;
    position: relative;

    svg {
      z-index: 1;

      path {
        // transition: fill 0.25s 0.1s var(--ease-out-expo);
      }
    }

    &:hover {
      &::after {
        transform: scaleY(1);
      }
      svg {
        path {
          fill: var(--c-red-adidas);
        }
      }
    }

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: var(--c-black);
      transform-origin: top center;
      transform: scaleY(0);
      transition: transform 0.65s var(--ease-out-expo);
    }

    &:last-child {
      border-left: 1px solid var(--c-black);
      border-right: 1px solid var(--c-black);
    }
  }

  &__partners {
    grid-column: 8 / span 5;

    @include mobile {
      grid-column: 1 / span 6;
      margin-top: mobile-vw(50px);
    }
  }

  &__partners-title.H2 {
    font-size: desktop-vw(32px);
    line-height: desktop-vw(40px);

    @include mobile {
      font-size: mobile-vw(32px);
      line-height: mobile-vw(40px);
      margin-bottom: mobile-vw(40px);
    }
  }
  &__links-title.P2 {
    font-size: desktop-vw(26px);
    line-height: desktop-vw(33px);
    margin-right: desktop-vw(100px);
    @include font-adihausDIN-cn-bold();

    @include mobile {
      margin-right: 0px;
      margin-bottom: mobile-vw(20px);
      width: 100%;
      font-size: mobile-vw(26px);
      line-height: mobile-vw(24px);
    }
  }

  &__newsletter-title.H2 {
    font-size: desktop-vw(32px);
    line-height: desktop-vw(40px);

    @include mobile {
      font-size: mobile-vw(32px);
      line-height: mobile-vw(40px);
    }
  }
}
</style>
