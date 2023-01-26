<template>
  <div class="app-second" :class="{ hide: !fontsPreloaded }">
    <AtomsCTABack @click.native="onBack()"> Retour </AtomsCTABack>
    <nuxt />

    <AppScrollbar v-if="!$viewport.isMobile" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      fontsPreloaded: false,
    }
  },
  mounted() {
    document.fonts.ready.then(() => {
      this.fontsPreloaded = true
    })
  },
  methods: {
    onBack() {
      this.$router.push({ path: '/' })
    },
  },
}
</script>

<style lang="scss">
.app-second {
  height: 100%;
  width: 100%;
  display: flex;
  flex: 1;
  flex-direction: column;

  transition: opacity 0.35s var(--ease-in-out-cubic);

  &.hide {
    opacity: 0;
  }

  .app-atoms-cta-back {
    position: fixed;
    left: desktop-vw(65px);
    top: desktop-vw(65px);
  }
}
</style>
