<template>
  <div class="app-be-part-of-configurations-arena">
    <div class="app-be-part-of-configurations-arena__inner grid-inner">
      <div class="app-be-part-of-configurations-arena__visuals">
        <nuxt-img
          class="app-be-part-of-configurations-arena__visual"
          alt="arena-base"
          format="webp"
          src="/imgs/configurations/base.webp"
        />

        <transition-group
          name="transition-arena"
          tag="div"
          mode="out-in"
          :duration="1000"
        >
          <nuxt-img
            v-if="arenaDisposition === 'sport'"
            key="sport"
            class="app-be-part-of-configurations-arena__visual"
            alt="arena-sport"
            format="webp"
            src="/imgs/configurations/sport.webp"
          />
          <nuxt-img
            v-if="arenaDisposition === 'scene_fond_gradin'"
            key="scene_fond_siege"
            class="app-be-part-of-configurations-arena__visual"
            alt="arena-scene_fond_siege"
            format="webp"
            src="/imgs/configurations/scene_fond_siege.webp"
          />
          <nuxt-img
            v-if="arenaDisposition === 'scene_fond_fosse'"
            key="scene_fond_fosse"
            class="app-be-part-of-configurations-arena__visual"
            alt="arena-scene_fond_fosse"
            format="webp"
            src="/imgs/configurations/scene_fond_fosse.webp"
          />
          <nuxt-img
            v-if="arenaDisposition === 'scene_centrale_gradin'"
            key="scene_central_siege"
            class="app-be-part-of-configurations-arena__visual"
            alt="arena-scene_central_siege"
            format="webp"
            src="/imgs/configurations/scene_central_siege.webp"
          />
          <nuxt-img
            v-if="arenaDisposition === 'scene_centrale_fosse'"
            key="scene_central_fosse"
            class="app-be-part-of-configurations-arena__visual"
            alt="arena-scene_central_fosse"
            format="webp"
            src="/imgs/configurations/scene_central_fosse.webp"
          />
          <nuxt-img
            v-if="
              arenaDisposition === 'sport' ||
              arenaDisposition === 'scene_centrale_fosse' ||
              arenaDisposition === 'scene_centrale_gradin'
            "
            key="gradin_top"
            class="app-be-part-of-configurations-arena__visual"
            alt="arena-gradin_top"
            format="webp"
            src="/imgs/configurations/gradin_top.webp"
          />
          <nuxt-img
            v-if="
              arenaDisposition === 'scene_fond_fosse' ||
              arenaDisposition === 'scene_fond_gradin'
            "
            key="gradin_top_opacity"
            class="app-be-part-of-configurations-arena__visual"
            alt="arena-gradin_top_opacity"
            format="webp"
            src="/imgs/configurations/gradin_top_opacity.webp"
          />
        </transition-group>
      </div>

      <ERichText
        class="app-be-part-of-configurations-arena__title"
        :content="contents.title"
      />
      <div class="app-be-part-of-configurations-arena__controller">
        <div class="app-be-part-of-configurations-arena__controller__f-r">
          <TP1
            class="app-be-part-of-configurations-arena__controller__f-r__title"
            color="beige"
          >
            Configuration
          </TP1>
          <transition-group
            tag="div"
            mode="out-in"
            class="app-be-part-of-configurations-arena__transition"
            :name="`transition-arena-${direction}`"
            :duration="1000"
          >
            <TH4
              v-for="(item, index) in contents.items"
              v-show="currentIndex === index"
              :key="index"
              class="app-be-part-of-configurations-arena__controller__f-r__text"
              color="beige"
            >
              {{ item.configuration }}
            </TH4>
          </transition-group>
        </div>
        <div class="app-be-part-of-configurations-arena__controller__s-r">
          <div
            class="app-be-part-of-configurations-arena__controller__s-r__content"
          >
            <TP1
              class="app-be-part-of-configurations-arena__controller__s-r__title"
              color="beige"
            >
              CAPACITE TOTALE
            </TP1>

            <transition-group
              tag="div"
              mode="out-in"
              class="app-be-part-of-configurations-arena__transition"
              :name="`transition-arena-${direction}`"
              :duration="1000"
            >
              <TH4
                v-for="(item, index) in contents.items"
                v-show="currentIndex === index"
                :key="index"
                class="app-be-part-of-configurations-arena__controller__s-r__text"
                color="beige"
              >
                {{ item.capacite }}
              </TH4>
            </transition-group>
          </div>
          <div
            class="app-be-part-of-configurations-arena__controller__s-r__content"
          >
            <TP1
              class="app-be-part-of-configurations-arena__controller__s-r__title"
              color="beige"
            >
              TYPE DE JAUGE
            </TP1>
            <transition-group
              tag="div"
              mode="out-in"
              class="app-be-part-of-configurations-arena__transition"
              :name="`transition-arena-${direction}`"
              :duration="1000"
            >
              <TH4
                v-for="(item, index) in contents.items"
                v-show="currentIndex === index"
                :key="index"
                class="app-be-part-of-configurations-arena__controller__s-r__text"
                color="beige"
              >
                {{ item.jauge }}
              </TH4>
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
          >
            {{ currentIndex + 1 }} - {{ contents.items.length }}
          </TP1>
          <div
            class="app-be-part-of-configurations-arena__controller__navigation right"
            @click="onRightClick()"
          >
            <SvgUnionConfiguration />
          </div>
        </div>
      </div>

      <div class="app-be-part-of-configurations-arena__paragraphs">
        <TP1 color="beige">
          {{ contents.columnLeft }}
        </TP1>
        <TP1 color="beige">
          {{ contents.columnRight }}
        </TP1>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    contents: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      currentIndex: 0,
      direction: 'next',
      arenaDisposition: 'sport',
      // sport
      // scene_centrale_fosse
      // scene_fond_fosse
      // scene_centrale_gradin
      // scene_fond_gradin
    }
  },
  mounted() {},
  methods: {
    onLeftClick() {
      this.direction = 'previous'
      console.log(this.contents)
      if (this.currentIndex === 0)
        this.currentIndex = this.contents.items.length - 1
      else this.currentIndex--

      this.arenaDisposition =
        this.contents.items[this.currentIndex].arena_disposition
    },
    onRightClick() {
      this.direction = 'next'
      if (this.currentIndex === this.contents.items.length - 1)
        this.currentIndex = 0
      else this.currentIndex++

      this.arenaDisposition =
        this.contents.items[this.currentIndex].arena_disposition
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
    margin-bottom: mobile-vw(150px);
    padding-top: mobile-vw(60px);
    padding-bottom: mobile-vw(185px);
  }

  &__visuals {
    grid-column: 7 / span 6;
    position: absolute;
    top: 50%;
    width: 80%;
    display: block;
    aspect-ratio: 580 / 785;
    transform: translate(0%, -50%) rotate(15deg);

    @include mobile {
      grid-column: 1 / span 6;
      grid-row: 3;
      position: relative;
      transform: translate(-50%, -50%) rotate(15deg);
      left: 50%;
    }
  }

  &__visual {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;

    &.transition-arena-enter-active,
    &.transition-arena-leave-active {
      transition: opacity 0.55s var(--ease-out-cubic);
    }

    &.transition-arena-enter-active {
      transition-delay: 0.45s;
    }

    &.transition-arena-enter {
      opacity: 0;
    }

    &.transition-arena-enter-to {
      opacity: 1;
    }

    &.transition-arena-leave {
      opacity: 1;
    }

    &.transition-arena-leave-to {
      opacity: 0;
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
      margin-top: mobile-vw(75px);
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

  &__title.app-element-rich-text {
    grid-column: 1 / span 6;

    @include mobile {
      grid-row: 1;
    }

    .H1 {
      color: var(--c-beige) !important;

      .app-atoms-stroke-text {
        -webkit-text-stroke: 1px var(--c-beige) !important;
      }
    }
  }

  &__controller {
    grid-column: 2 / span 3;
    border: 1px solid var(--c-white);
    margin-top: desktop-vw(80px);
    margin-bottom: desktop-vw(135px);

    @include mobile {
      grid-column: 1 / span 6;
      margin-top: mobile-vw(20px);
      margin-bottom: mobile-vw(60px);
      grid-row: 2;
    }

    &__navigation {
      width: desktop-vw(24px);
      height: desktop-vw(24px);
      background: var(--c-beige);
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;

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
