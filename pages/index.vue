<template>
  <main class="app-home">
    <AppHomeHero />
    <AppHomePresentation />
    <ELottieTest />
    <EMarquee>
      <TH1 color="red-adidas"> HYBRIDATION </TH1>
      <TH1 color="blue-adidas"> INCLUSIVITé </TH1>
      <TH1 color="light-red"> co-création </TH1>
      <TH1 color="light-blue"> elevation </TH1>
    </EMarquee>
    <EMarquee :inverted="true">
      <TH1 color="red-adidas"> HYBRIDATION </TH1>
      <TH1 color="blue-adidas"> INCLUSIVITé </TH1>
      <TH1 color="light-red"> co-création </TH1>
      <TH1 color="light-blue"> elevation </TH1>
    </EMarquee>
    <EMarqueeScroll>
      <TH1> HYBRIDATION </TH1>
      <TH1> INCLUSIVITé </TH1>
      <TH1> co-création </TH1>
      <TH1> elevation </TH1>
    </EMarqueeScroll>
    <AppHomeProjet />
    <AppHomeLeBloc />
    <AppHomePartners />
  </main>
</template>

<script>
export default {}
</script>

<style lang="scss">
.app-home {
  padding-bottom: desktop-vw(145px);

  @include mobile {
    // background: green;
  }
}
</style>
