<template>
  <SmartLink
    class="app-atoms-link-underline"
    :class="classes"
    :style="{
      '--color-underline': `var(--c-${color})`,
    }"
    :href="link"
    :internal="!external"
    :external="external"
    :blank="target"
  >
    <TP1 class="app-atoms-link-underline__text" weight="bold" :color="color"
      ><slot
    /></TP1>
  </SmartLink>
</template>

<script>
export default {
  props: {
    external: {
      type: Boolean,
      required: false,
      default: false,
    },
    link: {
      type: String,
      required: false,
      default: undefined,
    },
    color: {
      type: String,
      required: false,
      default: 'black',
    },
    target: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  computed: {
    classes() {
      return [
        {
          // 'no-link': !this.link,
          // medium: this.weight === 'medium',
        },
      ]
    },
  },
  mounted() {},
}
</script>

<style lang="scss">
.app-atoms-link-underline {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  position: relative;

  @include hover {
    cursor: pointer;

    &:hover {
      //   .app-atoms-link-underline__text {
      //     &::after {
      //       transform: scaleX(1) !important;
      //     }
      //   }
    }
  }

  &__text {
    position: relative;

    &::after {
      content: '';
      display: block;
      width: 100%;
      height: 2px;
      position: absolute;
      background: var(--color-underline);
      bottom: -2px;
      left: 0;
      transform: scaleX(1);
      transform-origin: left center;
      transition: transform 0.4s var(--ease-out-cubic);
      will-change: transform;
    }
  }

  .P2 {
    font-size: desktop-vw(24px);
    line-height: desktop-vw(32px);
    @include font-adihausDIN-cn-bold();
  }
}
</style>
