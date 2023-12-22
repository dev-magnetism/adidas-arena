<template>
  <div v-if="elHide" class="app-programmation-event-about-artist grid-inner">
    <div
      v-if="imageFrame || imageWithoutFrame || videoFrame"
      class="app-programmation-event-about-artist__left"
    >
      <EParallax
        v-if="imageFrame"
        ref="withFrame"
        class="app-programmation-event-about-artist__visual-with-frame"
        :speed="0.85"
      >
        <EKinesis :speed="6">
          <AppProgrammationImage
            :src="imageFrame.filename_disk"
            :alt="imageFrame.title"
            :sizes="{
              desktop: 'w400,h400,fcrop,q85',
              mobile: 'w400,h400,fcrop,q85',
            }"
          />
          <ELottie id="Cadre_01" start="top bottom-=15%" />
        </EKinesis>
      </EParallax>
      <EParallax
        v-if="imageWithoutFrame"
        ref="withoutFrame"
        class="app-programmation-event-about-artist__visual-without-frame"
        :speed="0.95"
      >
        <EKinesis :speed="7">
          <AppProgrammationImage
            :src="imageWithoutFrame.filename_disk"
            :alt="imageWithoutFrame.title"
            :sizes="{
              desktop: 'w400,h400,fcrop,q85',
              mobile: 'w400,h400,fcrop,q85',
            }"
          />
        </EKinesis>
      </EParallax>
      <EParallax
        v-if="videoFrame"
        ref="video"
        class="app-programmation-event-about-artist__video"
        :speed="1"
      >
        <EKinesis :speed="5">
          <div
            v-if="videoFrame.image && videoFrame.image !== ''"
            :class="{ invisible: hideVideoOverlay }"
            class="app-programmation-event-about-artist__video__overlay"
            @click="hideVideoOverlay = true"
          >
            <TH1 tag="p" weight="bold" color="white">PLAY</TH1>

            <AppProgrammationImage
              :src="videoFrame.image.filename_disk"
              :alt="videoFrame.image.title"
              :sizes="{
                desktop: 'w400,h400,fcrop,q85',
                mobile: 'w400,h400,fcrop,q85',
              }"
            />
          </div>
          <client-only>
            <iframe
              :class="{ invisible: !hideVideoOverlay }"
              :src="`https://www.youtube-nocookie.com/embed/${videoFrame.video.id}?modestbranding=1&rel=0&cc_load_policy=1&iv_load_policy=3&hl=fr-fr&fs=0&controls=0&disablekb=1`"
              frameborder="0"
            />
          </client-only>
        </EKinesis>
      </EParallax>
    </div>
    <div class="app-programmation-event-about-artist__right">
      <TH2 v-if="event.content.about_headline" weight="bold">{{
        event.content.about_headline
      }}</TH2>
      <ERichTextEvent
        v-if="event.content.about_text"
        :component="{ name: 'TP2', weight: 'medium', tagTarget: 'p', tag: 'p' }"
        :content="event.content.about_text"
      />
      <AtomsSpotify
        v-for="(tile, index) in event.content.spotify_tiles"
        :key="index"
        :index="index"
        :tile="tile"
      />
    </div>
  </div>
</template>

<script>
import { gsap } from 'gsap'

export default {
  props: {
    event: {
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
    mediaGalleryImages() {

      const _mediaGallery = JSON.parse(JSON.stringify(this.event.content.media_gallery))

      const mediaGallery = _mediaGallery.filter(
        (item) => !item.youtube_url
      )

      //  const mediaVideo = _mediaGallery.filter(
      //    (item) => item.youtube_url
      //  )

      // mediaGallery = (mediaVideo && !mediaVideo.image)? mediaGallery.splice(0, mediaGallery.length - 1): mediaGallery;

      return mediaGallery
    },
    imageFrame() {
      return this.mediaGalleryImages.length >= 1 
        ? this.mediaGalleryImages[0].image
        : null
    },
    imageWithoutFrame() {
      return this.mediaGalleryImages.length >= 2
        ? this.mediaGalleryImages[1].image
        : null
    },
    videoFrame() {
      const itemsMedia = this.event.content.media_gallery || []
      const videoItem = itemsMedia.find((item) => item.youtube_url);
      const itemCover = this.event.cover_video

      // console.log('videoItem', videoItem)

      // console.log('itemCover', itemCover)

      const image = (itemCover && itemCover != null && itemCover.image)? itemCover.image : ''

      // console.log('image', image)

      if (videoItem && videoItem !== 'undefined') {
        videoItem.id = this.getYouTubeVideoId(videoItem.youtube_url)
      }
      
      return videoItem && videoItem !== 'undefined' ? { video: videoItem, image } : false
      //  return videoItem ? { video: videoItem, image } : false
    },
    elHide() {
      return (
        this.imageFrame ||
        this.imageWithoutFrame ||
        this.videoFrame ||
        this.event.content.about_headline ||
        this.event.content.about_text
      )
    },
  },

  mounted() {
    this.initMatchMedia()
  },
  beforeDestroy() {
    this.mm?.revert()
  },
  methods: {
    initMatchMedia() {
      this.mm = gsap.matchMedia()

      this.mm.add('(min-width: 768px)', (context) => {
        let tweenFrame

        if (this.imageFrame) {
          tweenFrame = gsap.fromTo(
            this.$refs.withFrame.$el,
            {
              rotate: -8,
            },
            {
              rotate: -2,
              scrollTrigger: {
                trigger: this.$refs.withFrame.$el,
                scrub: 0.5,
                end: 'bottom top',
              },
            }
          )
        }

        let tweenVideo

        if (this.videoFrame) {
          tweenVideo = gsap.fromTo(
            this.$refs.video.$el,
            {
              rotate: -8,
            },
            {
              rotate: -4,
              scrollTrigger: {
                trigger: this.$refs.video.$el,
                scrub: 0.5,
                end: 'bottom top',
              },
            }
          )
        }

        let tweenWithoutFrame

        if (this.imageWithoutFrame) {
          tweenWithoutFrame = gsap.fromTo(
            this.$refs.withoutFrame.$el,
            {
              rotate: 4,
            },
            {
              rotate: 1,
              scrollTrigger: {
                trigger: this.$refs.withoutFrame.$el,
                scrub: 0.5,
                end: 'bottom top',
              },
            }
          )
        }

        return () => {
          tweenFrame?.kill()
          tweenWithoutFrame?.kill()
          tweenVideo?.kill()
        }
      })
    },
    getYouTubeVideoId(url) {
      const match = url.match(/[?&]v=([^&#]*)/)
      return match ? match[1] : false
    },
  },
}
</script>

<style lang="scss">
.app-programmation-event-about-artist {
  position: relative;
  margin-top: desktop-vw(350px);
  margin-bottom: desktop-vw(185px);

  @include mobile {
    margin-top: mobile-vw(110px);
    margin-bottom: mobile-vw(110px);
  }

  &__left {
    grid-column: 1 / span 8;
    position: relative;

    @include mobile {
      grid-column: 1 / span 6;
      grid-row: 1;
    }
  }

  &__video.app-parallax {
    position: absolute;
    aspect-ratio: 640 / 425;
    width: desktop-vw(640px);
    top: desktop-vw(375px);
    left: desktop-vw(100px);
    transform: rotate(-8deg);

    @include mobile {
      aspect-ratio: 265 / 175;
      width: mobile-vw(265px);
      top: mobile-vw(250px);
      left: mobile-vw(25px);
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

    .app-programmation-event-about-artist__video__overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 2;
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

  &__visual-without-frame.app-parallax {
    position: absolute;
    aspect-ratio: 315 / 425;
    width: desktop-vw(315px);
    top: desktop-vw(50px);
    right: desktop-vw(100px);
    transform: rotate(2deg);

    @include mobile {
      aspect-ratio: 135 / 180;
      width: mobile-vw(130px);
      top: mobile-vw(75px);
      right: mobile-vw(20px);
    }

    picture {
      width: 100%;
      height: 100%;
      display: block;
      @include noise();
    }
  }

  &__visual-with-frame.app-parallax {
    position: absolute;
    aspect-ratio: 440 / 550;
    width: desktop-vw(440px);
    top: desktop-vw(-175px);
    left: desktop-vw(50px);
    transform: rotate(-10deg);
    z-index: 1;

    @include mobile {
      aspect-ratio: 185 / 230;
      width: mobile-vw(185px);
      top: mobile-vw(0px);
      left: mobile-vw(20px);
      position: relative;
      margin-bottom: mobile-vw(250px);
    }

    picture {
      width: 100%;
      height: 100%;
      display: block;
      @include noise();
    }

    .app-element-lottie {
      width: 110%;
      top: 50%;
      left: 50%;
      height: auto;
      transform: translate(-50%, -50%) rotate(6deg);
      position: absolute;
      top: 50%;
      left: 50%;
    }
  }

  &__right {
    grid-column: 9 / span 4;
    min-height: desktop-vw(652px);

    @include mobile {
      grid-row: 2;
      grid-column: 1 / span 6;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: unset;
    }

    .H2 {
      margin-bottom: desktop-vw(25px);

      @include mobile {
        margin-bottom: mobile-vw(25px);
      }
    }

    .P2 {
      margin-bottom: desktop-vw(50px);

      @include mobile {
        margin-bottom: mobile-vw(45px);
      }
    }
  }
}
</style>
