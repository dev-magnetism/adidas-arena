<template>
  <div class="app-projet-introduction grid-inner">
    <div class="app-projet-introduction__row-framed-content">
      <TH2>L’Adidas Arena, COHÉSION, CRÉATIVITÉ & TRANSFORMATION</TH2>
      <TP2 weight="bold">
        Une Arena symbole de la métamorphose d’un quartier et révélatrice de
        talents.<br /><br />
        Construite dans le cadre des Jeux Olympiques et Paralympiques Paris
        2024, elle s’inscrira durablement dans l'héritage olympique et le
        paysage francilien et mondial.
      </TP2>
    </div>
    <EFramedPicture
      class="app-projet-introduction__row-framed-visual"
      color="red-adidas"
    >
      <nuxt-picture src="imgs/placeholder.png" format="webp" alt="alt" />
    </EFramedPicture>

    <div class="app-projet-introduction__row-second-visual-principal">
      <TH3>lorem ipsum dolor</TH3>
      <nuxt-picture
        src="imgs/placeholder.png"
        format="webp"
        alt="placeholder"
      />
    </div>

    <div class="app-projet-introduction__row-second-visual-transparent">
      <nuxt-picture
        src="imgs/placeholder-logo-home.png"
        format="webp"
        alt="placeholder"
      />
      <AtomsCornerPoints :size-points="6" />
    </div>

    <div class="app-projet-introduction__row-second-content">
      <TH4>POURQUOI ADIDAS ?</TH4>
      <TP2>
        Le naming de l’Arena par adidas est un partenariat construit autour de
        valeurs partagées par nos deux marques:<br /><br />
        l’inclusion, l’accès au sport pour tous, le respect de l’environnement,
        la création et l’élévation des talents. <br /><br />Ensemble, nous
        souhaitons faire briller un territoire et ses jeunes générations en leur
        offrant un rayonnement plus important et une ouverture sur
        l’international !
      </TP2>
    </div>
  </div>
</template>

<style lang="scss">
.app-projet-introduction {
  position: relative;

  &__row-framed-content {
    grid-column: 2 / span 6;
    grid-row: 1;
    display: flex;
    flex-direction: column;
    width: 90%;

    .H2 {
      line-height: desktop-vw(110px);
    }

    .P2 {
      margin-top: desktop-vw(15px);
      width: 80%;
    }
  }

  &__row-framed-visual {
    background-color: var(--c-red-adidas);
    grid-column: 7 / span 5;
    grid-row: 1;
    transform: rotate(4deg);
    aspect-ratio: 545 / 670;
    margin-top: desktop-vw(50px);
    width: 95%;
    margin-left: desktop-vw(50px);
    z-index: 2;
  }

  &__row-second-visual-transparent {
    position: absolute;
    grid-row: 2;
    width: 100%;
    grid-column: 6 / span 2;
    top: 20%;
    transform: rotate(-9deg);
    aspect-ratio: 200 / 130;
    left: 30%;
    display: flex;
    align-items: center;
    justify-content: center;

    @include fake-transparent();

    picture {
      display: block;
      width: 55%;
      height: auto;
    }
  }

  &__row-second-content {
    grid-column: 9 / span 3;
    margin-top: desktop-vw(100px);
    grid-row: 2;

    .P2 {
      margin-top: desktop-vw(30px);
    }
  }

  &__row-second-visual-principal {
    grid-column: 2 / span 6;
    position: relative;
    transform: translateY(-30%) rotate(-1.8deg);
    display: flex;
    width: 95%;
    margin-left: desktop-vw(25px);
    grid-row: 2;
    margin-top: desktop-vw(25px);

    .H3 {
      font-size: desktop-vw(22px);
      line-height: desktop-vw(28px);
      letter-spacing: -0.04em;
      align-self: flex-end;
      writing-mode: vertical-rl;
      transform: scale(-1);

      margin-right: desktop-vw(20px);
    }

    picture {
      aspect-ratio: 595 / 740;
      width: 100%;
    }
  }
}
</style>
