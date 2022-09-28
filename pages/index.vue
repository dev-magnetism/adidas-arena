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
    <AppHomeLeBloc />
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
  padding-bottom: desktop-vw(145px);

  @include mobile {
    // background: green;
  }
}
</style>
