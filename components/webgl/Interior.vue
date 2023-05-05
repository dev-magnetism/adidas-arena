<template>
  <div />
</template>

<script>
import { gsap } from 'gsap'
import { Observer } from 'gsap/Observer'

import { mapState, mapMutations } from 'vuex'

import {
  mergeGeometries,
  mergeVertices,
} from 'three/examples/jsm/utils/BufferGeometryUtils.js'

import {
  Color,
  Vector3,
  Mesh,
  Line,
  MeshLambertMaterial,
  LineBasicMaterial,
  ShaderMaterial,
  Group,
  DoubleSide,
  Box3,
  Plane,
  EdgesGeometry,
  LineSegments,
  AmbientLight,
  DirectionalLight,
  ShadowMaterial,
} from 'three'

import useWebGL from '~/hooks/webgl'
import useGUI from '~/hooks/gui'

import loaderManager from '~/assets/js/loaderManager'

import { ConditionalEdgesGeometry } from '~/assets/js/webgl/ConditionalEdgesGeometry'
import { ConditionalEdgesShader } from '~/assets/js/webgl/ConditionalEdgesShader'

export default {
  data() {
    return {
      colors: {
        shadowColor: new Color(0xede5db),
        arrowColor: new Color(0xff4a48),
        ambientLightColor: new Color(0xf2f2f2),
        directionalLightColor: new Color(0xffffff),
        lambertMaterialColor: new Color(0xd8d8d8),
        lambertMaterialEmissive: new Color(0xefefef),
        emissiveIntensity: 0.75,
        outlineColor: new Color(0x000000),
        outlineHiddenColor: new Color(0x808080),
        public: {
          lambertMaterialColor: new Color(0x3070ff),
          lambertMaterialEmissive: new Color(0x285bd1),
          emissiveIntensity: 0.6,
          lambertMaterialColorActive: new Color(0x0000ff),
          lambertMaterialEmissiveActive: new Color(0x0202d6),
          emissiveIntensityActive: 0.5,
        },
        vip: {
          lambertMaterialColor: new Color(0xf46b2b),
          lambertMaterialEmissive: new Color(0xe2723d),
          emissiveIntensity: 0.6,
          lambertMaterialColorActive: new Color(0xe2520f),
          lambertMaterialEmissiveActive: new Color(0xdb500f),
          emissiveIntensityActive: 0.7,
        },
      },
      azimuth: { min: -1.6, max: this.$viewport.isMobile ? 1.6 : 0.6 },
      drag: {
        ease: 0.04,
        current: 0,
        target: 0,
        last: 0,
        speed: 2,
        dragSpeed: 0.0025,
        enabled: true,
      },
      zoom: {
        initial: 15,
        current: 15,
        range: {
          min: 5,
          max: 50,
        },
      },
      thresholdAngle: 40,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
      floors: [],
      currentZoneIntersect: null,
      zoneFocusEnabled: false,
      dragInProgress: false,
      arrowPositionYoyo: new Vector3(),
    }
  },
  computed: {
    ...mapState({
      modelInteriorLoaded: (state) => state.modelInteriorLoaded,
      allLoadedActual: (state) => state.allLoadedActual,
      interiorVisible: (state) => state.interiorVisible,
      interiorIndexFloor: (state) => state.interiorIndexFloor,
      interiorMusicScene: (state) => state.interiorMusicScene,
      menuActive: (state) => state.menuActive,
      interiorContent: (state) => state.interiorContent,
      instructionsWebglVisible: (state) => state.instructionsWebglVisible,
      interiorCurrentZoneName: (state) => state.interiorCurrentZoneName,
      interiorTimelineFloorsInProgress: (state) =>
        state.interiorTimelineFloorsInProgress,
    }),
    currentFloor() {
      return this.floors[this.interiorIndexFloor.id]
    },
    currentZone() {
      return this.floors[this.interiorIndexFloor.id].specialObjects.find(
        (obj) => obj.name === this.interiorCurrentZoneName
      )
    },
    inactiveZones() {
      return this.currentFloor.specialObjects.filter(
        (object) => object.name !== this.interiorCurrentZoneName
      )
    },
  },
  watch: {
    interiorMusicScene() {
      this.switchMiddleScene()
    },
    interiorIndexFloor(newVal, oldVal) {
      if (newVal.immediate) {
        this.handleImmediateTransition(oldVal)
      } else {
        if (this.interiorTimelineFloorsInProgress) return

        this.handleAnimatedTransition(oldVal)
      }
    },
    modelInteriorLoaded() {
      this.initInterior()
    },
    interiorVisible(payload) {
      const { interior } = useWebGL()

      interior.visible = payload
    },
  },
  mounted() {
    const { scissors, renderer } = useWebGL()

    if (this.allLoadedActual) {
      this.initInterior()
    }

    scissors.current = { ...scissors.hero }

    renderer.setScissor(
      scissors.current.x,
      scissors.current.y,
      scissors.current.width,
      scissors.current.height
    )

    this.observer = Observer.create({
      axis: 'x',
      target: this.$nuxt.$el,
      type: 'touch,pointer',
      onDrag: this.onDrag,
      onStop: this.onStopDrag,

      onDragStart: (e) => {
        if (e.axis === 'x') {
          this.setAllowScroll(false)
        }
      },
      onDragEnd: (e) => {
        if (e.axis === 'x') this.setAllowScroll(true)
      },
      dragMinimum: 10,
      lockAxis: true,
      tolerance: 5,
    })

    this.$nuxt.$on('reset:interior', this.resetView)
    this.$nuxt.$on('interior:unfocus', this.unfocusZone)

    this.$raf.add(`webgl-interior`, this.onFrame)

    document
      .getElementById('__nuxt')
      .addEventListener('click', this.onClickZone)

    window.addEventListener('keyup', this.onKeyUp)
  },
  beforeDestroy() {
    const { interior } = useWebGL()

    // MATERIAL
    const materials = this.buildGraph(interior).materials

    materials.forEach((material, index) => {
      material.dispose()
      materials.splice(index, 1)
    })

    interior.traverse((item) => {
      if (item instanceof Mesh || item instanceof Line) {
        item.geometry?.dispose()

        interior.remove(item)
      }
    })

    interior.remove(this.floor)
    interior.remove(this.footField)
    interior.remove(this.musicScene)
    interior.remove(this.terrain)
    if (!this.$viewport.isMobile) interior.remove(this.arrow)

    interior.remove(this.zeroFloor)
    interior.remove(this.firstFloor)
    interior.remove(this.secondFloor)
    interior.remove(this.thirdFloor)
    interior.remove(this.fourthFloor)

    // LIGHTS
    this.ambientLight.dispose()
    interior.remove(this.ambientLight)

    this.directionalLight.dispose()
    interior.remove(this.directionalLight)

    // GUI
    this.gui?.dispose()
    this.guiDrag?.dispose()
    this.guiZoom?.dispose()
    this.guiAmbientLight?.dispose()
    this.guiDirectionalLight?.dispose()
    this.guiModelColors?.dispose()

    interior.floors = []
    this.observer?.kill()
    this.tweenCamera?.kill()
    this.tweenArrowTranslate?.kill()
    this.tlFloors?.kill()
    this.tlSwitchMiddleScene?.kill()
    this.$nuxt.$off('reset:interior', this.resetView)
    this.$nuxt.$off('interior:unfocus', this.unfocusZone)
    this.$raf.remove(`webgl-interior`, this.onFrame)

    window.removeEventListener('keyup', this.onKeyUp)
    document
      .getElementById('__nuxt')
      .removeEventListener('click', this.onClickZone)
  },
  methods: {
    onKeyUp(e) {
      if (
        e.key === 'Escape' &&
        this.zoneFocusEnabled &&
        this.interiorCurrentZoneName &&
        this.interiorVisible
      ) {
        this.unfocusZone()
      }
    },
    switchMiddleScene() {
      this.tlSwitchMiddleScene?.clear()
      this.tlSwitchMiddleScene?.kill()

      this.tlSwitchMiddleScene = gsap.timeline()

      if (this.interiorMusicScene) {
        this.tlSwitchMiddleScene.to(this.terrain.position, {
          y: this.terrain.hidePosition.y,
          ease: 'back.in(1.5)',
          duration: 0.6,
          onComplete: () => {
            this.terrain.visible = false
          },
        })
        this.tlSwitchMiddleScene.to(
          this.musicScene.position,
          {
            y: this.musicScene.initialPosition.y,
            ease: 'back.out(1)',
            duration: 0.6,
            onStart: () => {
              this.musicScene.visible = true
            },
          },
          '+=25%'
        )
      } else {
        this.tlSwitchMiddleScene.to(this.musicScene.position, {
          y: this.musicScene.hidePosition.y,
          ease: 'back.in(1.5)',
          duration: 0.6,
          onComplete: () => {
            this.musicScene.visible = false
          },
        })
        this.tlSwitchMiddleScene.to(
          this.terrain.position,
          {
            y: this.terrain.initialPosition.y,
            ease: 'back.out(1)',
            duration: 0.6,
            onStart: () => {
              this.terrain.visible = true
            },
          },
          '+=25%'
        )
      }
    },
    handleImmediateTransition(oldVal) {
      this.currentZoneIntersect = null
      this.setInteriorCurrentZoneName(null)

      const { camera } = useWebGL()

      camera.zoom = this.$viewport.isMobile
        ? this.currentFloor.content.camera_zoom_mobile
        : this.currentFloor.content.camera_zoom || this.zoom.current

      this.floors.forEach((floor, index) => {
        const visible = index <= this.interiorIndexFloor.id

        floor.visible = visible

        const isHidden =
          (index >= oldVal.id || oldVal.id === 0) &&
          index < this.interiorIndexFloor.id

        if (isHidden) {
          this.hideFloorImmediate(floor)
        }

        if (visible) {
          floor.position.copy(floor.initialPosition)

          if (index === this.interiorIndexFloor.id)
            this.appearFloorImmediate(floor)
        } else {
          floor.position.copy(floor.hidePosition)
        }
      })

      if (this.interiorIndexFloor.focus) {
        const { fail: zonesNotSelected, pass: zoneSelected } = this.partition(
          this.currentFloor.specialObjects,
          (e) => e.name === this.interiorIndexFloor.focus
        )

        this.focusZoneImmediate(zoneSelected[0], zonesNotSelected)
      } else {
        camera.position.copy(this.cameraBase.position)
        camera.rotation.copy(this.cameraBase.rotation)

        camera.updateProjectionMatrix()
      }
    },
    handleAnimatedTransition(oldVal) {
      this.tlFloors?.clear()
      this.tlFloors?.kill()
      this.tweenCamera?.kill()
      this.setInteriorTimelineFloorsInProgress(true)

      if (this.interiorCurrentZoneName) this.unfocusZone(true)

      this.tlFloors = gsap.timeline({
        // onStart: () => {
        //   this.setInteriorTimelineFloorsInProgress(true)
        // },
        onComplete: () => {
          this.setInteriorTimelineFloorsInProgress(false)
        },
      })

      const isAscendant = oldVal.id < this.interiorIndexFloor.id

      const { camera } = useWebGL()

      const coef = Math.abs(this.interiorIndexFloor.id - oldVal.id)

      this.tweenCamera = gsap.to(camera, {
        zoom: this.$viewport.isMobile
          ? this.floors[this.interiorIndexFloor.id].content.camera_zoom_mobile
          : this.floors[this.interiorIndexFloor.id].content.camera_zoom ||
            this.zoom.initial,
        onUpdate: () => {
          camera.updateProjectionMatrix()
        },
        delay: !isAscendant && coef < 2 ? 0.2 : 0,
        ease: 'power3.inOut',
        duration: coef > 2 ? coef * 0.65 : coef * 1,
      })

      if (isAscendant) {
        this.floors.forEach((floor, index) => {
          const isTweenable =
            index <= this.interiorIndexFloor.id && !floor.visible && index !== 0

          if (isTweenable) {
            const lastFloor = this.floors[index - 1]

            this.addFloorToTimelineAppear(floor, lastFloor, index)
          }
        })
      } else {
        const reversedFloors = [...this.floors].reverse()

        reversedFloors.forEach((floor, index) => {
          const reversedIndex = reversedFloors.length - 1 - index

          const nextFloor = this.floors[this.interiorIndexFloor.id]

          const isTweenable =
            reversedIndex <= oldVal.id &&
            reversedIndex > this.interiorIndexFloor.id &&
            floor.visible

          if (isTweenable) {
            this.addFloorToTimelineDisappear(
              floor,
              nextFloor,
              reversedIndex - 1
            )
          }
        })
      }
    },
    addFloorToTimelineDisappear(floor, nextFloor, index) {
      const graphNextFloor = this.buildGraph(nextFloor)

      this.tlFloors.addLabel(`${floor.name}`, '<10%')
      this.tlFloors.addLabel(`leave-${floor.name}`, `${floor.name}`)
      this.tlFloors.addLabel(`enter-${floor.name}`, `${floor.name}`)

      const isFinalFloor = index === this.interiorIndexFloor.id

      this.tlFloors.to(
        floor.position,
        {
          y: floor.hidePosition.y,
          onComplete: () => {
            floor.visible = false
          },
          ease: 'back.in(1.5)',
          duration: 0.85,
        },
        `leave-${floor.name}`
      )

      floor.specialObjects.forEach((zone) => {
        const color = this.colors.lambertMaterialColor.clone()

        const emissive = this.colors.lambertMaterialEmissive.clone()

        zone.materials.forEach((material) => {
          if (material instanceof MeshLambertMaterial) {
            const paramsLeave = {
              ease: 'power1.out',
              duration: 0.35,
            }
            this.tlFloors.to(
              material.color,
              {
                r: color.r,
                g: color.g,
                b: color.b,
                ...paramsLeave,
              },
              `leave-${floor.name}`
            )

            this.tlFloors.to(
              material.emissive,
              {
                r: emissive.r,
                g: emissive.g,
                b: emissive.b,
                ...paramsLeave,
              },
              `leave-${floor.name}`
            )

            this.tlFloors.to(
              material,
              {
                emissiveIntensity: this.colors.emissiveIntensity,
                ...paramsLeave,
              },
              `leave-${floor.name}`
            )
          }
        })
      })

      if (isFinalFloor) {
        const lineMaterials = graphNextFloor.materials.filter(
          (material) =>
            material.name === 'conditionalMaterial' ||
            material.name === 'lineMaterial'
        )

        const params = {
          ease: 'power2.out',
          duration: 0.5,
          delay: 0.75,
        }

        const outlineColor = this.colors.outlineColor.clone()

        lineMaterials.forEach((material) => {
          if (material instanceof LineBasicMaterial) {
            this.tlFloors.to(
              material.color,
              {
                r: outlineColor.r,
                g: outlineColor.g,
                b: outlineColor.b,
                ...params,
              },
              `enter-${floor.name}`
            )
          } else if (material instanceof ShaderMaterial) {
            this.tlFloors.to(
              material.uniforms.diffuse.value,
              {
                r: outlineColor.r,
                g: outlineColor.g,
                b: outlineColor.b,
                ...params,
              },
              `enter-${floor.name}`
            )
          }
        })

        nextFloor.specialObjects.forEach((zone) => {
          const typeZone = zone.publicAccess ? 'public' : 'vip'

          const color = this.colors[typeZone].lambertMaterialColor.clone()

          const emissive = this.colors[typeZone].lambertMaterialEmissive.clone()

          zone.materials.forEach((material) => {
            if (material instanceof MeshLambertMaterial) {
              this.tlFloors.to(
                material.color,
                {
                  r: color.r,
                  g: color.g,
                  b: color.b,
                  ...params,
                },
                `enter-${floor.name}`
              )

              this.tlFloors.to(
                material.emissive,
                {
                  r: emissive.r,
                  g: emissive.g,
                  b: emissive.b,
                  ...params,
                },
                `enter-${floor.name}`
              )

              this.tlFloors.to(
                material,
                {
                  emissiveIntensity: this.colors[typeZone].emissiveIntensity,
                  ...params,
                },
                `enter-${floor.name}`
              )
            }
          })
        })
      }
    },
    addFloorToTimelineAppear(floor, lastFloor, index) {
      const graphFloor = this.buildGraph(floor)
      const graphLastFloor = this.buildGraph(lastFloor)

      this.tlFloors.addLabel(`${floor.name}`, '<40%')
      this.tlFloors.addLabel(`leave-${floor.name}`, `${floor.name}`)
      this.tlFloors.addLabel(`enter-${floor.name}`, `${floor.name}`)

      const isFinalFloor = index === this.interiorIndexFloor.id

      // LEAVE LAST FLOOR
      const specialMaterials = graphLastFloor.materials.filter(
        (material) =>
          material.name === 'vipMaterial' || material.name === 'publicMaterial'
      )

      const lineMaterials = graphLastFloor.materials.filter(
        (material) =>
          material.name === 'conditionalMaterial' ||
          material.name === 'lineMaterial'
      )

      const color = this.colors.lambertMaterialColor.clone()
      const emissive = this.colors.lambertMaterialEmissive.clone()
      const outlineHiddenColor = this.colors.outlineHiddenColor.clone()

      const leaveParams = {
        ease: 'power1.inOut',
        duration: 0.3,
      }

      specialMaterials.forEach((material) => {
        this.tlFloors.to(
          material.color,
          {
            r: color.r,
            g: color.g,
            b: color.b,
            ...leaveParams,
          },
          `leave-${floor.name}`
        )
        this.tlFloors.to(
          material.emissive,
          {
            r: emissive.r,
            g: emissive.g,
            b: emissive.b,
            ...leaveParams,
          },
          `leave-${floor.name}`
        )

        this.tlFloors.to(
          material,
          {
            emissiveIntensity: this.colors.emissiveIntensity,
            ...leaveParams,
          },
          `leave-${floor.name}`
        )
      })

      lineMaterials.forEach((material) => {
        if (material instanceof LineBasicMaterial) {
          this.tlFloors.to(
            material.color,
            {
              r: outlineHiddenColor.r,
              g: outlineHiddenColor.g,
              b: outlineHiddenColor.b,
              ...leaveParams,
            },
            `leave-${floor.name}`
          )
        } else if (material instanceof ShaderMaterial) {
          this.tlFloors.to(
            material.uniforms.diffuse.value,
            {
              r: outlineHiddenColor.r,
              g: outlineHiddenColor.g,
              b: outlineHiddenColor.b,
              ...leaveParams,
            },
            `leave-${floor.name}`
          )
        }
      })

      // APPEAR NEW FLOOR
      graphFloor.materials.forEach((material) => {
        if (material instanceof MeshLambertMaterial) {
          material.color = this.colors.lambertMaterialColor.clone()
          material.emissive = this.colors.lambertMaterialEmissive.clone()
          material.emissiveIntensity = this.colors.emissiveIntensity
        } else if (material instanceof ShaderMaterial) {
          material.uniforms.diffuse.value.set(this.colors.outlineColor.clone())
        } else if (material instanceof LineBasicMaterial) {
          material.color = this.colors.outlineColor.clone()
        }
      })

      this.tlFloors.to(
        floor.position,
        {
          y: floor.initialPosition.y,
          onStart: () => {
            floor.visible = true
          },
          ease: 'back.out(2)',
          duration: 0.85,
        },
        `enter-${floor.name}`
      )

      if (isFinalFloor) {
        floor.specialObjects.forEach((zone) => {
          const params = {
            ease: 'power1.out',
            duration: 0.35,
            delay: 0.3,
          }

          const typeZone = zone.publicAccess ? 'public' : 'vip'

          const color = this.colors[typeZone].lambertMaterialColor.clone()

          const emissive = this.colors[typeZone].lambertMaterialEmissive.clone()

          zone.materials.forEach((material) => {
            if (material instanceof MeshLambertMaterial) {
              this.tlFloors.to(
                material.color,
                {
                  r: color.r,
                  g: color.g,
                  b: color.b,
                  ...params,
                },
                `enter-${floor.name}`
              )

              this.tlFloors.to(
                material.emissive,
                {
                  r: emissive.r,
                  g: emissive.g,
                  b: emissive.b,
                  ...params,
                },
                `enter-${floor.name}`
              )

              this.tlFloors.to(
                material,
                {
                  emissiveIntensity: this.colors[typeZone].emissiveIntensity,
                  ...params,
                },
                `enter-${floor.name}`
              )
            }
          })
        })
      }
    },
    focusZoneImmediate(zoneSelected, zonesNotSelected) {
      this.zoneFocusEnabled = true
      this.setInteriorCurrentZoneName(zoneSelected.name)
      this.setInteriorCurrentZoneHovered(zoneSelected.name)
      this.setAppCursor('pointer')

      this.drag.enabled = false

      if (this.$viewport.isMobile) this.setHeaderHide(true)

      const { camera } = useWebGL()

      const zone = zoneSelected.publicAccess ? 'public' : 'vip'

      zoneSelected.normalObject.material.color =
        this.colors[zone].lambertMaterialColorActive.clone()
      zoneSelected.normalObject.material.emissive =
        this.colors[zone].lambertMaterialEmissiveActive.clone()
      zoneSelected.normalObject.material.emissiveIntensity =
        this.colors[zone].emissiveIntensityActive

      const cameraSelected =
        this.$viewport.isMobile && zoneSelected.content.name_camera_mobile
          ? this.cameras.getObjectByName(
              zoneSelected.content.name_camera_mobile
            )
          : this.cameras.getObjectByName(zoneSelected.content.name_camera)

      camera.position.copy(cameraSelected.position)
      camera.rotation.copy(cameraSelected.rotation)

      camera.zoom = this.$viewport.isMobile
        ? zoneSelected.content.camera_zoom_mobile
        : zoneSelected.content.camera_zoom

      camera.updateProjectionMatrix()

      zonesNotSelected.forEach((zone) => {
        zone.materials.forEach((material) => {
          if (material instanceof MeshLambertMaterial) {
            material.color = this.colors.lambertMaterialColor.clone()

            material.emissive = this.colors.lambertMaterialEmissive.clone()

            material.emissiveIntensity = this.colors.emissiveIntensity
          }
        })
      })
    },
    appearFloorImmediate(floor) {
      floor.specialObjects.forEach((zone) => {
        zone.materials.forEach((material) => {
          const zoneType = zone.publicAccess ? 'public' : 'vip'

          if (material instanceof MeshLambertMaterial) {
            material.color = this.colors[zoneType].lambertMaterialColor.clone()
            material.emissive =
              this.colors[zoneType].lambertMaterialEmissive.clone()
            material.emissiveIntensity = this.colors[zoneType].emissiveIntensity
          } else if (material instanceof ShaderMaterial) {
            material.uniforms.diffuse.value.set(
              this.colors.outlineColor.clone()
            )
          } else if (material instanceof LineBasicMaterial) {
            material.color = this.colors.outlineColor.clone()
          }
        })
      })
    },
    hideFloorImmediate(floor) {
      const graphFloor = this.buildGraph(floor)

      graphFloor.materials.forEach((material) => {
        if (material instanceof MeshLambertMaterial) {
          material.color = this.colors.lambertMaterialColor.clone()

          material.emissive = this.colors.lambertMaterialEmissive.clone()

          material.emissiveIntensity = this.colors.emissiveIntensity
        } else if (material instanceof ShaderMaterial) {
          material.uniforms.diffuse.value.set(
            this.colors.outlineHiddenColor.clone()
          )
        } else if (material instanceof LineBasicMaterial) {
          material.color = this.colors.outlineHiddenColor.clone()
        }
      })
    },
    initInterior() {
      const { interior } = useWebGL()

      this.gltf = loaderManager.getModel('interior')

      this.model = this.gltf.scene

      this.initCamera()
      this.initMaterials()
      this.initLights()

      this.initFloor()
      this.initFootField()
      this.initMusicScene()
      this.initTerrain()

      this.initZeroFloor()
      this.initFirstFloor()
      this.initSecondFloor()
      this.initThirdFloor()
      this.initFourthFloor()

      if (!this.$viewport.isMobile) this.initArrow()

      this.initGUI()

      if (this.interiorMusicScene) {
        this.terrain.position.copy(this.terrain.hidePosition)
        this.terrain.visible = false
      } else {
        this.musicScene.position.copy(this.musicScene.hidePosition)
        this.musicScene.visible = false
      }

      interior.floors = this.floors
    },
    initArrow() {
      const { interior } = useWebGL()

      this.arrow = new Group()
      this.arrow.name = 'arrow'
      interior.add(this.arrow)

      const arrowGroup = this.model.getObjectByName('Arrow')
      arrowGroup.scale.y = -1
      arrowGroup.position.set(0, 0, 0)

      const arrow = this.mergeObject(arrowGroup)

      arrow.material = this.arrowMaterial
      arrow.material.side = DoubleSide
      arrow.material.flatShading = true
      arrow.castShadow = true
      arrow.receiveShadow = true

      const edgeArrow = this.edgeObject(arrow)
      edgeArrow.material = this.lineMaterial.clone()
      edgeArrow.material.transparent = true

      const conditionalArrow = this.conditionalObject(arrow)
      conditionalArrow.material = this.conditionalMaterial.clone()
      conditionalArrow.material.transparent = true

      this.arrow.add(arrow)
      this.arrow.add(edgeArrow)
      // this.arrow.add(conditionalArrow)
      this.arrow.basicMaterial = arrow.material

      this.tweenArrowTranslate = gsap.to(this.arrowPositionYoyo, {
        y: 2,
        repeat: -1,
        yoyo: true,
        duration: 0.3,
        paused: true,
      })

      this.tweenArrowScale?.kill()

      this.arrow.scale.set(0, 0, 0)
    },
    initLights() {
      const { interior } = useWebGL()

      this.ambientLight = new AmbientLight(this.colors.ambientLightColor)
      interior.add(this.ambientLight)

      this.directionalLight = new DirectionalLight(
        this.colors.directionalLightColor,
        1
      )
      this.directionalLight.castShadow = true
      this.directionalLight.position.set(-100, 150, 300)

      this.directionalLight.shadow.mapSize.width = this.$viewport.isMobile
        ? 1024
        : window.devicePixelRatio !== 2
        ? 2048
        : 1024

      this.directionalLight.shadow.mapSize.height = this.$viewport.isMobile
        ? 1024
        : window.devicePixelRatio !== 2
        ? 2048
        : 1024

      // this.directionalLight.shadow.bias = -0.001
      this.directionalLight.shadow.camera.near = 1
      this.directionalLight.shadow.camera.far = 1000

      const size = this.$viewport.isMobile ? 50 : 100

      this.directionalLight.shadow.camera.left = size * -1
      this.directionalLight.shadow.camera.right = size * 1
      this.directionalLight.shadow.camera.top = size * 1
      this.directionalLight.shadow.camera.bottom = size * -1

      interior.add(this.directionalLight)
    },
    initGUI() {
      const gui = useGUI()

      this.gui = gui.addFolder({ title: `Interior`, expanded: false })

      const { interior, camera } = useWebGL()

      this.gui.addInput(interior, 'position', {
        x: { step: 1, max: 1000, min: -1000 },
        y: { step: 1, max: 1000, min: -1000 },
        z: { step: 1, max: 1000, min: -1000 },
        label: 'Interior Position',
      })

      this.gui
        .addInput(camera, 'position', {
          x: { step: 1, max: 1000, min: -1000 },
          y: { step: 1, max: 1000, min: -1000 },
          z: { step: 1, max: 1000, min: -1000 },
          label: 'Camera Position',
        })
        .on('change', () => {
          camera.updateProjectionMatrix()
        })

      this.gui
        .addInput(camera, 'rotation', {
          x: { step: 0.001, max: Math.PI * 1, min: Math.PI * -1 },
          y: { step: 0.001, max: Math.PI * 1, min: Math.PI * -1 },
          z: { step: 0.001, max: Math.PI * 1, min: Math.PI * -1 },
          label: 'Camera Rotation',
        })
        .on('change', () => {
          camera.updateProjectionMatrix()
        })

      this.guiDirectionalLight = this.gui.addFolder({
        title: `Directional Light`,
        expanded: false,
      })

      this.guiDirectionalLight.addInput(this.directionalLight, 'castShadow', {
        label: 'Cast shadow',
      })

      this.guiDirectionalLight.addInput(this.directionalLight, 'position', {
        x: { step: 1, max: 1000, min: -1000 },
        y: { step: 1, max: 1000, min: -1000 },
        z: { step: 1, max: 1000, min: -1000 },
        label: 'Position',
      })

      this.guiDirectionalLight.addInput(this.directionalLight, 'color', {
        color: { type: 'float' },
        label: 'Color',
      })

      this.guiDirectionalLight.addInput(this.directionalLight, 'intensity', {
        min: 0,
        max: 2,
        step: 0.01,
        label: 'Intensity',
      })

      this.guiDirectionalLight
        .addInput(this.directionalLight.shadow.camera, 'near', {
          min: 0,
          max: 1,
          step: 0.01,
          label: 'Near Shadow Camera',
        })
        .on('change', (e) => {
          this.directionalLight.shadow.camera.near = e.value

          this.directionalLight.shadow.camera.updateProjectionMatrix()
        })

      this.guiDirectionalLight
        .addInput(this.directionalLight.shadow.camera, 'far', {
          min: 0,
          max: 1000,
          step: 0.01,
          label: 'Far Shadow Camera',
        })
        .on('change', (e) => {
          this.directionalLight.shadow.camera.far = e.value

          this.directionalLight.shadow.camera.updateProjectionMatrix()
        })

      this.guiModelColors = this.gui.addFolder({
        title: `Colors`,
        expanded: false,
      })

      this.guiModelColors
        .addInput(this.colors, 'lambertMaterialColor', {
          color: { type: 'float' },
          label: 'Color',
        })
        .on('change', (e) => {
          this.basicMaterial.color = e.value

          this.floors.forEach((floor) => {
            floor.materials.basicMaterial.color = e.value
          })
        })

      this.guiModelColors
        .addInput(this.colors, 'lambertMaterialEmissive', {
          color: { type: 'float' },
          label: 'Emissive Color',
        })
        .on('change', (e) => {
          this.basicMaterial.emissive = e.value

          this.floors.forEach((floor) => {
            floor.materials.basicMaterial.emissive = e.value
          })
        })

      this.guiModelColors
        .addInput(this.colors, 'emissiveIntensity', {
          min: 0,
          max: 1,
          step: 0.01,
          label: 'Emissive Intensity',
        })
        .on('change', (e) => {
          this.basicMaterial.emissiveIntensity = e.value

          this.floors.forEach((floor) => {
            floor.materials.basicMaterial.emissiveIntensity = e.value
          })
        })

      this.guiModelColors.addSeparator()

      this.guiModelColors.addInput(this.shadowMaterial, 'color', {
        color: { type: 'float' },
        label: 'Shadow Color',
      })

      this.guiModelColors.addInput(this.shadowMaterial, 'opacity', {
        min: 0,
        max: 1,
        step: 0.01,
        label: 'Shadow Color opacity',
      })

      this.guiModelColors.addSeparator()

      this.guiModelColors
        .addInput(this.colors, 'outlineColor', {
          color: { type: 'float' },
          label: 'Outline color',
        })
        .on('change', (e) => {
          this.lineMaterial.color = e.value

          this.conditionalMaterial.uniforms.diffuse.value.set(e.value)

          this.floors.forEach((floor) => {
            floor.materials.lineMaterial.color = e.value

            floor.materials.conditionalMaterial.uniforms.diffuse.value.set(
              e.value
            )
          })
        })

      this.guiAmbientLight = this.gui.addFolder({
        title: `Ambient Light`,
        expanded: false,
      })

      this.guiAmbientLight.addInput(this.ambientLight, 'color', {
        color: { type: 'float' },
        label: 'Color',
      })

      this.guiAmbientLight.addInput(this.ambientLight, 'intensity', {
        min: 0,
        max: 2,
        step: 0.01,
        label: 'Intensity',
      })

      this.guiDrag = this.gui.addFolder({ title: `Drag`, expanded: false })

      this.guiDrag.addInput(this.drag, 'enabled')

      this.guiDrag.addInput(this, 'azimuth', {
        min: Math.PI * -1,
        max: Math.PI * 1,
        label: 'Clamp rotation',
        step: 0.001,
      })

      this.guiDrag.addInput(this.drag, 'ease', {
        min: 0,
        max: 0.1,
        label: 'Drag ease',
        step: 0.0001,
      })

      this.guiDrag.addInput(this.drag, 'dragSpeed', {
        min: 0,
        max: 0.03,
        label: 'Drag speed',
        step: 0.0001,
      })

      this.guiZoom = this.gui.addFolder({ title: `Zoom`, expanded: false })

      this.guiZoom
        .addInput(this.zoom, 'current', {
          min: this.zoom.range.min,
          max: this.zoom.range.max,
          label: 'Zoom value',
          step: 1,
        })
        .on('change', (payload) => {
          const { camera } = useWebGL()

          this.zoom.current = payload.value
          this.zoom.initial = payload.value

          camera.zoom = this.zoom.current

          camera.updateProjectionMatrix()
        })
    },
    initCamera() {
      const { interior } = useWebGL()

      this.cameras = this.model.getObjectByName('Cameras')

      this.cameraBase = this.cameras.getObjectByName('BaseCamera')

      interior.initialCamera = { ...this.cameraBase }
    },
    resetView() {
      this.drag.current = 0
      this.drag.target = 0
      this.drag.last = 0
    },
    initMaterials() {
      this.shadowMaterial = new ShadowMaterial({
        precision: 'lowp',
        color: this.colors.shadowColor,
        opacity: 0.75,
      })

      const polygonsParams = {
        polygonOffset: true,
        polygonOffsetFactor: this.polygonOffsetFactor,
        polygonOffsetUnits: this.polygonOffsetUnits,
      }

      this.basicMaterial = new MeshLambertMaterial({
        precision: 'lowp',
        color: this.colors.lambertMaterialColor,
        emissive: this.colors.lambertMaterialEmissive,
        emissiveIntensity: this.colors.emissiveIntensity,
        ...polygonsParams,
      })
      this.basicMaterial.name = 'basicMaterial'
      this.basicMaterial.side = DoubleSide

      this.conditionalMaterial = new ShaderMaterial(ConditionalEdgesShader)
      this.conditionalMaterial.uniforms.diffuse.value.set(
        this.colors.outlineColor
      )
      this.conditionalMaterial.name = 'conditionalMaterial'

      this.lineMaterial = new LineBasicMaterial({
        precision: 'lowp',

        color: this.colors.outlineColor,
        linewidth: 2,
      })
      this.lineMaterial.name = 'lineMaterial'

      this.publicMaterial = new MeshLambertMaterial({
        precision: 'lowp',
        color: this.colors.public.lambertMaterialColor,
        emissive: this.colors.public.lambertMaterialEmissive,
        emissiveIntensity: this.colors.public.emissiveIntensity,
        ...polygonsParams,
      })
      this.publicMaterial.name = 'publicMaterial'
      this.publicMaterial.side = DoubleSide

      this.vipMaterial = new MeshLambertMaterial({
        precision: 'lowp',
        color: this.colors.vip.lambertMaterialColor,
        emissive: this.colors.vip.lambertMaterialEmissive,
        emissiveIntensity: this.colors.vip.emissiveIntensity,
        ...polygonsParams,
      })
      this.vipMaterial.name = 'vipMaterial'
      this.vipMaterial.side = DoubleSide

      this.arrowMaterial = new MeshLambertMaterial({
        precision: 'lowp',
        color: this.colors.arrowColor,
        emissive: this.colors.arrowColor,
        emissiveIntensity: this.colors.emissiveIntensity,
        opacity: 0,
        transparent: true,
      })
    },
    initFootField() {
      const { interior } = useWebGL()

      this.footField = new Group()
      this.footField.name = 'footField'
      interior.add(this.footField)

      const footFieldGroup = this.model.getObjectByName('FootField')

      const footField = this.mergeObject(footFieldGroup)
      const edgeFootField = this.edgeObject(footField)
      const conditionalFootField = this.conditionalObject(footField)

      this.footField.add(footField)
      this.footField.add(edgeFootField)
      this.footField.add(conditionalFootField)
    },
    initMusicScene() {
      const { interior } = useWebGL()

      this.musicScene = new Group()
      this.musicScene.name = 'musicScene'
      interior.add(this.musicScene)

      const musicSceneGroup = this.model.getObjectByName('Scene_Music')

      const musicScene = this.mergeObject(musicSceneGroup)
      const edgeMusicScene = this.edgeObject(musicScene)
      const conditionalMusicScene = this.conditionalObject(musicScene)

      this.musicScene.add(musicScene)
      this.musicScene.add(edgeMusicScene)
      this.musicScene.add(conditionalMusicScene)

      const { min, max } = new Box3().setFromObject(this.musicScene)

      this.musicScene.initialPosition = this.musicScene.position.clone()

      this.musicScene.hidePosition = this.musicScene.position.clone()
      this.musicScene.hidePosition.y = (max.y - min.y) * -1 - 0.5
    },
    initTerrain() {
      const { interior } = useWebGL()

      this.terrain = new Group()
      this.terrain.name = 'terrain'
      interior.add(this.terrain)

      const terrainGroup = this.model.getObjectByName('Terrain_001')

      const terrain = this.mergeObject(terrainGroup)
      const edgeTerrain = this.edgeObject(terrain)
      // const conditionalTerrain = this.conditionalObject(terrain)

      this.terrain.add(terrain)
      this.terrain.add(edgeTerrain)
      // this.terrain.add(conditionalTerrain)

      const { min, max } = new Box3().setFromObject(this.terrain)

      this.terrain.initialPosition = this.terrain.position.clone()

      this.terrain.hidePosition = this.terrain.position.clone()
      this.terrain.hidePosition.y = (max.y - min.y) * -1 - 0.5
    },
    initFloor() {
      const { interior } = useWebGL()

      this.floor = new Group()
      this.floor.name = 'floor'
      this.floor.position.y -= 0.1
      interior.add(this.floor)

      const floorGroup = this.model.getObjectByName('Floor')

      const floor = this.mergeObject(floorGroup)

      const shadowFloor = floor.clone()
      shadowFloor.name = 'shadowModel'
      shadowFloor.material = this.shadowMaterial

      floor.castShadow = false
      floor.receiveShadow = false

      const edgeFloor = this.edgeObject(floor)
      // const conditionalFloor = this.conditionalObject(floor)

      // this.floor.add(floor)
      this.floor.add(shadowFloor)
      this.floor.add(edgeFloor)
      // this.floor.add(conditionalFloor)
    },
    initZeroFloor() {
      const { interior } = useWebGL()

      const floorGroup = this.model
        .getObjectByName('Arene')
        .getObjectByName('RDC')

      this.zeroFloor = this.buildArenaFloor(floorGroup, 0, true)
      interior.add(this.zeroFloor)
      this.floors.push(this.zeroFloor)
    },
    initFirstFloor() {
      const { interior } = useWebGL()

      const floorGroup = this.model
        .getObjectByName('Arene')
        .getObjectByName('Niveau_1')

      this.firstFloor = this.buildArenaFloor(floorGroup, 1)
      interior.add(this.firstFloor)
      this.floors.push(this.firstFloor)
    },
    initSecondFloor() {
      const { interior } = useWebGL()

      const floorGroup = this.model
        .getObjectByName('Arene')
        .getObjectByName('Niveau_2')

      this.secondFloor = this.buildArenaFloor(floorGroup, 2)
      interior.add(this.secondFloor)
      this.floors.push(this.secondFloor)
    },
    initThirdFloor() {
      const { interior } = useWebGL()

      const floorGroup = this.model
        .getObjectByName('Arene')
        .getObjectByName('Niveau_3')

      this.thirdFloor = this.buildArenaFloor(floorGroup, 3)
      interior.add(this.thirdFloor)
      this.floors.push(this.thirdFloor)
    },
    initFourthFloor() {
      const { interior } = useWebGL()

      const floorGroup = this.model
        .getObjectByName('Arene')
        .getObjectByName('Niveau_4')

      this.fourthFloor = this.buildArenaFloor(floorGroup, 4)
      interior.add(this.fourthFloor)
      this.floors.push(this.fourthFloor)
    },
    onStopDrag() {
      this.dragInProgress = false
    },
    onDrag(e) {
      if (!this.drag.enabled || !this.interiorVisible) return

      const allowDrag = e.event.target.getAttribute('data-allow-drag')

      if (!allowDrag || allowDrag === null) return

      this.dragInProgress = true

      const delta = e.deltaX * this.drag.dragSpeed

      this.drag.target = gsap.utils.clamp(
        this.azimuth.min,
        this.azimuth.max,
        this.drag.target + delta
      )
    },
    onClickZone(e) {
      if (!this.interiorVisible || this.interiorTimelineFloorsInProgress) return

      if (this.currentZoneIntersect && !this.dragInProgress) {
        const basicObject = this.currentZoneIntersect.object
        const zone = basicObject.parent
        const isDifferentThanSelected =
          zone.name !== this.interiorCurrentZoneName

        if (!this.zoneFocusEnabled) {
          this.focusZone(zone)
        } else if (this.zoneFocusEnabled && !isDifferentThanSelected) {
          this.unfocusZone()
        }
      } else if (!this.currentZoneIntersect && this.zoneFocusEnabled) {
        this.unfocusZone()
      }
    },
    focusZone(zone) {
      this.zoneFocusEnabled = true
      this.setInteriorCurrentZoneName(zone.name)

      if (this.$viewport.isMobile) this.setHeaderHide(true)

      const { camera } = useWebGL()

      this.drag.enabled = false
      this.drag.target = 0

      this.tweenArrowTranslate?.pause()

      this.setCursorState('hide')

      const cameraSelected =
        this.$viewport.isMobile && zone.content.name_camera_mobile
          ? this.cameras.getObjectByName(zone.content.name_camera_mobile)
          : this.cameras.getObjectByName(zone.content.name_camera)

      const params = {
        ease: 'power1.inOut',
        duration: 1,
      }

      if (!this.$viewport.isMobile) {
        const materials = this.buildGraph(this.arrow).materials

        gsap.to([materials], {
          opacity: 0,
          ease: 'power1.inOut',
          duration: 0.5,
        })

        this.tweenArrowScale?.kill()
        this.tweenArrowScale = gsap.to(this.arrow.scale, {
          x: 0,
          y: 0,
          z: 0,
          ease: 'power1.inOut',
          duration: 0.5,
        })
      }

      gsap.to(camera.position, {
        x: cameraSelected.position.x,
        y: cameraSelected.position.y,
        z: cameraSelected.position.z,
        ...params,
      })
      gsap.to(camera.rotation, {
        x: cameraSelected.rotation.x,
        y: cameraSelected.rotation.y,
        z: cameraSelected.rotation.z,
        ...params,
      })
      gsap.to(camera, {
        zoom: this.$viewport.isMobile
          ? zone.content.camera_zoom_mobile
          : zone.content.camera_zoom,
        ...params,
        onUpdate: () => {
          camera.updateProjectionMatrix()
        },
      })

      this.inactiveZones.forEach((object) => {
        this.handlerColorsZonesInactives(object, false)
      })
    },
    handlerColorsZonesInactives(zone, appear) {
      const params = {
        ease: 'power1.inOut',
        duration: 0.5,
      }

      const typeZone = zone.publicAccess ? 'public' : 'vip'

      const color = appear
        ? this.colors[typeZone].lambertMaterialColor
        : this.colors.lambertMaterialColor

      const emissive = appear
        ? this.colors[typeZone].lambertMaterialEmissive
        : this.colors.lambertMaterialEmissive

      zone.materials.forEach((material) => {
        if (material instanceof MeshLambertMaterial) {
          gsap.to(material.color, {
            r: color.r,
            g: color.g,
            b: color.b,
            ...params,
          })

          gsap.to(material.emissive, {
            r: emissive.r,
            g: emissive.g,
            b: emissive.b,
            ...params,
          })

          gsap.to(material, {
            emissiveIntensity: appear
              ? this.colors[typeZone].emissiveIntensity
              : this.colors.emissiveIntensity,
            ...params,
          })
        }
      })
    },
    unfocusZone(forceUnfocus = false) {
      const saveZoneName = this.interiorCurrentZoneName
      this.zoneFocusEnabled = false
      this.currentZoneIntersect = null
      this.setAppCursor('initial')

      this.setInteriorCurrentZoneName(null)
      this.setInteriorCurrentZoneHovered(null)
      this.setCursorState('hide')

      if (this.$viewport.isMobile) this.setHeaderHide(false)

      const { camera } = useWebGL()

      this.drag.enabled = true

      const params = {
        ease: 'power1.inOut',
        duration: 1,
      }

      if (!forceUnfocus) {
        gsap.to(camera, {
          duration: 1,
          zoom: this.$viewport.isMobile
            ? this.currentFloor.content.camera_zoom_mobile
            : this.currentFloor.content.camera_zoom || this.zoom.initial,
          ...params,
          onUpdate: () => {
            camera.updateProjectionMatrix()
          },
        })

        this.tweenArrowTranslate?.play()
      }

      gsap.to(camera.position, {
        duration: 1,
        x: this.cameraBase.position.x,
        y: this.cameraBase.position.y,
        z: this.cameraBase.position.z,
        ...params,
      })

      gsap.to(camera.rotation, {
        duration: 1,
        x: this.cameraBase.rotation.x,
        y: this.cameraBase.rotation.y,
        z: this.cameraBase.rotation.z,
        ...params,
      })

      if (!forceUnfocus) {
        const test = this.currentFloor.specialObjects.filter(
          (object) => object.name !== saveZoneName
        )

        test.forEach((object) => {
          this.handlerColorsZonesInactives(object, true)
        })
      }
    },
    onMouseEnterZone(object) {
      if (this.$viewport.isMobile || this.menuActive) return

      this.setAppCursor('pointer')
      this.setInteriorCurrentZoneHovered(object.parent.name)

      const zone = object.parent.publicAccess ? 'public' : 'vip'

      const params = {
        ease: 'power2.inOut',
        duration: 0.45,
      }

      const materials = this.buildGraph(this.arrow).materials

      this.tweenArrowTranslate?.play()

      const invertZone = zone === 'public' ? 'vip' : 'public'

      this.arrow.basicMaterial.color =
        this.colors[invertZone].lambertMaterialColor.clone()

      this.arrow.basicMaterial.emissive =
        this.colors[invertZone].lambertMaterialEmissive.clone()

      this.arrow.basicMaterial.emissiveIntensity =
        this.colors[invertZone].emissiveIntensity

      gsap.to([materials], {
        opacity: 1,
        ...params,
      })

      this.tweenArrowScale?.kill()
      this.tweenArrowScale = gsap.to(this.arrow.scale, {
        x: 1,
        y: 1,
        z: 1,
        ...params,
      })

      gsap.to(object.parent.normalObject.material.color, {
        r: this.colors[zone].lambertMaterialColorActive.r,
        g: this.colors[zone].lambertMaterialColorActive.g,
        b: this.colors[zone].lambertMaterialColorActive.b,
        ...params,
      })
      gsap.to(object.parent.normalObject.material.emissive, {
        r: this.colors[zone].lambertMaterialColorActive.r,
        g: this.colors[zone].lambertMaterialColorActive.g,
        b: this.colors[zone].lambertMaterialColorActive.b,
        ...params,
      })
      gsap.to(object.parent.normalObject.material, {
        emissiveIntensity: this.colors[zone].emissiveIntensityActive,
        ...params,
      })
    },
    onMouseLeaveZone(object) {
      if (this.$viewport.isMobile || this.menuActive) return

      this.setAppCursor('initial')

      this.setInteriorCurrentZoneHovered(null)

      const params = {
        ease: 'power2.out',
        duration: 0.45,
      }

      this.tweenArrowTranslate?.pause()

      const zone = object.parent.publicAccess ? 'public' : 'vip'

      const materials = this.buildGraph(this.arrow).materials

      gsap.to([materials], {
        opacity: 0,
        ease: 'power2.inOut',
        duration: 0.2,
      })

      this.tweenArrowScale?.kill()
      this.tweenArrowScale = gsap.to(this.arrow.scale, {
        x: 0,
        y: 0,
        z: 0,
        ease: 'power2.inOut',
        duration: 0.2,
      })

      gsap.to(object.parent.normalObject.material.color, {
        r: this.colors[zone].lambertMaterialColor.r,
        g: this.colors[zone].lambertMaterialColor.g,
        b: this.colors[zone].lambertMaterialColor.b,
        ...params,
      })
      gsap.to(object.parent.normalObject.material.emissive, {
        r: this.colors[zone].lambertMaterialEmissive.r,
        g: this.colors[zone].lambertMaterialEmissive.g,
        b: this.colors[zone].lambertMaterialEmissive.b,
        ...params,
      })
      gsap.to(object.parent.normalObject.material, {
        emissiveIntensity: this.colors[zone].emissiveIntensity,
        ...params,
      })
    },
    onFrame({ time, deltaTime, frame, deltaRatio }) {
      if (!this.interiorVisible) return

      const { interior, raycaster } = useWebGL()

      if (
        this.currentFloor &&
        this.currentFloor.basicObjectRaycast &&
        !this.zoneFocusEnabled &&
        !this.dragInProgress &&
        !this.interiorTimelineFloorsInProgress &&
        !this.instructionsWebglVisible
      ) {
        const intersects = raycaster.intersectObjects(
          this.currentFloor?.basicObjectRaycast,
          false
        )

        if (intersects.length) {
          if (
            !this.currentZoneIntersect ||
            intersects[0].object.parent.name !==
              this.currentZoneIntersect?.object?.parent.name
          ) {
            if (this.currentZoneIntersect) {
              this.onMouseLeaveZone(this.currentZoneIntersect.object)
            }

            this.onMouseEnterZone(intersects[0].object)
          }

          this.currentZoneIntersect = intersects[0]

          if (!this.$viewport.isMobile) {
            const targetPosition = this.arrow.parent.worldToLocal(
              this.currentZoneIntersect.point.clone()
            )

            targetPosition.y += 3

            targetPosition.add(this.arrowPositionYoyo)

            this.arrow.position.lerp(targetPosition, 0.3)
          }
        } else {
          if (this.currentZoneIntersect) {
            this.onMouseLeaveZone(this.currentZoneIntersect.object)
          }

          this.currentZoneIntersect = null
        }
      }

      this.drag.current = this.lerp(
        this.drag.current,
        this.drag.target,
        this.drag.ease
      )

      interior.rotation.y = this.drag.current

      this.drag.last = this.drag.current
    },
    initFloorMaterials() {
      const basicMaterial = this.basicMaterial.clone()

      const outlineColor = this.colors.outlineColor.clone()
      const conditionalMaterial = this.conditionalMaterial.clone()
      conditionalMaterial.uniforms.diffuse.value.set(outlineColor)

      const lineMaterial = this.lineMaterial.clone()
      lineMaterial.color = outlineColor

      const publicMaterial = this.publicMaterial.clone()
      publicMaterial.color = this.colors.public.lambertMaterialColor.clone()
      publicMaterial.emissive =
        this.colors.public.lambertMaterialEmissive.clone()

      const vipMaterial = this.vipMaterial.clone()
      vipMaterial.color = this.colors.vip.lambertMaterialColor.clone()
      vipMaterial.emissive = this.colors.vip.lambertMaterialEmissive.clone()

      return {
        basicMaterial,
        lineMaterial,
        conditionalMaterial,
        publicMaterial,
        vipMaterial,
      }
    },
    buildArenaFloor(initialObject, indexFloor, isGroundFloor = false) {
      const arene = this.model.getObjectByName('Arene')

      const group = new Group()
      group.position.copy(arene.position)
      group.updateMatrixWorld()
      group.name = `floor-${indexFloor}`
      group.content = { ...this.interiorContent[indexFloor] }
      group.public = []
      group.vip = []
      group.basicObjectRaycast = []
      group.specialObjects = []
      group.materials = this.initFloorMaterials()
      group.isGroundFloor = isGroundFloor

      const clippingPlane = new Plane(new Vector3(0, 1, 0), 0)

      const object = initialObject.clone()

      const { basicObject, specialObjects } = this.parseFloor(object)

      // const { normalObject, edgeObject, conditionalObject } =
      //   this.buildMergedObjects(basicObject, clippingPlane, group.materials)

      // group.add(normalObject, edgeObject, conditionalObject)

      const { normalObject, edgeObject } = this.buildMergedObjects(
        basicObject,
        clippingPlane,
        group.materials
      )

      group.add(normalObject, edgeObject)

      group.position.y += indexFloor * 0.05
      group.initialPosition = group.position.clone()

      const { min, max } = new Box3().setFromObject(group)

      const height = max.y - min.y

      clippingPlane.constant = min.y * -1 + 0.05

      group.hidePosition = group.position.clone()
      group.hidePosition.y = height * -2

      specialObjects.forEach((obj) => {
        obj.isBasicObject = false
        obj.publicAccess = !obj.name.includes('VIP')

        const part = new Group()
        part.name = obj.name
        part.isBasicObject = obj.isBasicObject
        part.publicAccess = obj.publicAccess
        part.content = group.content.zones.find(
          (zone) => part.name === zone.name_gltf
        )

        const { normalObject, edgeObject, conditionalObject, hitbox } =
          this.buildMergedObjects(
            obj,
            clippingPlane,
            group.materials,
            !obj.isBasicObject
          )

        part.normalObject = normalObject
        part.add(hitbox)
        group.basicObjectRaycast.push(hitbox)

        part.materials = [
          normalObject.material,
          edgeObject.material,
          conditionalObject.material,
        ]

        part.add(normalObject, edgeObject, conditionalObject)
        part.position.y += 0.05

        const bounding = new Box3().setFromObject(part)

        part.min = bounding.min
        part.max = bounding.max

        if (part.name.includes('VIP')) {
          group.vip.push(part)
        } else {
          group.public.push(part)
        }

        group.specialObjects.push(part)

        group.add(part)
      })

      return group
    },

    parseFloor(object) {
      const basicObject = new Group()
      basicObject.isBasicObject = true

      const { fail: objectsWithoutBoole, pass: booleGroup } = this.partition(
        object.children,
        (e) => e.name.includes('Boole')
      )

      const booleObject = booleGroup[0].children[0]

      if (objectsWithoutBoole.length) basicObject.add(...objectsWithoutBoole)

      const { pass: specialObjects, fail: basicObjectsBoole } = this.partition(
        booleObject.children,
        (e) => e.name.includes('VIP') || e.name.includes('PUBLIC')
      )

      if (basicObjectsBoole.length) basicObject.add(...basicObjectsBoole)

      return { basicObject, specialObjects }
    },
    buildMergedObjects(object, clippingPlane, materials, cloned = false) {
      const originalHitbox = object.children.find((el) =>
        el.name.includes('itbox')
      )

      let hitbox

      if (cloned && originalHitbox) {
        hitbox = originalHitbox.clone()
        hitbox.visible = false
        object.remove(originalHitbox)

        const objWorldPosition = object.getWorldPosition(new Vector3())
        hitbox.position.add(objWorldPosition)
      }

      const normalObject = this.mergeObject(object)

      if (!object.isBasicObject) {
        if (object.publicAccess) {
          normalObject.material = cloned
            ? materials.publicMaterial.clone()
            : materials.publicMaterial
        } else {
          normalObject.material = cloned
            ? materials.vipMaterial.clone()
            : materials.vipMaterial
        }
      } else {
        normalObject.material = materials.basicMaterial
      }

      normalObject.material.clippingPlanes = [clippingPlane]
      normalObject.material.clipShadows = true

      const edgeObject = this.edgeObject(normalObject)
      edgeObject.material = materials.lineMaterial
      edgeObject.material.clippingPlanes = [clippingPlane]
      edgeObject.material.clipShadows = true

      const conditionalObject = this.conditionalObject(normalObject)
      conditionalObject.material = materials.conditionalMaterial
      conditionalObject.material.clippingPlanes = [clippingPlane]
      conditionalObject.material.clipShadows = true

      return {
        normalObject,
        edgeObject,
        conditionalObject,
        hitbox: hitbox || normalObject,
      }
    },
    partition(array, filter) {
      const pass = []
      const fail = []

      array.forEach((e, idx, arr) =>
        (filter(e, idx, arr) ? pass : fail).push(e)
      )

      return { pass, fail }
    },
    mergeObject(object) {
      const obj = object

      obj.updateMatrixWorld(true)

      const geometry = []

      obj.traverse((child) => {
        if (child.isMesh) {
          const g = child.geometry.clone()

          g.applyMatrix4(child.matrixWorld)

          for (const key in g.attributes) {
            if (key !== 'position' && key !== 'normal') {
              g.deleteAttribute(key)
            }
          }

          geometry.push(g.toNonIndexed())
        }
      })

      const mergedGeometries = mergeGeometries(geometry, false)
      const mergedGeometry = mergeVertices(mergedGeometries)

      const mesh = new Mesh(mergedGeometry)
      mesh.updateMatrixWorld()
      mesh.castShadow = true
      mesh.receiveShadow = true

      mesh.name = 'model'
      mesh.material = this.basicMaterial

      mesh.material.needsUpdate = true

      return mesh
    },
    edgeObject(object) {
      const mergedGeom = object.geometry.clone()

      const lineGeom = new EdgesGeometry(mergedGeom, this.thresholdAngle)

      const material = this.lineMaterial

      const line = new LineSegments(lineGeom, material)
      line.castShadow = false
      line.receiveShadow = false
      line.position.copy(object.position)
      line.scale.copy(object.scale)
      line.rotation.copy(object.rotation)
      line.name = 'edge'

      return line
    },
    conditionalObject(object) {
      const mergedGeom = object.geometry.clone()

      for (let index = 0; index < mergedGeom.attributes.length; index++) {
        if (index !== 'position') {
          mergedGeom.deleteAttribute(index)
        }
      }

      const lineGeom = new ConditionalEdgesGeometry(mergeVertices(mergedGeom))

      const material = this.conditionalMaterial

      const mesh = new LineSegments(lineGeom, material)
      mesh.castShadow = false
      mesh.receiveShadow = false
      mesh.position.copy(object.position)
      mesh.scale.copy(object.scale)
      mesh.rotation.copy(object.rotation)
      mesh.name = 'conditional'

      return mesh
    },
    lerp(p1, p2, t) {
      return p1 + (p2 - p1) * t
    },
    buildGraph(object) {
      const data = { nodes: {}, materials: [] }
      if (object) {
        object.traverse((obj) => {
          if (obj.name) data.nodes[obj.name] = obj
          if (obj.material) data.materials.push(obj.material)
        })
      }
      return data
    },
    ...mapMutations({
      setInteriorIndexFloor: 'setInteriorIndexFloor',
      setInteriorVisible: 'setInteriorVisible',
      setCursorState: 'setCursorState',
      setAppCursor: 'setAppCursor',
      setInteriorCurrentZoneName: 'setInteriorCurrentZoneName',
      setInteriorCurrentZoneHovered: 'setInteriorCurrentZoneHovered',
      setHeaderHide: 'setHeaderHide',
      setAllowScroll: 'setAllowScroll',
      setInstructionsWebglVisible: 'setInstructionsWebglVisible',
      setInteriorTimelineFloorsInProgress:
        'setInteriorTimelineFloorsInProgress',
    }),
  },
}
</script>
