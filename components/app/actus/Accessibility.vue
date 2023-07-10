<template>
  <div class="app-actualite-accessibility grid-inner">
    <div class="app-actualite-accessibility__wrapper">
      <TP2
        class="app-actualite-accessibility-a-plus"
        weight="bold"
        @click.native="increaseFontSize"
      >
        A+
      </TP2>
      <TP2
        class="app-actualite-accessibility-a-minus"
        weight="bold"
        @click.native="decreaseFontSize"
      >
        A-
      </TP2>
      <TP2 class="app-actualite-accessibility-reading-time" weight="medium">
        Temps de lecture : 6MIN
      </TP2>
      <TP2
        color="blue-adidas"
        class="app-actualite-accessibility-share"
        weight="bold"
        @mouseover.native="openShare"
        @mouseout.native="handleShareKTO(false)"
      >
        PARTAGER

      </TP2>
      <div
          class="app-actualite-accessibility-share-layer"
        >
          <div
            class="P2 medium app-actualite-accessibility-share"
            v-on:mouseover="handleShareKTO(true)"
            v-on:mouseout="handleShareKTO(false)"
          >
            <ShareNetwork
                network="facebook"
                :url="pageUrl"
                :title="this.content.title"
                :description="this.content.page_description_seo"
                :quote="this.content.page_description_seo"
              >
                Facebook
            </ShareNetwork>

          </div>
          <div
            class="P2 medium app-actualite-accessibility-share"
            v-on:mouseover="handleShareKTO(true)"
            v-on:mouseout="handleShareKTO(false)"
          >
            <ShareNetwork
                network="twitter"
                :url="pageUrl"
                :title="this.content.title"
              >
                Twitter
            </ShareNetwork>
          </div>
        </div>
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
    return {}
  },
  computed: {
    totalSlides() {
      return ('0' + this.content.items.length).slice(-2)
    },
    pageUrl() {
      //  console.log('pageUrl', this.$route)
      return 'https://www.adidas-arena.com' + this.$route.path
    }
  },
  methods: {
    openShare() {
      clearTimeout(this._timeoutShare);
      this._timeoutShare = '';
      const ref = document.querySelector('.app-actualite-accessibility-share');
      const tar = document.querySelector('.app-actualite-accessibility-share-layer');

      const refW = ref.offsetWidth;
      const refH = ref.offsetHeight;
      const refXpos = ref.offsetLeft;
      const refYpos = ref.offsetTop;

      tar.style.width = `${refW}px`;
      tar.style.left = `${refXpos}px`;
      tar.style.top = `${refYpos + refH}px`;
      tar.style.height = `${refH * 2}px`;
    },
    closeShare() {
      const tar = document.querySelector('.app-actualite-accessibility-share-layer');
      tar.style.height = "0px"
    },
    handleShareKTO(sens){
      const oThis = this;
      if(sens){
        clearTimeout(oThis._timeoutShare);
      } else {
        oThis._timeoutShare = setTimeout(function(){oThis.closeShare()}, 120);
      }
    },
    increaseFontSize() {
      //  console.log('increase', this.fontSize);
      const _dynText = document.querySelectorAll('.p, .li');
      _dynText.forEach((el)=>{
        if(parseInt(window.getComputedStyle(el).fontSize) < 20){
          el.style.fontSize = `${parseInt(window.getComputedStyle(el).fontSize) + 1}px`;
          el.style.lineHeight = `${parseInt(window.getComputedStyle(el).lineHeight) + 1}px`;
        }
      })
    },
    decreaseFontSize() {
      //  console.log('decrease', this.fontSize);
      const _dynText = document.querySelectorAll('.p, .li');
      _dynText.forEach((el)=>{
        if(parseInt(window.getComputedStyle(el).fontSize) > 14){
          el.style.fontSize = `${parseInt(window.getComputedStyle(el).fontSize) - 1}px`;
          el.style.lineHeight = `${parseInt(window.getComputedStyle(el).lineHeight) - 1}px`;
        }
      })
    },
  },
}
</script>

<style lang="scss">
.app-actualite-accessibility {
  margin-top: desktop-vw(120px);

  @include mobile {
    margin-top: mobile-vw(50px);
  }

  &__wrapper {
    grid-column: 1 / span 12;
    display: flex;
    justify-content: center;
    align-items: center;

    @include mobile {
      grid-column: 1 / span 6;
      align-items: unset;
    }
  }

  &-reading-time.P2 {
    text-transform: uppercase;
  }

  &-share.P2 {
    text-transform: uppercase;
  }

  .P2 {
    position: relative;
    padding: desktop-vw(15px) desktop-vw(30px);
    border: 1px solid black;
    border-right: none;

    @include mobile {
      padding: mobile-vw(10px) mobile-vw(15px);
      display: flex;
      align-items: center;
    }

    &:nth-child(4){
      border-right: 1px solid black;
    }

    &:not(.app-actualite-accessibility-reading-time) {
      cursor: pointer;
    }
  }

  &-share-layer{
    position: absolute;
    width: 100%;
    height: 0;
    transition: height 360ms ease-in-out;
    overflow: hidden;

    .P2{
      border-top: none;
      border-right: 1px solid black;
    }
  }
}
</style>
