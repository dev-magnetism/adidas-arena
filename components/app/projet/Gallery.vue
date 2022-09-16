<template>
  <div class="app-projet-gallery grid-inner">
    <div class="app-projet-gallery__item">
      <nuxt-picture
        class="app-projet-gallery__item__visual"
        src="imgs/placeholder.png"
        format="webp"
        alt="placeholder"
      />
      <div class="app-projet-gallery__item__content">
        <div class="app-projet-gallery__item__infos">
          <TH3>Les gym's</TH3>
          <TH4 weight="medium">350 M2</TH4>
        </div>
        <TP1 weight="regular"
          >Ce parvis est votre point d’arrivée et de passage mais aussi un
          espace de loisirs ! Une expérience vous permettant d’être connecté
          avec l’actualité de l'ADIDAS ARENA : expositions, matchs sportif,
          concerts, DJ set...
        </TP1>
      </div>
    </div>
    <div class="app-projet-gallery__item">
      <nuxt-picture
        class="app-projet-gallery__item__visual"
        src="imgs/placeholder.png"
        format="webp"
        alt="placeholder"
      />
      <div class="app-projet-gallery__item__content">
        <div class="app-projet-gallery__item__infos">
          <TH3>Les gym's</TH3>
          <TH4 weight="medium">350 M2</TH4>
        </div>
        <TP1 weight="regular"
          >Ce parvis est votre point d’arrivée et de passage mais aussi un
          espace de loisirs ! Une expérience vous permettant d’être connecté
          avec l’actualité de l'ADIDAS ARENA : expositions, matchs sportif,
          concerts, DJ set...
        </TP1>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.app-projet-gallery {
  margin-top: desktop-vw(200px);
  &__item {
    grid-column: span 6;

    &__visual {
      display: block;
      aspect-ratio: 670 / 680;
    }

    &__content {
      display: flex;
      justify-content: space-between;
      margin-top: desktop-vw(35px);

      .P1 {
        width: 65%;
      }
    }

    &__infos {
      .H3 {
        font-size: desktop-vw(48px);
        line-height: desktop-vw(42px);
        letter-spacing: -0.04em;
      }
      .H4 {
        font-size: desktop-vw(28px);
        line-height: desktop-vw(36px);
        letter-spacing: -0.04em;
        margin-top: desktop-vw(10px);
      }
    }
  }
}
</style>
