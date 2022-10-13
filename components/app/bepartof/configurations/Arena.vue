<template>
  <div class="app-be-part-of-configurations-arena">
    <div class="app-be-part-of-configurations-arena__inner grid-inner">
      <nuxt-picture
        alt="test"
        class="arena"
        format="webp"
        src="/imgs/configuration.png"
      ></nuxt-picture>
      <TH1 class="app-be-part-of-configurations-arena__title" color="beige"
        >configurations de l’arena</TH1
      >
      <div class="app-be-part-of-configurations-arena__controller">
        <div class="app-be-part-of-configurations-arena__controller__f-r">
          <TP1
            class="app-be-part-of-configurations-arena__controller__f-r__title"
            color="beige"
            >Configuration</TP1
          >
          <transition-group
            tag="div"
            mode="out-in"
            class="app-be-part-of-configurations-arena__transition"
            :name="`transition-arena-${direction}`"
            :duration="1000"
          >
            <TH4
              v-for="(item, index) in array"
              v-show="currentIndex === index + 1"
              :key="index"
              class="app-be-part-of-configurations-arena__controller__f-r__text"
              color="beige"
              >{{ item.firstRow.text }}</TH4
            >
          </transition-group>
        </div>
        <div class="app-be-part-of-configurations-arena__controller__s-r">
          <div
            class="app-be-part-of-configurations-arena__controller__s-r__content"
          >
            <TP1
              class="app-be-part-of-configurations-arena__controller__s-r__title"
              color="beige"
              >CAPACITE TOTALE</TP1
            >

            <transition-group
              tag="div"
              mode="out-in"
              class="app-be-part-of-configurations-arena__transition"
              :name="`transition-arena-${direction}`"
              :duration="1000"
            >
              <TH4
                v-for="(item, index) in array"
                v-show="currentIndex === index + 1"
                :key="index"
                class="app-be-part-of-configurations-arena__controller__s-r__text"
                color="beige"
                >{{ item.secondRow[0].text }}</TH4
              >
            </transition-group>
          </div>
          <div
            class="app-be-part-of-configurations-arena__controller__s-r__content"
          >
            <TP1
              class="app-be-part-of-configurations-arena__controller__s-r__title"
              color="beige"
              >TYPE DE JAUGE</TP1
            >
            <transition-group
              tag="div"
              mode="out-in"
              class="app-be-part-of-configurations-arena__transition"
              :name="`transition-arena-${direction}`"
              :duration="1000"
            >
              <TH4
                v-for="(item, index) in array"
                v-show="currentIndex === index + 1"
                :key="index"
                class="app-be-part-of-configurations-arena__controller__s-r__text"
                color="beige"
                >{{ item.secondRow[1].text }}</TH4
              >
            </transition-group>
          </div>
        </div>
        <div class="app-be-part-of-configurations-arena__controller__t-r">
          <div
            class="app-be-part-of-configurations-arena__controller__navigation left"
            @click="onLeftClick()"
          >
            <SvgUnionConfiguration />
          </div>
          <TP1
            class="app-be-part-of-configurations-arena__controller__t-r__text"
            color="beige"
            >{{ currentIndex }} - {{ array.length }}</TP1
          >
          <div
            class="app-be-part-of-configurations-arena__controller__navigation right"
            @click="onRightClick()"
          >
            <SvgUnionConfiguration />
          </div>
        </div>
      </div>

      <div class="app-be-part-of-configurations-arena__paragraphs">
        <TP1 color="beige"
          >Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
          vehicula luctus risus, ut placerat metus ultrices eu.
        </TP1>
        <TP1 color="beige"
          >Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
          vehicul.
        </TP1>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentIndex: 1,
      direction: 'next',
      array: [
        {
          firstRow: {
            title: 'Configuration 0',
            text: 'Sport / bowl 360 0',
          },
          secondRow: [
            {
              title: 'CAPACITE TOTALE 0',
              text: '8 500 0',
            },
            {
              title: 'TYPE DE JAUGE 0',
              text: 'LOREM IPSUM 0',
            },
          ],
        },
        {
          firstRow: {
            title: 'Configuration 1',
            text: 'Sport / bowl 360 1',
          },
          secondRow: [
            {
              title: 'CAPACITE TOTALE 1',
              text: '8 500 1',
            },
            {
              title: 'TYPE DE JAUGE 1',
              text: 'LOREM IPSUM 1',
            },
          ],
        },
        {
          firstRow: {
            title: 'Configuration 2',
            text: 'Sport / bowl 360 2',
          },
          secondRow: [
            {
              title: 'CAPACITE TOTALE 2',
              text: '8 500 2',
            },
            {
              title: 'TYPE DE JAUGE 2',
              text: 'LOREM IPSUM 2',
            },
          ],
        },
      ],
    }
  },
  mounted() {
    console.log(this.array)
  },
  methods: {
    onLeftClick() {
      this.direction = 'previous'
      if (this.currentIndex - 1 === 0) this.currentIndex = this.array.length
      else this.currentIndex--
    },
    onRightClick() {
      this.direction = 'next'
      if (this.currentIndex === this.array.length) this.currentIndex = 1
      else this.currentIndex++
    },
  },
}
</script>

<style lang="scss">
.app-be-part-of-configurations-arena {
  position: relative;
  margin-bottom: desktop-vw(130px);
  padding-top: desktop-vw(80px);
  padding-bottom: desktop-vw(100px);
  overflow-x: hidden;

  @include mobile {
    padding-top: mobile-vw(65px);
    padding-bottom: mobile-vw(185px);
  }

  .arena {
    grid-column: 7 / span 6;
    position: absolute;
    align-self: center;
    transform: rotate(15deg);
    width: 95%;
    aspect-ratio: 600 / 765;

    @include mobile {
      grid-row: 3;
      position: relative;
      grid-column: 1 / span 6;
      aspect-ratio: 285 / 380;
      width: 85%;
      justify-self: center;
      margin-bottom: mobile-vw(50px);
    }

    img {
      height: 100%;
      width: auto;
    }
  }

  &::before {
    content: '';
    display: block;
    background: linear-gradient(
        rgba(251, 245, 238, 0.01) 0.1em,
        transparent 0.1em
      ),
      linear-gradient(90deg, rgba(251, 245, 238, 0.01) 0.1em, transparent 0.1em);
    background-size: 2em 2em;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }
  &::after {
    content: '';
    display: block;
    background: radial-gradient(
      53.1% 72.86% at 70.11% 37.32%,
      #2929d2 0%,
      #343472 100%
    );
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
  }

  &__inner {
    z-index: 1;
    position: relative;
    row-gap: 0px;
  }

  &__paragraphs {
    grid-column: 1 / span 5;
    display: flex;

    @include mobile {
      grid-column: 1 / span 6;
      flex-direction: column;
    }

    .P1 {
      flex: 50%;
      font-size: desktop-vw(14px);
      line-height: desktop-vw(20px);

      @include mobile {
        font-size: mobile-vw(14px);
        line-height: mobile-vw(20px);
      }

      &:first-child {
        margin-right: desktop-vw(40px);

        @include mobile {
          margin-right: mobile-vw(0px);
          margin-bottom: mobile-vw(15px);
        }
      }
    }
  }

  &__title.H1 {
    grid-column: 1 / span 6;
  }

  &__controller {
    grid-column: 2 / span 3;
    border: 1px solid var(--c-white);
    margin-top: desktop-vw(130px);
    margin-bottom: desktop-vw(300px);

    @include mobile {
      grid-column: 1 / span 6;
    }

    &__navigation {
      width: desktop-vw(24px);
      height: desktop-vw(24px);
      background: var(--c-beige);
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;

      @include mobile {
        width: mobile-vw(42px);
        height: mobile-vw(42px);
      }

      svg {
        @include mobile {
          width: auto;
          height: 35%;
        }
      }

      &.right {
        transform: scaleX(-1);
      }

      @include hover {
        &:hover {
          // transform: scale(1.1);
        }
      }
    }

    &__t-r {
      display: flex;
      justify-content: space-between;
      align-items: center;

      &__text.P1 {
        font-size: desktop-vw(16px);
        line-height: desktop-vw(16px);
        @include font-adihausDIN-cn();

        @include mobile {
          font-size: mobile-vw(20px);
          line-height: mobile-vw(16px);
        }
      }

      @include mobile {
        padding: mobile-vw(15px) mobile-vw(10px) !important;
      }
    }

    &__f-r,
    &__t-r {
      padding: desktop-vw(12px);

      @include mobile {
        padding: mobile-vw(8px) mobile-vw(12px);
      }
    }

    &__s-r {
      display: flex;

      &__content {
        padding: desktop-vw(12px);
        flex: 1;

        @include mobile {
          padding: mobile-vw(8px) mobile-vw(12px);
        }

        &:first-child {
          border-right: 1px solid var(--c-white);
        }
      }
    }

    &__f-r,
    &__s-r {
      border-bottom: 1px solid var(--c-white);

      &__title.P1 {
        font-size: desktop-vw(12px);
        line-height: desktop-vw(12px);
        @include font-adihausDIN-cn-bold();

        @include mobile {
          font-size: mobile-vw(12px);
          line-height: mobile-vw(16px);
        }
      }
      &__text.H4 {
        font-size: desktop-vw(24px);
        line-height: desktop-vw(20px);
        @include font-adihausDIN-cn-bold();
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;

        @include mobile {
          font-size: mobile-vw(24px);
          line-height: mobile-vw(20px);
        }
      }
    }
  }
  &__transition {
    margin-top: desktop-vw(5px);
    height: desktop-vw(22px);
    overflow: hidden;
    position: relative;

    @include mobile {
      height: mobile-vw(22px);
    }

    .app-be-part-of-configurations-arena__controller__f-r__text.H4,
    .app-be-part-of-configurations-arena__controller__s-r__text.H4 {
      &.transition-arena-next-enter-active,
      &.transition-arena-next-leave-active,
      &.transition-arena-previous-enter-active,
      &.transition-arena-previous-leave-active {
        transition: transform 0.55s var(--ease-out-cubic);
      }

      &.transition-arena-next-enter-active,
      &.transition-arena-previous-enter-active {
        transition-delay: 0.45s;
      }

      &.transition-arena-next-enter {
        transform: translateY(-105%);
      }
      &.transition-arena-previous-enter {
        transform: translateY(105%);
      }

      &.transition-arena-next-enter-to,
      &.transition-arena-previous-enter-to {
        transform: translateY(0%);
      }

      &.transition-arena-next-leave,
      &.transition-arena-previous-leave {
        transform: translateY(0%);
      }

      &.transition-arena-next-leave-to {
        transform: translateY(105%);
      }
      &.transition-arena-previous-leave-to {
        transform: translateY(-105%);
      }
    }
  }
}
</style>
