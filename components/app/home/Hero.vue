<template>
  <div :class="{ open: viewExteriorOpen }" class="app-home-hero block-inner">
    <div ref="firstVisual" class="app-home-hero__first-visual">
      <nuxt-picture
        class="picture-absolute"
        provider="directus"
        :src="contents.pictureTop.src"
        :alt="contents.pictureTop.alt"
        format="webp"
        sizes="sm:50vw md:30vw"
      />
    </div>
    <div ref="secondVisual" class="app-home-hero__second-visual">
      <nuxt-picture
        class="picture-absolute"
        provider="directus"
        :src="contents.pictureBottom.src"
        :alt="contents.pictureBottom.alt"
        format="webp"
        sizes="sm:50vw md:30vw"
      />
    </div>
    <div class="app-home-hero__inner grid">
      <EHeroInstructions />
      <EEnterArena
        :class="{
          hide: !exteriorArenaHovered || !exteriorFullscreen || !DOMVisible,
        }"
        @onEnterArena="onEnterArena"
      />
      <AtomsCTABack
        :class="{ hide: !viewExteriorOpen || !DOMVisible }"
        @click.native="onVisit()"
      >
        Retour
      </AtomsCTABack>

      <ERichText
        ref="title"
        :class="{ hide: exteriorFullscreen }"
        class="app-home-hero__title"
        :content="contents.title"
        tag="H2"
      />

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
      <div
        ref="view"
        class="app-home-hero__view-exterior"
        :data-allow-drag="true"
        @click="!viewExteriorOpen && !$viewport.isMobile ? onVisit() : ''"
      >
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
        <AtomsCornerPoints />
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
      <EScrollIndicator
        :class="{ hide: !viewExteriorOpen || !DOMVisible }"
        @click.native="scrollHero()"
      />
    </div>
  </div>
</template>

<script>
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { mapState, mapMutations } from 'vuex'
// import { MathUtils } from 'three'

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
      hideInstructions: true,
    }
  },
  computed: {
    ...mapState({
      fontsLoaded: (state) => state.fontsLoaded,
      exteriorVisible: (state) => state.exteriorVisible,
      allLoadedFake: (state) => state.allLoadedFake,
      allLoadedActual: (state) => state.allLoadedActual,
      initialHeroDisplayed: (state) => state.initialHeroDisplayed,
      exteriorFullscreen: (state) => state.exteriorFullscreen,
      exteriorArenaHovered: (state) => state.exteriorArenaHovered,
      instructionsWebglVisible: (state) => state.instructionsWebglVisible,
    }),
  },
  watch: {
    // exteriorFullscreen(newVal) {
    //   this.hideInstructions = false
    // },
    fontsLoaded(newVal) {
      if (!newVal || this.$viewport.isMobile) return

      this.initSplitText()
    },
    initialHeroDisplayed(newVal) {
      if (!newVal) return

      if (this.$viewport.isMobile) {
        this.setAllowScroll(true)
        this.resetView()
        this.onResizePreviewExterior()
      } else {
        this.appearHeroInit(0.1)
      }
    },
    allLoadedFake() {
      this.resetView()
      this.onResizePreviewExterior()
    },
    viewExteriorOpen(newVal) {
      const { exterior } = useWebGL()

      if (newVal) {
        gsap.to(exterior.position, {
          x: 0,
          z: 0,
          duration: 0.7,
          delay: 0.1,
          ease: 'power1.inOut',
        })

        if (!this.$viewport.isMobile) this.disapearDOM()
      } else {
        gsap.to(exterior.position, {
          x: exterior.homeCustomPosition.x,
          z: exterior.homeCustomPosition.z,
          duration: 0.85,
          ease: 'power2.inOut',
        })

        gsap.to(exterior.drag, {
          target: 0,
          duration: 0.85,
          ease: 'power2.inOut',
        })

        if (!this.$viewport.isMobile) this.appearDOM()
      }
    },
  },
  mounted() {
    if (this.allLoadedFake && !this.$viewport.isMobile) {
      this.initSplitText()
      this.appearHeroInit(0.75)
      this.resetView()
    } else if (this.allLoadedFake && this.$viewport.isMobile) {
      this.setAllowScroll(true)
    } else if (this.allLoadedFake) {
      this.resetView()
    }

    if (this.$viewport.isMobile) {
      this.DOMVisible = true
      this.onResizePreviewExterior()
    }

    this.resizeObserver = new ResizeObserver(this.onResizePreviewExterior)
    this.resizeObserver.observe(this.$refs.view)

    this.$raf.add(`home-hero`, this.onFrame)

    window.addEventListener('keyup', this.onKeyUp)
  },

  beforeDestroy() {
    this.resizeObserver?.unobserve(this.$refs.view)

    this.tl?.clear()
    this.tl?.kill()

    this.scrollTrigger?.kill()

    this.tlAppearHero?.clear()
    this.tlAppearHero?.kill()

    this.$raf.remove(`home-hero`, this.onFrame)

    this.tlTest?.kill()

    window.removeEventListener('keyup', this.onKeyUp)
  },
  methods: {
    onEnterArena() {
      this.DOMVisible = false
      this.setAppCursor('initial')

      this.$router.push({ name: 'arena', params: { enterArena: true } })
    },
    onKeyUp(e) {
      if (e.key === 'Escape' && this.viewExteriorOpen && this.exteriorVisible) {
        this.onVisit()
      }
    },
    resetView() {
      this.setExteriorFullscreen(false)

      const { exterior } = useWebGL()

      exterior.drag.enabled = this.$viewport.isMobile

      this.$nuxt.$emit('reset:exterior')
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
          duration: 0.6,
          stagger: 0.05,
          ease: 'power3.out',
        })
        .to(
          linesReversed,
          {
            opacity: 1,
            duration: 0.65,
            stagger: 0.05,
            ease: 'power3.out',
          },
          '<10%'
        )
        .to(
          this.$refs.secondVisual,
          {
            y: '0%',
            rotate: -6,
            duration: 0.65,
            ease: 'power3.out',
          },
          '<0%'
        )
        .to(
          this.$refs.secondVisual,
          {
            opacity: 1,
            duration: 0.7,
            ease: 'power3.out',
          },
          '<0%'
        )
        .to(
          this.$refs.firstVisual,
          {
            y: '0%',
            rotate: 5,
            duration: 0.65,
            ease: 'power3.out',
          },
          '<0%'
        )
        .to(
          this.$refs.firstVisual,
          {
            opacity: 1,
            duration: 0.7,
            ease: 'power3.out',
          },
          '<0%'
        )
    },
    scrollHero() {
      if (!window.lenis) return

      window.lenis.scrollTo('.app-element-programmation-slider', {
        duration: 1.2,
      })
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
            duration: 0.6,
            stagger: 0.05,
            ease: 'power3.out',
          }
        )
        .fromTo(
          linesReversed,
          {
            opacity: 0,
          },
          {
            opacity: 1,
            duration: 0.6,
            stagger: 0.05,
            ease: 'power3.out',
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
            duration: 0.7,
            ease: 'power3.out',
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
            duration: 0.8,
            ease: 'power3.out',
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
            duration: 0.75,
            ease: 'power3.out',
          },
          '<0%'
        )
        .fromTo(
          this.$refs.firstVisual,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
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

      if (this.$viewport.isMobile) {
        this.$router.push({ path: '/arena' })
      } else {
        this.viewExteriorOpen = !this.viewExteriorOpen
        this.setExteriorFullscreen(!this.exteriorFullscreen)

        exterior.drag.enabled = this.viewExteriorOpen

        const state = Flip.getState(this.$refs.view)

        this.$refs.view.classList.toggle('fullwidth')

        Flip.from(state, {
          absolute: true,
          duration: 0.65,
          delay: 0.15,

          onUpdate: () => {
            this.onResizePreviewExterior()
          },
          ease: 'power1.inOut',
        })
      }
    },
    onFrame() {
      if (!window.lenis && !this.exteriorVisible) return

      const { exterior, camera, renderer, scissors } = useWebGL()

      exterior.position.y =
        (window.lenis?.scroll + scissors.mask?.y) /
        (camera.zoom - camera.zoom * 0.125)

      scissors.current.y = window.lenis?.scroll + scissors.mask?.y

      renderer.setScissor(
        scissors.current.x,
        scissors.current.y,
        scissors.current.width,
        scissors.current.height
      )
    },
    onResizePreviewExterior() {
      const { scissors, renderer } = useWebGL()

      const { left, top, height, width } =
        this.$refs.view.getBoundingClientRect()

      scissors.mask = {
        x: left,
        y: this.$viewport.height - top - height - window.lenis?.scroll,
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
      this.setAllowScroll(true)

      this.scrollTrigger = ScrollTrigger.create({
        trigger: this.$el,
        start: 'top bottom',
        end: 'bottom+=15% top',
        onToggle: (self) => {
          this.setExteriorVisible(self.isActive)

          if (self.isActive || this.exteriorVisible) {
            this.onResizePreviewExterior()
          }
        },
      })

      if (!this.$viewport.isMobile) {
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

      window.lenis.scrollTo('.app-element-programmation-slider', {
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
      setExteriorFullscreen: 'setExteriorFullscreen',
      setAllowScroll: 'setAllowScroll',
      setAppCursor: 'setAppCursor',
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
  position: relative;

  &:not(.open) {
    .app-home-hero__view-exterior {
      cursor: pointer;
    }
  }

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
    .app-element-enter-arena {
      @include mobile {
        display: none;
      }
    }

    .app-element-scroll-indicator {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      transition: opacity 0.35s var(--ease-in-out-cubic);
      transition-delay: 0.65s;

      @include mobile {
        display: none;
      }

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

      @include mobile {
        display: none;
      }

      &.hide {
        opacity: 0;
        pointer-events: none;
        transition-delay: 0s;
      }
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
    width: min(110px, desktop-vw(110px));
    height: min(110px, desktop-vw(110px));

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

    @include mobile {
      grid-column: 1 / span 6;
      height: 100%;
      aspect-ratio: 345 / 665;
      margin-top: mobile-vw(120px);
      width: 100%;
      position: relative;
    }

    &.fullwidth {
      grid-column: 1 / span 12;
      max-height: 100%;
      height: 100%;
    }

    @include desktop {
      .app-atoms-corner-points {
        &__line--right,
        &__line--bottom {
          display: none;
        }
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
      pointer-events: none;

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
    grid-column: 2 / span 7;
    align-self: center;
    z-index: 1;
    max-width: 700px;
    position: relative;
    left: -5%;

    .app-atoms-stroke-text {
      -webkit-text-stroke: 1px var(--c-black);
      -webkit-text-fill-color: transparent;
    }

    @include mobile {
      grid-column: 1 / span 6;
      max-width: 100%;
      left: 0%;
    }

    &.hide {
      pointer-events: none;
    }

    .lineParent {
      overflow: hidden;
    }

    .H1,
    h1 {
      font-size: min(130px, desktop-vw(130px));
      line-height: min(110px, desktop-vw(110px));

      @include mobile {
        font-size: mobile-vw(80px);
        line-height: mobile-vw(72px);
      }
    }
  }

  &__first-visual {
    position: absolute !important;
    top: desktop-vw(-200px);
    min-width: 250px;
    width: columns(3);
    left: var(--layout-margin);
    aspect-ratio: 350 / 440;
    transform: rotate(5deg);
    @include noise();

    @include mobile {
      width: columns(3);
      min-width: initial;
      aspect-ratio: 185 / 235;
      top: mobile-vw(-50px);
    }
  }
  &__second-visual {
    position: absolute !important;
    bottom: calc(min(-20px, desktop-vw(100px)));
    width: columns(2.25);
    left: columns(3.75);
    min-width: 200px;
    aspect-ratio: 255 / 320;
    transform: rotate(-6deg);
    @include noise();

    @include mobile {
      width: columns(2);
      min-width: initial;
      aspect-ratio: 115 / 145;
      top: mobile-vw(500px);
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

    @include mobile {
      display: none;
    }

    &.hide {
      opacity: 0;
      pointer-events: none;
      transition-delay: 0s;
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
