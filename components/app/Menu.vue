<template>
  <div
    :class="{
      'pointer-events': pointerEventsActivated,
    }"
    data-lenis-prevent
    class="app-menu"
  >
    <div ref="layerRed" class="app-menu__layer red" />
    <div ref="layerBlue" class="app-menu__layer blue" />

    <div
      ref="cta"
      :class="{ reduced: headerReduced }"
      class="app-menu__cta"
      @click="onCloseBurger"
    >
      <TP1 weight="bold" class="app-menu__cta__menu">
        {{ menuCloseName }}
      </TP1>
      <div class="app-menu__burger" :class="{ active: menuActive }" />
    </div>

    <div class="app-menu__inner">
      <div ref="visual" class="app-menu__visual">
        <transition-group tag="div" name="menu-visual">
          <nuxt-img
            v-for="(item, index) in menuVisuals"
            v-show="indexImage === index"
            :key="`menu-visual-${index}`"
            alt="red"
            :src="item.image"
            provider="directus"
            sizes="md:100vw"
            loading="lazy"
          />
        </transition-group>
      </div>

      <div class="app-menu__content">
        <span
          ref="contentBorderLeft"
          class="app-menu__border-left menu-border-left"
        />

        <div class="app-menu__title">
          <TH1 ref="menuTitle" tag="p" weight="bold">{{ menuName }} </TH1>
        </div>

        <div class="app-menu__mobile-links">
          <AppMenuLink
            ref="programmationLink"
            :content="menuProgrammation"
            @onClickActiveLink="onCloseBurger"
          />
        </div>

        <div class="app-menu__main-links">
          <AppMenuLink
            v-for="(item, index) in menu"
            :key="index"
            ref="mainLinks"
            :content="item"
            @onToggleSubmenu="onToggleSubmenu"
            @onHoverLink="onSelectImage"
            @onClickActiveLink="onCloseBurger"
          />
        </div>

        <div
          ref="submenu"
          :class="{ 'pointer-events': submenuActive }"
          class="app-menu__submenu"
        >
          <AppMenuLink
            v-for="(item, index) in submenu"
            :key="index"
            ref="submenuLinks"
            :content="item"
            @onHoverLink="onSelectImage"
            @onClickActiveLink="onCloseBurger"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'
import { mapState, mapMutations } from 'vuex'

export default {
  data() {
    return {
      submenuActive: false,
      pointerEventsActivated: false,
      indexImage: 0,
    }
  },
  computed: {
    ...mapState({
      menuActive: (state) => state.menuActive,
      menuContent: (state) => state.menuContent,
      appContent: (state) => state.appContent,
      headerReduced: (state) => state.headerReduced,
    }),
    menu() {
      return this.menuContent.data.filter(
        (el) => !el.submenu_element && !el.homepage && !el.programmation
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
    menuProgrammation() {
      return this.menuContent.data.find((el) => el.programmation)
    },
    menuCloseName() {
      return this.appContent.data.menu_close_name
    },
  },
  watch: {
    menuActive(payload) {
      if (payload) {
        this.initMainTimeline()
      } else if (!payload) {
        if (this.submenuActive) {
          this.initMainTimelineClosing()
        } else {
          this.tlMain?.reverse()
        }
      }
    },
  },
  mounted() {
    this.initNodes()

    this.$viewport.events.on('resize', this.onResize)
    this.$nuxt.$on('menu:reset', this.onResetMenu)
    window.addEventListener('keyup', this.onKeyUp)
  },
  beforeDestroy() {
    this.$viewport.events.off('resize', this.onResize)
    this.$nuxt.$off('menu:reset', this.onResetMenu)
    window.removeEventListener('keyup', this.onKeyUp)
  },
  methods: {
    onSelectImage(route) {
      this.indexImage = this.menuVisuals.findIndex((item) => item.url === route)
    },
    initNodes() {
      this.els = {
        main: {
          vueComponents: this.$refs.mainLinks,
          nodesComponents: this.$refs.mainLinks.map((link) => link.$el),
          nodesWrapper: this.$refs.mainLinks.map((link) =>
            link.$el.querySelector('.app-menu-link__title-wrapper')
          ),
          nodesTitle: this.$refs.mainLinks.map((link) =>
            link.$el.querySelector('.app-menu-link__title')
          ),
        },
        submenu: {
          vueComponents: this.$refs.submenuLinks,
          nodesComponents: this.$refs.submenuLinks.map((link) => link.$el),
          nodesWrapper: this.$refs.submenuLinks.map((link) =>
            link.$el.querySelector('.app-menu-link__title-wrapper')
          ),
          nodesTitle: this.$refs.submenuLinks.map((link) =>
            link.$el.querySelector('.app-menu-link__title')
          ),
        },
        borders: this.$el.querySelectorAll('.app-menu-link__border-top'),
      }

      this.els.submenuTitle = {
        nodeWrapper:
          this.els.main.nodesWrapper[this.els.main.nodesWrapper.length - 1],
        nodeTitle:
          this.els.main.nodesTitle[this.els.main.nodesTitle.length - 1],
      }

      this.els.targetFlip = this.els.main.nodesComponents[1]

      if (this.$viewport.isMobile) {
        this.els.main = {
          vueComponents: [
            this.$refs.programmationLink,
            ...this.$refs.mainLinks,
          ],
          nodesComponents: [
            this.$refs.programmationLink.$el,

            ...this.$refs.mainLinks.map((link) => link.$el),
          ],
          nodesWrapper: [
            this.$refs.programmationLink.$el.querySelector(
              '.app-menu-link__title-wrapper'
            ),
            ...this.$refs.mainLinks.map((link) =>
              link.$el.querySelector('.app-menu-link__title-wrapper')
            ),
          ],
          nodesTitle: [
            this.$refs.programmationLink.$el.querySelector(
              '.app-menu-link__title'
            ),
            ...this.$refs.mainLinks.map((link) =>
              link.$el.querySelector('.app-menu-link__title')
            ),
          ],
        }

        this.els.targetFlip = this.els.main.nodesComponents[1]
      }
    },
    onKeyUp(e) {
      if (e.key === 'Escape') {
        this.onCloseBurger()
      }
    },
    onResize() {
      if (this.submenuActive) {
        Flip.fit(this.els.submenuTitle.nodeWrapper, this.els.targetFlip, {
          simple: true,
        })
      } else {
        const elTitleSubmenuSave =
          this.els.main.nodesComponents[
            this.els.main.nodesComponents.length - 1
          ]

        Flip.fit(this.els.submenuTitle.nodeWrapper, elTitleSubmenuSave, {
          simple: true,
        })
      }
    },
    initMainTimeline() {
      this.tlMain?.kill()
      this.tlMain?.clear()

      const route = this.$route.path.includes('be-part-of')
        ? null
        : this.$route.name === 'programmation-id'
        ? '/programmation'
        : this.$route.path

      this.onSelectImage(route)

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
          onStart: () => {
            this.pointerEventsActivated = true
          },
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
          this.els.borders,
          {
            scaleX: 1,
            stagger: 0.15,
            duration: 1,
            ease: 'expo.out',
          },
          'title+=5%'
        )
        .to(
          this.els.main.nodesTitle,
          {
            y: 0,
            stagger: 0.15,
            duration: 0.75,
            ease: 'expo.out',
            onReverseComplete: () => {
              this.pointerEventsActivated = false
            },
            onStart: () => {
              this.$refs.mainLinks.forEach((el) => {
                el.appearActiveLottie()
              })
            },
          },
          'title+=8.5%'
        )
    },
    initMainTimelineClosing() {
      this.tlMainClose?.kill()
      this.tlMainClose?.clear()

      this.tlSubmenu?.clear()
      this.tlSubmenu?.kill()

      let elsMenuSubmenuTitleReversed

      if (this.$viewport.isMobile) {
        elsMenuSubmenuTitleReversed = [
          this.els.main.nodesTitle[0],
          ...this.els.submenu.nodesTitle,
        ].reverse()
      } else {
        elsMenuSubmenuTitleReversed = [...this.els.submenu.nodesTitle].reverse()
      }

      const elsTopBorderReversed = [...this.els.borders].reverse()

      this.tlMainClose = gsap
        .timeline({
          onComplete: () => {
            this.submenuActive = false

            const elTitleSubmenuSave =
              this.els.main.nodesComponents[
                this.els.main.nodesComponents.length - 1
              ]

            Flip.fit(this.els.submenuTitle.nodeWrapper, elTitleSubmenuSave, {
              simple: true,
            })

            gsap.set('.app-menu-link__button-submenu__inner', {
              rotation: 0,
            })

            gsap.set(this.els.main.nodesTitle, {
              y: '110%',
            })

            gsap.set(this.els.submenu.nodesTitle, {
              y: '110%',
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
            onStart: () => {
              this.pointerEventsActivated = false
            },
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
          this.els.submenuTitle.nodeTitle,
          {
            y: '110%',
            stagger: 0.15,
            duration: 0.75,
            ease: 'expo.out',
          },
          'title+=55%'
        )
        .to(
          this.$refs.menuTitle.$el,
          {
            y: '110%',
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
          '<-25%'
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

      let linksToHide

      if (this.$viewport.isMobile) {
        linksToHide = this.els.main.nodesTitle.filter(
          (link, index) =>
            index !== 0 && index !== this.els.main.nodesTitle.length - 1
        )
      } else {
        linksToHide = this.els.main.nodesTitle.filter(
          (link, index) => index !== this.els.main.nodesTitle.length - 1
        )
      }

      this.tlSubmenu = gsap
        .timeline()
        .set(this.$refs.submenu, { opacity: 1 })
        .to(linksToHide, {
          y: '110%',
          duration: 0.85,
          ease: 'power3.inOut',
        })
        .to(
          this.els.submenu.nodesTitle,
          {
            y: 0,
            stagger: 0.1,
            duration: 0.9,
            ease: 'power3.inOut',
            onStart: () => {
              this.$refs.submenuLinks.forEach((el) => {
                el.appearActiveLottie(0.35)
              })
            },
            onReverseComplete: () => {
              this.$refs.mainLinks.forEach((el) => {
                el.appearActiveLottie()
              })
            },
          },
          '<70%'
        )
    },
    onToggleSubmenu() {
      this.submenuActive = !this.submenuActive

      if (this.submenuActive) {
        Flip.fit(this.els.submenuTitle.nodeWrapper, this.els.targetFlip, {
          duration: 0.95,
          delay: 0.4,
          ease: 'expo.inOut',
          simple: true,
        })

        this.$refs.mainLinks.forEach((el) => {
          el.disappearActiveLottie()
        })

        this.initSubmenuTimeline()
      } else {
        const elMainLinkSubmenuWrapperSave =
          this.els.main.nodesComponents[
            this.els.main.nodesComponents.length - 1
          ]

        Flip.fit(
          this.els.submenuTitle.nodeWrapper,
          elMainLinkSubmenuWrapperSave,
          {
            duration: 0.9,
            delay: 0.5,
            ease: 'expo.inOut',
            simple: true,
          }
        )

        this.$refs.submenuLinks.forEach((el) => {
          el.disappearActiveLottie()
        })

        this.tlSubmenu?.reverse()
      }
    },
    onCloseBurger() {
      if (!this.menuActive) return

      this.setMenuActive(false)
    },
    onResetMenu() {
      this.tlMain?.getChildren().forEach((tween) => {
        gsap.set(tween.targets(), { clearProps: 'all' })
      })
      this.tlMain?.clear(true)
      this.tlMain?.kill()
      this.tlMain = null

      this.tlMainClose?.getChildren().forEach((tween) => {
        gsap.set(tween.targets(), { clearProps: 'all' })
      })
      this.tlMainClose?.clear(true)
      this.tlMainClose?.kill()
      this.tlMainClose = null

      this.tlSubmenu?.getChildren().forEach((tween) => {
        gsap.set(tween.targets(), { clearProps: 'all' })
      })
      this.tlSubmenu?.clear(true)
      this.tlSubmenu?.kill()
      this.tlSubmenu = null

      const elTitleSubmenuSave =
        this.els.main.nodesComponents[this.els.main.nodesComponents.length - 1]

      Flip.fit(this.els.submenuTitle.nodeWrapper, elTitleSubmenuSave)

      this.$el.scrollTo(0, 0)

      gsap.set('.app-menu-link__button-submenu__inner', {
        rotation: 0,
      })

      this.pointerEventsActivated = false
      this.submenuActive = false

      this.setMenuActive(false)
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
  z-index: 8;
  pointer-events: none;
  opacity: 0;

  @include mobile {
    height: calc(100 * var(--vh, 1vh));
    overscroll-behavior: contain;
    overflow-y: hidden;
  }

  &.pointer-events {
    pointer-events: all;

    @include mobile {
      overflow-y: scroll;
    }
  }

  &__inner {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;

    @include mobile {
      height: auto;
      min-height: 100%;
    }
  }

  &__visual {
    height: 100%;
    width: 58%;
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
      }

      &.menu-visual-leave-to {
        opacity: 0;
      }
    }
  }

  &__cta {
    margin-left: auto;
    display: flex;
    align-items: center;
    position: absolute;
    right: desktop-vw(60px);
    top: desktop-vw(75px);
    z-index: 1;
    opacity: 0;
    cursor: pointer;
    height: 40px;

    @include mobile {
      right: calc(var(--layout-margin) + 10px);
      top: mobile-vw(25px);
    }

    @include mobile {
      top: mobile-vw(25px);
    }

    &.reduced {
      transform: translate(0%, -100%);

      @include mobile {
        transform: translate(0%, 0%);
      }
    }

    &.visible {
      opacity: 1;
    }

    &__menu.P1 {
      font-size: 16px;
      line-height: 16px;
      text-transform: uppercase;
      margin-right: 20px;
    }
  }

  &__burger {
    display: flex;
    justify-content: center;
    align-items: center;
    outline: none;
    height: 20px;
    width: 30px;
    border: 0px;
    padding: 0px;
    background: transparent;
    cursor: pointer;

    &:before,
    &:after {
      content: '';
      width: 30px;
      height: 2px;
      position: absolute;
      background: black;
      transition: transform 0.75s var(--ease-out-expo);
      will-change: transform;
    }

    &:before {
      transform: translateY(-4px);
    }

    &:after {
      transform: translateY(4px);
    }

    &.active:before {
      transform: translateY(0) rotate(45deg);
    }

    &.active:after {
      transform: translateY(0) rotate(-45deg);
    }
  }

  &__content {
    height: 100%;
    width: 42%;
    position: relative;
    padding: desktop-vw(20px) desktop-vw(40px) desktop-vw(5px) desktop-vw(40px);
    display: flex;
    flex-direction: column;
    justify-content: flex-end;

    @include mobile {
      flex: 0 0 100%;
      padding: mobile-vw(35px) var(--layout-margin) mobile-vw(0px)
        var(--layout-margin);
      height: auto;
      min-height: 100%;
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

  &__mobile-links {
    @include desktop {
      display: none;
    }
  }

  &__main-links,
  &__submenu {
    display: flex;
    flex-direction: column;
  }

  &__main-links {
  }

  &__submenu {
    position: absolute;
    pointer-events: none;
    left: desktop-vw(100px);
    opacity: 0;

    &.pointer-events {
      pointer-events: all;
    }
  }

  &__layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    transform: scaleY(0);
    transform-origin: center top;
    cursor: initial;

    @include hover {
      &:hover {
        cursor: initial;
      }
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
