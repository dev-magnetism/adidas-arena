<template>
  <a
    :href="ctaLink"
    target="_blank"

    class="app-atoms-spotify-playlist"
  >
    <div class="app-atoms-spotify-playlist__row">
      <AtomsCornerPoints :size-points="8" />

      <div class="app-atoms-spotify-playlist__icon">
        <div class="app-atoms-spotify-playlist__icon__container">
          <SvgSpotify />
        </div>
      </div>
      <div class="app-atoms-spotify-playlist__title">
        <TH4>Playlist du mois</TH4>
      </div>
    </div>
  </a>
</template>

<script>
export default {
  props: {
    ctaLink: {
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

    @include mobile{
      width: mobile-vw(271px);
      height: mobile-vw(56px);
    }


    &__row{
      display: flex;
      flex-wrap: wrap;
      width: 100%;
      height: desktop-vw(56px);

      @include mobile{
        height: mobile-vw(56px);
      }
    }

    &__icon{
      display: block;
      flex: 0 0 auto;
      padding: 0 desktop-vw(16px);
      background-color: #fff;
      border-right: 1px solid #000;
      height: desktop-vw(56px);
      vertical-align: center;

      &__container{
        display: flex;
        flex-wrap: wrap;
        height: desktop-vw(56px);
        align-items: center;
        justify-content: center;
      }

      svg{
        display: inline-block;
        flex: 0 0 auto;
      }

      @include mobile{
        padding: 0 mobile-vw(16px);
        height: mobile-vw(56px);
        line-height: mobile-vw(56px);
      }

    }

    &__title{
      display: block;
      flex: 1 0 0%;
      padding: 0 desktop-vw(16px);
      @include fake-transparent();
      height: desktop-vw(56px);
      line-height: desktop-vw(56px);

      @include mobile{
        padding: 0 mobile-vw(16px);
        height: mobile-vw(56px);
        line-height: mobile-vw(56px);
      }

      .H4{
        font-size: desktop-vw(24px);
        line-height: desktop-vw(56px);
        font-weight: 600;

        @include mobile{
          font-size: mobile-vw(24px);
          line-height: mobile-vw(56px);
        }
      }
    }

  }

}
</style>
