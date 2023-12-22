<template>
  <a
    :href="ctaLink"
    target="_blank"

    class="app-atoms-spotify-playlist"
  >
    <div class="app-atoms-spotify-playlist__row">
      <AtomsCornerPoints :size-points="8" />

      <div class="app-atoms-spotify-playlist__icon">
        <SvgSpotify />
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


    &__row{
      display: flex;
      flex-wrap: wrap;
      width: 100%;
    }

    &__icon{
      display: block;
      flex: 0 0 auto;
      padding: desktop-vw(16px);
      background-color: #fff;
      border-right: 1px solid #000;
    }

    &__title{
      display: block;
      flex: 1 0 0%;
      padding: desktop-vw(16px);
      @include fake-transparent();

      .H4{
        font-size: desktop-vw(24px);
        line-height: desktop-vw(24px);
        font-weight: 600;

        @include mobile{
          font-size: mobile-vw(24px);
          line-height: mobile-vw(24px);
        }
      }
    }

  }

}
</style>
