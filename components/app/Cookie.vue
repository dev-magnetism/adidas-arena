<template>
  <div :class="{ accepted }" class="app-cookie">
    <TP1>
      {{ appContent.data.cookies_text }}
    </TP1>

    <div class="app-cookie__bottom">
      <AtomsCTA button @click.native="accepted = true">
        {{ appContent.data.cookies_accept }}
      </AtomsCTA>

      <AtomsLink :href="'google.fr'">
        <TP2 weight="bold"> {{ appContent.data.cookies_read_more }} </TP2>
      </AtomsLink>
    </div>

    <AtomsCornerPoints :size-points="8" />
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      accepted: false,
    }
  },
  computed: {
    ...mapState({
      appContent: (state) => state.appContent,
    }),
  },
}
</script>

<style lang="scss">
.app-cookie {
  position: fixed;
  width: desktop-vw(375px);
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
  }

  &.accepted {
    // opacity: 0;
    // pointer-events: none;
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
      flex: 0 0 60%;

      svg {
        @include mobile {
          padding: 0px mobile-vw(10px) mobile-vw(0px) mobile-vw(5px);
        }
      }
    }

    .app-atoms-link {
      margin: 0 auto;
      text-align: center;
      align-self: center;
      text-transform: uppercase;

      @include mobile {
        margin: 0 auto 0 mobile-vw(20px);
      }

      &::after {
        background: var(--c-black);

        --scale: 1 !important;
      }
    }
  }
}
</style>
