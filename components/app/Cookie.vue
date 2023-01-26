<template>
  <div :class="{ accepted }" class="app-cookie">
    <TP1>
      This website uses cookies to improve your experiences. By continuing to
      browse the site, you are agreeing to our use of cookies.
    </TP1>

    <div class="app-cookie__bottom">
      <AtomsCTA button @click.native="accepted = true">I agree</AtomsCTA>

      <AtomsLink :href="'google.fr'">
        <TP2 weight="bold"> Read more </TP2>
      </AtomsLink>
    </div>

    <AtomsCornerPoints :size-points="8" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      accepted: false,
    }
  },
}
</script>

<style lang="scss">
.app-cookie {
  position: fixed;
  width: desktop-vw(375px);
  max-width: 375px;
  background-color: #fdf8f2;
  z-index: 8;
  padding: desktop-vw(25px) desktop-vw(35px);
  bottom: desktop-vw(25px);
  left: desktop-vw(25px);
  transition: opacity 0.35s var(--ease-in-out-cubic);

  @include mobile {
    left: mobile-vw(12px);
    width: calc(100% - mobile-vw(24px));
    bottom: mobile-vw(25px);
    padding: mobile-vw(25px) mobile-vw(35px);
    max-width: initial;
  }

  &.accepted {
    opacity: 0;
    pointer-events: none;
  }

  .P1 {
    text-align: center;
    margin-bottom: desktop-vw(25px);

    @include mobile {
      margin-bottom: mobile-vw(25px);
    }
  }

  &__bottom {
    display: flex;
    flex-direction: row;

    .app-atoms-cta {
      width: 65%;
    }

    .app-atoms-link {
      margin: 0 auto;
      text-align: center;
      align-self: center;

      &::after {
        background: var(--c-black);
      }
    }
  }
}
</style>
