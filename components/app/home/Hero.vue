<template>
  <div class="app-home-hero block-inner">
    <div class="app-home-hero__inner grid">
      <AtomsCTABack
        :class="{ hide: !viewExteriorOpen || !DOMVisible }"
        @click.native="onVisit()"
      >
        Retour
      </AtomsCTABack>
      <ERichText
        ref="title"
        :class="{ hide: exteriorFullwidth }"
        class="app-home-hero__title"
        :content="contents.title"
      />
      <div ref="firstVisual" class="app-home-hero__first-visual">
        <nuxt-picture
          class="picture-absolute"
          provider="directus"
          :src="contents.pictureTop.src"
          :alt="contents.pictureTop.alt"
          format="webp"
        />
      </div>
      <div ref="secondVisual" class="app-home-hero__second-visual">
        <nuxt-picture
          class="picture-absolute"
          provider="directus"
          :src="contents.pictureBottom.src"
          :alt="contents.pictureBottom.alt"
          format="webp"
        />
      </div>
      <div
        :class="{ hide: viewExteriorOpen }"
        class="app-home-hero__scroll-indicator"
        @click="onClickScrollIndicator"
      >
        <TP1>{{ contents.scroll }}</TP1>
        <div class="app-home-hero__scroll-indicator__icon">
          <SvgHomeHeroUnion ref="union" />
        </div>
      </div>
      <div
        :class="{ hide: viewExteriorOpen || !DOMVisible }"
        class="app-home-hero__localisation"
      >
        <TP1 weight="bold" class="app-home-hero__localisation__city">
          {{ contents.city }}
        </TP1>
        <TP1
          :class="{ hide: viewExteriorOpen || !DOMVisible }"
          class="app-home-hero__localisation__place"
        >
          {{ contents.localisation }}
        </TP1>
      </div>
      <div ref="view" class="app-home-hero__view-exterior">
        <div class="app-home-hero__view-exterior__baseline">
          <AtomsTitleTag
            :class="{ hide: viewExteriorOpen || !DOMVisible }"
            class="app-home-hero__view-exterior__coordinate"
            bg="grey"
            color="black"
          >
            {{ contents.coordinate }}
          </AtomsTitleTag>
        </div>
        <AtomsCornerPoints lines-position="line-1, line-4" />

        <SvgHomeHeroSticker
          :class="{ hide: viewExteriorOpen }"
          class="app-home-hero__sticker"
        />
        <SvgHomeHeroStars
          :class="{ hide: viewExteriorOpen }"
          class="app-home-hero__stars"
        />
      </div>
      <AtomsTitleTag
        :class="{ hide: viewExteriorOpen || !DOMVisible }"
        class="app-home-hero__visit"
        :arrow="false"
        bg="red-adidas"
        color="black"
        @click.native="onVisit()"
      >
        {{ contents.visit }}
      </AtomsTitleTag>
      <EScrollIndicator :class="{ hide: !viewExteriorOpen || !DOMVisible }" />
    </div>
  </div>
</template>

<script>
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { mapState, mapMutations } from 'vuex'

import useWebGL from '~/hooks/webgl'

export default {
  props: {
    contents: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      viewExteriorOpen: false,
      DOMVisible: false,
      scissorsResizeInProgress: false,
    }
  },
  computed: {
    ...mapState({
      fontsLoaded: (state) => state.fontsLoaded,
      exteriorVisible: (state) => state.exteriorVisible,
      allLoadedFake: (state) => state.allLoadedFake,
      allLoadedActual: (state) => state.allLoadedActual,
      initialHeroDisplayed: (state) => state.initialHeroDisplayed,
      exteriorFullwidth: (state) => state.exteriorFullwidth,
    }),
  },
  watch: {
    fontsLoaded(payload) {
      if (!payload) return

      this.initSplitText()
    },
    allLoadedActual(payload) {
      if (!payload) return

      this.resetViewExterior()
    },
    initialHeroDisplayed(payload) {
      if (!payload) return

      this.appearHeroInit(0.1)
    },
    viewExteriorOpen(payload) {
      const { exterior } = useWebGL()

      if (payload) {
        gsap.to(exterior.position, {
          x: 0,
          z: 0,
          duration: 0.7,
          delay: 0.1,
          ease: 'power1.inOut',
        })

        this.disapearDOM()
      } else {
        gsap.to(exterior.position, {
          x: exterior.heroPosition.x,
          z: exterior.heroPosition.z,
          duration: 0.85,
          ease: 'power2.inOut',
        })

        gsap.to(exterior.drag, {
          target: 0,
          duration: 0.85,
          ease: 'power2.inOut',
        })

        this.appearDOM()
      }
    },
  },
  mounted() {
    if (this.fontsLoaded) {
      this.initSplitText()
    }

    if (this.allLoadedActual) {
      this.resetViewExterior()
      this.appearHeroInit(0.75)
    }

    this.setExteriorFullwidth(false)

    this.resizeObserver = new ResizeObserver(this.onResize)
    this.resizeObserver.observe(this.$refs.view)

    this.$raf.add(`home-hero`, this.onFrame)
  },
  beforeDestroy() {
    this.resizeObserver.unobserve(this.$refs.view)

    this.tl?.clear()
    this.tl?.kill()

    this.tlAppearHero?.clear()
    this.tlAppearHero?.kill()

    this.$raf.remove(`home-hero`, this.onFrame)
  },
  methods: {
    resetViewExterior() {
      const { exterior, camera } = useWebGL()

      exterior.drag.enabled = false

      exterior.position.copy(exterior.heroPosition)

      camera.position.copy(exterior.initialCamera.position)
      camera.rotation.copy(exterior.initialCamera.rotation)
      camera.zoom = exterior.zoom.initial
      camera.updateProjectionMatrix()
    },
    disapearDOM() {
      this.tlAppearHero?.clear()
      this.tlAppearHero?.kill()

      this.tlAppearHero = gsap
        .timeline()
        .to(this.split.lines, {
          y: '-80%',
          duration: 0.4,
          stagger: 0.035,
          ease: 'power1.inOut',
        })
        .to(
          this.split.lines,
          {
            opacity: 0,
            duration: 0.3,
            stagger: 0.035,
            ease: 'power1.inOut',
          },
          '<0%'
        )
        .to(
          this.$refs.secondVisual,
          {
            y: '70%',
            rotate: 10,
            duration: 0.5,
            ease: 'power1.inOut',
          },
          '<0%'
        )
        .to(
          this.$refs.secondVisual,
          {
            opacity: 0,
            duration: 0.45,
            ease: 'power1.inOut',
          },
          '<0%'
        )
        .to(
          this.$refs.firstVisual,
          {
            y: '-50%',
            rotate: -10,
            duration: 0.5,
            ease: 'power1.inOut',
          },
          '<0%'
        )
        .to(
          this.$refs.firstVisual,
          {
            opacity: 0,
            duration: 0.45,
            ease: 'power1.inOut',
          },
          '<0%'
        )
    },
    appearDOM() {
      this.tlAppearHero?.clear()
      this.tlAppearHero?.kill()

      const linesReversed = [...this.split.lines].reverse()

      this.tlAppearHero = gsap
        .timeline({ delay: 0.5 })
        .to(linesReversed, {
          y: '0',
          duration: 0.4,
          stagger: 0.05,
          ease: 'power1.inOut',
        })
        .to(
          linesReversed,
          {
            opacity: 1,
            duration: 0.4,
            stagger: 0.05,
            ease: 'power1.inOut',
          },
          '<10%'
        )
        .to(
          this.$refs.secondVisual,
          {
            y: '0%',
            rotate: -6,
            duration: 0.5,
            ease: 'power1.inOut',
          },
          '<0%'
        )
        .to(
          this.$refs.secondVisual,
          {
            opacity: 1,
            duration: 0.6,
            ease: 'power1.inOut',
          },
          '<0%'
        )
        .to(
          this.$refs.firstVisual,
          {
            y: '0%',
            rotate: 5,
            duration: 0.55,
            ease: 'power1.inOut',
          },
          '<0%'
        )
        .to(
          this.$refs.firstVisual,
          {
            opacity: 1,
            duration: 0.5,
            ease: 'power1.inOut',
          },
          '<0%'
        )
    },
    appearHeroInit(delay = 0) {
      this.tlAppearHeroInit?.clear()
      this.tlAppearHeroInit?.kill()

      const linesReversed = [...this.split.lines].reverse()

      this.tlAppearHeroInit = gsap
        .timeline({
          delay,
          onStart: () => {
            this.DOMVisible = true
          },
          onComplete: () => {
            this.initScrollTrigger()
          },
        })
        .fromTo(
          linesReversed,
          {
            y: '-80%',
          },
          {
            y: '0',
            duration: 0.4,
            stagger: 0.05,
            ease: 'power1.inOut',
          }
        )
        .fromTo(
          linesReversed,
          {
            opacity: 0,
          },
          {
            opacity: 1,
            duration: 0.4,
            stagger: 0.05,
            ease: 'power1.inOut',
          },
          '<10%'
        )
        .fromTo(
          this.$refs.secondVisual,
          {
            y: '70%',
            rotate: 10,
          },
          {
            y: '0%',
            rotate: -6,
            duration: 0.5,
            ease: 'power1.inOut',
          },
          '<0%'
        )
        .fromTo(
          this.$refs.secondVisual,
          {
            opacity: 0,
          },
          {
            opacity: 1,
            duration: 0.6,
            ease: 'power1.inOut',
          },
          '<0%'
        )
        .fromTo(
          this.$refs.firstVisual,
          {
            y: '-50%',
            rotate: -10,
          },
          {
            y: '0%',
            rotate: 5,
            duration: 0.55,
            ease: 'power1.inOut',
          },
          '<0%'
        )
        .fromTo(
          this.$refs.firstVisual,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.5,
            ease: 'power1.inOut',
          },
          '<0%'
        )
    },
    initSplitText() {
      const titleH1 = this.$refs.title.$el.querySelector('.H1')

      this.split = this.nestedLinesSplit(titleH1, {
        type: 'lines',
        linesClass: 'lineChild line',
      })
    },
    onVisit() {
      const { exterior } = useWebGL()

      this.viewExteriorOpen = !this.viewExteriorOpen
      this.setExteriorFullwidth(!this.exteriorFullwidth)

      exterior.drag.enabled = this.viewExteriorOpen

      const state = Flip.getState(this.$refs.view)

      this.$refs.view.classList.toggle('fullwidth')

      Flip.from(state, {
        absolute: true,
        duration: 0.65,
        delay: 0.15,

        onUpdate: () => {
          this.onResize()
        },
        ease: 'power1.inOut',
      })
    },
    onFrame() {
      if (!window.lenis && !this.exteriorVisible) return

      const { exterior, camera, renderer, scissors } = useWebGL()

      exterior.position.y =
        window.lenis.scroll / (camera.zoom - camera.zoom * 0.125)

      scissors.current.y = window.lenis.scroll + scissors.mask?.y

      renderer.setScissor(
        scissors.current.x,
        scissors.current.y,
        scissors.current.width,
        scissors.current.height
      )
    },
    onResize() {
      const { left, top, height, width } =
        this.$refs.view.getBoundingClientRect()

      const { scissors, renderer } = useWebGL()

      scissors.mask = {
        x: left,
        y: this.$viewport.height - top - height - window.lenis.scroll,
        width,
        height,
      }

      scissors.current = { ...scissors.mask }

      renderer.setScissor(
        scissors.current.x,
        scissors.current.y,
        scissors.current.width,
        scissors.current.height
      )
    },
    initScrollTrigger() {
      ScrollTrigger.create({
        trigger: this.$el,
        start: 'top bottom',
        end: 'bottom+=15% top',
        onToggle: (self) => this.setExteriorVisible(self.isActive),
      })

      gsap.to(this.$refs.firstVisual, {
        yPercent: -50,
        rotate: -6,
        scrollTrigger: {
          trigger: this.$el,
          scrub: 0.5,
          start: 'top top',
        },
      })

      gsap.to(this.$refs.secondVisual, {
        yPercent: -50,
        rotate: 6,
        scrollTrigger: {
          trigger: this.$el,
          scrub: 0.5,
          start: 'top top',
        },
      })

      if (!this.$viewport.isMobile) {
        this.tl = gsap.timeline({ repeat: -1, repeatDelay: 5 })

        this.tl.to(this.$refs.union.$el, {
          yPercent: 105,
          duration: 0.675,
        })

        this.tl.set(this.$refs.union.$el, {
          yPercent: -105,
        })

        this.tl.to(this.$refs.union.$el, {
          yPercent: 0,
          duration: 0.675,
          delay: 0.15,
        })
      }
    },
    onClickScrollIndicator() {
      if (!window.lenis) return

      window.lenis.scrollTo('.app-home-presentation', {
        duration: 1.2,
      })
    },
    nestedLinesSplit(target, vars) {
      const split = new SplitText(target, vars)
      const words = vars.type.includes('words')
      const chars = vars.type.includes('chars')
      const insertAt = function (a, b, i) {
        const l = b.length
        for (let j = 0; j < l; j++) {
          a.splice(i++, 0, b[j])
        }
        return l
      }
      let children
      let child
      let i
      if (typeof target === 'string') {
        target = document.querySelectorAll(target)
      }
      if (target.length > 1) {
        for (i = 0; i < target.length; i++) {
          split.lines = split.lines.concat(
            this.nestedLinesSplit(target[i], vars).lines
          )
        }
        return split
      }
      children = (words ? split.words : []).concat(chars ? split.chars : [])
      for (i = 0; i < children.length; i++) {
        children[i]._protect = true
      }
      children = split.lines
      for (i = 0; i < children.length; i++) {
        child = children[i].firstChild
        if (!child._protect && child.nodeType !== 3) {
          children[i].parentNode.insertBefore(child, children[i])
          children[i].parentNode.removeChild(children[i])
          children.splice(i, 1)
          i +=
            insertAt(children, this.nestedLinesSplit(child, vars).lines, i) - 1
        }
      }
      return split
    },
    ...mapMutations({
      setExteriorVisible: 'setExteriorVisible',
      setExteriorFullwidth: 'setExteriorFullwidth',
    }),
  },
}
</script>

<style lang="scss">
.app-home-hero {
  width: 100%;
  height: 100vh;
  padding-top: desktop-vw(40px);
  padding-bottom: desktop-vw(40px);

  @include mobile {
    height: 100%;
    padding-top: mobile-vw(190px);
    padding-bottom: 0px;
  }

  &__inner {
    width: 100%;
    height: 100%;
    border: 1px solid #181818;
    position: relative;

    @include mobile {
      border: none;
    }
  }

  .app-element-scroll-indicator {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    transition: opacity 0.35s var(--ease-in-out-cubic);
    transition-delay: 0.65s;

    &.hide {
      opacity: 0;
      pointer-events: none;
      transition-delay: 0s;
    }
  }

  .app-atoms-cta-back {
    transition: opacity 0.35s var(--ease-in-out-cubic);
    transition-delay: 0.65s;
    top: desktop-vw(25px);
    left: desktop-vw(25px);
    position: absolute;

    &.hide {
      opacity: 0;
      pointer-events: none;
      transition-delay: 0s;
    }
  }

  &__sticker,
  &__stars {
    transition: transform 0.35s var(--ease-in-out-cubic);
    transition-delay: 0.65s;

    &.hide {
      transform: translate(-50%, -50%) scale(0) rotate(45deg);
      transition-delay: 0s;
    }
  }

  &__sticker {
    position: absolute;
    grid-column: 8 / span 5;
    transform: translate(-50%, -50%) scale(1) rotate(0deg);
    top: 30%;
    left: 0;
    z-index: 9;
    width: desktop-vw(110px);
    height: desktop-vw(110px);

    @include mobile {
      display: none;
    }
  }

  &__stars {
    position: absolute;
    grid-column: 7 / span 2;
    transform: translate(-50%, -50%) scale(1) rotate(0deg);
    left: -12%;
    top: 17%;
    z-index: 9;

    @include mobile {
      display: none;
    }
  }

  &__view-exterior {
    grid-column: 8 / span 5;
    align-self: flex-end;
    display: flex;
    justify-content: space-between;
    aspect-ratio: 575/885;
    height: auto;
    position: absolute;
    right: 0;
    bottom: 0;
    width: 100%;
    max-height: calc(85vh - desktop-vw(80px));
    transform-origin: right bottom;
    will-change: transform, width, height;

    &.fullwidth {
      grid-column: 1 / span 12;
      max-height: 100%;
      height: 100%;
    }

    @include mobile {
      grid-column: 1 / span 6;
      height: auto;
      aspect-ratio: 345 / 665;
      margin-top: mobile-vw(135px);
      width: 100%;
    }

    @include desktop {
      .app-atoms-corner-points {
        border-bottom: none !important;
        border-right: none !important;
      }
    }

    &__baseline {
      display: flex;
      justify-content: space-between;
      flex-direction: row;

      width: 100%;
      padding: desktop-vw(0px) desktop-vw(20px) desktop-vw(20px)
        desktop-vw(20px);
      z-index: 1;
      position: absolute;
      bottom: 0;
      left: 0;

      @include mobile {
        height: 100%;
        padding: mobile-vw(18px) mobile-vw(18px) mobile-vw(18px) mobile-vw(18px);
        flex-direction: column;
      }
    }

    &__coordinate.app-atoms-title-tag {
      padding: desktop-vw(10px) desktop-vw(15px);
      display: block;

      transition: opacity 0.35s var(--ease-in-out-cubic);
      transition-delay: 0.65s;

      &.hide {
        opacity: 0;
        transition-delay: 0s;
        pointer-events: none;
      }

      @include mobile {
        padding: mobile-vw(10px) mobile-vw(15px);
        align-self: flex-start;
      }

      .P2.bold {
        @include font-adihausDIN-medium();
        font-size: desktop-vw(16px);
        line-height: desktop-vw(21px);

        @include mobile {
          font-size: mobile-vw(16px);
          line-height: mobile-vw(16px);
        }
      }
    }
  }

  &__visit.app-atoms-title-tag {
    padding: desktop-vw(10px) desktop-vw(15px);
    display: block;
    position: absolute;
    right: desktop-vw(20px);
    bottom: desktop-vw(20px);
    cursor: pointer;
    transition: opacity 0.35s var(--ease-in-out-cubic);
    transition-delay: 0.65s;

    &.hide {
      opacity: 0;
      transition-delay: 0s;
      pointer-events: none;
    }

    @include mobile {
      right: mobile-vw(18px);
      bottom: mobile-vw(18px);
      padding: mobile-vw(10px) mobile-vw(15px);
      align-self: flex-end;
      display: block;
    }

    .P2.bold {
      text-transform: uppercase;
      @include font-adihausDIN-cn-medium();
      font-size: desktop-vw(16px);
      line-height: desktop-vw(21px);

      @include mobile {
        font-size: mobile-vw(16px);
        line-height: mobile-vw(16px);
      }
    }
  }

  &__title.app-element-rich-text {
    grid-column: 2 / span 6;
    align-self: center;
    z-index: 1;
    max-width: min(620px, desktop-vw(720px));
    position: relative;

    &.hide {
      pointer-events: none;
    }

    .app-atoms-stroke-text {
      display: block;
    }

    .lineParent {
      overflow: hidden;
    }

    .H1,
    h1 {
      font-size: min(130px, desktop-vw(130px)) !important;
      line-height: min(110px, desktop-vw(110px)) !important;

      @include mobile {
        font-size: min(80px, mobile-vw(80px)) !important;
        line-height: min(86px, mobile-vw(86px)) !important;
      }
    }

    @include mobile {
      grid-column: 1 / span 6;
      max-width: 100%;
    }
  }

  &__first-visual {
    position: absolute !important;
    left: 0;
    top: desktop-vw(-250px);
    // max-width: 350px;
    min-width: 250px;
    grid-column: 1 / span 3;
    width: 100%;
    aspect-ratio: 350 / 440;
    transform: rotate(5deg);
    @include noise();

    @include mobile {
      grid-column: 1 / span 4;
      width: 80%;
      min-width: 75%;
      aspect-ratio: 185 / 235;
      top: mobile-vw(-225px);
    }
  }
  &__second-visual {
    position: absolute !important;
    left: 0;
    bottom: calc(min(-20px, desktop-vw(65px)));
    grid-column: 4 / span 3;
    width: 75%;
    min-width: 200px;
    aspect-ratio: 255 / 320;
    transform: rotate(-6deg);
    @include noise();

    @include mobile {
      grid-column: 4 / span 2;
      width: 100%;
      min-width: 100%;
      aspect-ratio: 115 / 145;
      top: mobile-vw(300px);
    }
  }

  &__localisation,
  &__city {
    transition: opacity 0.35s var(--ease-in-out-cubic);
    transition-delay: 0.4s;

    &.hide {
      opacity: 0;
      pointer-events: none;
      transition-delay: 0s;
    }
  }

  &__localisation {
    position: absolute;
    bottom: 15px;
    left: 0;
    grid-column: 2 / span 6;
    display: flex;
    flex-direction: column;

    @include mobile {
      display: none;
    }

    &__city {
      @include font-adihausDIN-bold();
    }
    &__place {
    }
  }

  &__scroll-indicator {
    position: absolute;
    bottom: 0;
    left: 0;
    padding: desktop-vw(25px) desktop-vw(15px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-top: 1px solid #181818;
    border-right: 1px solid #181818;
    opacity: 1;
    cursor: pointer;
    transition: opacity 0.35s var(--ease-in-out-cubic);
    transition-delay: 0.4s;

    &.hide {
      opacity: 0;
      pointer-events: none;
      transition-delay: 0s;
    }

    @include mobile {
      display: none;
    }

    .P1 {
      font-size: 12px;
      line-height: 15px;
    }

    &__icon {
      margin-top: desktop-vw(25px);
      overflow: hidden;
    }
  }
}
</style>
