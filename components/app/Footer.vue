<template>
  <div class="app-footer grid-inner">
    <div class="app-footer__principal">
      <TH2 class="app-footer__newsletter-title">
        Restez au courant, inscrivez-vous à notre newsletter
      </TH2>
      <form action="#" class="app-footer__newsletter" id="form1">
        <input
          class="app-footer__newsletter__field-mail"
          placeholder="email@email.com"
          type="email"
          name="name"
          required
        />
        <button class="app-footer__newsletter__submit" type="submit">
          <SvgFooterUnion />
        </button>

        <div class="app-footer__newsletter__accept-politic">
          <input id="accept-politic" type="checkbox" required />
          <label for="accept-politic">
            <TP2>
              J’accepte la
              <SmartLink href="https://www.magnetism.fr/" :blank="true">
                politique de confidentialité
              </SmartLink>
            </TP2>
          </label>
          <span class="checkmark" />
        </div>
      </form>
      <div class="app-footer__links">
        <TP2 weight="bold" class="app-footer__links-title"> ADIDAS ARENA </TP2>
        <ul class="app-footer__links__ul first-column">
          <li><TP2 weight="bold">Accueil</TP2></li>
          <li><TP2 weight="bold">Accueil</TP2></li>
          <li><TP2 weight="bold">Accueil</TP2></li>
          <li><TP2 weight="bold">Accueil</TP2></li>
          <li><TP2 weight="bold">Accueil</TP2></li>
        </ul>
        <ul class="app-footer__links__ul second-column">
          <li><TP2 weight="bold">Accueil</TP2></li>
          <li><TP2 weight="bold">Accueil</TP2></li>
        </ul>
      </div>
      <div class="app-footer__social-networks">
        <div class="app-footer__social-network"><SvgFooterFacebook /></div>
        <div class="app-footer__social-network"><SvgFooterLinkedin /></div>
        <div class="app-footer__social-network"><SvgFooterInstagram /></div>
        <div class="app-footer__social-network"><SvgFooterTwitter /></div>
      </div>
    </div>
    <div class="app-footer__partners">
      <TH2 class="app-footer__partners-title"> NOS PARTENAIREs </TH2>
      <EGridLogosFooter />
    </div>
    <div class="app-footer__bottom">
      <TP2> ©2022 - Tous droits réservés</TP2>
      <TP2> Cookies</TP2>
      <TP2> Mentions légales</TP2>
    </div>
  </div>
</template>

<style lang="scss">
.app-footer {
  margin-top: desktop-vw(200px);
  padding-top: desktop-vw(95px);
  padding-bottom: desktop-vw(40px);
  background: var(--c-red-adidas);
  background-image: url('/imgs/footer/background.png');
  background-repeat: no-repeat;
  background-size: 85% auto;
  background-position: right center;

  &__bottom {
    display: flex;
    grid-column: 1 / span 12;
    margin-left: auto;
    margin-top: desktop-vw(100px);

    .P2 {
      &:not(:first-child) {
        margin-left: desktop-vw(50px);
      }
    }
  }

  &__newsletter {
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    margin-top: desktop-vw(10px);

    &__accept-politic {
      flex-basis: 100%;
      display: flex;
      align-items: center;
      position: relative;
      padding-left: desktop-vw(25px);
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      margin-top: desktop-vw(10px);

      .P2 {
        font-size: desktop-vw(16px);
        line-height: desktop-vw(21px);
        color: rgba(24, 24, 24, 0.25);
        cursor: pointer;
      }

      a {
        text-decoration: underline;
        color: rgba(24, 24, 24, 1);
        @include font-adihausDIN-medium();
        position: relative;
      }

      input {
        opacity: 0;
        position: absolute;
        width: desktop-vw(25px);
        height: 100%;
        top: 0;
        left: 0;
        cursor: pointer;

        &:checked ~ .checkmark {
          background-color: var(--c-black);
        }
      }

      .checkmark {
        position: absolute;
        left: 0;
        height: 12px;
        width: 12px;
        background-color: transparent;
        border: 1px solid var(--c-black);
        pointer-events: none;
        cursor: pointer;
      }
    }

    &__field-mail {
      @include font-adihausDIN-cn-bold();
      text-transform: uppercase;
      font-size: desktop-vw(82px);
      line-height: desktop-vw(106px);
      letter-spacing: -0.04em;
      width: calc(100% - (desktop-vw(56px) + 60px));

      &::placeholder {
        color: rgba(24, 24, 24, 0.25);
      }
    }

    &__submit {
      border: 1px solid var(--c-black);
      width: desktop-vw(56px);
      height: desktop-vw(56px);
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

  &__principal {
    grid-column: 1 / span 6;
  }

  &__links {
    display: flex;
    flex-direction: row;
    margin-top: desktop-vw(95px);

    &__ul {
      list-style: none;

      .P2 {
        @include font-adihausDIN-cn-bold();
      }

      &:first-of-type {
        margin-right: 70px;
      }

      li:not(:first-child) {
        margin-top: desktop-vw(6px);
      }
    }
  }

  &__social-networks {
    display: flex;
    margin-top: desktop-vw(120px);
  }

  &__social-network {
    width: 56px;
    height: 56px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-top: 1px solid var(--c-black);
    border-left: 1px solid var(--c-black);
    border-bottom: 1px solid var(--c-black);

    &:last-child {
      border-left: 1px solid var(--c-black);
      border-right: 1px solid var(--c-black);
    }
  }

  &__partners {
    grid-column: 8 / span 5;
  }

  &__partners-title {
    font-size: desktop-vw(32px);
    line-height: desktop-vw(40px);
  }
  &__links-title {
    font-size: desktop-vw(26px);
    line-height: desktop-vw(33px);
    margin-right: desktop-vw(100px);
    @include font-adihausDIN-cn-bold();
  }

  &__newsletter-title {
    font-size: desktop-vw(32px);
    line-height: desktop-vw(40px);
  }
  &__newsletter-title {
    font-size: desktop-vw(32px);
    line-height: desktop-vw(40px);
  }
}
</style>
