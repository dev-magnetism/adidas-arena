<template>
  <a
    :href="ctaLink"
    target="_blank"

    class="app-atoms-spotify-playlist"
    :class="{ hide: barsticky }"
  >
    <div class="app-atoms-spotify-playlist__row">
      <AtomsCornerPoints :size-points="8" />

      <div class="app-atoms-spotify-playlist__icon">
        <div class="app-atoms-spotify-playlist__icon__container">
          <SvgSpotify />
        </div>
      </div>
      <div class="app-atoms-spotify-playlist__title">
        <div class="app-atoms-spotify-playlist__title-container">
          <TH4>{{ ctaLabel || 'Playlist du mois' }}</TH4>
        </div>
      </div>
    </div>
  </a>
</template>

<script>
export default {
  props: {
    barsticky: {
      type: Boolean,
      default: false
    },
    ctaLink: {
      type: String,
      default: '',
    },
    ctaLabel: {
      type: String,
      default: '',
    },
  },
  methods: {

  },
}
</script>

<style lang="scss">
.app-atoms-spotify {

  &-playlist{
    position: relative;
    display: inline-block;
    width: desktop-vw(271px);
    height: desktop-vw(56px);
    cursor: pointer;
    transition: all 360ms ease-in-out;

    &.hide{
      opacity: 0;
      height: 0;
      overflow: hidden;
      pointer-events: none;
    }

    @include mobile{
      margin-top: mobile-vw(16px);
      width: mobile-vw(170px);
      height: mobile-vw(32px);

      &.hide{
        margin-top: 0;
      }
    }


    &__row{
      display: flex;
      flex-wrap: nowrap;
      width: 100%;
      height: 100%;

    }

    &__icon{
      display: block;
      flex: 0 0 auto;
      padding: 0 desktop-vw(16px);
      background-color: #fff;
      border-right: 1px solid #000;
      height: 100%;
      vertical-align: center;

      &__container{
        display: flex;
        flex-wrap: wrap;
        height: 100%;
        align-items: center;
        justify-content: center;
      }

      svg{
        display: inline-block;
        flex: 0 0 auto;

        @include desktop{
          transform: scale(1.2);
        }
      }

      @include mobile{
        padding: 0 mobile-vw(8px);
      }

    }

    &__title{
      display: block;
      flex: 1 0 0%;
      padding: 0 desktop-vw(16px);
      @include fake-transparent();
      height: 100%;

      @include mobile{
        padding: 0 mobile-vw(8px);
      }

      &-container{
        display: flex;
        flex-wrap: wrap;
        height: 100%;
        align-items: center;
        white-space: nowrap;
      }

      .H4{
        font-size: desktop-vw(24px);
        font-weight: 600;

        @include mobile{
          font-size: mobile-vw(16px);
        }
      }
    }

  }

}
</style>
