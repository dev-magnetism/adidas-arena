<template>
  <div class="app-programmation-event-tag">
    <TP1 weight="bold"><slot /></TP1>
  </div>
</template>

<style lang="scss">
.app-programmation-event-tag {
  padding: desktop-vw(15px) desktop-vw(25px);
  display: inline-flex;
  background-color: #fbf5ee;
  border: 1px solid var(--c-black);

  @include mobile {
    padding: mobile-vw(15px) mobile-vw(25px);
  }
}
</style>
