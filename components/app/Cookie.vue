<template>
  <div class="app-cookie">
    <TP1>
      This website uses cookies to improve your experiences. By continuing to
      browse the site, you are agreeing to our use of cookies.
    </TP1>

    <div class="app-cookie__bottom">
      <AtomsCTAButton>Test</AtomsCTAButton>

      <AtomsLink :href="'google.fr'" :external="true">
        <TP2 weight="bold"> test </TP2>
      </AtomsLink>
    </div>

    <AtomsCornerPoints :size-points="4" />
  </div>
</template>

<style lang="scss">
.app-cookie {
  position: fixed;
  width: desktop-vw(375px);
  max-width: 375px;
  background-color: #fdf8f2;
  z-index: 8;
  padding: 25px 40px;
  bottom: 25px;
  left: 25px;

  .P1 {
    font-size: 16px;
    line-height: 20px;
    text-align: center;
    margin-bottom: 25px;
  }
}
</style>
