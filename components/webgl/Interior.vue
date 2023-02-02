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
          lambertMaterialColorActive: new THREE.Color(0xe2520f),
          lambertMaterialEmissiveActive: new THREE.Color(0xdb500f),
          emissiveIntensityActive: 0.7,
        },
        vip: {
          lambertMaterialColor: new THREE.Color(0xf46b2b),
          lambertMaterialEmissive: new THREE.Color(0xe2723d),
          emissiveIntensity: 0.6,
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
        } else {
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

          // const isHidden =
          //   (index >= oldVal.id || oldVal.id === 0) &&
          //   index < this.interiorIndexFloor.id

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

          // if (isHidden) {
          // }
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
        this.terrain.visible = false
      } else {
        this.musicScene.position.copy(this.musicScene.hidePosition)
        this.musicScene.visible = false
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

      this.directionalLight.shadow.mapSize.width = 1024 // 4096
      this.directionalLight.shadow.mapSize.height = 1024 // 4096

      this.directionalLight.shadow.camera.near = 1
      this.directionalLight.shadow.camera.far = 1000

      this.directionalLight.shadow.camera.left = -50
      this.directionalLight.shadow.camera.right = 50
      this.directionalLight.shadow.camera.top = 50
      this.directionalLight.shadow.camera.bottom = -50

      interior.add(this.directionalLight)
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

      const polygonsParams = {
        polygonOffset: true,
        polygonOffsetFactor: this.polygonOffsetFactor,
        polygonOffsetUnits: this.polygonOffsetUnits,
      }

      this.basicMaterial = new THREE.MeshLambertMaterial({
        color: this.colors.lambertMaterialColor,
        emissive: this.colors.lambertMaterialEmissive,
        emissiveIntensity: 0.7,
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
        emissiveIntensity: 0.7,
        ...polygonsParams,
      })

      this.vipMaterial = new THREE.MeshLambertMaterial({
        color: this.colors.vip.lambertMaterialColor,
        emissive: this.colors.vip.lambertMaterialEmissive,
        emissiveIntensity: 0.7,
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
    buildArenaFloor(initialObject, name = 'no-name', isGroundFloor = false) {
      const arene = this.model.getObjectByName('Arene')

      const group = new THREE.Group()
      group.position.copy(arene.position)
      group.name = name
      group.divider = []
      group.public = []
      group.vip = []
      group.materials = this.initFloorMaterials()
      group.isGroundFloor = isGroundFloor

      const clippingPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)

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
        part.position.y += 0.05

        if (part.name.includes('VIP')) {
          group.vip.push(part)
        } else {
          group.public.push(part)
        }

        // const box = new THREE.BoxHelper(part, 0xff0000)
        // part.add(box)

        // const { interactionManager } = useWebGL()
        // interactionManager.add(part)
        // part.addEventListener('click', this.onClickArena)
        // group.addEventListener('mouseenter', this.onMouseEnterArena)
        // group.addEventListener('mouseleave', this.onMouseLeaveArena)

        group.add(part)
      })

      group.initialPosition = group.position.clone()

      const { min, max } = new THREE.Box3().setFromObject(group)

      const height = max.y - min.y

      clippingPlane.constant = min.y * -1 + 0.1

      group.hidePosition = group.position.clone()
      group.hidePosition.y = height * -1 - 0.2

      return group
    },
    onClickArena(e) {
      console.log('here onClickArena', e)
    },
    onMouseEnterArena() {
      // console.log('here onMouseEnterArena')
    },
    onMouseLeaveArena() {
      // console.log('here onMouseLeaveArena')
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

      if (!object.isBasicObject) {
        if (object.publicAccess) {
          normalObject.material = materials.publicMaterial
        } else {
          normalObject.material = materials.vipMaterial
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
