<template>
  <div
    class="app-header-shell"
    :class="{
      'app-header-shell--announcement-collapsed':
        hasAnnouncement && !bannerAtTop,
    }"
  >
    <div
      v-if="hasAnnouncement"
      class="app-header__announcement"
      role="region"
      aria-label="Annonce"
    >
      <div class="app-header__announcement__inner">
        <TP2
          weight="bold"
          color="white"
          class="app-header__announcement__text app-header__announcement__text--lead"
        >
          {{ announcementText }}<a
            v-if="showAnnouncementCta && announcementCtaIsExternal"
            :href="announcementCtaLink"
            class="app-header__announcement__cta"
            target="_blank"
            rel="noopener noreferrer"
          >{{ announcementCtaLabel }}</a><nuxt-link
            v-else-if="showAnnouncementCta"
            :to="announcementCtaLink"
            class="app-header__announcement__cta"
            target="_blank"
            rel="noopener noreferrer"
          >{{ announcementCtaLabel }}</nuxt-link>
        </TP2>
      </div>
    </div>

    <div
      ref="headerRow"
      class="app-header"
      :class="{
        reduced: headerReduced,
        hide: headerHide || overlayContactOpen,
      }"
      @click.stop="() => {}"
    >
      <a
        v-if="this.webview !== 'ok'"
        :class="{ reduced: headerReduced, white: headerWhite }"
        class="app-header__logo"
        href="/"
      >
        <TH1 :tag="$route.name === 'index' ? 'h1' : 'p'">Adidas Arena</TH1>
        <SvgArenaLogo />
      </a>

      <div
        v-else
        :class="{ reduced: headerReduced, white: headerWhite }"
        class="app-header__logo"
      >
        <TH1 :tag="$route.name === 'index' ? 'h1' : 'p'">Adidas Arena</TH1>
        <SvgArenaLogo />
      </div>

      <div v-if="this.webview !== 'ok'" class="app-header__nav">
        <nuxt-link
          :class="{ reduced: headerReduced, white: headerWhite }"
          class="pbb"
          to="/paris-basketball"
        >
          <img
            v-if="headerWhite"
            src="/imgs/logo-pbb-white.svg"
            alt="Paris Basketball"
          />
          <img v-else src="/imgs/logo-pbb-color.svg" alt="Paris Basketball" />
        </nuxt-link>
        <nuxt-link
          v-for="(item, i) in navItems"
          :key="i"
          :class="{ reduced: headerReduced, white: headerWhite }"
          :to="item.Link"
        >
          <TP1 weight="bold" :color="headerWhite ? 'grey' : 'black'">
            {{ item.Label }}
          </TP1>
        </nuxt-link>
      </div>

      <div
        v-if="this.webview !== 'ok'"
        :class="{ reduced: headerReduced, white: headerWhite }"
        class="app-header__burger"
        @click="setMenuActive(true)"
      >
        <TP1
          weight="bold"
          class="app-header__burger__menu"
          :color="headerWhite ? 'grey' : 'black'"
        >
          {{ menuName }}
        </TP1>
        <div class="app-header__burger__icon" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const validUrl = require('valid-url')

export default {
  data() {
    return {
      bannerAtTop: true,
      viewportMobile: false,
    }
  },
  computed: {
    ...mapState({
      menuContent: (state) => state.menuContent,
      menuActive: (state) => state.menuActive,
      appContent: (state) => state.appContent,
      headerReduced: (state) => state.headerReduced,
      headerWhite: (state) => state.headerWhite,
      headerHide: (state) => state.headerHide,
      overlayContactOpen: (state) => state.overlayContactOpen,
      interiorVisible: (state) => state.interiorVisible,
      exteriorVisible: (state) => state.exteriorVisible,
      webview: (state) => state.webview,
    }),
    menuName() {
      return this.appContent.data.menu_name
    },
    menuBusiness() {
      return this.menuContent.data.find((el) => el.business)
    },
    menuProgrammation() {
      return this.menuContent.data.find((el) => el.programmation)
    },
    navItems() {
      return this.appContent.data.header_nav
    },
    headerNameMobile() {
      return this.appContent.data.header_name_mobile
    },
    announcementBodyDesktop() {
      const t = this.appContent?.data?.header_announcement_text
      return typeof t === 'string' ? t.trim() : ''
    },
    announcementBodyMobile() {
      const t = this.appContent?.data?.header_announcement_text_mobile
      return typeof t === 'string' ? t.trim() : ''
    },
    announcementText() {
      const desktop = this.announcementBodyDesktop
      const mobile = this.announcementBodyMobile
      if (this.viewportMobile && mobile.length > 0) return mobile
      if (desktop.length > 0) return desktop
      return mobile
    },
    announcementEnabled() {
      const v = this.appContent?.data?.header_announcement_enabled
      if (v === false || v === 0 || v === '0' || v === 'false') return false
      return true
    },
    hasAnnouncement() {
      if (!this.announcementEnabled) return false
      return (
        this.announcementBodyDesktop.length > 0 ||
        this.announcementBodyMobile.length > 0
      )
    },
    announcementCtaLabel() {
      const t = this.appContent?.data?.header_announcement_cta_label
      return typeof t === 'string' ? t.trim() : ''
    },
    announcementCtaLink() {
      const t = this.appContent?.data?.header_announcement_cta_link
      return typeof t === 'string' ? t.trim() : ''
    },
    showAnnouncementCta() {
      return (
        this.announcementCtaLabel.length > 0 &&
        this.announcementCtaLink.length > 0
      )
    },
    announcementCtaIsExternal() {
      const href = this.announcementCtaLink
      if (!href) return false
      return validUrl.isUri(href)
    },
  },

  created() {
    if (process.client && this.$viewport) {
      this.syncViewportMobile()
    }
  },

  mounted() {
    this.syncViewportMobile()
    if (this.$viewport?.events) {
      this.$viewport.events.on('resize', this.syncViewportMobile)
    }

    this.$nuxt.$on(
      'global:forceInitScrollTrigger',
      this.onForceInitScrollTrigger
    )
    this.$nuxt.$on('app:scroll', this.onAppScroll)

    window.addEventListener('scroll', this.onWindowScroll, { passive: true })
    this.updateBannerFromScroll()

    this.initScrollTrigger()
  },
  beforeDestroy() {
    if (this.$viewport?.events) {
      this.$viewport.events.off('resize', this.syncViewportMobile)
    }

    this.$nuxt.$off(
      'global:forceInitScrollTrigger',
      this.onForceInitScrollTrigger
    )
    this.$nuxt.$off('app:scroll', this.onAppScroll)

    window.removeEventListener('scroll', this.onWindowScroll)

    this.scrollTrigger?.kill()
  },
  methods: {
    syncViewportMobile() {
      if (!this.$viewport || this.$viewport.isMobile == null) return
      this.viewportMobile = Boolean(this.$viewport.isMobile)
    },
    onAppScroll() {
      this.updateBannerFromScroll()
    },
    onWindowScroll() {
      this.updateBannerFromScroll()
    },
    updateBannerFromScroll() {
      const y = window.lenis?.scroll ?? window.scrollY ?? 0
      this.bannerAtTop = y < 12
    },
    onForceInitScrollTrigger() {
      this.scrollTrigger?.kill()
      this.initScrollTrigger()
    },
    initScrollTrigger() {
      const trigger = this.$refs.headerRow || this.$el
      this.scrollTrigger = ScrollTrigger.create({
        trigger,
        start: 'top+=20px top',
        end: 'max',
        fastScrollEnd: true,
        onEnter: (e) => {
          this.setHeaderReduced(true)
        },
        onLeaveBack: (e) => {
          this.setHeaderReduced(false)
        },
      })
    },
    ...mapMutations({
      setMenuActive: 'setMenuActive',
      setHeaderReduced: 'setHeaderReduced',
    }),
  },
}
</script>

<style lang="scss">
.app-header-shell {
  pointer-events: none;

  > * {
    pointer-events: auto;
  }
}

.app-header__announcement {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  box-sizing: border-box;
  height: 32.5px;
  max-height: 32.5px;
  padding: 0 desktop-vw(20px);
  background-color: var(--c-blue-adidas);
  color: var(--c-white);
  transition: max-height 0.45s var(--ease-out-cubic),
    height 0.45s var(--ease-out-cubic),
    opacity 0.35s var(--ease-in-out-cubic), padding 0.35s var(--ease-in-out-cubic);
  overflow: hidden;

  &__inner {
    display: block;
    max-width: 95%;
    margin: 0 auto;
    text-align: center;
    min-width: 0;
    white-space: nowrap;

    @include mobile {
      white-space: normal;
      max-width: 100%;
      overflow-wrap: anywhere;
    }
  }

  &__cta {
    display: inline;
    margin-left: 0.35em;
    vertical-align: baseline;
    color: inherit !important;
    text-decoration-line: underline;
    text-decoration-style: solid;
    text-decoration-color: currentColor;
    text-underline-offset: 0.12em;
    text-decoration-thickness: 1px;
    text-decoration-skip-ink: auto;
    white-space: nowrap;
  }

  @include mobile {
    height: auto;
    max-height: 88px;
    padding: mobile-vw(6px) var(--layout-margin);
  }

  &__text.P2 {
    font-size: desktop-vw(13px);
    line-height: 1.3;
    max-width: 90%;
    color: #ffffff !important;

    @include mobile {
      font-size: mobile-vw(12px);
      max-width: 100%;
    }
  }

  &__text--lead.P2 {
    display: inline-block;
    max-width: min(70vw, 42rem);
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    vertical-align: top;
    text-align: center;

    @include mobile {
      display: block;
      max-width: 100%;
      overflow: visible;
      text-overflow: unset;
      white-space: normal;
    }
  }
}

.app-header-shell--announcement-collapsed .app-header__announcement {
  max-height: 0;
  height: 0;
  opacity: 0;
  padding-top: 0;
  padding-bottom: 0;
  pointer-events: none;

  @include mobile {
    height: 0;
  }
}

.app-header {
  position: fixed;
  top: 60px;
  left: 50%;
  display: flex;
  width: 50%;
  justify-content: space-between;
  transition: transform 0.65s var(--ease-out-cubic),
    opacity 0.35s 0.4s var(--ease-in-out-cubic), top 0.45s var(--ease-out-cubic);
  will-change: transform;
  z-index: 3;
  height: 40px;

  @include mobile {
    top: mobile-vw(25px);
  }

  &.reduced {
    transform: translate(0%, -40px);

    @include mobile {
      transform: translate(0%, 0%);
    }
  }

  &.hide {
    transition-delay: 0s;
    opacity: 0;
    pointer-events: none;
  }

  &__nav {
    margin-left: auto;
    margin-right: desktop-vw(25px);
    align-self: center;
    cursor: pointer;
    display: flex;
    gap: desktop-vw(25px);
    align-items: center;

    @include mobile {
      display: none;
    }

    .pbb {
      width: 3rem;
    }

    .P1.bold {
      font-size: 16px;
      line-height: 16px;
      text-transform: uppercase;
      transition: color 0.4s var(--ease-out-cubic);
      user-select: none;
    }
  }

  &__logo {
    z-index: 2;
    transform: translateX(-50%);

    h1,
    p {
      position: absolute;
      pointer-events: none;
      opacity: 0;
    }

    &.white {
      svg g {
        fill: #f5f5f3;
      }
    }

    svg {
      cursor: pointer;

      g {
        transition: fill 0.4s var(--ease-out-cubic);
      }

      @include mobile {
        width: 100%;
        display: block;
      }
    }
  }
  &__burger {
    z-index: 2;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    margin-right: desktop-vw(60px);
    align-self: center;

    @include mobile {
      margin-right: calc(var(--layout-margin) + 10px);
    }

    &.white {
      .app-header__burger__icon::after,
      .app-header__burger__icon::before {
        background-color: var(--c-grey);
      }
    }

    &__menu.P1 {
      font-size: 16px;
      line-height: 16px;
      text-transform: uppercase;
      margin-right: 20px;
      transition: color 0.4s var(--ease-out-cubic);
      user-select: none;

      @include mobile {
        display: none;
      }
    }

    &__icon {
      display: flex;
      justify-content: center;
      align-items: center;
      outline: none;
      height: 20px;
      width: 30px;
      border: 0px;
      padding: 0px;
      background-color: transparent;

      &:before,
      &:after {
        content: '';
        width: 30px;
        height: 2px;
        position: absolute;
        background-color: black;
        transition: background-color 0.4s var(--ease-out-cubic);
      }

      &:before {
        transform: translateY(-4px);
      }

      &:after {
        transform: translateY(4px);
      }
    }
  }
}
</style>
