<template>
  <div class="app-webgl-interior grid-inner">
    <div class="floors">
      <span
        v-for="i in 5"
        :key="i"
        :class="{ active: i - 1 === interiorIndexFloor }"
        @click="setInteriorIndexFloor(i - 1)"
        >floor {{ i - 1 }}</span
      >
    </div>
  </div>
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
        shadowColor: new THREE.Color(0xfbe7c9),
        arrowColor: new THREE.Color(0xff4a48),
        ambientLightColor: new THREE.Color(0xf1e7d9),
        directionalLightColor: new THREE.Color(0xffffff),
        lambertMaterialColor: new THREE.Color(0xf1e7d9),
        lambertMaterialEmissive: new THREE.Color(0xffffff),
        emissiveIntensity: 0.7,
        outlineColor: new THREE.Color(0x000000),
        public: {
          lambertMaterialColor: new THREE.Color(0xaee7d9),
          lambertMaterialEmissive: new THREE.Color(0x00ffff),
          emissiveIntensity: 0.7,
        },
        vip: {
          lambertMaterialColor: new THREE.Color(0xdf6c2d),
          lambertMaterialEmissive: new THREE.Color(0x873e23),
          emissiveIntensity: 0.7,
        },
      },
      rotation: [0, 0, 0],
      azimuth: { min: -Math.PI / 1.4, max: Math.PI * 1 },
      directionalLightCastShadow: true,
      modelCastShadow: true,
      modelReceiveShadow: true,
      directionalLightIsStatic: true,
      drag: {
        ease: 0.065,
        current: 0,
        target: 0,
        last: 0,
        speed: 2,
        dragSpeed: 0.005,
        enabled: true,
      },
      zoom: {
        ease: 0.065,
        initial: 10,
        current: 10,
        target: 10,
        last: 10,
        wheelSpeed: 0.015,
        range: {
          min: 5,
          max: 30,
        },
        enabled: true,
      },
      thresholdAngle: 40,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
      floorsGUI: [],
      helpers: [],
    }
  },
  computed: {
    ...mapState({
      modelInteriorLoaded: (state) => state.modelInteriorLoaded,
      allLoadedActual: (state) => state.allLoadedActual,
      interiorVisible: (state) => state.interiorVisible,
      interiorIndexFloor: (state) => state.interiorIndexFloor,
    }),
    floorsActivated() {
      const { interior } = useWebGL()

      return interior.floors.filter(
        (floor, index) => index <= this.interiorIndexFloor
      )
    },
  },
  watch: {
    interiorIndexFloor(value) {
      const { interior } = useWebGL()

      console.log(value, this.floorsActivated)

      interior.floors.forEach((floor, index) => {
        floor.visible = index <= value

        console.log(floor.visible, floor.name)
      })
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
    const { scissors, renderer, interior } = useWebGL()

    interior.zoom = this.zoom
    interior.drag = this.drag

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
      onWheel: this.onWheel,
      onDrag: this.onDrag,
      dragMinimum: 5,
      tolerance: 5,
    })

    this.$raf.add(`webgl-interior`, this.onFrame)
  },
  beforeDestroy() {
    const { interior, scene } = useWebGL()

    // MATERIAL
    const materials = this.buildGraph(interior).materials

    materials.forEach((material) => {
      material.dispose()
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
    this.guiFloors?.dispose()
    this.floorsGUI.forEach((gui) => {
      gui.dispose()
    })

    this.observer?.kill()
    interior.floors = []
    this.$raf.remove(`webgl-interior`, this.onFrame)
  },
  methods: {
    initInterior() {
      this.gltf = loaderManager.getModel('interior')
      this.model = this.gltf.scene

      this.initCamera()
      this.initMaterials()
      this.initLights()

      this.initFloor()
      this.initFootField()
      this.initMusicScene()

      this.initZeroFloor()
      this.initFirstFloor()
      this.initSecondFloor()
      this.initThirdFloor()
      this.initFourthFloor()

      this.initGUI()
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
      const { interior } = useWebGL()

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

          interior.floors.forEach((floor) => {
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

          interior.floors.forEach((floor) => {
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

          interior.floors.forEach((floor) => {
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

          interior.floors.forEach((floor) => {
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

          interior.floors.forEach((floor) => {
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

          interior.floors.forEach((floor) => {
            floor.materials.basicMaterialPublic.emissiveIntensity = e.value
          })
        })

      this.guiModelColors.addSeparator()

      this.guiModelColors
        .addInput(this.colors.vip, 'lambertMaterialColor', {
          color: { type: 'float' },
          label: 'Color VIP',
        })
        .on('change', (e) => {
          this.modelMaterialVIP.color = e.value

          interior.floors.forEach((floor) => {
            floor.materials.basicMaterialVIP.color = e.value
          })
        })

      this.guiModelColors
        .addInput(this.colors.vip, 'lambertMaterialEmissive', {
          color: { type: 'float' },
          label: 'Emissive Color VIP',
        })
        .on('change', (e) => {
          this.modelMaterialVIP.emissive = e.value

          interior.floors.forEach((floor) => {
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

          interior.floors.forEach((floor) => {
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
        step: 0.1,
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

      this.guiZoom.addInput(this.zoom, 'range', {
        min: 5,
        max: 100,
        label: 'Range (min/max)',
        step: 0.1,
      })

      this.guiZoom.addInput(this.zoom, 'ease', {
        min: 0,
        max: 0.25,
        label: 'Zoom ease',
        step: 0.0001,
      })

      this.guiZoom.addInput(this.zoom, 'wheelSpeed', {
        min: 0,
        max: 0.065,
        label: 'Wheel speed',
        step: 0.0001,
      })
    },
    initCamera() {
      const { camera } = useWebGL()

      this.cameras = this.model.getObjectByName('Cameras')

      this.cameraBase = this.cameras.getObjectByName('BaseCamera')

      camera.position.copy(this.cameraBase.position)
      camera.rotation.copy(this.cameraBase.rotation)

      camera.updateProjectionMatrix()
    },
    initMaterials() {
      this.shadowMaterial = new THREE.ShadowMaterial({
        color: this.colors.shadowColor,
        transparent: true,
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
        linewidth: 1,
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
      shadowFootField.isShadow = true

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
      shadowFloor.isShadow = true

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
      interior.floors.push(this.zeroFloor)
    },
    initFirstFloor() {
      const { interior } = useWebGL()

      const floorGroup = this.model
        .getObjectByName('Arene')
        .getObjectByName('Niveau_1')

      this.firstFloor = this.buildArenaFloor(floorGroup, `floor-${1}`)
      interior.add(this.firstFloor)
      interior.floors.push(this.firstFloor)
    },
    initSecondFloor() {
      const { interior } = useWebGL()

      const floorGroup = this.model
        .getObjectByName('Arene')
        .getObjectByName('Niveau_2')

      this.secondFloor = this.buildArenaFloor(floorGroup, `floor-${2}`)
      interior.add(this.secondFloor)
      interior.floors.push(this.secondFloor)
    },
    initThirdFloor() {
      const { interior } = useWebGL()

      const floorGroup = this.model
        .getObjectByName('Arene')
        .getObjectByName('Niveau_3')

      this.thirdFloor = this.buildArenaFloor(floorGroup, `floor-${3}`)
      interior.add(this.thirdFloor)
      interior.floors.push(this.thirdFloor)
    },
    initFourthFloor() {
      const { interior } = useWebGL()

      const floorGroup = this.model
        .getObjectByName('Arene')
        .getObjectByName('Niveau_4')

      this.fourthFloor = this.buildArenaFloor(floorGroup, `floor-${4}`)
      interior.add(this.fourthFloor)
      interior.floors.push(this.fourthFloor)
    },
    onWheel(e) {
      if (!this.zoom.enabled) return

      const delta = e.deltaY * this.zoom.wheelSpeed

      this.zoom.target = gsap.utils.clamp(
        this.zoom.range.min,
        this.zoom.range.max,
        this.zoom.target + delta
      )
    },
    onDrag(e) {
      if (!this.drag.enabled) return

      const delta = e.deltaX * this.drag.dragSpeed

      this.drag.target = gsap.utils.clamp(
        this.azimuth.min,
        this.azimuth.max,
        this.drag.target + delta
      )
    },
    onFrame({ time, deltaTime, frame, deltaRatio }) {
      if (!this.interiorVisible) return

      const { camera, interior } = useWebGL()

      this.drag.current = this.lerp(
        this.drag.current,
        this.drag.target,
        this.drag.ease
      )

      interior.rotation.y = this.drag.current

      this.zoom.current = this.lerp(
        this.zoom.current,
        this.zoom.target,
        this.zoom.ease
      )

      camera.zoom = gsap.utils.clamp(
        this.zoom.range.min,
        this.zoom.range.max,
        this.zoom.current
      )

      camera.updateProjectionMatrix()

      this.drag.last = this.drag.current
      this.zoom.last = this.zoom.current
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
      group.isGroundFloor = isGroundFloor

      const clippingPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
      // const helper = new THREE.PlaneHelper(clippingPlane, 75, 0xff0000)
      // this.helpers.push(helper)

      // scene.add(helper)

      const gui = useGUI()

      const floorGUI = gui.addFolder({ title: name })
      this.floorsGUI.push(floorGUI)

      const object = initialObject.clone()

      const { basicObject, specialObjects, dividerObject } =
        this.parseFloor(object)

      group.divider = dividerObject

      group.materials = {
        basicMaterial: this.modelMaterial.clone(),
        lineMaterial: this.lineMaterial.clone(),
        conditionalMaterial: this.conditionalMaterial.clone(),
        basicMaterialPublic: this.modelMaterialPublic.clone(),
        basicMaterialVIP: this.modelMaterialVIP.clone(),
      }

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

        group.add(part)
      })

      // const { min, max } = new THREE.Box3().setFromObject(group)

      // console.log(group.position.y, min)

      // const height = max.y - min.y

      // const dividerBottom = group.divider.find((divider) =>
      //   divider.name.includes('Bottom')
      // )

      // console.log(dividerBottom)
      // clippingPlane.constant = min.y * -1

      // if (!group.isGroundFloor) {
      //   group.position.y = height * -1
      // }

      // group.hidePosition = group.position.y
      // group.visiblePosition = 0

      // floorGUI.addInput(group.position, 'y', {
      //   min: -15,
      //   max: height * -1 + height,
      //   step: 0.0001,
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

      if (!object.isBasicObject) {
        if (object.publicAccess) {
          normalObject.material = materials.basicMaterialPublic
        } else {
          normalObject.material = materials.basicMaterialVIP
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

      mesh.castShadow = this.modelCastShadow
      mesh.receiveShadow = this.modelReceiveShadow

      mesh.name = 'model'
      mesh.material = this.modelMaterial
      mesh.isShadow = false

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
    }),
  },
}
</script>

<style lang="scss">
.app-webgl-interior {
  height: 100%;
  width: 100%;
  position: fixed;

  .floors {
    display: flex;
    width: 100%;
    grid-column: 1 / span 12;
    justify-content: flex-end;
    align-items: flex-end;

    span {
      padding: 20px;
      background: red;
      margin-right: 10px;
      cursor: pointer;

      &.active {
        background: blue;
      }

      &:last-child {
        margin-right: 0px;
      }
    }
  }
}
</style>
