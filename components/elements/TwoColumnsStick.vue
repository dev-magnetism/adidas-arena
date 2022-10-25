<template>
  <div class="app-two-columns-stick">
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

  &__column {
    flex: 1;

    .app-element-rich-text {
      .wysiwyg-text.H2 {
        font-size: desktop-vw(110px);
        line-height: desktop-vw(120px);
        @include font-tuskerGrotesk-bold();

        sup {
          font-size: desktop-vw(70px);
          line-height: desktop-vw(60px);
        }
      }
    }

    &.left {
      text-align: right;
      margin-right: desktop-vw(10px);
    }

    &.right {
      text-align: left;
      margin-left: desktop-vw(10px);

      > :first-child {
        margin-top: desktop-vw(120px);
      }
    }
  }
}
</style>
