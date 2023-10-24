<template>
  <div class="app-home-projet__header">
    <div class="app-home-projet__header__infos">
      <div class="app-home-projet__header__info">
        
      </div>
      <div class="app-home-projet__header__info">
        
      </div>
    </div>
    <div class="app-home-projet__header__description">
      
    </div>
  </div>
</template>

<script>
export default {
  props: {
    contentLeft: {
      type: Array,
      default: () => [],
    },
    contentRight: {
      type: Object,
      default: () => {},
    },
  },
}
</script>

<style lang="scss">
.app-home-projet__header {
  grid-column: 1 / span 5;
  align-self: flex-start;
  display: flex;
  position: absolute;
  width: 90%;
  left: 0;
  top: desktop-vw(25px);

  @include mobile {
    grid-column: 1 / span 6;
    width: 100%;
    top: 2.5%;
  }

  span.line-header-border-bottom {
    position: absolute;
    bottom: 0;
    height: 1px;
    width: 100%;
    left: 0;
    background: var(--c-black);
    transform-origin: left center;
    transform: scaleX(0);

    @include mobile {
      transform: scaleX(1);
    }
  }
  span.line-header-border-right {
    position: absolute;
    bottom: 0;
    height: 100%;
    width: 1px;
    right: 0;
    background: var(--c-black);
    transform-origin: center bottom;
    transform: scaleY(0);

    @include mobile {
      transform: scaleY(1);
    }
  }

  &__infos {
    flex: 2;
    display: flex;
    flex-direction: column;
    position: relative;

    span.line-infos-border-right {
      position: absolute;
      top: 0;
      height: 100%;
      width: 1px;
      right: 0;
      background: var(--c-black);
      transform-origin: center bottom;
      transform: scaleY(0);

      @include mobile {
        transform: scaleY(1);
      }
    }
  }

  &__info {
    padding: desktop-vw(10px) desktop-vw(12px) desktop-vw(10px) desktop-vw(0px);
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    border-left: none;
    position: relative;

    @include mobile {
      padding: mobile-vw(5px) mobile-vw(5px) mobile-vw(5px) mobile-vw(0px);
    }

    &:first-child {
      span.line-info-border-bottom {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 1px;
        background: var(--c-black);
        transform-origin: left center;
        transform: scaleX(0);

        @include mobile {
          transform: scaleX(1);
        }
      }
    }

    &__title.P1 {
      font-size: desktop-vw(12px);
      line-height: desktop-vw(16px);
      @include font-adihausDIN-cn-medium();

      @include mobile {
        font-size: mobile-vw(8px);
        line-height: mobile-vw(10px);
      }
    }

    &__content.H2 {
      font-size: desktop-vw(24px);
      line-height: desktop-vw(20px);
      margin-top: desktop-vw(5px);

      @include mobile {
        font-size: mobile-vw(14px);
        line-height: mobile-vw(20px);
      }
    }

    &:first-child {
      border-top: none;
    }
    &:not(:first-child) {
      border-top: none;
    }
  }

  &__description {
    flex: 1;
    padding: desktop-vw(10px) desktop-vw(12px);

    @include mobile {
      padding: mobile-vw(5px) mobile-vw(12px);
    }

    &__title.P1 {
      font-size: desktop-vw(12px);
      line-height: desktop-vw(16px);
      @include font-adihausDIN-cn-medium();

      @include mobile {
        font-size: mobile-vw(8px);
        line-height: mobile-vw(10px);
      }
    }

    &__content.H3.info-text-6 {
      font-size: desktop-vw(12px);
      line-height: desktop-vw(20px);
      @include font-adihausDIN();
      margin-top: desktop-vw(10px);

      @include mobile {
        font-size: mobile-vw(8px);
        line-height: mobile-vw(11px);
      }
    }
  }
}
</style>
