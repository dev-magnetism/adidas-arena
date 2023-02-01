<template>
  <div class="app-webgl-interior grid-inner"></div>
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
        },
        vip: {
          lambertMaterialColor: new THREE.Color(0xf46b2b),
          lambertMaterialEmissive: new THREE.Color(0xe2723d),
          emissiveIntensity: 0.6,
        },
      },
      azimuth: { min: -1.6, max: 0.6 },
      directionalLightIsStatic: true,
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
        initial: 16,
        current: 16,
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
      helpers: [],
    }
  },
  computed: {
    ...mapState({
      modelInteriorLoaded: (state) => state.modelInteriorLoaded,
      allLoadedActual: (state) => state.allLoadedActual,
      interiorVisible: (state) => state.interiorVisible,
      interiorIndexFloor: (state) => state.interiorIndexFloor,
      interiorMusicScene: (state) => state.interiorMusicScene,
    }),
  },
  watch: {
    interiorMusicScene() {
      this.switchMiddleScene()
    },
    interiorIndexFloor(newVal, oldVal) {
      if (newVal.id === oldVal.id) return

      if (newVal.immediate) {
        this.handleImmediateTransition()
      } else {
        this.handleAnimatedTransition(oldVal)
      }
    },
    modelInteriorLoaded() {
      this.initInterior()
    },
    interiorVisible(payload) {
      const { interior } = useWebGL()

      console.log('here', payload)

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
      dragMinimum: 5,
      tolerance: 5,
    })

    this.$nuxt.$on('reset:interior', this.resetView)

    this.$raf.add(`webgl-interior`, this.onFrame)
  },
  beforeDestroy() {
    const { interior, scene } = useWebGL()

    // MATERIAL
    const materials = this.buildGraph(interior).materials

    materials.forEach((material, index) => {
      material.dispose()
      materials.splice(index, 1)
    })

    this.helpers.forEach((helper) => {
      helper.geometry.dispose()
      helper.material.dispose()

      scene.remove(helper)
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
    scene.remove(this.ambientLight)

    this.directionalLight.dispose()

    if (this.directionalLightIsStatic) {
      interior.remove(this.directionalLight)
    } else {
      scene.remove(this.directionalLight)
    }

    // GUI
    this.gui?.dispose()
    this.guiDrag?.dispose()
    this.guiZoom?.dispose()
    this.guiAmbientLight?.dispose()
    this.guiModelColors?.dispose()
    this.floorsGUI.forEach((gui) => {
      gui.dispose()
    })

    this.observer?.kill()
    this.tlFloors?.kill()
    this.tlSwitchMiddleScene?.kill()
    this.tlFloorsHidden?.kill()
    this.$nuxt.$off('reset:interior', this.resetView)
    this.$raf.remove(`webgl-interior`, this.onFrame)
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
        })
        this.tlSwitchMiddleScene.to(
          this.musicScene.position,
          {
            y: this.musicScene.initialPosition.y,
            ease: 'back.out(1)',
            duration: 0.6,
          },
          '+=25%'
        )
      } else {
        this.tlSwitchMiddleScene.to(this.musicScene.position, {
          y: this.musicScene.hidePosition.y,
          ease: 'back.in(1.5)',
          duration: 0.6,
        })
        this.tlSwitchMiddleScene.to(
          this.terrain.position,
          {
            y: this.terrain.initialPosition.y,
            ease: 'back.out(1)',
            duration: 0.6,
          },
          '+=25%'
        )
      }
    },
    handleImmediateTransition() {
      const { camera } = useWebGL()

      this.drag.target = 0

      camera.zoom = this.zoom.current

      camera.updateProjectionMatrix()

      this.floors.forEach((floor, index) => {
        const visible = index <= this.interiorIndexFloor.id

        floor.visible = visible

        if (visible) {
          floor.position.copy(floor.initialPosition)

          // if (index < this.interiorIndexFloor.id) {
          //   floor.materials.basicMaterialPublic.color =
          //     this.colors.lambertMaterialColor
          //   floor.materials.basicMaterialPublic.emissive =
          //     this.colors.lambertMaterialEmissive

          //   floor.materials.conditionalMaterial.uniforms.diffuse.value.set(
          //     this.colors.outlineHiddenColor
          //   )

          //   floor.materials.lineMaterial.color = this.colors.outlineHiddenColor

          //   floor.materials.basicMaterialVIP.color =
          //     this.colors.lambertMaterialColor
          //   floor.materials.basicMaterialVIP.emissive =
          //     this.colors.lambertMaterialEmissive
          // } else {
          //   floor.materials.basicMaterialPublic.color =
          //     this.colors.public.lambertMaterialColor
          //   floor.materials.basicMaterialPublic.emissive =
          //     this.colors.public.lambertMaterialEmissive

          //   floor.materials.conditionalMaterial.uniforms.diffuse.value.set(
          //     this.colors.outlineColor
          //   )

          //   floor.materials.lineMaterial.color = this.colors.outlineColor

          //   floor.materials.basicMaterialVIP.color =
          //     this.colors.vip.lambertMaterialColor
          //   floor.materials.basicMaterialVIP.emissive =
          //     this.colors.vip.lambertMaterialEmissive
          // }
        } else {
          // floor.materials.basicMaterialPublic.color =
          //   this.colors.public.lambertMaterialColor
          // floor.materials.basicMaterialPublic.emissive =
          //   this.colors.public.lambertMaterialEmissive

          // floor.materials.conditionalMaterial.uniforms.diffuse.value.set(
          //   this.colors.outlineColor
          // )

          // floor.materials.lineMaterial.color = this.colors.outlineColor

          // floor.materials.basicMaterialVIP.color =
          //   this.colors.vip.lambertMaterialColor
          // floor.materials.basicMaterialVIP.emissive =
          //   this.colors.vip.lambertMaterialEmissive

          floor.position.copy(floor.hidePosition)
        }
      })
    },
    handleAnimatedTransition(oldVal) {
      this.tlFloors?.clear()
      this.tlFloors?.kill()
      this.tlFloorsHidden?.clear()
      this.tlFloorsHidden?.kill()

      this.tlFloors = gsap.timeline()
      this.tlFloorsHidden = gsap.timeline()

      const isAscendant = oldVal.id < this.interiorIndexFloor.id

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
            // floor.materials.basicMaterialPublic.color =
            //   this.colors.lambertMaterialColor
            // floor.materials.basicMaterialPublic.emissive =
            //   this.colors.lambertMaterialEmissive
            // floor.materials.conditionalMaterial.uniforms.diffuse.value.set(
            //   this.colors.outlineHiddenColor
            // )
            // floor.materials.lineMaterial.color = this.colors.outlineHiddenColor
            // floor.materials.basicMaterialVIP.color =
            //   this.colors.lambertMaterialColor
            // floor.materials.basicMaterialVIP.emissive =
            //   this.colors.lambertMaterialEmissive
            // console.log(
            //   floor.name,
            //   floor.materials.lineMaterial.id,
            //   this.colors
            // )
            // gsap.to(floor.materials.lineMaterial.color, {
            //   r: this.colors.outlineHiddenColor.r,
            //   g: this.colors.outlineHiddenColor.g,
            //   b: this.colors.outlineHiddenColor.b,
            //   onUpdate: () => {
            //     floor.materials.conditionalMaterial.uniforms.diffuse.value.set(
            //       floor.materials.lineMaterial.color
            //     )
            //   },
            // })
            // gsap.to(floor.materials.basicMaterialPublic, {
            //   color: {
            //     r: 1,
            //     g: 1,
            //     b: 0,
            //   },
            // })
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

          // console.log(floor.name, isTweenable, reversedIndex)

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

          // if (index !== this.interiorIndexFloor.id) {
          //   // console.log(floor.name)
          //   floor.materials.basicMaterialPublic.color =
          //     this.colors.public.lambertMaterialColor
          //   floor.materials.basicMaterialPublic.emissive =
          //     this.colors.public.lambertMaterialEmissive

          //   floor.materials.conditionalMaterial.uniforms.diffuse.value.set(
          //     this.colors.outlineColor
          //   )

          //   floor.materials.lineMaterial.color = this.colors.outlineColor

          //   floor.materials.basicMaterialVIP.color =
          //     this.colors.vip.lambertMaterialColor
          //   floor.materials.basicMaterialVIP.emissive =
          //     this.colors.vip.lambertMaterialEmissive
          // }
        })
      }

      console.log('------------')
    },
    initInterior() {
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
      } else {
        this.musicScene.position.copy(this.musicScene.hidePosition)
      }

      this.setInteriorIndexFloor({ id: 0, immediate: true })
      this.handleImmediateTransition()
    },
    initLights() {
      const { interior, scene } = useWebGL()

      this.ambientLight = new THREE.AmbientLight(this.colors.ambientLightColor)
      scene.add(this.ambientLight)

      this.directionalLight = new THREE.DirectionalLight(
        this.colors.directionalLightColor,
        1
      )
      this.directionalLight.castShadow = true
      this.directionalLight.position.set(-100, 150, 300)

      this.directionalLight.shadow.mapSize.width = 4096 // 2048
      this.directionalLight.shadow.mapSize.height = 4096 // 2048

      this.directionalLight.shadow.camera.near = 1
      this.directionalLight.shadow.camera.far = 1000

      this.directionalLight.shadow.camera.left = -65
      this.directionalLight.shadow.camera.right = 65
      this.directionalLight.shadow.camera.top = 65
      this.directionalLight.shadow.camera.bottom = -65

      if (this.directionalLightIsStatic) {
        interior.add(this.directionalLight)
      } else {
        scene.add(this.directionalLight)
      }
    },
    initGUI() {
      const gui = useGUI()

      this.gui = gui.addFolder({ title: `Interior` })

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
          this.modelMaterial.color = e.value

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
          this.modelMaterial.emissive = e.value

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
          this.modelMaterial.emissiveIntensity = e.value

          this.floors.forEach((floor) => {
            floor.materials.basicMaterial.emissiveIntensity = e.value
          })
        })

      this.guiModelColors.addSeparator()

      this.guiModelColors
        .addInput(this.colors.public, 'lambertMaterialColor', {
          color: { type: 'float' },
          label: 'Color Public',
        })
        .on('change', (e) => {
          this.modelMaterialPublic.color = e.value

          this.floors.forEach((floor) => {
            floor.materials.basicMaterialPublic.color = e.value
          })
        })

      this.guiModelColors
        .addInput(this.colors.public, 'lambertMaterialEmissive', {
          color: { type: 'float' },
          label: 'Emissive Color Public',
        })
        .on('change', (e) => {
          this.modelMaterialPublic.emissive = e.value

          this.floors.forEach((floor) => {
            floor.materials.basicMaterialPublic.emissive = e.value
          })
        })

      this.guiModelColors
        .addInput(this.colors.public, 'emissiveIntensity', {
          min: 0,
          max: 1,
          step: 0.01,
          label: 'Emissive Intensity Public',
        })
        .on('change', (e) => {
          this.modelMaterialPublic.emissiveIntensity = e.value

          this.floors.forEach((floor) => {
            floor.materials.basicMaterialPublic.emissiveIntensity = e.value
          })
        })

      this.guiModelColors.addSeparator()

      // this.guiModelColors
      //   .addInput(this.colors.vip, 'lambertMaterialColor', {
      //     color: { type: 'float' },
      //     label: 'Color VIP',
      //   })
      //   .on('change', (e) => {
      //     this.modelMaterialVIP.color = e.value

      //     this.floors.forEach((floor) => {
      //       floor.materials.basicMaterialVIP.color = e.value
      //     })
      //   })

      this.guiModelColors
        .addInput(this.colors.vip, 'lambertMaterialEmissive', {
          color: { type: 'float' },
          label: 'Emissive Color VIP',
        })
        .on('change', (e) => {
          this.modelMaterialVIP.emissive = e.value

          this.floors.forEach((floor) => {
            floor.materials.basicMaterialVIP.emissive = e.value
          })
        })

      this.guiModelColors
        .addInput(this.colors.vip, 'emissiveIntensity', {
          min: 0,
          max: 1,
          step: 0.01,
          label: 'Emissive Intensity VIP',
        })
        .on('change', (e) => {
          this.modelMaterialVIP.emissiveIntensity = e.value

          this.floors.forEach((floor) => {
            floor.materials.basicMaterialVIP.emissiveIntensity = e.value
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

      // camera.position.copy(this.cameraBase.position)
      // camera.rotation.copy(this.cameraBase.rotation)

      // camera.updateProjectionMatrix()
    },
    resetView() {
      console.log('reset interior')

      this.setInteriorVisible(true)

      const { interior, camera } = useWebGL()

      this.drag.current = 0
      this.drag.target = 0
      this.drag.last = 0

      camera.position.copy(interior.initialCamera.position)
      camera.rotation.copy(interior.initialCamera.rotation)
      camera.zoom = this.zoom.initial

      camera.updateProjectionMatrix()
    },
    initMaterials() {
      this.shadowMaterial = new THREE.ShadowMaterial({
        color: this.colors.shadowColor,
        opacity: 0.75,
      })

      this.modelMaterial = new THREE.MeshLambertMaterial({
        color: this.colors.lambertMaterialColor,
        emissive: this.colors.lambertMaterialEmissive,
        emissiveIntensity: 0.7,
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

      this.modelMaterialPublic = new THREE.MeshLambertMaterial({
        color: this.colors.public.lambertMaterialColor,
        emissive: this.colors.public.lambertMaterialEmissive,
        emissiveIntensity: 0.7,
      })

      this.modelMaterialVIP = new THREE.MeshLambertMaterial({
        color: this.colors.vip.lambertMaterialColor,
        emissive: this.colors.vip.lambertMaterialEmissive,
        emissiveIntensity: 0.7,
      })
    },
    initFootField() {
      const { interior } = useWebGL()

      this.footField = new THREE.Group()
      this.footField.name = 'footField'
      interior.add(this.footField)

      const footFieldGroup = this.model.getObjectByName('FootField')

      const footField = this.mergeObject(footFieldGroup)

      const shadowFootField = footField.clone()
      shadowFootField.name = 'shadowModel'
      shadowFootField.material = this.shadowMaterial

      footField.receiveShadow = false

      const edgeFootField = this.edgeObject(footField)
      const conditionalFootField = this.conditionalObject(footField)

      this.footField.add(footField)
      this.footField.add(shadowFootField)
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

      this.zeroFloor = this.buildArenaFloor(floorGroup, `floor-${0}`, true)
      interior.add(this.zeroFloor)
      this.floors.push(this.zeroFloor)
    },
    initFirstFloor() {
      const { interior } = useWebGL()

      const floorGroup = this.model
        .getObjectByName('Arene')
        .getObjectByName('Niveau_1')

      this.firstFloor = this.buildArenaFloor(floorGroup, `floor-${1}`)
      interior.add(this.firstFloor)
      this.floors.push(this.firstFloor)
    },
    initSecondFloor() {
      const { interior } = useWebGL()

      const floorGroup = this.model
        .getObjectByName('Arene')
        .getObjectByName('Niveau_2')

      this.secondFloor = this.buildArenaFloor(floorGroup, `floor-${2}`)
      interior.add(this.secondFloor)
      this.floors.push(this.secondFloor)
    },
    initThirdFloor() {
      const { interior } = useWebGL()

      const floorGroup = this.model
        .getObjectByName('Arene')
        .getObjectByName('Niveau_3')

      this.thirdFloor = this.buildArenaFloor(floorGroup, `floor-${3}`)
      interior.add(this.thirdFloor)
      this.floors.push(this.thirdFloor)
    },
    initFourthFloor() {
      const { interior } = useWebGL()

      const floorGroup = this.model
        .getObjectByName('Arene')
        .getObjectByName('Niveau_4')

      this.fourthFloor = this.buildArenaFloor(floorGroup, `floor-${4}`)
      interior.add(this.fourthFloor)
      this.floors.push(this.fourthFloor)
    },

    onDrag(e) {
      if (!this.drag.enabled || !this.interiorVisible) return

      const delta = e.deltaX * this.drag.dragSpeed

      this.drag.target = gsap.utils.clamp(
        this.azimuth.min,
        this.azimuth.max,
        this.drag.target + delta
      )
    },
    onFrame({ time, deltaTime, frame, deltaRatio }) {
      if (!this.interiorVisible) return

      const { interior } = useWebGL()

      this.drag.current = this.lerp(
        this.drag.current,
        this.drag.target,
        this.drag.ease
      )

      interior.rotation.y = this.drag.current

      this.drag.last = this.drag.current
    },
    buildArenaFloor(initialObject, name = 'no-name', isGroundFloor = false) {
      // const { scene } = useWebGL()

      const arene = this.model.getObjectByName('Arene')

      const group = new THREE.Group()
      group.position.copy(arene.position)
      group.name = name
      group.divider = []
      group.public = []
      group.vip = []
      group.materials = {}
      group.isGroundFloor = isGroundFloor

      const basicMaterial = this.modelMaterial.clone()
      const lineMaterial = this.lineMaterial.clone()
      const conditionalMaterial = this.conditionalMaterial.clone()
      const basicMaterialPublic = this.modelMaterialPublic.clone()
      const basicMaterialVIP = this.modelMaterialVIP.clone()

      console.log(this.modelMaterialVIP.id)
      console.log(basicMaterialVIP.id)
      console.log('-------')

      group.materials = {
        basicMaterial,
        lineMaterial,
        conditionalMaterial,
        basicMaterialPublic,
        basicMaterialVIP,
      }

      const clippingPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
      // const helper = new THREE.PlaneHelper(clippingPlane, 75, 0xff0000)
      // this.helpers.push(helper)

      // scene.add(helper)

      const object = initialObject.clone()

      const { basicObject, specialObjects, dividerObject } =
        this.parseFloor(object)

      group.divider = dividerObject

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

        const meshes = this.buildMergedObjects(
          obj,
          clippingPlane,
          group.materials
        )

        part.add(...meshes)

        if (part.name.includes('VIP')) {
          group.vip.push(part)
        } else {
          group.public.push(part)
        }

        // const box = new THREE.BoxHelper(part, 0xff0000)
        // part.add(box)

        group.add(part)
      })

      group.initialPosition = group.position.clone()

      const { min, max } = new THREE.Box3().setFromObject(group)

      const height = max.y - min.y

      clippingPlane.constant = min.y * -1 + 0.1

      group.hidePosition = group.position.clone()
      group.hidePosition.y = height * -1 - 0.2

      // const gui = useGUI()

      // const floorGUI = gui.addFolder({ title: name })
      // this.floorsGUI.push(floorGUI)

      // floorGUI.addInput(group.position, 'y', {
      //   min: group.hidePosition.y,
      //   max: group.initialPosition.y,
      //   step: 0.00001,
      //   label: 'Y',
      // })

      return group
    },

    parseFloor(object) {
      const basicObject = new THREE.Group()
      basicObject.isBasicObject = true

      const { fail: objectsWithoutDivider, pass: objectDivider } =
        this.partition(object.children, (e) => e.name.includes('Divider'))

      const dividerObject = objectDivider[0]

      const { fail: objectsWithoutBoole, pass: booleGroup } = this.partition(
        objectsWithoutDivider,
        (e) => e.name.includes('Boole')
      )

      const booleObject = booleGroup[0].children[0]

      if (objectsWithoutBoole.length) basicObject.add(...objectsWithoutBoole)

      const { pass: specialObjects, fail: basicObjectsBoole } = this.partition(
        booleObject.children,
        (e) => e.name.includes('VIP') || e.name.includes('PUBLIC')
      )

      if (basicObjectsBoole.length) basicObject.add(...basicObjectsBoole)

      return { basicObject, specialObjects, dividerObject }
    },
    buildMergedObjects(object, clippingPlane, materials) {
      const normalObject = this.mergeObject(object)

      console.log(object.name)

      if (!object.isBasicObject) {
        // const test = new THREE.MeshLambertMaterial({
        //   color: this.colors.vip.lambertMaterialColor,
        //   emissive: this.colors.vip.lambertMaterialEmissive,
        //   emissiveIntensity: 0.7,
        // })

        normalObject.material = materials.basicMaterialVIP

        // if (object.publicAccess) {
        //   normalObject.material = materials.basicMaterialPublic
        // } else {
        //   normalObject.material = materials.basicMaterialVIP
        // }
      } else {
        normalObject.material = materials.basicMaterial
      }

      normalObject.material.needsUpdate = true
      normalObject.material.clippingPlanes = [clippingPlane]
      normalObject.material.clipShadows = true

      const edgeBasicObject = this.edgeObject(normalObject)
      edgeBasicObject.material = materials.lineMaterial
      edgeBasicObject.material.needsUpdate = true
      edgeBasicObject.material.clippingPlanes = [clippingPlane]
      edgeBasicObject.material.clipShadows = true

      const conditionalObject = this.conditionalObject(normalObject)
      conditionalObject.material = materials.conditionalMaterial
      conditionalObject.material.needsUpdate = true
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
      mesh.material = this.modelMaterial

      mesh.material.polygonOffset = true
      mesh.material.polygonOffsetFactor = this.polygonOffsetFactor
      mesh.material.polygonOffsetUnits = this.polygonOffsetUnits
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
    }),
  },
}
</script>

<style lang="scss">
.app-webgl-interior {
  height: 100%;
  width: 100%;
  position: fixed;
}
</style>
