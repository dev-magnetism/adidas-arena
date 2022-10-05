<template>
  <main class="app-home">
    <AppHomeHero />
    <AppHomePresentation />
    <EMarqueeScroll>
      <TH1 color="red-adidas">
        HYBRIDATION INCLUSIVITé co-création elevation
      </TH1>
    </EMarqueeScroll>
    <EMarqueeScroll :inverted="true">
      <TH1 color="red-adidas">
        HYBRIDATION INCLUSIVITé co-création elevation
      </TH1>
    </EMarqueeScroll>
    <AppHomeProjet />
    <!-- <AppHomeLeBloc /> -->
    <AppHomePartners />
    <AppFooter />
  </main>
</template>

<script>
import scroll from '@/mixins/scroll'

export default {
  mixins: [scroll],
}
</script>

<style lang="scss">
.app-home {
  .app-footer {
    margin-top: desktop-vw(205px);
  }
  @include mobile {
    // background: green;
  }
}
</style>
