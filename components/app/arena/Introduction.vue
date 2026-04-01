<template>
  <div class="app-arena-introduction grid-inner">
    <div class="app-arena-introduction__title">
      <ERichText ref="title" :split="false" tag="h1" :content="contents.title" />
    </div>

    

    <EParallax
      ref="video"
      v-if="videoFrame?.video?.id"
      class="app-arena-introduction__video"
      :speed="1"
    >
      <EKinesis :speed="5">
        <div
          v-if="videoFrame?.image && videoFrame?.image !== ''"
          :class="{ invisible: hideVideoOverlay }"
          class="app-arena-introduction__video__overlay"
          @click="hideVideoOverlay = true"
        >
          <TH1 tag="p" weight="bold" color="white">PLAY</TH1>
          <nuxt-img
            :src="videoFrame.image"
            :alt="contents.title"
            provider="directus"
            loading="lazy"
            sizes="sm:35vw md:20vw"
          />

        </div>
        <client-only>
          <iframe
            :class="{ invisible: videoFrame.image && videoFrame.image !== ''?!hideVideoOverlay:hideVideoOverlay }"
            :src="`https://www.youtube-nocookie.com/embed/${videoFrame.video.id}?modestbranding=1&rel=0&cc_load_policy=1&iv_load_policy=3&hl=fr-fr&fs=0&controls=0&disablekb=1`"
            frameborder="0"
          />
        </client-only>
      </EKinesis>
    </EParallax>

    <div class="app-arena-introduction__row2 grid-inner">
      <div ref="visualFramed" class="app-arena-introduction__visual">
        <EKinesis :speed="5">
         <nuxt-picture
            provider="directus"
            :src="contents.pictureFramedImage"
            format="webp"
            :alt="contents.pictureFramedAlt"
            sizes="sm:35vw md:50vw"
          />
        </EKinesis>
      </div>

      <div class="app-arena-introduction__text">
        <ERichText
          ref="paragraph"
          tag="p"
          weight="medium"
          :content="contents.paragraph"
        />
      </div>
    </div>

  </div>

</template>

<script>
import { gsap } from 'gsap'
import { mapMutations, mapState } from 'vuex'
import { SplitText } from 'gsap/SplitText'

export default {
  props: {
    contents: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      hideVideoOverlay: false,
    }
  },
  computed: {
    ...mapState({
      interiorVisible: (state) => state.interiorVisible,
      allLoadedActual: (state) => state.allLoadedActual,
      allLoadedFake: (state) => state.allLoadedFake,
      initialHeroDisplayed: (state) => state.initialHeroDisplayed,
      fontsLoaded: (state) => state.fontsLoaded,
    }),
    videoFrame() {
      const videoItem = {};
      videoItem.url = this.contents.video_url;
      const itemCover = this.contents.video_cover;

      //  console.log('itemCover', itemCover)

      const image = (itemCover && itemCover != null)? itemCover : ''

      // console.log('image', image)

      //  console.log('videoFrame / videoItem', videoItem);

      if (videoItem && videoItem.url != null) {
        videoItem.id = this.getYouTubeVideoId(videoItem.url);
      }

      return videoItem && videoItem.url !== null ? { video: videoItem, image } : false
      //  return videoItem ? { video: videoItem, image } : false
    },
  },
  watch: {
    initialHeroDisplayed(newVal) {
      if (!newVal) return

      if (this.$viewport.isMobile) {
        this.setAllowScroll(true)
      } else {
        this.appearHero(0.15)
      }
    },
    fontsLoaded(newVal) {
      //  if (!newVal || this.$viewport.isMobile) return

      //  this.initSplitText()
    },
  },
  mounted() {
    if (this.allLoadedFake && !this.$viewport.isMobile) {
      // this.initSplitText()
      this.appearHero(0.85)
    } else if (this.allLoadedFake && this.$viewport.isMobile) {
      this.setAllowScroll(true)
    }
    this.initMatchMedia();
  },
  beforeDestroy() {
    this.mm?.revert()
    this.tlAppear?.kill()
  },
  methods: {
    initSplitText() {
      const title = this.$refs.title.$el.querySelectorAll('.H2')

      this.splittingChild = new SplitText(title, {
        type: 'lines',
        linesClass: 'line-child',
      })

      this.splittingParent = new SplitText(title, {
        type: 'lines',
        linesClass: 'line-parent',
      })
    },
    appearHero(delay = 0) {
      this.tlAppear?.clear()
      this.tlAppear?.kill()

      this.tlAppear = gsap
        .timeline({
          delay,
          onComplete: () => {
            this.initMatchMedia()
          },
        })
        .addLabel('texts')
        .fromTo(
          [this.$refs.paragraph.$el],
          {
            y: -30,
          },
          {
            y: 0,
            duration: 0.6,
            ease: 'power3.out',
          },
          'texts+=15%'
        )
        .fromTo(
          [this.$refs.paragraph.$el],
          {
            opacity: 0,
          },
          {
            opacity: 1,
            duration: 0.85,
            ease: 'power3.out',
          },
          'texts+=15%'
        )
        .addLabel('visuals', 'texts')
        .fromTo(
          this.$refs.visualFramed,
          {
            y: '40%',
            rotate: -10,
          },
          {
            y: '0%',
            rotate: -4,
            duration: 0.5,
            ease: 'power3.out',
          },
          'visuals'
        )
        .fromTo(
          this.$refs.visualFramed,
          {
            opacity: 0,
          },
          {
            opacity: 1,
            duration: 0.55,
            ease: 'power3.out',
          },
          'visuals+=5%'
        )

    },
    initMatchMedia() {
      this.setAllowScroll(true)

      this.mm = gsap.matchMedia()

      this.mm.add('(min-width: 768px)', (context) => {
        const tweenFramed = gsap.to(this.$refs.visualFramed, {
          yPercent: -10,
          rotate: 2,
          scrollTrigger: {
            trigger: this.$el,
            scrub: 0.5,
            start: `top top+=${window.innerWidth * 0.138888}`, // padding-top value
          },
        })

        let tweenVideo

        if (this.videoFrame) {
          tweenVideo = gsap.fromTo(
            this.$refs.video.$el,
            {
              rotate: 10,
            },
            {
              rotate: 4,
              scrollTrigger: {
                trigger: this.$refs.video.$el,
                scrub: 0.5,
                end: 'bottom top',
              },
            }
          )
        }

        

        return () => {
          tweenFramed?.kill()
          tweenVideo?.kill()
        }
      })
    },
    
    getYouTubeVideoId(url) {
      return this.$getYoutubeVideoID(url)
    },
    ...mapMutations({
      setAllowScroll: 'setAllowScroll',
    }),
  },
}
</script>

<style lang="scss">
.app-arena-introduction {
  position: relative;
  margin-top: desktop-vw(130px);

  @include mobile{
    margin-top: mobile-vw(40px);
  }

  &__title {
    grid-column: 1 / span 8;
    grid-row: 1;
    display: flex;
    flex-direction: column;
    width: 100%;

    @include mobile {
      grid-column: 1 / span 6;
      width: 100%;
    }

    .H2.medium{
      font-size: desktop-vw(135px);
      line-height: desktop-vw(127px);

      @include mobile {
        font-size: mobile-vw(54px);
        line-height: mobile-vw(50px);
      }

      .wysiwyg-stroke{
        @include font-ITCFranklinGothicLT-DmCp();
        -webkit-text-stroke: 1px #181818;
      }
    }

  }

  &__visual {
    grid-column: 2 / span 4;
    grid-row: 1;
    aspect-ratio: 310 / 385;
    width: 90%;
    z-index: 2;
    transform: rotate(-10deg);

    @include mobile {
      grid-row: 2;
      grid-column: 2 / span 4;
      margin-left: 0px;
      margin-top: mobile-vw(25px);
      aspect-ratio: 310 / 385;
    }

    picture {
      position: relative;
      @include noise();
    }

    .app-element-framed-picture {
      height: 100%;
    }
  }

  &__video.app-parallax {
    position: absolute;
    aspect-ratio: 640 / 425;
    width: desktop-vw(640px);
    top: desktop-vw(450px);
    left: desktop-vw(400px);
    transform: rotate(10deg);
    z-index: 3;

    @include mobile {
      aspect-ratio: 640 / 425;
      width: mobile-vw(265px);
      top: mobile-vw(200px);
      left: mobile-vw(50px);
      transform: rotate(-4deg);
    }

    .app-element-kinesis {
      display: flex;
      align-items: center;
      justify-content: center;

      @include hover {
        &:hover {
          cursor: pointer;
        }
      }
    }

    iframe {
      position: absolute;
      width: 100%;
      height: 100%;

      &.invisible {
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
        display: none;
      }
    }

    picture {
      width: 100%;
      height: 100%;
      display: block;
      pointer-events: none;
    }

    .app-arena-introduction__video__overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 4;
      transition: opacity 0.4s 0.1s var(--ease-in-out-cubic);

      &.invisible {
        opacity: 0;
        pointer-events: none;
      }

      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.2);
        pointer-events: none;
      }

      .H1 {
        position: absolute;
        z-index: 1;
        pointer-events: none;
      }
    }
  }

  &__row2{
    grid-row: 2;
    grid-column: 1 / span 12;
    margin-top: desktop-vw(500px);

     @include mobile {
      grid-column: 1 / span 6;
      margin-top: mobile-vw(100px);
     }
  }
  
  &__text {
    grid-column: 7 / span 6;

    @include mobile {
      grid-column: 1 / span 6;
      margin-top: mobile-vw(-25px);
      grid-row: 4;
    }

    .app-element-rich-text {
      .P2.wysiwyg-text {
        font-size: desktop-vw(67px);
        line-height: desktop-vw(60px);
        @include font-ITCFranklinGothicLT-DmCp();
        text-transform: uppercase;

        @include mobile {
          font-size: mobile-vw(32px);
          line-height: mobile-vw(26px);
        }

        &:first-child {
          margin-top: desktop-vw(30px);
        }
      }
    }
  }
}
</style>
