<template>
  <div
    :class="{
      'pointer-events': pointerEventsActivated,
    }"
    class="app-menu"
  >
    <div ref="layerRed" class="app-menu__layer red" />
    <div ref="layerBlue" class="app-menu__layer blue" />

    <div ref="cta" class="app-menu__cta" @click="onCloseBurger">
      <TP1 v-if="!$viewport.isMobile" weight="bold" class="app-menu__cta__menu">
        {{ menuCloseName }}
      </TP1>
      <div
        class="app-menu__cta__burger"
        :class="{ active: burgerCloseActivated }"
      >
        <span class="app-menu__cta__burger__line top" />
        <span class="app-menu__cta__burger__line bottom" />
      </div>
    </div>

    <div class="app-menu__inner">
      <div ref="visual" class="app-menu__visual">
        <transition-group name="menu-visual">
          <nuxt-img
            v-for="(item, index) in menuVisuals"
            v-show="indexImageVisible === index"
            :key="`menu-visual-${index}`"
            alt="red"
            :src="item.image"
            provider="directus"
          />
        </transition-group>
      </div>
      <div class="app-menu__content">
        <span
          ref="contentBorderLeft"
          class="app-menu__border-left menu-border-left"
        />
        <div class="app-menu__title">
          <TH1 ref="menuTitle">{{ menuName }} </TH1>
        </div>
        <div class="app-menu__principal">
          <div
            v-for="(item, index) in menu"
            :key="index"
            ref="linkPrincipal"
            class="app-menu__link"
          >
            <span class="app-menu__link__border-top" />
            <div class="app-menu__link__title principal">
              <TH2
                v-if="!item.submenu_title"
                class="menu-principal-title"
                @mouseenter.native="onLinkSelected('principal', index)"
                @mouseleave.native="onLinkUnselected('principal', index)"
              >
                <nuxt-link :to="item.url">{{ item.name }}</nuxt-link>
              </TH2>
              <TH2
                v-if="item.submenu_title"
                class="menu-principal-title"
                @click.native="onToggleSubmenu"
                @mouseenter.native="onLinkSelected('principal', index)"
                @mouseleave.native="onLinkUnselected('principal', index)"
              >
                {{ item.name }}
              </TH2>
              <div
                v-if="item.submenu_title"
                ref="buttonSubmenu"
                class="app-menu__link__button-submenu"
                @click="onToggleSubmenu"
              >
                <div
                  ref="submenuCross"
                  class="app-menu__link__button-submenu__inner"
                >
                  <span
                    class="app-menu__link__button-submenu__line horizontally"
                  />
                  <span
                    class="app-menu__link__button-submenu__line vertically"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          :class="{ 'pointer-events': submenuActive }"
          class="app-menu__submenu"
        >
          <div
            v-for="(item, index) in submenu"
            :key="index"
            ref="linkSubmenu"
            class="app-menu__link"
          >
            <div class="app-menu__link__title">
              <TH2
                class="menu-submenu-title"
                @mouseenter.native="onLinkSelected('submenu', index)"
                @mouseleave.native="onLinkUnselected('submenu', index)"
              >
                <nuxt-link :to="item.url">{{ item.name }}</nuxt-link>
              </TH2>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'
import { mapState, mapMutations } from 'vuex'
import lottie from 'lottie-web'

export default {
  data() {
    return {
      submenuActive: false,
      pointerEventsActivated: false,
      burgerCloseActivated: false,
      indexLinkHovered: 0,
      indexImageVisible: 0,
      lottiesMenuPrincipal: [],
      lottiesMenuSubmenu: [],
      keyDown: false,
    }
  },
  computed: {
    ...mapState({
      menuActive: (state) => state.menuActive,
      menuContent: (state) => state.menuContent,
      appContent: (state) => state.appContent,
    }),
    menu() {
      return this.menuContent.data.filter(
        (el) => !el.submenu_element && !el.homepage
      )
    },
    menuVisuals() {
      return this.menuContent.data.filter((el) => !el.submenu_element)
    },
    submenu() {
      return this.menuContent.data.filter((el) => el.submenu_element)
    },
    menuName() {
      return this.appContent.data.menu_name
    },
    menuCloseName() {
      return this.appContent.data.menu_close_name
    },
  },
  watch: {
    menuActive(payload) {
      if (payload) {
        this.initMainTimeline()
      } else {
        this.burgerCloseActivated = false

        if (this.submenuActive) {
          this.initMainTimelineClosing()
        } else {
          if (this.activeLinkLocation === 'principal') {
            this.handleActiveLinkLottie('disappear')
          }

          this.tlMain?.reverse()
        }
      }
    },
  },

  mounted() {
    this.elsTopBorder = this.$el.querySelectorAll('.app-menu__link__border-top')

    this.elsMenuPrincipalTitleWrapper = this.$el.querySelectorAll(
      '.app-menu__link__title.principal'
    )

    this.elsMenuPrincipalTitle = this.$el.querySelectorAll(
      '.menu-principal-title'
    )
    this.elsMenuSubmenuTitle = this.$el.querySelectorAll('.menu-submenu-title')

    this.elTitleSubmenuWrapper =
      this.elsMenuPrincipalTitleWrapper[
        this.elsMenuPrincipalTitleWrapper.length - 1
      ]

    this.elTitleSubmenu =
      this.elsMenuPrincipalTitle[this.elsMenuPrincipalTitle.length - 1]

    this.elTitleTargetFlip = this.elsMenuPrincipalTitleWrapper[0]

    this.initLotties()
    this.getActiveLottie()

    this.$viewport.events.on('resize', this.onResize)

    this.$nuxt.$on('menu:reset', this.onResetMenu)

    window.addEventListener('keydown', this.onKeyDown)
    window.addEventListener('keyup', this.onKeyUp)
  },

  beforeDestroy() {
    this.$viewport.events.off('resize', this.onResize)

    this.$nuxt.$off('menu:reset', this.onResetMenu)

    window.removeEventListener('keydown', this.onKeyDown)
    window.removeEventListener('keyup', this.onKeyUp)
  },

  methods: {
    onKeyDown(e) {
      if (this.keyDown) return

      this.keyDown = true
    },
    onKeyUp(e) {
      if (!this.keyDown) return

      this.keyDown = false

      if (e.key === 'Escape') {
        this.onCloseBurger()
      }
    },
    onResize() {
      if (this.submenuActive)
        Flip.fit(this.elTitleSubmenuWrapper, this.elTitleTargetFlip)
    },
    initLotties() {
      const lottieCircle1 = require(`@/assets/lotties/Cercle_1.json`)
      const lottieCircle3 = require(`@/assets/lotties/Cercle_3.json`)

      this.$refs.linkPrincipal.forEach((el, index) => {
        if (this.menu[index].submenu) return

        const animationHover = lottie.loadAnimation({
          container: el,
          loop: false,
          autoplay: false,
          animationData: lottieCircle1,
        })

        const animationActive = lottie.loadAnimation({
          container: el,
          loop: false,
          autoplay: false,
          animationData: lottieCircle3,
        })

        this.lottiesMenuPrincipal.push({
          tweenEnter: null,
          tweenLeave: null,
          animation: { hover: animationHover, active: animationActive },
        })
      })

      this.$refs.linkSubmenu.forEach((el, index) => {
        if (this.menu[index].submenu) return

        const animationHover = lottie.loadAnimation({
          container: el,
          loop: false,
          autoplay: false,
          animationData: lottieCircle1,
        })

        const animationActive = lottie.loadAnimation({
          container: el,
          loop: false,
          autoplay: false,
          animationData: lottieCircle3,
        })

        this.lottiesMenuSubmenu.push({
          tweenEnter: null,
          tweenLeave: null,
          animation: { hover: animationHover, active: animationActive },
        })
      })
    },
    onLinkSelected(target, index) {
      if (target === 'principal') {
        this.indexLinkHovered =
          this.indexLinkHovered !== index ? index : this.indexLinkHovered

        this.indexImageVisible = this.indexLinkHovered + 1

        if (this.indexLinkHovered !== this.menu.length - 1) {
          this.appearLottieHovered(target, index)
        }
      } else {
        this.appearLottieHovered(target, index)
      }
    },
    onLinkUnselected(target, index) {
      if (target === 'principal') {
        this.indexLinkHovered = index

        this.indexImageVisible = this.indexLinkHovered + 1

        if (this.indexLinkHovered !== this.menu.length - 1) {
          this.disappearLottieHovered(target, index)
        }
      } else {
        this.disappearLottieHovered(target, index)
      }
    },
    appearLottieHovered(target, index) {
      if (
        (this.activeLinkIndex === index &&
          target === this.activeLinkLocation) ||
        this.$viewport.isMobile
      )
        return

      const playhead = { frame: 0 }

      let lottie

      if (target === 'principal') {
        this.lottiesMenuPrincipal[index].tweenLeave?.kill()
        lottie = this.lottiesMenuPrincipal[index].animation.hover
      } else {
        this.lottiesMenuSubmenu[index].tweenLeave?.kill()
        lottie = this.lottiesMenuSubmenu[index].animation.hover
      }

      const tween = gsap.to(playhead, {
        duration: 1,
        frame: lottie.totalFrames - 1,
        ease: 'power2.inOut',
        onUpdate: () => lottie.goToAndStop(playhead.frame, true),
      })

      if (target === 'principal') {
        this.lottiesMenuPrincipal[index].tweenEnter = tween
      } else {
        this.lottiesMenuSubmenu[index].tweenEnter = tween
      }
    },
    disappearLottieHovered(target, index) {
      if (
        (this.activeLinkIndex === index &&
          target === this.activeLinkLocation) ||
        this.$viewport.isMobile
      )
        return

      let lottie

      if (target === 'principal') {
        this.lottiesMenuPrincipal[index].tweenEnter?.kill()
        lottie = this.lottiesMenuPrincipal[index].animation.hover
      } else {
        this.lottiesMenuSubmenu[index].tweenEnter?.kill()
        lottie = this.lottiesMenuSubmenu[index].animation.hover
      }

      const playhead = { frame: lottie.currentFrame }

      const duration = gsap.utils.mapRange(
        0,
        lottie.totalFrames - 1,
        0,
        0.8,
        playhead.frame
      )

      const tween = gsap.to(playhead, {
        duration,
        frame: 0,
        ease: 'power1.inOut',
        onUpdate: () => lottie.goToAndStop(playhead.frame, true),
      })

      if (target === 'principal') {
        this.lottiesMenuPrincipal[index].tweenLeave = tween
      } else {
        this.lottiesMenuSubmenu[index].tweenLeave = tween
      }
    },
    initMainTimeline() {
      this.tlMain?.kill()
      this.tlMain?.clear()

      this.burgerCloseActivated = true
      this.pointerEventsActivated = true

      this.tlMain = gsap
        .timeline()
        .set(this.$el, {
          opacity: 1,
        })
        .to(this.$refs.layerBlue, {
          scaleY: 1,
          duration: 0.85,
          ease: 'power3.inOut',
        })
        .to(
          this.$refs.layerRed,
          {
            scaleY: 1,
            duration: 0.85,
            ease: 'power3.inOut',

            onReverseComplete: () => {
              this.pointerEventsActivated = false
            },
          },
          '<10%'
        )
        .set(this.$el, {
          backgroundColor: '#F5F5F3',
          opacity: 1,
        })
        .set(this.$refs.cta, {
          opacity: 1,
        })
        .to([this.$refs.layerRed, this.$refs.layerBlue], {
          scaleY: 0,
          duration: 0.6,

          transformOrigin: 'center bottom',
          ease: 'power3.inOut',
        })
        .addLabel('title', '<65%')
        .to(
          this.$refs.visual,
          {
            opacity: 1,
            delay: 0.035,
            duration: 0.7,
            ease: 'expo.out',
          },
          'title'
        )
        .to(
          this.$refs.visual,
          {
            y: 0,
            duration: 0.7,
            ease: 'expo.out',
          },
          'title'
        )
        .to(
          this.$refs.menuTitle.$el,
          {
            y: 0,
            duration: 0.65,
            ease: 'expo.out',
          },
          'title'
        )
        .to(
          this.$refs.contentBorderLeft,
          {
            scaleY: 1,
            duration: 1.5,
            ease: 'expo.out',
          },
          'title+=5%'
        )
        .to(
          this.elsTopBorder,
          {
            scaleX: 1,
            stagger: 0.15,
            duration: 1,
            ease: 'expo.out',
          },
          'title+=5%'
        )
        .to(
          this.elsMenuPrincipalTitle,
          {
            y: 0,
            stagger: 0.15,
            duration: 0.75,
            ease: 'expo.out',
          },
          'title+=8.5%'
        )
        .to(
          this.$refs.buttonSubmenu,
          {
            y: 0,
            duration: 0.75,
            ease: 'expo.out',
            onStart: () => {
              if (this.activeLinkLocation !== 'principal') return

              this.handleActiveLinkLottie('appear')
            },
          },
          '<40%'
        )
    },
    initMainTimelineClosing() {
      this.tlMainClose?.kill()
      this.tlMainClose?.clear()

      const elsMenuSubmenuTitleReversed = [
        ...this.elsMenuSubmenuTitle,
      ].reverse()

      const elsTopBorderReversed = [...this.elsTopBorder].reverse()

      if (this.activeLinkLocation === 'submenu') {
        this.handleActiveLinkLottie('disappear')
      }

      this.tlMainClose = gsap
        .timeline({
          onComplete: () => {
            this.submenuActive = false

            const elTitleSubmenuSave =
              this.$refs.linkPrincipal[this.$refs.linkPrincipal.length - 1]

            Flip.fit(this.elTitleSubmenuWrapper, elTitleSubmenuSave)

            gsap.set(this.$refs.submenuCross, {
              rotation: 0,
            })
          },
        })
        .addLabel('title')
        .to(
          elsMenuSubmenuTitleReversed,
          {
            y: '110%',
            stagger: 0.15,
            duration: 0.75,
            ease: 'expo.out',
          },
          'title'
        )
        .to(
          this.$refs.contentBorderLeft,
          {
            scaleY: 0,
            duration: 1.5,
            ease: 'expo.out',
          },
          'title+=5%'
        )
        .to(
          elsTopBorderReversed,
          {
            scaleX: 0,
            stagger: 0.15,
            duration: 1,
            ease: 'expo.out',
          },
          'title+=5%'
        )
        .to(
          this.elTitleSubmenu,
          {
            y: '110%',
            stagger: 0.15,
            duration: 0.75,
            ease: 'expo.out',
          },
          'title+=55%'
        )
        .to(
          this.$refs.buttonSubmenu,
          {
            y: '150%',
            duration: 0.75,
            ease: 'expo.out',
          },
          'title+=55%'
        )
        .to(
          this.$refs.menuTitle.$el,
          {
            y: '100%',
            duration: 0.65,
            ease: 'expo.out',
          },
          'title+=75%'
        )
        .addLabel('visual', '<0%')
        .to(
          this.$refs.visual,
          {
            opacity: 0,
            duration: 0.75,
            ease: 'expo.out',
          },
          'visual'
        )
        .to(
          this.$refs.visual,
          {
            y: '20%',
            duration: 0.7,
            ease: 'expo.out',
          },
          'visual'
        )
        .to(
          [this.$refs.layerRed, this.$refs.layerBlue],
          {
            scaleY: 1,
            duration: 0.6,
            transformOrigin: 'center bottom',
            ease: 'power3.inOut',
          },
          '<-15%'
        )
        .set(this.$el, {
          backgroundColor: 'transparent',
        })
        .set(this.$refs.cta, {
          opacity: 0,
        })
        .to(this.$refs.layerRed, {
          scaleY: 0,
          duration: 0.85,
          ease: 'power3.inOut',
          transformOrigin: 'center top',
          onComplete: () => {
            this.pointerEventsActivated = false
          },
        })
        .to(
          this.$refs.layerBlue,

          {
            scaleY: 0,
            duration: 0.85,
            ease: 'power3.inOut',
            transformOrigin: 'center top',
          },
          '<10%'
        )
        .set(this.$el, {
          opacity: 0,
        })
    },
    initSubmenuTimeline() {
      this.tlSubmenu?.kill()
      this.tlSubmenu?.clear()

      const elsTitlePrincipalHidden = [...this.elsMenuPrincipalTitle].slice(
        0,
        -1
      )

      this.tlSubmenu = gsap
        .timeline()
        .to(elsTitlePrincipalHidden, {
          y: '110%',
          duration: 0.85,
          ease: 'power3.inOut',
          onComplete: () => {
            if (this.activeLinkLocation === 'submenu') {
              this.handleActiveLinkLottie('appear')
            }
          },
        })
        .to(
          this.elsMenuSubmenuTitle,
          {
            y: 0,
            stagger: 0.1,
            duration: 0.9,
            ease: 'power3.inOut',
            onReverseComplete: () => {
              if (this.activeLinkLocation === 'principal') {
                this.handleActiveLinkLottie('appear')
              }
            },
          },
          '<70%'
        )
    },
    handleActiveLinkLottie(state) {
      const playhead = { frame: 0, targetFrame: 0 }
      let duration

      if (state === 'appear') {
        playhead.frame = 0
        playhead.targetFrame = this.activeLinkLottie.totalFrames - 1
        duration = 1
      } else {
        playhead.frame = this.activeLinkLottie.currentFrame
        playhead.targetFrame = 0

        duration = gsap.utils.mapRange(
          0,
          this.activeLinkLottie.totalFrames - 1,
          0,
          0.8,
          playhead.frame
        )
      }

      this.activeLinkLottieTween?.kill()

      const tween = gsap.to(playhead, {
        duration,
        frame: playhead.targetFrame,
        ease: 'power2.inOut',
        onUpdate: () => this.activeLinkLottie.goToAndStop(playhead.frame, true),
      })

      this.activeLinkLottieTween = tween
    },
    onToggleSubmenu() {
      this.submenuActive = !this.submenuActive

      if (this.submenuActive) {
        Flip.fit(this.elTitleSubmenuWrapper, this.elTitleTargetFlip, {
          duration: 0.95,
          delay: 0.4,
          ease: 'expo.inOut',
        })

        gsap.to(this.$refs.submenuCross, {
          rotation: 405,
          duration: 0.95,
          delay: 0.4,
          ease: 'expo.inOut',
        })

        if (this.activeLinkLocation === 'principal') {
          this.handleActiveLinkLottie('disappear')
        }

        this.initSubmenuTimeline()
      } else {
        const elTitleSubmenuSave =
          this.$refs.linkPrincipal[this.$refs.linkPrincipal.length - 1]

        Flip.fit(this.elTitleSubmenuWrapper, elTitleSubmenuSave, {
          duration: 0.9,
          delay: 0.5,
          ease: 'expo.inOut',
        })

        gsap.to(this.$refs.submenuCross, {
          rotation: 0,
          duration: 0.9,
          delay: 0.5,
          ease: 'expo.inOut',
        })

        this.tlSubmenu?.reverse()

        if (this.activeLinkLocation === 'submenu') {
          this.handleActiveLinkLottie('disappear')
        }
      }
    },
    onCloseBurger() {
      if (!this.menuActive) return

      this.setMenuActive(false)
    },
    onResetMenu() {
      this.setMenuActive(false)

      this.pointerEventsActivated = false
      this.burgerCloseActivated = false
      this.submenuActive = false

      this.tlMain?.pause(0)
      this.tlMain?.clear()

      this.tlMainClose?.pause(0)
      this.tlMainClose?.clear()

      this.tlSubmenu?.pause(0)
      this.tlSubmenu?.clear()

      this.activeLinkLottieTween?.kill()
      this.activeLinkLottie?.goToAndStop(0, true)
      this.getActiveLottie()

      const elTitleSubmenuSave =
        this.$refs.linkPrincipal[this.$refs.linkPrincipal.length - 1]

      Flip.fit(this.elTitleSubmenuWrapper, elTitleSubmenuSave)

      gsap.set(this.$refs.submenuCross, {
        rotation: 0,
      })

      gsap.set(this.elsMenuPrincipalTitle, {
        y: '110%',
      })

      gsap.set(this.elsMenuSubmenuTitle, {
        y: '110%',
      })

      gsap.set(this.$el, {
        opacity: 0,
      })
    },
    getActiveLottie() {
      if (this.$route.path === '/' || this.$route.fullPath === '/') {
        this.activeLinkIsIndex = true
        this.activeLinkLocation = null
        this.activeLinkIndex = null
        this.activeLinkLottie = null
        this.indexLinkHovered = 0
        this.indexImageVisible = 0
      } else {
        this.activeLinkIsIndex = false

        const indexMenu = this.menu
          .filter((item) => !item.submenu || item.url)
          .findIndex((item) => item.url === this.$route.path)

        const indexSubmenu = this.submenu
          .filter((item) => !item.submenu || item.url)
          .findIndex((item) => item.url === this.$route.path)

        if (indexMenu !== -1) {
          this.activeLinkLocation = 'principal'
          this.activeLinkIndex = indexMenu
          this.activeLinkLottie =
            this.lottiesMenuPrincipal[indexMenu].animation.active
          this.indexLinkHovered = this.activeLinkIndex
          this.indexImageVisible = this.activeLinkIndex + 1
        } else if (indexSubmenu !== -1) {
          this.activeLinkLocation = 'submenu'
          this.activeLinkIndex = indexSubmenu
          this.activeLinkLottie =
            this.lottiesMenuSubmenu[indexSubmenu].animation.active
          this.indexLinkHovered = this.menu.length - 1
          this.indexImageVisible = this.menu.length - 1 + 1
        }
      }
    },
    ...mapMutations({
      setMenuActive: 'setMenuActive',
    }),
  },
}
</script>

<style lang="scss">
.app-menu {
  width: 100vw;
  height: 100vh;
  position: fixed;
  background-color: transparent;
  z-index: 3;
  pointer-events: none;
  opacity: 0;

  &.pointer-events {
    pointer-events: all;
  }

  &__inner {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
  }

  &__visual {
    height: 100%;
    flex: 0 0 58%;
    transform: translateY(20%);
    position: relative;
    opacity: 0;

    @include mobile {
      display: none;
    }

    img {
      position: absolute;
      top: 0;
      left: 0;

      &.menu-visual-enter-active,
      &.menu-visual-leave-active {
        transition: opacity 0.55s var(--ease-in-out-cubic);
      }

      &.menu-visual-enter {
        opacity: 0;
      }

      &.menu-visual-enter-to {
        opacity: 1;
      }

      &.menu-visual-leave {
        opacity: 1;
        opacity: 1;
      }

      &.menu-visual-leave-to {
        opacity: 0;
      }
    }
  }

  &__cta {
    margin-left: auto;
    display: flex;
    position: absolute;
    right: calc(var(--layout-margin) + 25px);
    top: desktop-vw(70.5px);
    z-index: 1;
    opacity: 0;
    cursor: pointer;

    @include mobile {
      top: mobile-vw(35px);
      right: calc(var(--layout-margin));
      height: 12px;
    }

    &.visible {
      opacity: 1;
    }

    &__menu {
      text-transform: uppercase;
      margin-right: 20px;
    }

    &__burger {
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;

      &.active {
        .app-menu__cta__burger__line.top {
          transform: translate(0px, 2px) rotate(45deg);
        }
        .app-menu__cta__burger__line.bottom {
          transform: translate(0px, -4px) rotate(-45deg);

          @include mobile {
            transform: translate(0px, -2px) rotate(-45deg);
          }
        }
      }

      &__line {
        display: block;
        width: 30px;
        height: 2px;
        background: black;
        transition: transform 0.75s var(--ease-out-expo);
        will-change: transform;
      }
    }
  }

  &__content {
    height: 100%;
    flex: 0 0 42%;
    position: relative;
    padding: desktop-vw(20px) desktop-vw(40px) desktop-vw(5px) desktop-vw(40px);
    display: flex;
    flex-direction: column;
    justify-content: flex-end;

    @include mobile {
      flex: 0 0 100%;
      padding: mobile-vw(0px) var(--layout-margin) mobile-vw(0px)
        var(--layout-margin);
    }
  }

  &__border-left {
    position: absolute;
    top: 0;
    height: 100%;
    width: 1px;
    left: 0px;
    background: var(--c-black);
    transform: translate(50%, 0%) scaleY(0);
    transform-origin: center top;

    @include mobile {
      display: none;
    }
  }

  &__title {
    overflow: hidden;
    display: inline-block;
    margin-bottom: desktop-vh(40px);

    @include mobile {
      margin-bottom: mobile-vh(20px);
    }

    .H1 {
      -webkit-text-stroke: 1px var(--c-black);
      -webkit-text-fill-color: transparent;
      transform: translateY(100%);
      will-change: transform;
    }
  }

  &__principal,
  &__submenu {
    display: flex;
    flex-direction: column;
  }

  &__principal {
    svg:nth-of-type(1) {
      position: absolute;
      width: auto !important;
      height: 165% !important;
      transform: translate(-25%, -50%) !important;
      top: 50%;
      left: 0;
      pointer-events: none;
    }
    svg:nth-of-type(2) {
      position: absolute;
      width: auto !important;
      height: 200% !important;
      transform: translate(-25%, -55%) !important;
      top: 50%;
      left: 0;
      pointer-events: none;
    }
  }

  &__submenu {
    position: absolute;
    pointer-events: none;
    left: desktop-vw(100px);

    svg:nth-of-type(1) {
      position: absolute;
      width: auto !important;
      height: 185% !important;
      transform: translate(-12.5%, -50%) !important;
      top: 50%;
      left: 0;
      pointer-events: none;
    }

    svg:nth-of-type(2) {
      position: absolute;
      width: auto !important;
      height: 220% !important;
      transform: translate(-20%, -55%) !important;
      top: 50%;
      left: 0;
      pointer-events: none;
    }

    &.pointer-events {
      pointer-events: all;
    }
  }

  &__link {
    position: relative;
    margin: desktop-vh(25px) 0px desktop-vh(20px) 0px;
    display: flex;
    flex-wrap: wrap;

    @include mobile {
      margin: mobile-vh(25px) 0px mobile-vh(25px) 0px;
    }

    &__title {
      display: block;
      overflow: hidden;
      display: flex;
      width: 100% !important;

      .H2.medium {
        transform: translateY(110%);
        font-size: desktop-vw(72px);
        line-height: desktop-vw(78px);
        cursor: pointer;
        will-change: transform;

        @include mobile {
          font-size: mobile-vw(48px);
          line-height: mobile-vw(52px);
        }
      }
    }

    &__border-top {
      display: block;
      background: var(--c-black);
      width: calc(100% + desktop-vw(40px) + desktop-vw(40px));
      height: 1px;
      position: absolute;
      top: desktop-vh(-25px);
      left: desktop-vw(-40px);
      transform: scaleX(0);
      transform-origin: left center;

      @include mobile {
        top: mobile-vh(-25px);
        width: 100vw;
        position: relative;
        left: 50%;
        right: 50%;
        margin-left: -50vw;
        margin-right: -50vw;
      }
    }

    &__button-submenu {
      align-self: center;
      margin-left: auto;
      border: 1px solid black;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      width: desktop-vw(40px);
      height: desktop-vw(40px);
      padding: desktop-vw(10px);
      transform: translateY(150%);
      margin-right: 1px;

      @include mobile {
        width: mobile-vw(40px);
        height: mobile-vw(40px);
        padding: mobile-vw(10px);
      }

      &__inner {
        justify-content: center;
        align-items: center;
        display: flex;
        width: 100%;
        height: 100%;
        position: relative;
        will-change: transform;
      }

      &__line {
        background: var(--c-black);
        display: block;
        position: absolute;

        &.horizontally {
          width: 100%;
          height: 4px;
        }
        &.vertically {
          width: 4px;
          height: 100%;
        }
      }
    }
  }

  &__layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transform: scaleY(0);
    transform-origin: center top;
    cursor: initial;

    &:hover {
      cursor: initial;
    }

    &.red {
      background-color: var(--c-red-adidas);
      z-index: 3;
    }

    &.blue {
      background-color: var(--c-blue-adidas);
      z-index: 2;
    }
  }
}
</style>
