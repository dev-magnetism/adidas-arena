<template>
  <div
    :class="{ 'grid-inner': $viewport.isMobile }"
    class="app-two-columns-stick"
  >
    <div class="app-two-columns-stick__column left">
      <ERichText :class="{ small: smallText }" tag="div" :content="leftContent" />
    </div>

    <div class="app-two-columns-stick__column right">
      <ERichText :class="{ small: smallText }" tag="div" :content="rightContent" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    leftContent: {
      type: String,
      default: '',
      require: true,
    },
    rightContent: {
      type: String,
      default: '',
      require: true,
    },
    smallText: {
      type: Boolean,
      default: false,
      require: false
    }
  },
}
</script>

<style lang="scss">
.app-two-columns-stick {
  display: flex;
  flex-direction: row;
  padding-top: desktop-vw(160px);
  margin-bottom: desktop-vw(200px);

  @include mobile {
    padding-top: mobile-vw(80px);
    margin-bottom: mobile-vw(90px);

    display: grid;
    grid-gap: 0;
  }

  &__column {
    flex: 1;

    @include mobile {
      flex: none;
    }

    .small {
      .wysiwyg-text.H2 {
        @include desktop {
          font-size: desktop-vw(75px) !important;
          line-height: desktop-vw(65px) !important;
        }
        @include mobile {
          font-size: mobile-vw(60px) !important;
          line-height: mobile-vw(55px) !important;
        }
      }
    }

    &.left {
      text-align: right;
      margin-right: desktop-vw(10px);

      @include mobile {
        grid-column: 1 / span 6;
        text-align: center;
        margin-right: mobile-vw(0px);
      }
    }

    &.right {
      text-align: left;
      margin-left: desktop-vw(10px);
      margin-top: auto;

      @include mobile {
        grid-column: 1 / span 6;
        text-align: center;
        margin-left: mobile-vw(0px);
      }

      .app-element-rich-text {
        @include mobile {
          display: flex;
          flex-direction: column-reverse;
        }
      }

      > :first-child {
        // margin-top: desktop-vw(100px);

        // @include mobile {
        //   margin-top: mobile-vw(0px);
        // }
      }
    }

    .app-element-rich-text {
      @include mobile {
        display: inline-flex;
        flex-direction: column;
        align-items: center;
      }
      .wysiwyg-text.H2 {
        font-size: desktop-vw(110px);
        line-height: desktop-vw(100px);
        @include font-ITCFranklinGothicLT-DmCp();
        position: relative;

        .app-atoms-stroke-text {
          -webkit-text-stroke: 1px var(--c-black);
          -webkit-text-fill-color: transparent;
        }

        @include mobile {
          font-size: mobile-vw(70px);
          line-height: mobile-vw(62px);
          display: inline-flex;
          text-align: center;
        }

        sup {
          font-size: desktop-vw(50px);
          line-height: desktop-vw(50px);
          align-self: flex-start;
          transform: translateY(-80%);
          position: absolute;
          top: 0;
          left: 100%;

          @include mobile {
            font-size: mobile-vw(28px);
            line-height: mobile-vw(16px);
          }
        }
      }
    }
  }
}
</style>
