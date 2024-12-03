<template>
  <div
    v-if="event.content.description"
    class="app-programmation-event-more-information grid-inner"
  >
    <div
      v-if="event.content.description"
      class="app-programmation-event-more-information__left"
    >
      <TH4 class="app-programmation-event-more-information__title">
        Plus d'infos
      </TH4>

      <ERichTextEvent
        :component="{ name: 'TP2', weight: 'medium', tagTarget: 'p', tag: 'p' }"
        :content="event.content.description"
      />
    </div>
    <div
      v-if="sponsors.length"
      class="app-programmation-event-more-information__right"
    >
      <div
        v-for="(sponsor, index) in sponsors"
        :key="index"
        class="app-programmation-event-more-information__item"
      >
        <AppProgrammationImage
          :src="sponsor.sponsor_id.logo.filename_disk"
          :alt="`image-${sponsor.sponsor_id.content.altImage}`"
          :lazy="true"
          :sizes="{
            desktop: 'w116,h116,fcrop,q85',
            mobile: 'w116,h116,fcrop,q85',
          }"
        />
        <div class="app-programmation-event-more-information__item__text">
          <TP2 weight="bold">
            {{ sponsor.sponsor_id.content.title }}
          </TP2>
          <TP2 weight="regular" class="license">
            {{ sponsor.sponsor_id.content.description }}
          </TP2>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    event: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    descriptionRichText() {
      return this.event.content.description
    },
    sponsors() {
      const sponsors = this.event.sponsors
      sponsors.forEach((sponsor) => {
        sponsor.sponsor_id.content = sponsor.sponsor_id.translations.find(
          (translation) => translation.language === 'fr'
        )
      })

      return sponsors
    },
  },
}
</script>

<style lang="scss">
.app-programmation-event-more-information {
  margin-top: desktop-vw(115px);

  @include mobile {
    margin-top: mobile-vw(70px);
  }

  &__left {
    grid-column: 2 / 5 span;

    @include mobile {
      grid-column: 1 / 6 span;
      grid-row: 1;
      margin-bottom: mobile-vw(15px);
    }

    .P2 {
      opacity: 0.8;
    }
  }

  &__title {
    margin-bottom: desktop-vw(15px);

    @include mobile {
      margin-bottom: mobile-vw(15px);
    }
  }

  &__right {
    grid-column: 8 / span 3;
    position: relative;

    @include mobile {
      grid-column: 1 / 6 span;
      grid-row: 2;
    }
  }

  &__item {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: desktop-vw(20px);

    @include mobile {
      justify-content: flex-start;
      margin-bottom: mobile-vw(10px);
    }

    &:last-child {
      margin-bottom: 0px;
    }

    picture {
      width: desktop-vw(115px);
      height: desktop-vw(115px);
      aspect-ratio: 110 / 100;
      display: block;

      @include mobile {
        width: mobile-vw(115px);
        height: mobile-vw(115px);
      }

      img {
        object-fit: cover;
      }
    }

    &__text{
      margin-left: desktop-vw(20px);
      opacity: 0.8;
      text-transform: uppercase;

      @include mobile {
        margin-left: mobile-vw(25px);
      }

      p.license{
        font-size: desktop-vw(12px);
        line-height: desktop-vw(18px);

        @include mobile {
          font-size: mobile-vw(12px);
          line-height: mobile-vw(16px);
        }
      }
    }
  }
}
</style>
