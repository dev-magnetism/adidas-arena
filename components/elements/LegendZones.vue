<template>
  <div class="app-element-legend-zones">
    <TP2 weight="medium" class="public"><span />Public</TP2>
    <TP2 weight="medium" class="vip"><span />VIP</TP2>
  </div>
</template>

<style lang="scss">
.app-element-legend-zones {
  position: absolute;
  bottom: 175px;
  right: 30px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;

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
      margin-bottom: 5px;
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
      width: 15px;
      height: 15px;
      border: 1px solid var(--c-black);
      margin-right: 10px;
    }
  }
}
</style>
