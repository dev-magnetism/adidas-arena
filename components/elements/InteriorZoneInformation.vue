<template>
  <div class="app-element-interior-zone-information">
    <div class="app-element-interior-zone-information__selected">
      <transition-group name="transition-appear">
        <div
          v-for="(zone, index) in interiorContent[interiorIndexFloor.id].zones"
          v-show="zone.name_gltf === currentContent?.name_gltf"
          :key="`full-${index}`"
          class="app-element-interior-zone-information__selected-zone"
          @click.stop="() => {}"
        >
          <SvgCloseZoneInformation @click.native="onCloseInformationZone()" />
          <AtomsCornerPoints :size-points="8" />
          <TH3
            class="app-element-interior-zone-information__zone-selected__title"
          >
            {{ zone?.name }}
          </TH3>
          <TP2
            class="app-element-interior-zone-information__zone-selected__text"
            v-html="zone?.description"
          />
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

    <div class="app-element-interior-zone-information__hovered">
      <transition-group name="transition-appear">
        <div
          v-for="(zone, index) in interiorContent[interiorIndexFloor.id].zones"
          v-show="zone.name_gltf === currentContentHovered?.name_gltf"
          :key="`title-${index}`"
          class="app-element-interior-zone-information__hovered-zone"
        >
          <AtomsCornerPoints :size-points="8" />
          <TH4
            class="app-element-interior-zone-information__zone-selected__title"
            >{{ zone?.name }}</TH4
          >
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
// import useWebGL from '~/hooks/webgl'

export default {
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

  mounted() {
    console.log(this.currentContent)
    // const { interior } = useWebGL()
  },
  beforeDestroy() {},
  methods: {
    onCloseInformationZone() {
      this.$nuxt.$emit('interior:unfocus')
    },
  },
}
</script>

<style lang="scss">
.app-element-interior-zone-information {
  @include mobile {
    opacity: 0;
    pointer-events: none;
  }
  &__selected {
    &-zone {
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
        z-index: 9;
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
  .transition-appear-enter-active,
  .transition-appear-leave-active {
    transition: opacity 0.35s var(--ease-in-out-cubic);
  }

  .transition-appear-enter-active {
    transition-delay: 0.35s;
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
}
</style>
