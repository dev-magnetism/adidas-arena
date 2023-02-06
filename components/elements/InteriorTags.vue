<template>
  <div class="app-element-interior-tags">
    <transition-group tag="div" :duration="1000" name="tags">
      <div
        v-for="(floor, indexFloor) in floors"
        class="app-element-interior-tags__floor"
        v-show="indexFloor === interiorIndexFloor.id"
        ref="tesssst"
        :key="`floor-${indexFloor}`"
      >
        <div
          v-for="(zone, indexZone) in floor.zones"
          v-show="!zone.hide"
          :key="`zone-${indexZone}`"
          :class="zone.id"
          class="app-element-interior-tags__item"
        >
          <AtomsCornerPoints :size-points="8" />

          <TH4> {{ zone.name }}</TH4>
          <TP2 v-if="zone.description"> {{ zone.description }}</TP2>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import useWebGL from '~/hooks/webgl'

export default {
  data() {
    return {
      floors: [
        {
          name: 'RDC',
          positionMobile: new THREE.Vector3(-15, 0, 0),
          zones: [
            {
              name: 'ESPACE DE CIRCULATION',
              id: 'PUBLIC_Room_002',
            },
            {
              name: 'LES GYM’S',
              description:
                'Deux gymnases au service des écoles et du sport loisirs',
              id: 'PUBLIC_Room_004',
            },
            {
              name: 'SALON COURTSIDE',
              description:
                'Un salon vitré longeant le tunnel d’accès des joueurs',
              id: 'VIP_Room_001',
              hide: true,
            },
            {
              name: 'SALON COURTSIDE',
              description:
                'Un salon vitré longeant le tunnel d’accès des joueurs',
              id: 'VIP_Room_003',
            },
          ],
        },
        {
          name: '1',
          positionMobile: new THREE.Vector3(-15, 0, 0),

          zones: [
            {
              name: 'LES SALONS',
              description:
                'une surface totale de 900 m2, POUR vivre un événement dans un environnement privilégié.',
              id: 'VIP_area',
            },
          ],
        },
        {
          name: '2',
          positionMobile: new THREE.Vector3(-20, 0, 0),
          zones: [
            {
              name: 'LE BLOC',
              id: 'PUBLIC_Cantine',
              description:
                'une surface totale de 900 m2, POUR vivre un événement dans un environnement privilégié.',
            },
            {
              name: 'LES LOGES',
              id: 'VIP_Loge',
              description:
                'Des loges privées à la fois en retrait mais aussi avec vue sur la salle.',
            },
            {
              name: 'LES LOGES',
              id: 'VIP_Tribunes',
              hide: true,
              description:
                'Des loges privées à la fois en retrait mais aussi avec vue sur la salle.',
            },
          ],
        },
        {
          name: '3',
          positionMobile: new THREE.Vector3(20, 0, 0),
          zones: [
            {
              name: 'LE ROOFTOP',
              description:
                'un point de vue imprenable AVEC une offre de bar-restauration, ET un playground de basketball.',
              id: 'PUBLIC_Terrasse',
            },
          ],
        },
        {
          name: '4',
          positionMobile: new THREE.Vector3(-30, 0, 0),
          zones: [
            {
              name: 'LES GYM’S',
              description:
                'Deux gymnases au service des écoles et du sport loisirs',
              id: 'PUBLIC_Terrain_002',
            },
            {
              name: 'SKYBAR',
              description:
                'UN espace de 150m2 AVEC une vue plongeante dominant la salle, une ambiance chic mais trendy.',
              id: 'VIP_Skybar',
            },
          ],
        },
      ],
    }
  },
  computed: {
    ...mapState({
      interiorIndexFloor: (state) => state.interiorIndexFloor,
    }),
  },
  watch: {
    interiorIndexFloor(newVal) {},
  },
  mounted() {
    this.$raf.add(`interior-tags`, this.onFrame)

    this.$nuxt.$on('interior:animated-transition', this.onAnimatedTransition)
    this.$nuxt.$on('interior:immediate-transition', this.onImmediateTransition)
  },
  beforeDestroy() {
    this.$raf.remove(`interior-tags`, this.onFrame)

    this.$nuxt.$off('interior:animated-transition', this.onAnimatedTransition)
    this.$nuxt.$off('interior:immediate-transition', this.onImmediateTransition)
  },
  methods: {
    onAnimatedTransition() {
      const { interior } = useWebGL()

      if (this.$viewport.isMobile)
        interior.position.copy(
          this.floors[this.interiorIndexFloor.id].positionMobile
        )

      // console.log('here')
    },
    onImmediateTransition() {
      const { interior } = useWebGL()

      if (this.$viewport.isMobile)
        interior.position.copy(
          this.floors[this.interiorIndexFloor.id].positionMobile
        )

      // console.log('here')
      // console.log()
    },
    onFrame() {
      // const { interior } = useWebGL()
      // if (!interior.floors) return
      // const floor = interior.floors[this.interiorIndexFloor.id]
      // floor.specialObjects.forEach((zone) => {
      //   const vec3 = new THREE.Vector3()
      //   const screenPosition = zone.getWorldPosition(vec3)
      //   console.log(screenPosition)
      //   const translateX = screenPosition.x
      //   const translateY = -screenPosition.y
      //   zone.el.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`
      // })
    },
  },
}
</script>

<style lang="scss">
.app-element-interior-tags {
  &__floor {
    &.tags-enter-active,
    &.tags-leave-active {
      transition: opacity 0.7s var(--ease-in-out-cubic);
    }

    &.tags-enter-active {
      transition-delay: 0.35s;
    }

    &.tags-enter {
      opacity: 0;
    }

    &.tags-enter-to {
      opacity: 1;
    }

    &.tags-leave {
      opacity: 1;
    }

    &.tags-leave-to {
      opacity: 0;
    }
  }
  &__item {
    position: absolute;
    padding: 15px 30px;
    background-color: white;
    text-align: center;

    .P2 {
      text-transform: uppercase;
      font-size: 14px;
      line-height: 16px;

      @include mobile {
        font-size: 12px;
        line-height: 14px;
      }
    }

    .H4 {
      @include mobile {
        font-size: mobile-vw(20px);
        line-height: mobile-vw(18px);
        margin-bottom: 5px;
      }
    }

    &.PUBLIC_Room_002 {
      top: 65vh;
      left: 15%;

      @include mobile {
        bottom: 12%;
        top: initial;
        left: 0;
        width: 250px;
      }
    }
    &.VIP_Room_003 {
      top: 42vh;
      left: 58%;

      @include mobile {
        top: 48%;
        left: 5%;
      }
      .P2 {
        width: 220px;
      }
    }
    &.PUBLIC_Room_004 {
      top: 15vh;
      right: 20%;

      @include mobile {
        top: 25%;
        right: 0;
      }
      .P2 {
        width: 250px;

        @include mobile {
          width: 150px;
        }
      }
    }
    &.VIP_area {
      top: 25vh;
      right: 15%;

      @include mobile {
        top: 8vh;
      }
      .P2 {
        width: 250px;
        @include mobile {
          width: 150px;
        }
      }
    }
    &.VIP_Loge {
      top: 25vh;
      left: 25%;
      @include mobile {
        top: initial;
        left: 0;
        bottom: 25%;
      }
      .P2 {
        width: 250px;
      }
    }
    &.PUBLIC_Cantine {
      top: 40vh;
      right: 5%;

      @include mobile {
        top: 15%;
        right: 0;
      }
      .P2 {
        width: 250px;
      }
    }
    &.PUBLIC_Terrasse {
      bottom: 5vh;
      left: 5%;

      @include mobile {
        bottom: 50%;
        left: 50%;
        transform: translateX(-50%);
      }

      .P2 {
        width: 250px;
        @include mobile {
          width: 150px;
        }
      }
    }
    &.PUBLIC_Terrain_002 {
      top: 15vh;
      left: 50%;

      @include mobile {
        top: 12%;
        left: initial;
        right: 0;
      }
      .P2 {
        width: 250px;
        @include mobile {
          width: 150px;
        }
      }
    }
    &.VIP_Skybar {
      bottom: 30vh;
      left: 50%;

      @include mobile {
        bottom: 12%;
        left: 50%;
        transform: translateX(-50%);
      }
      .P2 {
        width: 250px;
        @include mobile {
          width: 150px;
        }
      }
    }
  }
}
</style>
