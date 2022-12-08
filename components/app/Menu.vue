<template>
  <div
    :class="{
      'pointer-events': activePointerEvents,
    }"
    class="app-menu"
  >
    <div ref="layerRed" class="app-menu__layer red" />
    <div ref="layerBlue" class="app-menu__layer blue" />

    <div ref="cta" class="app-menu__cta">
      <p v-if="!$viewport.isMobile" class="app-menu__cta__menu">Close</p>
      <div
        class="app-menu__cta__burger"
        :class="{ active: activeBurgerClose }"
        @click="onCloseBurger"
      >
        <span class="app-menu__cta__burger__line top" />
        <span class="app-menu__cta__burger__line bottom" />
      </div>
    </div>

    <div class="app-menu__inner">
      <div ref="visual" class="app-menu__visual">
        <!-- <nuxt-img
          v-for="(item, index) in menu"
          :key="index"
          alt="red"
          :src="item.image"
        ></nuxt-img> -->
        <transition-group name="menu-visual">
          <img
            v-for="(item, index) in menu"
            v-show="titleSelected === index"
            :key="index"
            alt="red"
            :src="item.image"
          />
        </transition-group>
      </div>
      <div class="app-menu__content">
        <span class="app-menu__border-left menu-border-left" />
        <div class="app-menu__title">
          <TH1 ref="menuTitle">Menu </TH1>
        </div>
        <div class="app-menu__links">
          <div
            v-for="(item, index) in menu"
            :key="index"
            ref="link"
            class="app-menu__link"
          >
            <span class="app-menu__link__border menu-border-top" />
            <div class="app-menu__link__title">
              <TH2
                v-if="!item.submenu"
                class="menu-link-title"
                @mouseenter.native="onTitleSelected(index)"
              >
                <nuxt-link :to="item.url">{{ item.name }}</nuxt-link>
              </TH2>
              <TH2
                v-if="item.submenu"
                class="menu-link-title"
                @click.native="onClickSubmenu"
                @mouseenter.native="onTitleSelected(index)"
              >
                {{ item.name }}
              </TH2>
              <div
                v-if="item.submenu"
                ref="buttonSubmenu"
                class="app-menu__link__button-submenu"
                @click="onClickSubmenu"
                @mouseenter="onTitleSelected(index)"
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
            <div
              v-if="index !== 0"
              :class="{ active: submenuOpen }"
              class="app-menu__link-submenu__title"
            >
              <TH2 class="menu-link-submenu-title">
                <nuxt-link :to="submenu[index - 1].url">
                  {{ submenu[index - 1].name }}
                </nuxt-link>
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

export default {
  data() {
    return {
      submenuOpen: false,
      activePointerEvents: false,
      activeBurgerClose: false,
      titleSelected: 0,
      menu: [
        {
          name: 'Projet',
          url: '/projet',
          image: 'https://picsum.photos/500',
        },
        {
          name: `L'arena`,
          url: '/arena',
          image: 'https://picsum.photos/400',
        },
        {
          name: 'Le bloc',
          url: '/le-bloc',
          image: 'https://picsum.photos/450',
        },
        {
          name: 'Be part of',
          url: null,
          submenu: true,
          image: 'https://picsum.photos/200',
        },
      ],
      submenu: [
        {
          name: 'Hospitalite',
          url: '/be-part-of/hospitalite',
        },
        {
          name: `Configurations`,
          url: '/be-part-of/configurations',
        },
        {
          name: 'Partenaire',
          url: '/be-part-of/partenaire',
        },
      ],
    }
  },
  computed: {
    ...mapState({
      menuOpen: (state) => state.menuOpen,
      menuActive: (state) => state.menuActive,
    }),
  },
  watch: {
    menuActive(payload) {
      if (payload) {
        this.activePointerEvents = true
        this.activeBurgerClose = true

        this.tlLayout.play()

        this.initTimelineSubmenu()
      } else {
        this.activeBurgerClose = false

        if (this.submenuOpen) {
          this.initTimeClose()
        } else {
          this.tlLayout.reverse()
        }
      }
    },
  },

  mounted() {
    this.bordersTop = this.$el.querySelectorAll('.menu-border-top')
    this.linksTitleParent = this.$el.querySelectorAll('.app-menu__link__title')
    this.linksTitle = this.$el.querySelectorAll('.menu-link-title')
    this.linksTitleSubmenu = this.$el.querySelectorAll(
      '.menu-link-submenu-title'
    )

    this.initTimelineLayout()
    this.initTimelineSubmenu()

    this.$nuxt.$on('menu:reset', this.onMenuReset)
  },

  beforeDestroy() {
    this.$nuxt.$off('menu:reset', this.onMenuReset)
  },

  methods: {
    onMenuReset() {
      this.setMenuActive(false)
      this.setMenuOpen(false)

      this.activePointerEvents = false
      this.activeBurgerClose = false
      this.submenuOpen = false

      this.tlLayout.pause(0)
      this.tlLayout.clear()
      this.initTimelineLayout()

      this.tlCloseLayoutFromSubmenu?.clear()
      this.tlCloseLayoutFromSubmenu?.kill()

      this.tlLayoutSubmenu?.clear()
      this.tlLayoutSubmenu?.kill()

      const titleSubmenu =
        this.linksTitleParent[this.linksTitleParent.length - 1]
      const titleSubmenuSave = this.$refs.link[this.$refs.link.length - 1]

      Flip.fit(titleSubmenu, titleSubmenuSave)

      gsap.set(this.$refs.submenuCross, {
        rotation: 0,
      })

      gsap.set(this.linksTitleSubmenu, {
        y: '105%',
      })
    },
    onCloseBurger() {
      if (!this.menuActive) return

      this.setMenuActive(false)
    },
    onTitleSelected(index) {
      if (this.titleSelected === index) return

      this.titleSelected = index
    },

    onClickSubmenu() {
      this.submenuOpen = !this.submenuOpen

      const titleSubmenu =
        this.linksTitleParent[this.linksTitleParent.length - 1]
      const titleSubmenuTarget = this.linksTitleParent[0]
      const titleSubmenuSave = this.$refs.link[this.$refs.link.length - 1]

      if (this.submenuOpen) {
        Flip.fit(titleSubmenu, titleSubmenuTarget, {
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

        this.tlLayoutSubmenu.play()
      } else {
        Flip.fit(titleSubmenu, titleSubmenuSave, {
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

        this.tlLayoutSubmenu.reverse()
      }
    },
    initTimeClose() {
      const titleSubmenu = this.linksTitle[this.linksTitle.length - 1]
      const linksTitleSubmenuReversed = [...this.linksTitleSubmenu].reverse()
      const bordersTopReversed = [...this.bordersTop].reverse()

      this.tlCloseLayoutFromSubmenu = gsap
        .timeline({
          onComplete: () => {
            this.submenuOpen = false

            this.tlCloseLayoutFromSubmenu?.clear()
            this.tlCloseLayoutFromSubmenu?.kill()

            this.tlLayoutSubmenu?.clear()
            this.tlLayoutSubmenu?.kill()

            const titleSubmenu =
              this.linksTitleParent[this.linksTitleParent.length - 1]
            const titleSubmenuSave = this.$refs.link[this.$refs.link.length - 1]

            Flip.fit(titleSubmenu, titleSubmenuSave)

            gsap.set(this.$refs.submenuCross, {
              rotation: 0,
            })

            this.tlLayout.pause(0)
          },
        })
        .addLabel('title')
        .to(
          linksTitleSubmenuReversed,
          {
            y: '105%',
            stagger: 0.15,
            duration: 0.75,
            ease: 'expo.out',
          },
          'title'
        )
        .to(
          '.menu-border-left',

          {
            scaleY: 0,
            duration: 1.5,
            ease: 'expo.out',
          },
          'title+=5%'
        )
        .to(
          bordersTopReversed,
          {
            scaleX: 0,
            stagger: 0.15,
            duration: 1,
            ease: 'expo.out',
          },
          'title+=5%'
        )
        .to(
          titleSubmenu,
          {
            y: '105%',
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
        .addLabel('visual', '<40%')
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
            onComplete: () => {
              this.setMenuOpen(false)
            },
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
            this.setMenuOpen(false)
            this.activePointerEvents = false
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
    },
    initTimelineSubmenu() {
      this.tlLayoutSubmenu = gsap.timeline({ paused: true })

      const linksTitleHidden = Object.values(this.linksTitle).filter(
        (item, index) => index !== this.linksTitle.length - 1
      )

      this.tlLayoutSubmenu.to(linksTitleHidden, {
        y: '105%',
        duration: 0.85,
        ease: 'power3.inOut',
      })

      this.tlLayoutSubmenu.to(
        this.linksTitleSubmenu,
        {
          y: 0,
          stagger: 0.1,
          duration: 0.85,
          ease: 'power3.inOut',
        },
        '<70%'
      )
    },
    initTimelineLayout() {
      this.tlLayout = gsap
        .timeline({ paused: true })
        .fromTo(
          this.$refs.layerBlue,
          { scaleY: 0 },
          {
            scaleY: 1,
            duration: 0.85,
            ease: 'power3.inOut',
          }
        )
        .fromTo(
          this.$refs.layerRed,
          { scaleY: 0 },
          {
            scaleY: 1,
            duration: 0.85,
            ease: 'power3.inOut',
            onComplete: () => {
              this.setMenuOpen(true)
            },
            onReverseComplete: () => {
              this.activePointerEvents = false
            },
          },
          '<10%'
        )
        .set(this.$el, {
          backgroundColor: '#FBF5EE',
        })
        .set(this.$refs.cta, {
          opacity: 1,
        })
        .to([this.$refs.layerRed, this.$refs.layerBlue], {
          scaleY: 0,
          duration: 0.6,
          transformOrigin: 'center bottom',
          ease: 'power3.inOut',
          onReverseComplete: () => {
            this.setMenuOpen(false)
          },
        })

        .addLabel('visual', '<45%')

        .fromTo(
          this.$refs.visual,
          {
            opacity: 0,
          },
          {
            opacity: 1,
            delay: 0.035,
            duration: 0.7,
            ease: 'expo.out',
          },
          'visual'
        )
        .fromTo(
          this.$refs.visual,
          {
            y: '20%',
          },
          {
            y: 0,
            duration: 0.7,
            ease: 'expo.out',
          },
          'visual'
        )

        .addLabel('title', '<20%')

        .fromTo(
          this.$refs.menuTitle.$el,
          {
            y: '100%',
          },
          {
            y: 0,
            duration: 0.65,
            ease: 'expo.out',
          },
          'title'
        )
        .fromTo(
          '.menu-border-left',
          {
            scaleY: 0,
          },
          {
            scaleY: 1,
            duration: 1.5,
            ease: 'expo.out',
          },
          'title+=5%'
        )
        .fromTo(
          this.bordersTop,
          {
            scaleX: 0,
          },
          {
            scaleX: 1,
            stagger: 0.15,
            duration: 1,
            ease: 'expo.out',
          },
          'title+=5%'
        )
        .fromTo(
          this.linksTitle,
          {
            y: '105%',
          },
          {
            y: 0,
            stagger: 0.15,
            duration: 0.75,
            ease: 'expo.out',
          },
          'title+=5%'
        )
        .fromTo(
          this.$refs.buttonSubmenu,
          {
            y: '150%',
          },
          {
            y: 0,
            duration: 0.75,
            ease: 'expo.out',
          },
          '<40%'
        )
    },
    ...mapMutations({
      setMenuOpen: 'setMenuOpen',
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

    @include mobile {
      top: mobile-vw(35px);
      right: calc(var(--layout-margin));
      height: 12px;
    }

    &.visible {
      opacity: 1;
    }

    &__menu {
      font-size: 16px;
      line-height: 16px;
      @include font-tuskerGrotesk-medium();
      text-transform: uppercase;
      margin-right: 20px;
    }

    &__burger {
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      cursor: pointer;

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

  &__links {
    display: flex;
    flex-direction: column;
  }

  &__link {
    position: relative;
    margin: desktop-vh(25px) 0px desktop-vh(30px) 0px;
    display: flex;
    flex-wrap: wrap;

    @include mobile {
      margin: mobile-vh(25px) 0px mobile-vh(25px) 0px;
    }

    &__title {
      display: block;
      overflow: hidden;
      display: flex;
      width: 100%;

      .H2.menu-link-title.medium {
        transform: translateY(105%);
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

    &-submenu__title {
      display: block;
      overflow: hidden;
      position: absolute;
      left: desktop-vw(50px);
      top: 0;
      pointer-events: none;

      @include mobile {
        left: mobile-vw(25px);
      }

      &.active {
        pointer-events: all;
      }

      .H2.menu-link-submenu-title.medium {
        transform: translateY(105%);
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

    &__border {
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
