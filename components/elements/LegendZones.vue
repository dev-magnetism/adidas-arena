<template>
  <div class="app-element-legend-zones">
    <TP2 weight="medium" class="public"><span />Public</TP2>
    <TP2 weight="medium" class="vip"><span />VIP</TP2>
  </div>
</template>

<style lang="scss">
.app-element-legend-zones {
  position: absolute;
  bottom: 20px;
  right: 200px;
  display: flex;
  align-items: center;
  justify-content: center;

  @include mobile {
    left: 10px;
    bottom: 50px;
    flex-direction: column;
    align-items: flex-start;
  }

  .P2 {
    display: flex;
    align-items: center;
    justify-content: center;
    text-transform: uppercase;

    &:first-child {
      margin-right: 30px;

      @include mobile {
        margin-right: 0px;
      }
    }

    &.public {
      span {
        background: #3171ff;
      }
    }

    &.vip {
      span {
        background: var(--c-red-adidas);
      }
    }

    span {
      display: block;
      width: 10px;
      height: 10px;
      border: 1px solid var(--c-black);
      margin-right: 10px;
    }
  }
}
</style>
