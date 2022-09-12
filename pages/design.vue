<template>
  <div class="page-design">
    <TH1>H1 - LOREM IPSUM</TH1>
    <TH1 weight="bold">H1 - LOREM IPSUM</TH1>
    <TH2>H2 - LOREM IPSUM</TH2>
    <TH2 weight="bold">H2 - LOREM IPSUM</TH2>
    <TH3 weight="bold">H3 - LOREM IPSUM</TH3>
    <TH4 weight="bold">H4 - LOREM IPSUM</TH4>
    <TP1>P1 - Lorem ipsum dolor sit amet</TP1>
    <TP2>P2 - Lorem ipsum dolor sit amet</TP2>
    <TP2 weight="bold">P2 - Lorem ipsum dolor sit amet</TP2>
    <AtomsCTA>Devenir partenaire</AtomsCTA>
    <AtomsCTA link="/" :arrow="false">Devenir partenaire</AtomsCTA>
    <AtomsCTA :arrow="false" bg="red-adidas" color="beige">
      Devenir partenaire
    </AtomsCTA>
    <AtomsCTA bg="beige" color="black">Devenir partenaire</AtomsCTA>
  </div>
</template>

<script>
export default {
  methods: {
    onClick() {
      console.log('click')
    },
  },
}
</script>

<style lang="scss"></style>
