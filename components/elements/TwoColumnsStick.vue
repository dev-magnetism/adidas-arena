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
      > .H2 {
        font-size: desktop-vw(110px);
        line-height: desktop-vw(120px);
      }
    }

    &.left {
      text-align: right;
    }

    &.right {
      text-align: left;

      > :first-child {
        margin-top: desktop-vw(120px);
      }
    }
  }
}
</style>
