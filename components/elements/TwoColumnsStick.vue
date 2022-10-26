<template>
  <div
    :class="{ 'grid-inner': $device.isMobile }"
    class="app-two-columns-stick"
  >
    <div class="app-two-columns-stick__column left">
      <ERichText :content="leftContent" />
    </div>

    <div class="app-two-columns-stick__column right">
      <ERichText :content="rightContent" />
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
  },
}
</script>

<style lang="scss">
.app-two-columns-stick {
  display: flex;
  flex-direction: row;
  margin-top: desktop-vw(160px);
  margin-bottom: desktop-vw(200px);

  @include mobile {
    display: grid;
    grid-gap: mobile-vw(10px);
  }

  &__column {
    flex: 1;

    @include mobile {
      flex: none;
    }

    &.left {
      text-align: right;
      margin-right: desktop-vw(10px);

      @include mobile {
        grid-column: 1 / span 3;
        margin-right: mobile-vw(0px);
      }
    }

    &.right {
      text-align: left;
      margin-left: desktop-vw(10px);

      @include mobile {
        grid-column: 4 / span 3;
        margin-right: mobile-vw(0px);
      }

      > :first-child {
        margin-top: desktop-vw(120px);
      }
    }

    .app-element-rich-text {
      .wysiwyg-text.H2 {
        font-size: desktop-vw(110px);
        line-height: desktop-vw(120px);
        @include font-tuskerGrotesk-bold();

        @include mobile {
          font-size: mobile-vw(70px);
          line-height: mobile-vw(80px);
        }

        sup {
          font-size: desktop-vw(70px);
          line-height: desktop-vw(60px);

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
