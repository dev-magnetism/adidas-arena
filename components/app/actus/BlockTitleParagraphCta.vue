<template>
  <div class="app-actualites-block-title-paragraph-cta grid-inner">
    <div class="app-actualites-block-title-paragraph-cta__wrapper">
      <TH4
        v-if="content.title"
        class="app-actualites-block-title-paragraph-cta__title"
        weight="bold"
      >
        {{ content.title }}
      </TH4>
      <ERichTextEvent
        v-if="content.paragraph"
        class="app-actualites-block-title-paragraph-cta__paragraph"
        :component="{ name: 'TP2', weight: 'medium', tagTarget: 'p', tag: 'p' }"
        :content="content.paragraph"
        tag="p"
      />
      <AtomsCTA
        v-if="content.cta_href && content.cta_text"
        class="app-actualites-block-title-paragraph-cta__cta"
        :href="content.cta_href"
      >
        {{ content.cta_text }}
      </AtomsCTA>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    content: {
      type: Object,
      default: () => {},
    },
  },
}
</script>

<style lang="scss">
.app-actualites-block-title-paragraph-cta {
  position: relative;

  &__wrapper {
    grid-column: 4 / span 6;
    display: flex;
    flex-direction: column;

    @include mobile {
      grid-column: 1 / span 6;
    }
  }

  &__title {
    margin-bottom: desktop-vw(30px);

    @include mobile {
      margin-bottom: mobile-vw(25px);
    }
  }

  &__paragraph {
    ul {
      list-style: none;
      padding-left: desktop-vw(30px);

      @include mobile {
        padding-left: mobile-vw(10px);
      }

      li {
        padding-left: desktop-vw(60px);
        position: relative;
        display: flex;
        align-items: center;
        margin-bottom: desktop-vw(15px);

        @include mobile {
          padding-left: mobile-vw(50px);
          margin-bottom: mobile-vw(15px);
        }

        &:last-of-type {
          margin-bottom: 0px;
        }

        &::before {
          content: '';
          align-self: flex-start;
          position: absolute;
          left: 0;
          width: desktop-vw(40px);
          aspect-ratio: 40 / 10;
          height: auto;
          transform: translateY(100%);
          background-size: contain;
          background-repeat: no-repeat;
          background-image: url("data:image/svg+xml,%3Csvg width='43' height='12' viewBox='0 0 43 12' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1.278 9.418c8.3-.287 18.13-2.794 26.232-4.291 8.866-1.639 11.692-3.436 3.131.125-3.897 1.62-9.685 2.638-12.428 5.096-1.125 1.009 5.159-2.284 5.873-2.536C26.143 7.086 45 1.735 39.315 1.802c-5.803.067-11.427-.654-17.212-.454-3.229.112-10.39 1.212-13.272.46-5.056-1.32 11.19-.486 16.785-.582 3.277-.056 17.34 1.364 15.5 1.797-5.59 1.315-19.65 4.618-22.2 7.884' stroke='%2300F' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E");

          @include mobile {
            width: mobile-vw(40px);
          }
        }
      }
    }
  }

  &__cta {
    margin-top: desktop-vw(70px);
    align-self: center;

    @include mobile {
      margin-top: mobile-vw(30px);
    }
  }
}
</style>
