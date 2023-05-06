<template>
  <div class="app-programmation-event-more-information grid-inner">
    <div class="app-programmation-event-more-information__left">
      <TH4 class="app-programmation-event-more-information__title">
        Plus d'infos
      </TH4>

      <ERichTextEvent
        :component="{ name: 'TP2', weight: 'medium', tagTarget: 'p', tag: 'p' }"
        :content="event.content.description"
      />
    </div>
    <div class="app-programmation-event-more-information__right">
      <a href="#" class="app-programmation-event-more-information__item">
        <img src="https://picsum.photos/200/300" alt="fdsfdsf" />
        <TP2 weight="bold">Fédération française de karaté</TP2>
      </a>
      <a href="#" class="app-programmation-event-more-information__item">
        <img src="https://picsum.photos/200/300" alt="fdsfdsf" />
        <TP2 weight="bold">Fédération française de karaté</TP2>
      </a>
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
    justify-content: center;
    align-items: center;
    margin-bottom: desktop-vw(20px);
    cursor: pointer;

    @include mobile {
      justify-content: flex-start;
      margin-bottom: mobile-vw(10px);
    }

    &:last-child {
      margin-bottom: 0px;
    }

    img {
      width: desktop-vw(110px);
      height: desktop-vw(110px);
      aspect-ratio: 110 / 100;
      display: block;
      object-fit: cover;

      @include mobile {
        width: mobile-vw(110px);
        height: mobile-vw(110px);
      }
    }

    p {
      margin-left: desktop-vw(20px);
      opacity: 0.8;
      text-transform: uppercase;

      @include mobile {
        margin-left: mobile-vw(25px);
      }
    }
  }
}
</style>
