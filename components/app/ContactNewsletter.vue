<template>
  <div class="app-contact-newsletter grid-inner">
    <div class="app-contact-newsletter__newsletter">
      <AtomsCornerPoints :size-points="8" />
      <TH4>Trop tôt pour vous engager ? </TH4>
      <TH4> découvrez les actus de L’ADIDAS ARENA</TH4>

      <form action="#" class="app-contact-newsletter__newsletter__form">
        <input
          class="app-contact-newsletter__newsletter__form__field-mail"
          placeholder="email@email.com"
          type="email"
          name="name"
          required
        />
        <button
          class="app-contact-newsletter__newsletter__form__submit"
          type="submit"
        >
          <SvgFooterUnion />
        </button>
      </form>
    </div>

    <div class="app-contact-newsletter__visual-transparent"></div>
  </div>
</template>

<style lang="scss">
.app-contact-newsletter {
  row-gap: 0;
  position: relative;

  &__visual-transparent {
    @include fake-transparent();

    position: absolute;
    grid-column: 3 / span 2;
    width: 100%;
    aspect-ratio: 185 / 230;
    bottom: desktop-vw(80px);
    transform: rotate(5.6deg);
  }

  &__newsletter {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    grid-column: 4 / span 7;
    position: relative;
    transform: rotate(-3deg);
    padding: desktop-vw(45px) desktop-vw(0px) desktop-vw(35px) desktop-vw(0px);
    background: linear-gradient(
        rgba(251, 245, 238, 0.8) 0.1em,
        transparent 0.1em
      ),
      linear-gradient(90deg, rgba(251, 245, 238, 0.8) 0.1em, transparent 0.1em),
      white;
    background-size: 1.3em 1.3em;
    z-index: 1;

    &__form {
      display: flex;
      flex-flow: row wrap;
      align-items: center;
      margin-top: desktop-vw(20px);
      justify-content: center;
      width: 85%;

      &__field-mail {
        @include font-adihausDIN-cn-medium();
        text-transform: uppercase;
        font-size: desktop-vw(82px);
        line-height: desktop-vw(106px);
        letter-spacing: -0.04em;
        width: 75%;

        &::placeholder {
          color: rgba(24, 24, 24, 0.25);
        }
      }

      &__submit {
        border: 1px solid var(--c-black);
        width: desktop-vw(55px);
        height: desktop-vw(55px);
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: desktop-vw(40px);
        opacity: 0.25;
        cursor: pointer;
        align-self: center;

        svg {
          width: 50%;
          height: auto;
        }
      }
    }
  }
}
</style>
