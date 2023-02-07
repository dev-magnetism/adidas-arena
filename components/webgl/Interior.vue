<template>
  <div />
</template>

<script>
import { gsap } from 'gsap'
import { Observer } from 'gsap/Observer'

import { mapState, mapMutations } from 'vuex'

import {
  mergeBufferGeometries,
  mergeVertices,
} from 'three/examples/jsm/utils/BufferGeometryUtils.js'
// import { MeshLineMaterial } from 'meshline'

import useWebGL from '~/hooks/webgl'
import useGUI from '~/hooks/gui'

import loaderManager from '~/assets/js/loaderManager'

import { ConditionalEdgesGeometry } from '~/assets/js/webgl/ConditionalEdgesGeometry'
import { ConditionalEdgesShader } from '~/assets/js/webgl/ConditionalEdgesShader'

export default {
  data() {
    return {
      colors: {
        shadowColor: new THREE.Color(0xede5db),
        arrowColor: new THREE.Color(0xff4a48),
        ambientLightColor: new THREE.Color(0xf2f2f2),
        directionalLightColor: new THREE.Color(0xffffff),
        lambertMaterialColor: new THREE.Color(0xd8d8d8),
        lambertMaterialEmissive: new THREE.Color(0xefefef),
        emissiveIntensity: 0.75,
        outlineColor: new THREE.Color(0x000000),
        outlineHiddenColor: new THREE.Color(0x808080),
        public: {
          lambertMaterialColor: new THREE.Color(0x3070ff),
          lambertMaterialEmissive: new THREE.Color(0x285bd1),
          emissiveIntensity: 0.6,
          lambertMaterialColorActive: new THREE.Color(0x0000ff),
          lambertMaterialEmissiveActive: new THREE.Color(0x0202d6),
          emissiveIntensityActive: 0.5,
        },
        vip: {
          lambertMaterialColor: new THREE.Color(0xf46b2b),
          lambertMaterialEmissive: new THREE.Color(0xe2723d),
          emissiveIntensity: 0.6,
          lambertMaterialColorActive: new THREE.Color(0xe2520f),
          lambertMaterialEmissiveActive: new THREE.Color(0xdb500f),
          emissiveIntensityActive: 0.7,
        },
      },
      azimuth: { min: -1.6, max: 0.6 },
      drag: {
        ease: 0.04,
        current: 0,
        target: 0,
        last: 0,
        speed: 2,
        dragSpeed: 0.0025,
        enabled: false,
      },
      zoom: {
        initial: 15,
        current: 15,
        range: {
          min: 5,
          max: 30,
        },
      },
      thresholdAngle: 40,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
      floorsGUI: [],
      floors: [],
      currentZoneIntersect: null,
      zoneFocusEnabled: false,
      dragInProgress: false,
    }
  },
  computed: {
    ...mapState({
      modelInteriorLoaded: (state) => state.modelInteriorLoaded,
      allLoadedActual: (state) => state.allLoadedActual,
      interiorVisible: (state) => state.interiorVisible,
      interiorIndexFloor: (state) => state.interiorIndexFloor,
      interiorMusicScene: (state) => state.interiorMusicScene,
      interiorContent: (state) => state.interiorContent,
      interiorCurrentZoneName: (state) => state.interiorCurrentZoneName,
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
      target: this.$nuxt.$el,
      type: 'touch,pointer,wheel',
      onDrag: this.onDrag,
      onStop: this.onStopDrag,
      dragMinimum: 5,
      tolerance: 5,
    })

    this.$nuxt.$on('reset:interior', this.resetView)

    this.$raf.add(`webgl-interior`, this.onFrame)

    document
      .getElementById('__nuxt')
      .addEventListener('click', this.onClickZone)
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
      if (item instanceof THREE.Mesh || item instanceof THREE.Line) {
        item.geometry?.dispose()

        interior.remove(item)
      }
    })

    interior.remove(this.floor)
    interior.remove(this.footField)
    interior.remove(this.musicScene)
    interior.remove(this.terrain)

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
    this.guiModelColors?.dispose()
    this.floorsGUI.forEach((gui) => {
      gui.dispose()
    })

    interior.floors = []
    this.observer?.kill()
    this.tlFloors?.kill()
    this.tlSwitchMiddleScene?.kill()
    this.tlFloorsHidden?.kill()
    this.$nuxt.$off('reset:interior', this.resetView)
    this.$raf.remove(`webgl-interior`, this.onFrame)

    document
      .getElementById('__nuxt')
      .removeEventListener('click', this.onClickZone)
  },
  methods: {
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

      this.drag.target = 0

      camera.zoom = this.currentFloor.content.camera_zoom || this.zoom.current
      camera.updateProjectionMatrix()

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
        console.log('focus', this.currentFloor)

        const { fail: zonesNotSelected, pass: zoneSelected } = this.partition(
          this.currentFloor.specialObjects,
          (e) => e.name === this.interiorIndexFloor.focus
        )

        this.focusZoneImmediate(zoneSelected[0], zonesNotSelected)

        // const zone = this.currentFloor.specialObjects.find(
        //   (object) => object.name === this.interiorIndexFloor.focus
        // )

        // this.focusZone(zone)
      }
    },
    handleAnimatedTransition(oldVal) {
      this.tlFloors?.clear()
      this.tlFloors?.kill()
      this.tlFloorsHidden?.clear()
      this.tlFloorsHidden?.kill()

      this.tlFloors = gsap.timeline()
      this.tlFloorsHidden = gsap.timeline()

      const isAscendant = oldVal.id < this.interiorIndexFloor.id

      this.$nuxt.$emit('interior:animated-transition')

      if (isAscendant) {
        this.floors.forEach((floor, index) => {
          const isTweenable =
            index <= this.interiorIndexFloor.id && !floor.visible && index !== 0

          const isHidden =
            (index >= oldVal.id || oldVal.id === 0) &&
            index < this.interiorIndexFloor.id

          if (isTweenable) {
            this.tlFloors.to(floor.position, {
              y: floor.initialPosition.y,
              onStart: () => {
                floor.visible = true
              },
              ease: 'back.out(2)',
              duration: 0.75,
            })
          }

          if (isHidden) {
            this.hideFloorImmediate(floor)
            // floor.specialObjects.forEach((zone) => {
            //   this.handlerColorsZonesInactives(zone, false, true)
            // })
            // color change smooth to white for vip et public + change outline line material + shader material
          }
        })
      } else {
        const reversedFloors = [...this.floors].reverse()

        reversedFloors.forEach((floor, index) => {
          const reversedIndex = reversedFloors.length - 1 - index

          const isTweenable =
            reversedIndex <= oldVal.id &&
            reversedIndex > this.interiorIndexFloor.id &&
            floor.visible

          if (isTweenable) {
            this.tlFloors.to(floor.position, {
              y: floor.hidePosition.y,
              ease: 'back.in(1.5)',
              duration: 0.55,
              onComplete: () => {
                floor.visible = false
              },
            })
          }
          if (reversedIndex >= this.interiorIndexFloor.id) {
            this.appearFloorImmediate(floor)
          }
        })
      }
    },
    focusZoneImmediate(zoneSelected, zonesNotSelected) {
      this.zoneFocusEnabled = true
      this.setInteriorCurrentZoneName(zoneSelected.name)
      this.drag.enabled = false

      const { camera } = useWebGL()

      const cameraSelected = this.cameras.getObjectByName(
        zoneSelected.content.name_camera
      )

      camera.position.copy(cameraSelected.position)
      camera.rotation.copy(cameraSelected.rotation)

      camera.zoom = zoneSelected.content.camera_zoom

      camera.updateProjectionMatrix()

      zonesNotSelected.forEach((zone) => {
        zone.materials.forEach((material) => {
          if (material instanceof THREE.MeshLambertMaterial) {
            material.color = this.colors.lambertMaterialColor.clone()

            material.emissive = this.colors.lambertMaterialEmissive.clone()

            material.emissiveIntensity = this.colors.emissiveIntensity
          }
        })
      })
    },
    appearFloorImmediate(floor) {
      console.log(floor)

      floor.specialObjects.forEach((zone) => {
        zone.materials.forEach((material) => {
          const zoneType = zone.publicAccess ? 'public' : 'vip'

          if (material instanceof THREE.MeshLambertMaterial) {
            material.color = this.colors[zoneType].lambertMaterialColor.clone()
            material.emissive =
              this.colors[zoneType].lambertMaterialEmissive.clone()
            material.emissiveIntensity = this.colors[zoneType].emissiveIntensity
          } else if (material instanceof THREE.ShaderMaterial) {
            material.uniforms.diffuse.value.set(
              this.colors.outlineColor.clone()
            )
          } else if (material instanceof THREE.LineBasicMaterial) {
            material.color = this.colors.outlineColor.clone()
          }
        })
      })
    },
    hideFloorImmediate(floor) {
      const graphFloor = this.buildGraph(floor)

      graphFloor.materials.forEach((material) => {
        if (material instanceof THREE.MeshLambertMaterial) {
          material.color = this.colors.lambertMaterialColor.clone()

          material.emissive = this.colors.lambertMaterialEmissive.clone()

          material.emissiveIntensity = this.colors.emissiveIntensity
        } else if (material instanceof THREE.ShaderMaterial) {
          material.uniforms.diffuse.value.set(
            this.colors.outlineHiddenColor.clone()
          )
        } else if (material instanceof THREE.LineBasicMaterial) {
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

      this.initGUI()

      if (this.interiorMusicScene) {
        this.terrain.position.copy(this.terrain.hidePosition)
        this.terrain.visible = false
      } else {
        this.musicScene.position.copy(this.musicScene.hidePosition)
        this.musicScene.visible = false
      }

      console.log('here mounted interior')

      interior.floors = this.floors

      // this.setInteriorIndexFloor({
      //   id: 2,
      //   focus: 'PUBLIC_Cantine',
      //   immediate: true,
      // })

      // this.handleImmediateTransition()
    },
    initLights() {
      const { interior } = useWebGL()

      this.ambientLight = new THREE.AmbientLight(this.colors.ambientLightColor)
      interior.add(this.ambientLight)

      this.directionalLight = new THREE.DirectionalLight(
        this.colors.directionalLightColor,
        1
      )
      this.directionalLight.castShadow = true
      this.directionalLight.position.set(-100, 150, 300)

      this.directionalLight.shadow.mapSize.width = 1024 // 4096
      this.directionalLight.shadow.mapSize.height = 1024 // 4096

      this.directionalLight.shadow.camera.near = 1
      this.directionalLight.shadow.camera.far = 1000

      this.directionalLight.shadow.camera.left = -40
      this.directionalLight.shadow.camera.right = 40
      this.directionalLight.shadow.camera.top = 40
      this.directionalLight.shadow.camera.bottom = -40

      interior.add(this.directionalLight)
    },
    initGUI() {
      const gui = useGUI()

      this.gui = gui.addFolder({ title: `Interior` })

      const { interior } = useWebGL()

      this.interiorContent.forEach((floor, floorIndex) => {
        const floorButton = this.gui.addButton({
          title: `Floor ${floorIndex}`,
          label: 'counter', // optional
        })

        floorButton.on('click', (e) => {
          this.setInteriorIndexFloor({
            id: floorIndex,
            immediate: true,
          })
        })

        floor.zones.forEach((zone, zoneIndex) => {
          const zoneButton = this.gui.addButton({
            title: `Zone ${zone.name_gltf}`,
            label: 'counter', // optional
          })

          zoneButton.on('click', (e) => {
            this.setInteriorIndexFloor({
              id: floorIndex,
              focus: zone.name_gltf,
              immediate: true,
            })
          })
        })

        this.gui.addSeparator()
      })

      this.gui.addInput(interior, 'position', {
        x: { step: 1, max: 1000, min: -1000 },
        y: { step: 1, max: 1000, min: -1000 },
        z: { step: 1, max: 1000, min: -1000 },
        label: 'Position',
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
      // console.log('reset interior')

      this.setInteriorVisible(true)

      const { interior, camera } = useWebGL()

      this.drag.current = 0
      this.drag.target = 0
      this.drag.last = 0

      camera.position.copy(interior.initialCamera.position)
      camera.rotation.copy(interior.initialCamera.rotation)

      this.zoom.initial = this.$viewport.isMobile ? 10 : this.zoom.initial
      this.zoom.current = this.$viewport.isMobile ? 10 : this.zoom.current

      camera.zoom = this.zoom.initial

      camera.updateProjectionMatrix()
    },
    initMaterials() {
      this.shadowMaterial = new THREE.ShadowMaterial({
        color: this.colors.shadowColor,
        opacity: 0.75,
      })

      const polygonsParams = {
        polygonOffset: true,
        polygonOffsetFactor: this.polygonOffsetFactor,
        polygonOffsetUnits: this.polygonOffsetUnits,
      }

      this.basicMaterial = new THREE.MeshLambertMaterial({
        color: this.colors.lambertMaterialColor,
        emissive: this.colors.lambertMaterialEmissive,
        emissiveIntensity: this.colors.emissiveIntensity,
        ...polygonsParams,
      })

      this.conditionalMaterial = new THREE.ShaderMaterial(
        ConditionalEdgesShader
      )
      this.conditionalMaterial.uniforms.diffuse.value.set(
        this.colors.outlineColor
      )

      this.lineMaterial = new THREE.LineBasicMaterial({
        color: this.colors.outlineColor,
        linewidth: 2,
      })

      this.publicMaterial = new THREE.MeshLambertMaterial({
        color: this.colors.public.lambertMaterialColor,
        emissive: this.colors.public.lambertMaterialEmissive,
        emissiveIntensity: this.colors.public.emissiveIntensity,
        ...polygonsParams,
      })

      this.vipMaterial = new THREE.MeshLambertMaterial({
        color: this.colors.vip.lambertMaterialColor,
        emissive: this.colors.vip.lambertMaterialEmissive,
        emissiveIntensity: this.colors.vip.emissiveIntensity,
        ...polygonsParams,
      })
    },
    initFootField() {
      const { interior } = useWebGL()

      this.footField = new THREE.Group()
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

      this.musicScene = new THREE.Group()
      this.musicScene.name = 'musicScene'
      interior.add(this.musicScene)

      const musicSceneGroup = this.model.getObjectByName('Scene')

      const musicScene = this.mergeObject(musicSceneGroup)
      const edgeMusicScene = this.edgeObject(musicScene)
      const conditionalMusicScene = this.conditionalObject(musicScene)

      this.musicScene.add(musicScene)
      this.musicScene.add(edgeMusicScene)
      this.musicScene.add(conditionalMusicScene)

      const { min, max } = new THREE.Box3().setFromObject(this.musicScene)

      this.musicScene.initialPosition = this.musicScene.position.clone()

      this.musicScene.hidePosition = this.musicScene.position.clone()
      this.musicScene.hidePosition.y = (max.y - min.y) * -1 - 0.5
    },
    initTerrain() {
      const { interior } = useWebGL()

      this.terrain = new THREE.Group()
      this.terrain.name = 'terrain'
      interior.add(this.terrain)

      const terrainGroup = this.model.getObjectByName('Terrain_001')

      const terrain = this.mergeObject(terrainGroup)
      const edgeTerrain = this.edgeObject(terrain)
      const conditionalTerrain = this.conditionalObject(terrain)

      this.terrain.add(terrain)
      this.terrain.add(edgeTerrain)
      this.terrain.add(conditionalTerrain)

      const { min, max } = new THREE.Box3().setFromObject(this.terrain)

      this.terrain.initialPosition = this.terrain.position.clone()

      this.terrain.hidePosition = this.terrain.position.clone()
      this.terrain.hidePosition.y = (max.y - min.y) * -1 - 0.5
    },
    initFloor() {
      const { interior } = useWebGL()

      this.floor = new THREE.Group()
      this.floor.name = 'floor'
      this.floor.position.y -= 0.05
      interior.add(this.floor)

      const floorGroup = this.model.getObjectByName('Floor')

      const floor = this.mergeObject(floorGroup)

      const shadowFloor = floor.clone()
      shadowFloor.name = 'shadowModel'
      shadowFloor.material = this.shadowMaterial

      floor.castShadow = false
      floor.receiveShadow = false

      const edgeFloor = this.edgeObject(floor)
      const conditionalFloor = this.conditionalObject(floor)

      this.floor.add(floor)
      this.floor.add(shadowFloor)
      this.floor.add(edgeFloor)
      this.floor.add(conditionalFloor)
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

      this.dragInProgress = true

      const delta = e.deltaX * this.drag.dragSpeed

      this.drag.target = gsap.utils.clamp(
        this.azimuth.min,
        this.azimuth.max,
        this.drag.target + delta
      )
    },
    onClickZone(e) {
      if (!this.interiorVisible) return

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

      const { camera } = useWebGL()

      this.drag.enabled = false
      this.drag.target = 0

      this.setCursorState('hide')

      const cameraSelected = this.cameras.getObjectByName(
        zone.content.name_camera
      )

      const params = {
        ease: 'power1.inOut',
        duration: 1,
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
        zoom: zone.content.camera_zoom,
        ...params,
        onUpdate: () => {
          camera.updateProjectionMatrix()
        },
      })

      this.inactiveZones.forEach((object) => {
        this.handlerColorsZonesInactives(object, false)
      })
    },
    handlerColorsZonesInactives(zone, appear, outline = false) {
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

      const outlineColor = appear
        ? this.colors.outlineColor
        : this.colors.outlineHiddenColor

      zone.materials.forEach((material) => {
        if (material instanceof THREE.MeshLambertMaterial) {
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
        } else if (material instanceof THREE.LineBasicMaterial && outline) {
          gsap.to(material, {
            color: outlineColor,
            ...params,
            onUpdate: () => {
              console.log(material.color)
              // const color = material.color.clone()
              // conditionnalMaterial.uniforms.diffuse.value.set(color)
            },
          })
        } else if (material instanceof THREE.LineBasicMaterial && outline) {
          gsap.to(material, {
            color: outlineColor,
            ...params,
            onUpdate: () => {
              console.log(material.color)
              // const color = material.color.clone()
              // conditionnalMaterial.uniforms.diffuse.value.set(color)
            },
          })
        }
      })
    },
    unfocusZone() {
      this.zoneFocusEnabled = false
      this.currentZoneIntersect = null
      this.setInteriorCurrentZoneName(null)

      const { camera } = useWebGL()

      this.drag.enabled = true

      const params = {
        ease: 'power1.inOut',
        duration: 1,
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
      gsap.to(camera, {
        duration: 1,
        zoom: this.zoom.initial,
        // zoom: this.currentFloor.content.camera_zoom || this.zoom.initial,
        ...params,
        onUpdate: () => {
          camera.updateProjectionMatrix()
        },
      })

      this.inactiveZones.forEach((object) => {
        this.handlerColorsZonesInactives(object, true)
      })
    },
    onMouseEnterZone(object) {
      this.setCursorState('hover')

      const zone = object.parent.publicAccess ? 'public' : 'vip'

      const params = {
        ease: 'power2.inOut',
        duration: 0.45,
      }

      gsap.to(object.material.color, {
        r: this.colors[zone].lambertMaterialColorActive.r,
        g: this.colors[zone].lambertMaterialColorActive.g,
        b: this.colors[zone].lambertMaterialColorActive.b,
        ...params,
      })
      gsap.to(object.material.emissive, {
        r: this.colors[zone].lambertMaterialColorActive.r,
        g: this.colors[zone].lambertMaterialColorActive.g,
        b: this.colors[zone].lambertMaterialColorActive.b,
        ...params,
      })
      gsap.to(object.material, {
        emissiveIntensity: this.colors[zone].emissiveIntensityActive,
        ...params,
      })
    },
    onMouseLeaveZone(object) {
      this.setCursorState('hide')

      const params = {
        ease: 'power2.out',
        duration: 0.45,
      }

      const zone = object.parent.publicAccess ? 'public' : 'vip'

      gsap.to(object.material.color, {
        r: this.colors[zone].lambertMaterialColor.r,
        g: this.colors[zone].lambertMaterialColor.g,
        b: this.colors[zone].lambertMaterialColor.b,
        ...params,
      })
      gsap.to(object.material.emissive, {
        r: this.colors[zone].lambertMaterialEmissive.r,
        g: this.colors[zone].lambertMaterialEmissive.g,
        b: this.colors[zone].lambertMaterialEmissive.b,
        ...params,
      })
      gsap.to(object.material, {
        emissiveIntensity: this.colors[zone].emissiveIntensity,
        ...params,
      })
    },
    onFrame({ time, deltaTime, frame, deltaRatio }) {
      if (!this.interiorVisible || this.$viewport.isMobile) return

      const { interior } = useWebGL()
      // const { interior, raycaster } = useWebGL()

      // if (
      //   this.currentFloor &&
      //   this.currentFloor.basicObjectRaycast &&
      //   !this.zoneFocusEnabled
      //   // add !this.zoneFocusEnabled to disable intersect when a zone is selected
      // ) {
      //   const intersects = raycaster.intersectObjects(
      //     this.currentFloor?.basicObjectRaycast,
      //     false
      //   )

      //   if (intersects.length) {
      //     if (
      //       !this.currentZoneIntersect ||
      //       intersects[0].object.parent.name !==
      //         this.currentZoneIntersect?.object?.parent.name
      //     ) {
      //       if (this.currentZoneIntersect) {
      //         // this.onMouseLeaveZone(this.currentZoneIntersect.object)
      //       }
      //       // this.onMouseEnterZone(intersects[0].object)
      //     }

      //     this.currentZoneIntersect = intersects[0]
      //   } else {
      //     if (this.currentZoneIntersect) {
      //       // this.onMouseLeaveZone(this.currentZoneIntersect.object)
      //     }

      //     this.currentZoneIntersect = null
      //   }
      // }

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

      const group = new THREE.Group()
      group.position.copy(arene.position)
      group.name = `floor-${indexFloor}`
      group.content = { ...this.interiorContent[indexFloor] }
      group.public = []
      group.vip = []
      group.basicObjectRaycast = []
      group.specialObjects = []
      group.materials = this.initFloorMaterials()
      group.isGroundFloor = isGroundFloor

      const clippingPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)

      const object = initialObject.clone()

      const { basicObject, specialObjects } = this.parseFloor(object)

      const basicMeshes = this.buildMergedObjects(
        basicObject,
        clippingPlane,
        group.materials
      )
      group.add(...basicMeshes)

      specialObjects.forEach((obj) => {
        obj.isBasicObject = false
        obj.publicAccess = !obj.name.includes('VIP')

        const part = new THREE.Group()
        part.name = obj.name
        part.isBasicObject = obj.isBasicObject
        part.publicAccess = obj.publicAccess
        part.content = group.content.zones.find(
          (zone) => part.name === zone.name_gltf
        )

        const meshes = this.buildMergedObjects(
          obj,
          clippingPlane,
          group.materials,
          !obj.isBasicObject
        )

        const basicObjectForRaycast = meshes.find(
          (mesh) => mesh.name === 'model' && mesh.type === 'Mesh'
        )
        group.basicObjectRaycast.push(basicObjectForRaycast)

        part.materials = [
          meshes[0].material,
          meshes[1].material,
          meshes[2].material,
        ]

        part.add(...meshes)
        part.position.y += 0.05

        const { min, max } = new THREE.Box3().setFromObject(part)

        part.min = min
        part.max = max

        if (part.name.includes('VIP')) {
          group.vip.push(part)
        } else {
          group.public.push(part)
        }

        group.specialObjects.push(part)

        group.add(part)
      })

      group.initialPosition = group.position.clone()

      const { min, max } = new THREE.Box3().setFromObject(group)

      const height = max.y - min.y

      clippingPlane.constant = min.y * -1 + 0.15

      group.hidePosition = group.position.clone()
      group.hidePosition.y = height * -1 - 0.2

      return group
    },
    parseFloor(object) {
      const basicObject = new THREE.Group()
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

      const edgeBasicObject = this.edgeObject(normalObject)
      edgeBasicObject.material = materials.lineMaterial
      edgeBasicObject.material.clippingPlanes = [clippingPlane]
      edgeBasicObject.material.clipShadows = true

      const conditionalObject = this.conditionalObject(normalObject)
      conditionalObject.material = materials.conditionalMaterial
      conditionalObject.material.clippingPlanes = [clippingPlane]
      conditionalObject.material.clipShadows = true

      return [normalObject, edgeBasicObject, conditionalObject]
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

      const mergedGeometries = mergeBufferGeometries(geometry, false)
      const mergedGeometry = mergeVertices(mergedGeometries)

      const mesh = new THREE.Mesh(mergedGeometry)

      mesh.castShadow = true
      mesh.receiveShadow = true

      mesh.name = 'model'
      mesh.material = this.basicMaterial

      mesh.material.needsUpdate = true

      return mesh
    },
    edgeObject(object) {
      const mergedGeom = object.geometry.clone()

      const lineGeom = new THREE.EdgesGeometry(mergedGeom, this.thresholdAngle)

      const material = this.lineMaterial

      const line = new THREE.LineSegments(lineGeom, material)
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

      const mesh = new THREE.LineSegments(lineGeom, material)
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
      setInteriorCurrentZoneName: 'setInteriorCurrentZoneName',
    }),
  },
}
</script>
