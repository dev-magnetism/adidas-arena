<template>
  <div class="app-home-le-block grid-inner">
    <div class="placeholder-plan"><TH1>LE BLOC</TH1></div>
  </div>
</template>

<style lang="scss">
.app-home-le-block {
  width: 100%;
  height: 100%;
  position: relative;
  margin-top: desktop-vw(70px);
  margin-bottom: desktop-vw(130px);

  .placeholder-plan {
    @include fake-transparent();
    grid-column: 1 / span 12;
    aspect-ratio: 1300 / 905;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
