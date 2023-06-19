<template>
  <div :class="{ hide: accepted || denied }" class="app-cookie">
    <TP2 class="app-cookie__text">
      {{ appContent.data.cookies_text }}
    </TP2>

    <AtomsLink class="app-cookie__read-more" href="/cookies">
      <TP2 weight="bold"> {{ appContent.data.cookies_read_more }} </TP2>
    </AtomsLink>

    <div class="app-cookie__bottom">
      <AtomsCTA button @click.native="onAccept()">
        {{ appContent.data.cookies_accept }}
      </AtomsCTA>

      <AtomsLink button @click.native="onDenied()">
        <TP2 weight="bold"> {{ appContent.data.cookies_denied }} </TP2>
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
      denied: false,
    }
  },
  computed: {
    ...mapState({
      appContent: (state) => state.appContent,
    }),
  },
  watch: {
    accepted(newVal) {
      // if (newVal) this.initializeGTM()
    },
  },
  mounted() {
    this.initializeGTM()

    // this.accepted = this.$cookies.get('aa-cookies')
  },
  methods: {
    onAccept() {
      // if (!this.accepted) {
      //   this.$cookies.set('aa-cookies', true, {
      //     path: '/',
      //     maxAge: 60 * 60 * 24 * 7 * 4 * 6,
      //   })
      //   this.accepted = true
      // }
    },
    onDenied() {
      // this.denied = true
    },
    initializeGTM() {
      // this.$gtm.init('GTM-TJGC9WK')
    },
  },
}
</script>

<style lang="scss">
.app-cookie {
  position: fixed;
  width: max(375px, desktop-vw(375px));
  background-color: var(--c-grey);
  z-index: 7;
  padding: 25px 35px;
  bottom: var(--layout-margin);
  left: var(--layout-margin);
  transition: opacity 0.35s var(--ease-in-out-cubic);

  display: none;
  pointer-events: none;
  visibility: hidden;
  opacity: 0;

  @include mobile {
    left: mobile-vw(12px);
    width: calc(100% - mobile-vw(24px));
    bottom: mobile-vw(25px);
    padding: mobile-vw(15px) mobile-vw(25px);
  }

  &.hide {
    opacity: 0;
    pointer-events: none;
  }

  &__read-more.app-atoms-link {
    margin: 0 auto;
    text-align: center;
    align-self: center;
    text-transform: uppercase;
    margin-bottom: desktop-vw(25px);
    user-select: none;

    @include mobile {
      margin: 0 auto mobile-vw(20px) 0;
    }

    .P2 {
      font-size: desktop-vw(14px);
      line-height: desktop-vw(20px);

      @include mobile {
        font-size: mobile-vw(14px);
        line-height: mobile-vw(20px);
      }
    }

    &::after {
      background: var(--c-black);

      --scale: 1 !important;
    }
  }

  &__text.P2 {
    text-align: left;
    margin-bottom: desktop-vw(15px);
    @include font-adihausDIN();
    text-transform: uppercase;
    user-select: none;

    @include mobile {
      margin-bottom: mobile-vw(15px);
    }
  }

  &__bottom {
    display: flex;
    flex-direction: row;

    .app-atoms-cta {
      flex: 0 0 55%;
      padding: 10px 10px 10px 20px;
      user-select: none;

      .P2 {
        font-size: 20px;
        line-height: 28px;
      }

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
      user-select: none;

      @include mobile {
        margin: 0 auto 0 mobile-vw(20px);
      }

      .P2 {
        font-size: desktop-vw(14px);
        line-height: desktop-vw(20px);

        @include mobile {
          font-size: mobile-vw(14px);
          line-height: mobile-vw(20px);
        }
      }

      &::after {
        background: var(--c-black);

        --scale: 1 !important;
      }
    }
  }
}
</style>
