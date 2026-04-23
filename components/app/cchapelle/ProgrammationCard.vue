<template>
  <article :style="styles" class="app-cchapelle-programmation-card">
    <div class="app-cchapelle-programmation-card__visual">
      <div class="app-cchapelle-programmation-card__visual__wrapper">
        <img
          class="app-cchapelle-programmation-card__visual__picture"
          :src="event.coverUrl || event.coverThumbnailUrl"
          :alt="`visuel-${event.name}`"
          loading="lazy"
        />
      </div>
    </div>

    <div class="app-cchapelle-programmation-card__informations">
      <div class="app-cchapelle-programmation-card__head">
        <TP2 class="type" weight="bold">{{ allGenres }}</TP2>
        <TP2 class="date" weight="medium">{{ formattedDate }}</TP2>
      </div>

      <TH2 class="artist" weight="bold">{{ firstArtist }}</TH2>

      <TP2 v-if="ticketPrice" class="price" weight="medium"
        >A partir de {{ ticketPrice }}EUR</TP2
      >

      <a
        class="app-cchapelle-programmation-card__cta-link"
        :href="event.url"
        target="_blank"
        rel="noopener"
      >
        <TP2
          class="cta"
          weight="bold"
          @mouseenter.native="onCtaMouseEnter"
          @mouseleave.native="onCtaMouseLeave"
        >
          Reserver
        </TP2>
      </a>
    </div>
  </article>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  props: {
    event: {
      type: Object,
      default: () => ({}),
    },
    theme: {
      type: String,
      default: 'red',
    },
    rotateNegative: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    styles() {
      return {
        '--bg':
          this.theme === 'blue'
            ? 'var(--c-blue-adidas)'
            : this.theme === 'red'
            ? 'var(--c-red-adidas)'
            : 'var(--c-grey)',
        '--rotation': `${this.genRand(1, 2.5, 2) * (this.rotateNegative ? -1 : 1)}deg`,
      }
    },
    firstArtist() {
      return this.event?.artists?.[0]?.name || this.event?.name || ''
    },
    allGenres() {
      if (Array.isArray(this.event?.genres) && this.event.genres.length) {
        return this.event.genres
          .map((genre) => genre?.name)
          .filter(Boolean)
          .join(' / ')
      }

      return this.event?.typeOfPlace || ''
    },
    ticketPrice() {
      const deal = this.event?.deals?.[0]
      const price = Number(deal?.price)
      const organizerFees = Number(deal?.organizer_fees)

      if (Number.isNaN(price)) return null

      const total = price + (Number.isNaN(organizerFees) ? 0 : organizerFees)
      return total.toFixed(2)
    },
    formattedDate() {
      if (!this.event?.startTime) return ''
      return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(new Date(this.event.startTime))
    },
  },
  methods: {
    onCtaMouseEnter() {
      if (this.$viewport.isMobile) return

      this.setCursorState('hide')
      this.setAppCursor('pointer')
    },
    onCtaMouseLeave() {
      if (this.$viewport.isMobile) return

      this.setAppCursor('none')
      this.setCursorState('slider')
    },
    genRand(min, max, decimalPlaces) {
      const rand = Math.random() * (max - min) + min
      const power = Math.pow(10, decimalPlaces)
      return Math.floor(rand * power) / power
    },
    ...mapMutations({
      setCursorState: 'setCursorState',
      setAppCursor: 'setAppCursor',
    }),
  },
}
</script>

<style lang="scss">
.app-cchapelle-programmation-card {
  display: flex;
  flex-direction: column;
  background-color: var(--bg);
  position: relative;
  border: 1px solid var(--c-black);
  transform: rotate(var(--rotation));
  flex: 0 0 32.5%;
  min-width: 0;

  &__visual {
    width: 100%;
  }

  &__visual__wrapper {
    aspect-ratio: 16 / 9;
    overflow: hidden;
    background: var(--c-black);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__visual__picture {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
  }

  &__informations {
    display: flex;
    flex-direction: column;
    border-top: 1px solid var(--c-black);
    padding: desktop-vw(15px) desktop-vw(20px);
    color: var(--c-black);
  }

  &__cta-link {
    align-self: flex-end;
    text-decoration: none;
  }

  &__head {
    display: flex;
    justify-content: space-between;
    margin-bottom: desktop-vw(10px);

    .P2 {
      text-transform: uppercase;
      font-size: desktop-vw(18px);
      line-height: desktop-vw(20px);
      @include font-ITCFranklinGothicLT-DmCp();
    }
  }

  .artist.H2 {
    font-size: desktop-vw(64px);
    line-height: desktop-vw(58px);
    margin: 0 0 desktop-vw(20px);
    text-transform: uppercase;
    @include font-ITCFranklinGothicLT-DmXtraCp();
  }

  .price.P2 {
    margin-top: auto;
    margin-bottom: desktop-vw(12px);
    font-size: desktop-vw(17px);
    line-height: desktop-vw(20px);
    text-transform: uppercase;
    @include font-ITCFranklinGothicLT-BkCp();
  }

  .cta.P2 {
    display: inline-flex;
    align-self: flex-end;
    border: 1px solid var(--c-black);
    padding: desktop-vw(8px) desktop-vw(12px);
    text-transform: uppercase;
    font-size: desktop-vw(16px);
    line-height: desktop-vw(16px);
    background: var(--c-grey);
    @include font-ITCFranklinGothicLT-DmCp();
  }

  @include mobile {
    flex: 0 0 83%;

    &__informations {
      padding: mobile-vw(12px) mobile-vw(14px);
    }

    &__head {
      margin-bottom: mobile-vw(8px);

      .P2 {
        font-size: mobile-vw(14px);
        line-height: mobile-vw(18px);
      }

      .type {
        max-width: 62%;
      }
    }

    .artist.H2 {
      font-size: mobile-vw(46px);
      line-height: mobile-vw(42px);
      margin: 0 0 mobile-vw(12px);
    }

    .price.P2 {
      margin-bottom: mobile-vw(10px);
      font-size: mobile-vw(14px);
      line-height: mobile-vw(18px);
    }

    .cta.P2 {
      padding: mobile-vw(8px) mobile-vw(10px);
      font-size: mobile-vw(14px);
      line-height: mobile-vw(14px);
    }
  }
}
</style>
