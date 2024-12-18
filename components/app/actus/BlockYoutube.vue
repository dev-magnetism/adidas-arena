<template>
  <div class="app-actualites-block-youtube grid-inner">
    <div class="app-actualites-block-youtube__wrapper">
      <EParallax
        ref="video"
        class="app-actualites-block-youtube__video"
        :class="{ portrait: content.vertical_video }"
        :speed="0.85"
      >
        <EKinesis :speed="5">
          <div
            :class="{ invisible: hideVideoOverlay }"
            class="app-actualites-block-youtube__video__overlay"
            @click="hideVideoOverlay = true"
          >
            <TH1 tag="p" weight="bold" color="white">PLAY</TH1>

            <nuxt-picture
              ref="picture"
              provider="directus"
              :src="content.poster"
              format="webp"
              :alt="`block-youtube-poster-${content.id}`"
              sizes="sm:50vw md:100vw"
            />
          </div>
          <client-only>
            <iframe
              :class="{ invisible: !hideVideoOverlay }"
              :src="`https://www.youtube-nocookie.com/embed/${youTubeVideoId}?modestbranding=1&rel=0&cc_load_policy=1&iv_load_policy=3&hl=fr-fr&fs=0&controls=0&disablekb=1`"
              frameborder="0"
            />
          </client-only>
        </EKinesis>
      </EParallax>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    content: {
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
    youTubeVideoId() {
      return this.$getYoutubeVideoID(this.content.url)
    },
  },
}
</script>

<style lang="scss">
.app-actualites-block-youtube {
  position: relative;

  &__wrapper {
    grid-column: 3 / span 8;

    @include mobile {
      grid-column: 1 / span 6;
    }
  }

  &__video.app-parallax {
    aspect-ratio: 850 / 560;
    width: 100%;
    transform: rotate(-2deg);

    &.portrait {
      aspect-ratio: 9 / 16;
      width: desktop-vw(380px);
      margin: 0 auto;

      @include mobile {
        aspect-ratio: 9 / 16;
        width: desktop-vw(200px);
      }
    }

    @include mobile {
      aspect-ratio: 340 / 225;
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

    .app-actualites-block-youtube__video__overlay {
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
}
</style>
