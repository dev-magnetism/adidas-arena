<template>
  <div :style="styles" class="app-menu-link">
    <span v-if="!content.submenu_element" class="app-menu-link__border-top" />

    <div class="app-menu-link__title-wrapper">
      <TH2
        v-if="!content.submenu_title"
        weight="bold"
        tag="p"
        class="app-menu-link__title"
        @mouseenter.native="onLinkHover"
        @mouseleave.native="onLinkLeave"
      >
        <nuxt-link :to="content.url">
          {{ content.name }}
        </nuxt-link>
      </TH2>
      <TH2
        v-else-if="content.submenu_title"
        class="app-menu-link__title"
        weight="bold"
        tag="p"
        @mouseenter.native="$emit('onHoverLink', null)"
        @click.native="onToggleSubmenu"
      >
        {{ content.name }}

        <span ref="buttonSubmenu" class="app-menu-link__button-submenu">
          <span ref="submenuCross" class="app-menu-link__button-submenu__inner">
            <span class="app-menu-link__button-submenu__line horizontally" />
            <span class="app-menu-link__button-submenu__line vertically" />
          </span>
        </span>
      </TH2>
      <TH2
        v-else-if="content.programmation"
        class="app-menu-link__title"
        weight="bold"
        tag="p"
      >
        <nuxt-link :to="content.url">
          {{ content.name }}
        </nuxt-link>
      </TH2>
    </div>
  </div>
</template>

<script>
import { gsap } from 'gsap'
import { mapState } from 'vuex'

import lottie from 'lottie-web'

const lottieCircle1 = require(`@/assets/lotties/Cercle_1.json`)
const lottieCircle3 = require(`@/assets/lotties/Cercle_3.json`)

export default {
  props: {
    content: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      submenuActive: false,
    }
  },
  computed: {
    ...mapState({
      menuActive: (state) => state.menuActive,
    }),
    linkActive() {
      return this.content.url === this.$route.path
    },
    styles() {
      const styles = this.calculateNewStyles(this.content.name)

      return {
        '--height': styles.height,
        '--transform': styles.transform,
      }
    },
  },
  watch: {
    menuActive(newVal) {
      if (!newVal && !this.content.programmation && !this.$viewport.isMobile) {
        this.submenuActive = false

        const tweenParams = {
          duration: 0.5,
          ease: 'power2.out',
        }

        if (this.lottieHover.currentFrame !== 0) {
          const playhead = { frame: this.lottieHover.totalFrames - 1 }

          this.tweenHover?.kill()

          gsap.to(playhead, {
            ...tweenParams,
            frame: 0,
            onUpdate: () => this.lottieHover.goToAndStop(playhead.frame, true),
          })
        }

        if (this.lottieActive.currentFrame !== 0) {
          const playhead = { frame: this.lottieActive.totalFrames - 1 }

          gsap.to(playhead, {
            ...tweenParams,
            frame: 0,
            onUpdate: () => this.lottieActive.goToAndStop(playhead.frame, true),
          })
        }
      }
    },
  },
  mounted() {
    this.initLotties()
  },
  methods: {
    appearActiveLottie(delay = 0) {
      if (!this.linkActive || this.$viewport.isMobile) return

      const playhead = {
        frame: 0,
        targetFrame: this.lottieActive.totalFrames - 1,
      }

      gsap.to(playhead, {
        duration: 0.75,
        frame: playhead.targetFrame,
        ease: 'power2.inOut',
        delay,
        onUpdate: () => this.lottieActive.goToAndStop(playhead.frame, true),
      })
    },
    disappearActiveLottie(delay = 0) {
      if (!this.linkActive || this.$viewport.isMobile) return

      const playhead = {
        frame: this.lottieActive.totalFrames - 1,
        targetFrame: 0,
      }

      gsap.to(playhead, {
        duration: 0.75,
        delay,
        frame: playhead.targetFrame,
        ease: 'power2.inOut',
        onUpdate: () => this.lottieActive.goToAndStop(playhead.frame, true),
      })
    },
    onToggleSubmenu() {
      this.submenuActive = !this.submenuActive

      this.$emit('onToggleSubmenu', this.submenuActive)

      if (this.submenuActive) {
        gsap.to(this.$refs.submenuCross, {
          rotation: 405,
          duration: 0.95,
          delay: 0.4,
          ease: 'expo.inOut',
        })
      } else {
        gsap.to(this.$refs.submenuCross, {
          rotation: 0,
          duration: 0.9,
          delay: 0.5,
          ease: 'expo.inOut',
        })
      }
    },
    onLinkHover() {
      if (!this.menuActive || this.$viewport.isMobile) return

      if (!this.linkActive) {
        const playhead = { frame: 0 }

        this.tweenHover?.kill()

        this.tweenHover = gsap.to(playhead, {
          duration: 1,
          frame: this.lottieHover.totalFrames - 1,
          ease: 'power2.inOut',
          onUpdate: () => this.lottieHover.goToAndStop(playhead.frame, true),
        })
      }

      if (!this.content.submenu_element) {
        this.$emit('onHoverLink', this.content.url)
      }
    },
    onLinkLeave() {
      if (!this.menuActive || this.$viewport.isMobile) return

      if (!this.linkActive) {
        this.tweenHover.reverse()
      }
    },
    initLotties() {
      if (this.$viewport.isMobile || this.content.programmation) return

      this.lottieHover = lottie.loadAnimation({
        container: this.$el,
        loop: false,
        autoplay: false,
        animationData: lottieCircle1,
      })

      this.lottieActive = lottie.loadAnimation({
        container: this.$el,
        loop: false,
        autoplay: false,
        animationData: lottieCircle3,
      })
    },
    calculateNewStyles(word) {
      const baseHeight = 100 // 100% is the default height
      const baseChars = this.content.submenu_element ? 10 : 6 // default number of characters
      const chars = word.replace(/ /g, '').length // get the length of the word

      const factorHeight = this.content.submenu_element ? 2 : 1.65
      const factorTranslate = this.content.submenu_element ? -12.5 : -20

      const height = baseHeight * (chars / baseChars) * factorHeight // calculate new height
      const translateX = factorTranslate // calculate new translateX

      return {
        height: height + '%',
        transform: translateX + '%',
      }
    },
  },
}
</script>

<style lang="scss">
.app-menu-link {
  position: relative;
  margin: desktop-vh(25px) 0px desktop-vh(20px) 0px;
  display: flex;
  flex-wrap: wrap;

  @include mobile {
    margin: mobile-vh(25px) 0px mobile-vh(25px) 0px;
  }

  svg {
    position: absolute;
    width: auto !important;
    height: var(--height) !important;
    transform: translate(var(--transform), -50%) !important;
    top: 50%;
    left: 0;
    pointer-events: none;
  }

  &__title-wrapper {
    display: block;
    overflow: hidden;
    display: flex;
    width: 100% !important;

    .H2.medium,
    .H2.bold {
      transform: translateY(110%);
      font-size: desktop-vw(72px);
      line-height: desktop-vw(78px);
      cursor: pointer;
      will-change: transform;
      display: flex;
      width: 100%;

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
    top: desktop-vh(-20px);
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
      top: 50%;
      transform: translate(-50%, -50%);
      left: 50%;

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
</style>
