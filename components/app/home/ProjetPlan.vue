<template>
  <div class="app-home-projet__plan">
    <div class="app-home-projet__plan__header__wrapper">
      <div class="app-home-projet__plan__header">
        <TP2 class="app-home-projet__plan__header__f-c">{{
          $parent.contents.projetMapTitle
        }}</TP2>
        <div class="app-home-projet__plan__header__s-c">
          <TP2>{{ $parent.contents.projetMapRef }}</TP2>
          <span class="app-home-projet__plan__header__dot" />
          <TP2>{{ $parent.contents.projetMapRefNumber }}</TP2>
        </div>
      </div>
      <div class="app-home-projet__plan__header-fake" />
      <TP2 color="transparent" class="app-home-projet__plan__border">{{
        $parent.contents.projetMapTitle
      }}</TP2>
    </div>

    <div class="app-home-projet__plan__body">
      <div class="app-home-projet__plan__body__visual-wrapper">
        <nuxt-picture
          class="app-home-projet__plan__body__visual"
          src="imgs/projet/plan.webp"
          format="webp"
          alt="alt"
          sizes="sm:50vw md:35vw"
          loading="lazy"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.app-home-projet__plan {
  position: absolute;
  grid-column: 5 / span 5;
  width: 92.5%;
  aspect-ratio: 495/435;
  bottom: 40%;
  left: columns(0.5);
  transform: translateY(50%) rotate(4deg);
  z-index: -1;
  transform-origin: left bottom;

  @include mobile {
    grid-column: 1 / span 6;
    width: 100%;
    aspect-ratio: 335/320;
    bottom: 18.5%;
    left: 0%;
    transform: translateY(0%) rotate(6deg);
    z-index: 1;
    transform-origin: left bottom;
  }

  .app-element-lottie {
    position: absolute;
    top: 50%;
    width: 70%;
    left: 0;
  }

  &__bottom {
    aspect-ratio: 375 / 425;
    display: block;
    width: 100%;
    height: 100%;
    padding: desktop-vw(20px) desktop-vw(40px) desktop-vw(45px) desktop-vw(40px);

    transform: rotate(5deg);

    picture {
      display: block;
    }
  }

  &__border.P2 {
    height: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    padding: desktop-vw(12px);
    border-right: 1px solid var(--c-black);
    transform-origin: center bottom;

    text-transform: uppercase;
    font-size: desktop-vw(24px);
    line-height: desktop-vw(20px);
    position: absolute;
    left: 0;
    height: 3.8194444444vw;
    @include font-adihausDIN-cn-bold();

    @include mobile {
      font-size: mobile-vw(16px);
      line-height: mobile-vw(12px);
      height: mobile-vw(30px);
      padding: 0 mobile-vw(10px);
      z-index: 2;
    }
  }

  &__body {
    aspect-ratio: 375 / 425;
    display: block;
    width: 100%;
    height: 100%;
    padding: desktop-vw(20px) desktop-vw(40px) desktop-vw(45px) desktop-vw(40px);
    overflow: hidden;
    background: var(--c-white);
    border: 1px solid var(--c-black);
    border-top: none;

    &__visual-wrapper {
      width: 100%;
      height: 100%;
      transform-origin: left bottom;
    }

    &__visual {
      transform: rotate(5deg);
      display: block;
    }
  }

  &__header-fake {
    display: flex;
    flex-direction: row;
    transform: scaleY(0);
    transform-origin: center bottom;
    position: absolute;
    width: 100%;
    top: 0;
    background: white;
    left: 0;
    border: 1px solid var(--c-black);
    height: desktop-vw(55px);

    @include mobile {
      display: none;
    }
  }

  &__header__wrapper {
    height: desktop-vw(55px);
    position: relative;
    width: 100%;
    z-index: 1;

    @include mobile {
      height: mobile-vw(30px);
    }
  }

  &__header {
    display: flex;
    flex-direction: row;
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 1;
    height: 60%;
    overflow: hidden;

    @include mobile {
      height: 100%;
      align-items: center;
      border: 1px solid var(--c-black);
      background: var(--c-white);
    }

    &__f-c {
      flex: 1;
      padding: desktop-vw(12px);

      display: flex;
      align-items: center;
      justify-content: center;

      @include mobile {
        padding: 0px;
      }

      &.P2.regular {
        text-transform: uppercase;
        font-size: desktop-vw(24px);
        line-height: desktop-vw(20px);
        position: absolute;
        left: 0;
        height: 3.8194444444vw;

        @include font-adihausDIN-cn-bold();

        @include mobile {
          font-size: mobile-vw(16px);
          line-height: mobile-vw(12px);
          height: auto;
          padding: 0 mobile-vw(10px);
        }
      }
    }

    &__s-c {
      flex: 3;
      padding: 12px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      position: absolute;
      right: 0;
      height: 3.8194444444vw;

      @include mobile {
        height: auto;
        padding: 0px;
      }

      .P2.regular {
        font-size: desktop-vw(18px);
        line-height: desktop-vw(20px);
        text-transform: uppercase;

        @include font-adihausDIN-cn-bold();

        @include mobile {
          font-size: mobile-vw(16px);
          line-height: mobile-vw(12px);
        }
      }
    }

    &__dot {
      width: 5px;
      height: 5px;
      display: block;
      background: var(--c-black);
      margin: 0 desktop-vw(10px);
      border-radius: 50%;
    }
  }
}
</style>
