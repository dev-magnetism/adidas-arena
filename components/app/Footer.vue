<template>
  <div class="app-footer grid-inner" @mouseenter="onMouseEnterEl">
    <div class="app-footer__principal">
      <TH2
        tag="p"
        weight="bold"
        color="grey"
        class="app-footer__newsletter-title"
      >
        {{ contents.data.footer_title }}
      </TH2>
      <form
        :class="{ submited }"
        class="app-footer__newsletter"
        @submit.prevent="onSubmit"
      >
        <div class="app-footer__newsletter__successful">
          <TH2 tag="p" weight="bold" color="red-adidas">
            {{ appContent.data.newsletter_big_text }}
          </TH2>
          <TH4 tag="p" color="white">{{ appContent.data.newsletter_text }}</TH4>
        </div>
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
          aria-label="footer-newsletter-submit"
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
            id="accept-politic-footer"
            v-model="accept"
            type="checkbox"
            required
          />
          <label for="accept-politic-footer">
            <TP2 color="grey">
              J’accepte la
              <nuxt-link to="/politique-de-confidentialite">
                politique de confidentialité
              </nuxt-link>
            </TP2>
          </label>
          <span class="checkmark" />
        </div>
      </form>
      <div class="app-footer__links">
        <SvgArenaLogoFooter class="app-footer__logo" />
        <div class="app-footer__links__ul first-column">
          <AtomsLink
            v-for="(item, index) in contents.data.app_footer_links_left"
            :key="index"
            :href="item.app_footer_links_left_link"
          >
            <TP2 color="grey" weight="bold">
              {{ item.app_footer_links_left_text }}
            </TP2>
          </AtomsLink>
        </div>
        <div class="app-footer__links__ul second-column">
          <AtomsLink
            v-for="(item, index) in contents.data.app_footer_links_right"
            :key="index"
            :href="item.app_footer_links_right_link"
          >
            <TP2 color="grey" weight="bold">
              {{ item.app_footer_links_right_text }}
            </TP2>
          </AtomsLink>
        </div>
      </div>
      <div class="app-footer__social-networks">
        <a
          v-if="contents.data.social_networks_instagram_link"
          :href="contents.data.social_networks_instagram_link"
          target="_blank"
          class="app-footer__social-network"
        >
          <SvgFooterInstagram />
        </a>
        <a
          v-if="contents.data.social_networks_tiktok_link"
          :href="contents.data.social_networks_tiktok_link"
          target="_blank"
          class="app-footer__social-network"
        >
          <SvgFooterTiktok />
        </a>
        <a
          v-if="contents.data.social_networks_twitter_link"
          :href="contents.data.social_networks_twitter_link"
          target="_blank"
          class="app-footer__social-network"
        >
          <SvgFooterTwitter />
        </a>
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
      </div>
    </div>
    <div class="app-footer__partners">
      <TH2
        tag="p"
        weight="bold"
        color="grey"
        class="app-footer__partners-title"
      >
        NOS PARTENAIRES
      </TH2>
      <EGridLogosFooter :contents="logos" />
      <div class="app-footer__paris-e-c">
        <a
          class="app-footer__paris-e-c__inner"
          href="https://parisentertainmentcompany.com/"
          target="_blank"
        >
          <TP2 color="white">
            L’adidas arena est une salle du groupe Paris Entertainment Company.
          </TP2>
          <div class="app-footer__paris-e-c__logo">
            <SvgParisEC />
          </div>
        </a>
      </div>
    </div>
    <div class="app-footer__bottom">
      <TP2 color="grey">
        ©{{ new Date().getFullYear() }} -
        {{ contents.data.footer_all_rights_reserved }}
      </TP2>
      <AtomsLink :href="contents.data.footer_cookies_link">
        <TP2 color="grey"> {{ contents.data.footer_cookies_title }}</TP2>
      </AtomsLink>
      <AtomsLink :href="contents.data.footer_mentions_legales_link">
        <TP2 color="grey">
          {{ contents.data.footer_mentions_legales_title }}
        </TP2>
      </AtomsLink>
    </div>
  </div>
</template>

<script>
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { mapMutations, mapState } from 'vuex'

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
    this.$nuxt.$on(
      'global:forceInitScrollTrigger',
      this.onForceInitScrollTrigger
    )

    this.initScrollTrigger()

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
    this.tl?.clear()
    this.tl?.kill()

    this.$nuxt.$off(
      'global:forceInitScrollTrigger',
      this.onForceInitScrollTrigger
    )

    this.scrollTrigger?.kill()
  },
  methods: {
    onForceInitScrollTrigger() {
      this.scrollTrigger?.kill()
      this.initScrollTrigger()
    },
    initScrollTrigger() {
      this.scrollTrigger = ScrollTrigger.create({
        trigger: this.$el,
        start: 'top-=7.5% top',
        onToggle: (self) => this.setHeaderWhite(self.isActive),
      })
    },
    onMouseEnterEl() {
      this.setCursorState('hide')
      this.setAppCursor('initial')
    },
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
    ...mapMutations({
      setHeaderWhite: 'setHeaderWhite',
      setCursorState: 'setCursorState',
      setAppCursor: 'setAppCursor',
    }),
  },
}
</script>

<style lang="scss">
.app-footer {
  padding-top: desktop-vw(95px);
  padding-bottom: desktop-vw(40px);
  background: var(--c-black);
  position: relative;
  width: 100vw;
  overflow: hidden;

  @include mobile {
    padding-top: mobile-vw(60px);
    padding-bottom: mobile-vw(15px);
  }

  &__bottom {
    display: flex;
    grid-column: 1 / span 12;
    margin-left: auto;
    margin-top: desktop-vw(100px);
    z-index: 1;

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
        font-size: 14px;

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
    position: relative;

    &.submited {
      .app-footer__newsletter__field-mail,
      .app-footer__newsletter__submit,
      .app-footer__newsletter__accept-politic {
        opacity: 0;
        pointer-events: none;

        transition: opacity 0.35s var(--ease-in-out-cubic);
      }

      .app-footer__newsletter__successful {
        opacity: 1;
        pointer-events: all;
      }
    }

    &__successful {
      position: absolute;
      text-align: center;
      left: 0;
      top: 0;
      opacity: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: opacity 0.35s 0.35s var(--ease-in-out-cubic);
      pointer-events: none;

      .H4 {
        align-self: flex-end;
        margin-left: 10px;
      }
    }

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
                transform: translate(-50%, -50%) scale(0.35);
              }
            }
          }
        }
      }

      &.valid {
        .P2 {
          color: rgba(245, 245, 243, 1) !important;
        }
      }

      .P2 {
        font-size: desktop-vw(16px);
        line-height: desktop-vw(21px);
        color: var(--c-grey);
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
        border: 1px solid var(--c-grey);
        pointer-events: none;
        cursor: pointer;

        &::after {
          content: '';
          width: 75%;
          height: 75%;
          background: var(--c-grey);
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
      color: var(--c-grey);

      @include mobile {
        width: calc(80% - (mobile-vw(20px)));
        font-size: mobile-vw(40px);
        line-height: mobile-vw(50px);
        @include font-adihausDIN-cn-medium();
      }

      &::placeholder {
        color: rgba(245, 245, 243, 0.25);
      }
    }

    &__submit {
      outline: 1px solid rgba(245, 245, 243, 0.25);
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

        @include mobile {
          padding: mobile-vw(15px);
        }
      }
    }
  }

  &__principal {
    grid-column: 1 / span 6;
    z-index: 1;

    @include mobile {
      grid-column: 1 / span 6;
    }
  }

  &__links {
    display: flex;
    flex-direction: row;
    margin-top: desktop-vw(95px);

    @include mobile {
      margin-top: mobile-vw(50px);
      flex-flow: row wrap;
    }

    &__ul {
      display: flex;
      flex-direction: column;

      @include mobile {
        flex: 0 0 50%;
      }

      .P2 {
        @include font-adihausDIN-cn-bold();
        text-transform: uppercase;
        display: inline-block;
        letter-spacing: 0.04em;
      }

      &:first-of-type {
        margin-right: desktop-vw(70px);

        @include mobile {
          margin-right: 0px;
        }
      }

      .app-atoms-link {
        &.nuxt-link-exact-active.nuxt-link-active {
          &::after {
            --scale: 1;
          }
        }
      }

      a:not(:first-child) {
        margin-top: desktop-vw(6px);

        @include mobile {
          margin-top: mobile-vw(10px);
        }
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
    border-top: 1px solid var(--c-grey);
    border-left: 1px solid var(--c-grey);
    border-bottom: 1px solid var(--c-grey);
    cursor: pointer;
    position: relative;

    svg {
      z-index: 1;

      path {
        // transition: fill 0.25s 0.1s var(--ease-out-expo);
      }
    }

    @include hover {
      &:hover {
        &::after {
          transform: scaleY(1);
        }
        svg {
          path {
            fill: var(--c-black);
          }
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
      background: var(--c-grey);
      transform-origin: top center;
      transform: scaleY(0);
      transition: transform 0.65s var(--ease-out-expo);
    }

    &:last-child {
      border-left: 1px solid var(--c-grey);
      border-right: 1px solid var(--c-grey);
    }
  }

  &__partners {
    grid-column: 8 / span 5;
    z-index: 1;
    display: flex;
    flex-direction: column;
    position: relative;

    @include mobile {
      grid-column: 1 / span 6;
      margin-top: mobile-vw(50px);
    }
  }

  &__paris-e-c {
    margin-top: auto;
    outline: 1px solid white;
    display: flex;
    width: 80%;
    flex-direction: row;
    cursor: pointer;

    @include mobile {
      width: 100%;
      margin-top: mobile-vw(40px);
    }

    &__inner {
      flex-direction: row;
      display: flex;
    }

    .P2,
    &__logo {
      flex: 50%;
      // padding: 0 desktop-vw(15px);
    }

    .P2 {
      padding: desktop-vw(20px) desktop-vw(15px);
      text-transform: uppercase;
      @include font-adihausDIN();

      @include mobile {
        padding: mobile-vw(15px) mobile-vw(15px);
        font-size: mobile-vw(12px);
        line-height: mobile-vw(18px);
      }
    }

    &__logo {
      background: var(--c-grey);
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

      svg {
        width: auto;
        height: 65%;

        @include mobile {
          width: auto;
          height: 45%;
        }
      }
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
  &__logo {
    margin-right: desktop-vw(100px);

    @include mobile {
      margin-bottom: mobile-vw(30px);
    }
  }
  &__links-title.P2 {
    font-size: desktop-vw(26px);
    line-height: desktop-vw(33px);
    margin-right: desktop-vw(100px);
    @include font-adihausDIN-cn-bold();
    display: none;

    @include mobile {
      display: block;
    }

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

  &__brush {
    position: absolute;
    bottom: 0;
    left: -2.5%;
    z-index: 0;
    width: 70%;
    height: auto;
    pointer-events: none;

    @include mobile {
      display: none;
    }
  }
  &__brush-mobile {
    position: absolute;
    bottom: -17.5%;
    left: 0;
    width: 100%;
    height: auto;
    pointer-events: none;
    display: none;

    @include mobile {
      display: block;
    }
  }
}
</style>
