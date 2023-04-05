<template>
  <div class="app-element-interior-zone-informations">
    <button
      :class="{ hide: !interiorCurrentZoneName || informationsMobileOpen }"
      class="app-element-interior-zone-informations__close"
      @click="onCloseInformationZone()"
    >
      <SvgBackArrow />
    </button>
    <div class="app-element-interior-zone-informations__selected">
      <transition-group name="transition-appear">
        <div
          v-for="(zone, index) in interiorContent[interiorIndexFloor.id].zones"
          v-show="
            zone.name_gltf === currentContent?.name_gltf && !$viewport.isMobile
          "
          :key="`full-${index}`"
          class="app-element-interior-zone-informations__selected-zone"
          @click.stop="() => {}"
        >
          <SvgCloseZoneInformation @click.native="onCloseInformationZone()" />
          <AtomsCornerPoints :size-points="8" />
          <TH3
            tag="h1"
            class="app-element-interior-zone-informations__zone-selected__title"
          >
            {{ zone?.name }}
          </TH3>
          <client-only>
            <TP2
              weight="bold"
              class="app-element-interior-zone-informations__zone-selected__text"
              v-html="zone?.description"
            />
          </client-only>
          <AtomsLink
            v-if="zone.cta_text && zone.cta_href"
            :href="zone.cta_href"
          >
            <TP1 weight="bold" color="blue-adidas">
              {{ zone.cta_text }}
            </TP1>
          </AtomsLink>
        </div>
      </transition-group>
    </div>

    <div class="app-element-interior-zone-informations__selected-mobile">
      <transition-group tag="div" name="transition-appear">
        <div
          v-for="(zone, index) in interiorContent[interiorIndexFloor.id].zones"
          v-show="
            zone.name_gltf === currentContent?.name_gltf &&
            !informationsMobileOpen
          "
          :key="`title-${index}`"
          class="app-element-interior-zone-informations__selected-mobile__wrapper"
          @click.stop="() => {}"
        >
          <div
            class="app-element-interior-zone-informations__selected-mobile__title"
          >
            <AtomsCornerPoints :size-points="8" />
            <TH4>{{ zone?.name }}</TH4>
          </div>
          <div
            class="app-element-interior-zone-informations__selected-mobile__cta"
          >
            <TP2 color="grey" weight="bold" @click.native="readMore()"
              >En savoir plus</TP2
            >
          </div>
        </div>
      </transition-group>
    </div>

    <div
      class="app-element-interior-zone-informations__selected-mobile__overlay"
    >
      <transition-group name="transition-overlay">
        <div
          v-for="(zone, index) in interiorContent[interiorIndexFloor.id].zones"
          v-show="
            zone.name_gltf === currentContent?.name_gltf &&
            $viewport.isMobile &&
            informationsMobileOpen
          "
          :key="`full-${index}`"
          class="app-element-interior-zone-informations__selected-mobile__overlay-zone"
          @click.stop="() => {}"
        >
          <button
            class="app-element-interior-zone-informations__selected-mobile__overlay-zone__close"
            @click="onCloseInformationZone()"
          >
            <SvgBackArrow />
          </button>
          <AtomsCornerPoints :size-points="8" />
          <TH3
            weight="bold"
            class="app-element-interior-zone-informations__zone-selected-mobile__overlay__title"
          >
            {{ zone?.name }}
          </TH3>
          <client-only>
            <TP2
              weight="bold"
              class="app-element-interior-zone-informations__zone-selected-mobile__overlay__text"
              v-html="zone?.description"
            />
          </client-only>
          <AtomsLink
            v-if="zone.cta_text && zone.cta_href"
            :href="zone.cta_href"
          >
            <TP1 weight="bold" color="blue-adidas">
              {{ zone.cta_text }}
            </TP1>
          </AtomsLink>
        </div>
      </transition-group>
    </div>

    <div class="app-element-interior-zone-informations__hovered">
      <transition-group name="transition-appear">
        <div
          v-for="(zone, index) in interiorContent[interiorIndexFloor.id].zones"
          v-show="zone.name_gltf === currentContentHovered?.name_gltf"
          :key="`title-${index}`"
          class="app-element-interior-zone-informations__hovered-zone"
        >
          <AtomsCornerPoints :size-points="8" />
          <TH4
            class="app-element-interior-zone-informations__zone-selected__title"
            >{{ zone?.name }}</TH4
          >
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
// import useWebGL from '~/hooks/webgl'

export default {
  data() {
    return {
      informationsMobileOpen: false,
    }
  },

  computed: {
    ...mapState({
      interiorContent: (state) => state.interiorContent,
      interiorIndexFloor: (state) => state.interiorIndexFloor,
      interiorCurrentZoneName: (state) => state.interiorCurrentZoneName,
      interiorCurrentZoneHovered: (state) => state.interiorCurrentZoneHovered,
    }),
    currentContent() {
      return this.interiorContent[this.interiorIndexFloor.id].zones.find(
        (zone) => zone.name_gltf === this.interiorCurrentZoneName
      )
    },
    currentContentHovered() {
      return this.interiorContent[this.interiorIndexFloor.id].zones.find(
        (zone) => zone.name_gltf === this.interiorCurrentZoneHovered
      )
    },
  },
  watch: {
    informationsMobileOpen(newVal) {
      if (newVal) this.setHeaderHide(newVal)
    },
  },

  methods: {
    readMore() {
      this.informationsMobileOpen = !this.informationsMobileOpen
    },
    onCloseInformationZone() {
      if (this.$viewport.isMobile) {
        this.informationsMobileOpen = false
      } else {
        this.$nuxt.$emit('interior:unfocus')
      }
    },
    ...mapMutations({
      setHeaderHide: 'setHeaderHide',
    }),
  },
}
</script>

<style lang="scss">
.app-element-interior-zone-informations {
  transition: opacity 0.35s var(--ease-in-out-cubic);
  &.hide {
    opacity: 0;
    pointer-events: none;
  }

  &__close {
    position: absolute;
    background: var(--c-black);
    top: 0;
    left: 0;
    z-index: 99;
    width: 45px;
    height: 45px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: opacity 0.35s var(--ease-in-out-cubic);

    @include desktop {
      display: none;
    }

    &.hide {
      opacity: 0;
      pointer-events: none;
    }
  }

  &__selected-mobile {
    @include desktop {
      display: none;
    }

    &__wrapper {
      position: absolute;
      display: flex;
      justify-content: center;
      align-items: center;
      top: 0;
      right: 0;
      text-align: center;
      flex-direction: column;
    }
    &__title {
      padding: 10px 15px;
      position: relative;
      background-color: var(--c-grey);

      .app-atoms-corner-points__line--top,
      .app-atoms-corner-points__line--right {
        display: none;
      }
    }
    &__cta {
      padding: 10px 15px;
      background-color: var(--c-red-adidas);
      align-self: flex-end;
      border: 1px solid var(--c-black);
      border-right: none;
      border-top: none;
      text-transform: uppercase;

      .P2.bold {
        @include font-adihausDIN-cn-bold();
      }
    }
  }

  &__selected-mobile__overlay-zone {
    padding: mobile-vw(60px) mobile-vw(30px) mobile-vw(40px) mobile-vw(30px);
    bottom: 0;
    position: absolute;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 999;
    background-color: #fff;
    background-image: linear-gradient(
        45deg,
        #cccccc 25%,
        transparent 25%,
        transparent 75%,
        #cccccc 75%
      ),
      linear-gradient(
        45deg,
        #cccccc 25%,
        transparent 25%,
        transparent 75%,
        #cccccc 75%
      );
    background-size: 7px 7px;
    background-position: 0 0, 3.5px 3.5px;

    @include desktop {
      display: none;
    }

    .app-atoms-corner-points__line--left,
    .app-atoms-corner-points__line--bottom {
      display: none;
    }

    &__close {
      position: absolute;
      background: var(--c-black);
      top: 0;
      left: 0;
      z-index: 99;
      width: 45px;
      height: 45px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .H3 {
      margin-bottom: 20px;
      font-size: mobile-vw(72px);
      line-height: mobile-vw(72px);
    }

    .app-atoms-link {
      margin-top: mobile-vw(80px);

      &::after {
        background-color: var(--c-blue-adidas);
      }
    }
  }

  &__selected-zone {
    @include mobile {
      display: none;
    }

    padding: min(60px, desktop-vw(60px)) min(30px, desktop-vw(30px))
      min(40px, desktop-vw(40px)) min(30px, desktop-vw(30px));
    bottom: 0;
    position: absolute;
    left: 0;
    width: 25vw;
    background-color: #fff;
    background-image: linear-gradient(
        45deg,
        #cccccc 25%,
        transparent 25%,
        transparent 75%,
        #cccccc 75%
      ),
      linear-gradient(
        45deg,
        #cccccc 25%,
        transparent 25%,
        transparent 75%,
        #cccccc 75%
      );
    background-size: 7px 7px;
    background-position: 0 0, 3.5px 3.5px;

    @include mobile {
      width: 100%;
      height: 100%;
      z-index: 999;
    }

    .app-atoms-corner-points__line--left,
    .app-atoms-corner-points__line--bottom {
      display: none;
    }

    svg {
      position: absolute;
      top: desktop-vw(15px);
      right: desktop-vw(15px);
      cursor: pointer;
    }

    .H3 {
      margin-bottom: 20px;
    }

    .app-atoms-link {
      margin-top: min(80px, desktop-vw(80px));
      &::after {
        background-color: var(--c-blue-adidas);
      }
    }
  }

  &__hovered {
    @include mobile {
      display: none;
    }

    &-zone {
      padding: 20px 30px;
      position: absolute;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: var(--c-grey);
      bottom: 20px;
      right: 200px;
      height: 80px;
      max-width: 210px;
      text-align: center;

      .H4 {
        font-size: 32px;
        line-height: 32px;
      }
    }
  }

  .transition-appear-enter-active {
    transition: opacity 0.45s var(--ease-in-out-cubic);
  }

  .transition-appear-leave-active {
    transition: opacity 0.25s var(--ease-in-out-cubic);
  }

  .transition-appear-enter-active {
    transition-delay: 0.1s;
  }

  .transition-appear-enter {
    opacity: 0;
  }

  .transition-appear-enter-to {
    opacity: 1;
  }

  .transition-appear-leave {
    opacity: 1;
  }

  .transition-appear-leave-to {
    opacity: 0;
  }

  .transition-overlay-enter-active,
  .transition-overlay-leave-active {
    transition: transform 0.5s var(--ease-in-out-cubic);
  }

  .transition-overlay-enter-active {
    transition-delay: 0.2;
  }

  .transition-overlay-enter {
    transform: translateY(100vh);
  }

  .transition-overlay-enter-to {
    transform: translateY(0vh);
  }

  .transition-overlay-leave {
    transform: translateY(0vh);
  }

  .transition-overlay-leave-to {
    transform: translateY(100vh);
  }
}
</style>
