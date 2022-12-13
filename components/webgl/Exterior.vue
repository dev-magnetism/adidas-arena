<template>
  <div class="app-webgl-exterior">
    <div class="arrow-debug">
      <span
        :class="{ 'is-active': indexArrowPosition === 0 }"
        @click="onFocusPartAdidasArena(0)"
        >0</span
      >
      <span
        :class="{ 'is-active': indexArrowPosition === 1 }"
        @click="onFocusPartAdidasArena(1)"
        >1</span
      >
      <span
        :class="{ 'is-active': indexArrowPosition === 2 }"
        @click="onFocusPartAdidasArena(2)"
        >2</span
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

import useWebGL from '~/hooks/webgl'
import useGUI from '~/hooks/gui'

import loaderManager from '~/assets/js/loaderManager'

import { ConditionalEdgesGeometry } from '~/assets/js/webgl/ConditionalEdgesGeometry'
import { ConditionalEdgesShader } from '~/assets/js/webgl/ConditionalEdgesShader'

export default {
  data() {
    return {
      modelColorSelected: new THREE.Color(0xff0000),
      modelShadowColorSelected: new THREE.Color(0xfff000),
      modelShadowColor: new THREE.Color(0xff00e6),
      modelLineColor: new THREE.Color(0x000000),
      rotation: [0, 0, 0],
      polar: [0, Math.PI / 2],
      azimuth: { min: -Math.PI / 1.4, max: Math.PI * 1 },
      directionalLightCastShadow: true,
      modelCastShadow: true,
      modelReceiveShadow: true,
      directionalLightIsStatic: true,
      cloudsParams: {
        speed: 0.0075,
      },
      drag: {
        ease: 0.065,
        current: 0,
        target: 0,
        last: 0,
        speed: 2,
        dragSpeed: 0.005,
      },
      zoom: {
        ease: 0.065,
        current: 15,
        target: 15,
        last: 15,
        wheelSpeed: 0.015,
        range: {
          min: 10,
          max: 35,
        },
      },
      indexArrowPosition: null,
      thresholdAngle: 40,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
    }
  },
  computed: {
    ...mapState({
      modelExteriorLoaded: (state) => state.modelExteriorLoaded,
      modelCloudLoaded: (state) => state.modelCloudLoaded,
      allLoadedActual: (state) => state.allLoadedActual,
      exteriorVisible: (state) => state.exteriorVisible,
    }),
  },
  watch: {
    modelExteriorLoaded() {
      this.initExterior()
    },
    modelCloudLoaded() {
      this.initClouds()
    },
    allLoadedActual(payload) {
      if (payload) this.initGUI()
    },
    exteriorVisible(payload) {
      const { exterior } = useWebGL()

      exterior.visible = payload
    },
  },
  mounted() {
    if (this.allLoadedActual) {
      this.initExterior()
      this.initClouds()
      this.initGUI()
    }

    this.observer = Observer.create({
      target: document,
      type: 'touch,pointer,wheel',
      onWheel: this.onWheel,
      onDrag: this.onDrag,
      dragMinimum: 5,
      tolerance: 5,
    })

    this.$raf.add(`3d`, this.onFrame)
  },
  beforeDestroy() {
    const { exterior, scene } = useWebGL()

    this.cloud?.material?.dispose()
    this.cloud?.geometry?.dispose()

    exterior.traverse((item) => {
      if (item instanceof THREE.Mesh || item instanceof THREE.Line) {
        item.geometry?.dispose()

        exterior.remove(item)
      }
    })

    exterior.remove(this.floor)
    exterior.remove(this.buildings)
    exterior.remove(this.road)
    exterior.remove(this.cars)
    exterior.remove(this.trees)
    exterior.remove(this.lamps)
    exterior.remove(this.clouds)
    exterior.remove(this.adidasArenaGroundFloor)
    exterior.remove(this.adidasArenaFirstFloor)
    exterior.remove(this.adidasArenaSecondFloor)
    exterior.remove(this.adidasArenaRoof)
    exterior.remove(this.paniers)
    exterior.remove(this.basket)
    exterior.remove(this.tram)
    exterior.remove(this.arrow)

    // MATERIAL
    this.shadowMaterial?.dispose()
    this.modelMaterial?.dispose()
    this.conditionalMaterial?.dispose()
    this.lineMaterial?.dispose()

    // LIGHTS
    this.ambientLight.dispose()
    scene.remove(this.ambientLight)

    this.directionalLight.dispose()
    // this.directionalLightHelper.dispose()
    if (!this.directionalLightIsStatic) {
      scene.remove(this.directionalLight)
      // scene.remove(this.directionalLightHelper)
    }

    // GUI
    this.guiAmbientLight?.dispose()
    this.guiDirectionalLight?.dispose()
    this.guiDrag?.dispose()
    this.guiModel?.dispose()
    this.guiZoom?.dispose()
    this.guiClouds?.dispose()

    // TWEEN
    this.tweenArrowTranslate?.kill()
    this.tweenZoom?.kill()

    // GLOBAL
    this.observer?.kill()
    this.$raf.remove(`3d`, this.onFrame)
  },
  methods: {
    onWheel(e) {
      // const delta = e.deltaY * this.zoom.wheelSpeed
      // this.zoom.target = gsap.utils.clamp(
      //   this.zoom.range.min,
      //   this.zoom.range.max,
      //   this.zoom.target + delta
      // )
    },
    onDrag(e) {
      const delta = e.deltaX * this.drag.dragSpeed

      this.drag.target = gsap.utils.clamp(
        this.azimuth.min,
        this.azimuth.max,
        this.drag.target + delta
      )
    },
    onFrame() {
      if (
        this.modelExteriorLoaded === undefined &&
        this.modelCloudLoaded === undefined &&
        !this.exteriorVisible
      )
        return

      const { camera, exterior } = useWebGL()

      this.clouds?.children?.forEach((cloud) => {
        const z = cloud.direction
          ? cloud.position.z - cloud.coefParallax * this.cloudsParams.speed
          : cloud.position.z + cloud.coefParallax * this.cloudsParams.speed
        cloud.position.z = gsap.utils.wrap(100, -100, z)
      })

      this.drag.current = this.lerp(
        this.drag.current,
        this.drag.target,
        this.drag.ease
      )
      exterior.rotation.y = this.drag.current

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

    initExterior() {
      this.gltfExterior = loaderManager.getModel('exterior').scene

      const arrowsPositionGroup =
        this.gltfExterior.getObjectByName('ArrowsPosition')

      this.arrowPositions = arrowsPositionGroup.children.map(
        (child) => child.position
      )

      this.initCamera()
      this.initMaterials()
      this.initLights()

      this.initFloor()
      this.initRoad()
      this.initBuildings()
      this.initAdidasArenaGroundFloor()
      this.initAdidasArenaFirstFloor()
      this.initAdidasArenaSecondFloor()
      this.initAdidasArenaRoof()
      this.initCars()
      this.initPaniers()
      this.initTram()
      this.initTrees()
      this.initBasket()
      this.initLamps()
      this.initArrow()
    },

    initCamera() {
      const { camera } = useWebGL()

      this.camera = loaderManager
        .getModel('exterior')
        .scene.getObjectByName('Camera_Zoom')

      camera.position.copy(this.camera.position)
      camera.rotation.copy(this.camera.rotation)
      camera.zoom = this.zoom.current

      camera.updateProjectionMatrix()
    },

    initMaterials() {
      this.modelMaterial = new THREE.MeshLambertMaterial({
        color: new THREE.Color(0xffffff),
        emissive: new THREE.Color(0xffffff),
        emissiveIntensity: 0.85,
      })

      this.shadowMaterial = new THREE.ShadowMaterial({
        color: this.modelShadowColor,
      })

      this.conditionalMaterial = new THREE.ShaderMaterial(
        ConditionalEdgesShader
      )
      this.conditionalMaterial.uniforms.diffuse.value.set(
        new THREE.Color(0x000000)
      )

      this.lineMaterial = new THREE.LineBasicMaterial({
        color: this.modelLineColor,
      })
    },

    initClouds() {
      const { exterior } = useWebGL()

      this.clouds = new THREE.Group()
      this.clouds.name = 'clouds'
      exterior.add(this.clouds)

      this.gltfCloud = loaderManager.getModel('cloud').scene

      const cloud = this.mergeObject(this.gltfCloud)
      const edgeCloud = this.edgeObject(cloud)
      const conditionalCloud = this.conditionalObject(cloud)

      this.cloud = new THREE.Group()
      this.cloud.name = 'cloud'

      this.cloud.add(cloud)
      this.cloud.add(edgeCloud)
      this.cloud.add(conditionalCloud)

      const planesGroup = this.gltfExterior.getObjectByName('Plane')

      planesGroup.traverse((plane) => {
        const object = this.cloud.clone()
        object.coefParallax = this.genRand(0.25, 10, 2)
        object.direction = Math.random() < 0.5
        object.position.copy(plane.position)
        object.initialPosition = object.position

        this.clouds.add(object)
      })
    },

    initLights() {
      const { exterior, scene } = useWebGL()

      this.ambientLight = new THREE.AmbientLight(0xff00e6)
      scene.add(this.ambientLight)

      this.directionalLight = new THREE.DirectionalLight(0xffffff, 1)
      this.directionalLight.castShadow = true
      this.directionalLight.position.set(-100, 150, 300)

      // this.directionalLightHelper = new THREE.DirectionalLightHelper(
      //   this.directionalLight,
      //   15,
      //   new THREE.Color('#FF0000')
      // )

      this.directionalLight.shadow.mapSize.width = 2048
      this.directionalLight.shadow.mapSize.height = 2048
      // this.directionalLight.shadow.radius = 1

      this.directionalLight.shadow.camera.near = 1
      this.directionalLight.shadow.camera.far = 5000

      this.directionalLight.shadow.camera.left = -80
      this.directionalLight.shadow.camera.right = 80
      this.directionalLight.shadow.camera.top = 80
      this.directionalLight.shadow.camera.bottom = -80

      if (this.directionalLightIsStatic) {
        // exterior.add(this.directionalLightHelper)
        exterior.add(this.directionalLight)
      } else {
        // scene.add(this.directionalLightHelper)
        scene.add(this.directionalLight)
      }
    },

    initArrow() {
      const { exterior } = useWebGL()

      this.arrow = new THREE.Group()
      this.arrow.castShadow = true
      this.arrow.receiveShadow = true
      exterior.add(this.arrow)

      const arrowGroup = this.gltfExterior.getObjectByName('Arrow_001')

      const arrow = this.mergeObject(arrowGroup)
      const edgeArrow = this.edgeObject(arrow)
      const conditionalArrow = this.conditionalObject(arrow)

      this.arrow.add(arrow)
      this.arrow.add(edgeArrow)
      this.arrow.add(conditionalArrow)

      this.arrow.position.x = this.arrowPositions[0].x
      this.arrow.position.z = this.arrowPositions[0].z

      this.tweenArrowTranslate = gsap.to(this.arrow.position, {
        y: 2,
        repeat: -1,
        yoyo: true,
        duration: 1,
      })

      arrow.material.flatShading = true
    },

    initBasket() {
      const { exterior } = useWebGL()

      this.basket = new THREE.Group()
      exterior.add(this.basket)

      const basketGroup = this.gltfExterior.getObjectByName('Basket')

      const basket = this.mergeObject(basketGroup)

      // const shadowBasket = basket.clone()
      // shadowBasket.name = 'shadowModel'
      // shadowBasket.material = this.shadowMaterial.clone()
      // shadowBasket.isShadow = true

      const edgeBasket = this.edgeObject(basket)
      const conditionalBasket = this.conditionalObject(basket)

      this.basket.add(basket)
      // this.basket.add(shadowBasket)
      this.basket.add(edgeBasket)
      this.basket.add(conditionalBasket)
    },

    initCars() {
      const { exterior } = useWebGL()

      this.cars = new THREE.Group()
      exterior.add(this.cars)

      const carsGroup = this.gltfExterior.getObjectByName('Cars')

      const cars = this.mergeObject(carsGroup)
      const edgeCars = this.edgeObject(cars)
      const conditionalCars = this.conditionalObject(cars)

      this.cars.add(cars)
      this.cars.add(edgeCars)
      this.cars.add(conditionalCars)
    },

    initPaniers() {
      const { exterior } = useWebGL()

      this.paniers = new THREE.Group()
      exterior.add(this.paniers)

      const paniersGroup = this.gltfExterior.getObjectByName('Paniers')

      const paniers = this.mergeObject(paniersGroup)
      const edgePaniers = this.edgeObject(paniers)
      const conditionalPaniers = this.conditionalObject(paniers)

      this.paniers.add(paniers)
      this.paniers.add(edgePaniers)
      this.paniers.add(conditionalPaniers)
    },

    initRoad() {
      const { exterior } = useWebGL()

      this.road = new THREE.Group()
      exterior.add(this.road)

      const roadGroup = this.gltfExterior.getObjectByName('Road')

      const road = this.mergeObject(roadGroup)

      const shadowRoad = road.clone()
      shadowRoad.name = 'shadowModel'
      shadowRoad.material = this.shadowMaterial.clone()
      shadowRoad.isShadow = true

      const edgeRoad = this.edgeObject(road)
      const conditionalRoad = this.conditionalObject(road)

      // this.road.add(road)
      this.road.add(shadowRoad)
      this.road.add(edgeRoad)
      this.road.add(conditionalRoad)
    },

    initLamps() {
      const { exterior } = useWebGL()

      this.lamps = new THREE.Group()
      exterior.add(this.lamps)

      const lampsGroup = this.gltfExterior.getObjectByName('Lamps')

      const lamps = this.mergeObject(lampsGroup)
      const edgeLamps = this.edgeObject(lamps)
      const conditionalLamps = this.conditionalObject(lamps)

      this.lamps.add(lamps)
      this.lamps.add(edgeLamps)
      this.lamps.add(conditionalLamps)
    },

    initTram() {
      const { exterior } = useWebGL()

      this.tram = new THREE.Group()
      exterior.add(this.tram)

      const tramGroup = this.gltfExterior.getObjectByName('Tram')

      const tram = this.mergeObject(tramGroup)
      const edgeTram = this.edgeObject(tram)
      const conditionalTram = this.conditionalObject(tram)

      this.tram.add(tram)
      this.tram.add(edgeTram)
      this.tram.add(conditionalTram)
    },

    initTrees() {
      const { exterior } = useWebGL()

      this.trees = new THREE.Group()
      this.trees.name = 'trees'
      exterior.add(this.trees)

      const treesGroup = this.gltfExterior.getObjectByName('Trees')

      const trees = this.mergeObject(treesGroup)
      const edgeTrees = this.edgeObject(trees)
      const conditionalTrees = this.conditionalObject(trees)

      this.trees.add(trees)
      this.trees.add(edgeTrees)
      this.trees.add(conditionalTrees)
    },

    initFloor() {
      const { exterior } = useWebGL()

      this.floor = new THREE.Group()
      this.floor.name = 'floor'
      exterior.add(this.floor)

      const floorGroup = this.gltfExterior.getObjectByName('Floor')

      const floor = this.mergeObject(floorGroup)

      const shadowFloor = floor.clone()
      shadowFloor.name = 'shadowModel'
      shadowFloor.material = this.shadowMaterial.clone()
      shadowFloor.isShadow = true

      const edgeFloor = this.edgeObject(floor)
      const conditionalFloor = this.conditionalObject(floor)

      this.floor.add(floor)
      this.floor.add(shadowFloor)
      this.floor.add(edgeFloor)
      this.floor.add(conditionalFloor)
    },

    initBuildings() {
      const { exterior } = useWebGL()

      this.buildings = new THREE.Group()
      exterior.add(this.buildings)

      const buildingsGroup = this.gltfExterior.getObjectByName('Buildings')

      const buildings = this.mergeObject(buildingsGroup)

      const edgeBuildings = this.edgeObject(buildings)
      const conditionalBuildings = this.conditionalObject(buildings)

      this.buildings.add(buildings)
      this.buildings.add(edgeBuildings)
      this.buildings.add(conditionalBuildings)
    },

    initAdidasArenaGroundFloor() {
      const { exterior } = useWebGL()

      this.adidasArenaGroundFloor = new THREE.Group()
      this.adidasArenaGroundFloor.idBlock = 2
      exterior.add(this.adidasArenaGroundFloor)

      const adidasArenaGroup = this.gltfExterior.getObjectByName('Arena_02')

      const adidasArena = this.mergeObject(adidasArenaGroup)
      const edgeAdidasArena = this.edgeObject(adidasArena)
      const conditionalAdidasArena = this.conditionalObject(adidasArena)

      this.adidasArenaGroundFloor.add(adidasArena)
      this.adidasArenaGroundFloor.add(edgeAdidasArena)
      this.adidasArenaGroundFloor.add(conditionalAdidasArena)
    },

    initAdidasArenaFirstFloor() {
      const { exterior } = useWebGL()

      this.adidasArenaFirstFloor = new THREE.Group()
      this.adidasArenaFirstFloor.idBlock = 1

      exterior.add(this.adidasArenaFirstFloor)

      const adidasArenaGroup = this.gltfExterior.getObjectByName('Arena_01')

      const adidasArena = this.mergeObject(adidasArenaGroup)
      const edgeAdidasArena = this.edgeObject(adidasArena)
      const conditionalAdidasArena = this.conditionalObject(adidasArena)

      this.adidasArenaFirstFloor.add(adidasArena)
      this.adidasArenaFirstFloor.add(edgeAdidasArena)
      this.adidasArenaFirstFloor.add(conditionalAdidasArena)
    },

    initAdidasArenaSecondFloor() {
      const { exterior } = useWebGL()

      this.adidasArenaSecondFloor = new THREE.Group()
      this.adidasArenaFirstFloor.idBlock = 0

      exterior.add(this.adidasArenaSecondFloor)

      const adidasArenaGroup = this.gltfExterior.getObjectByName('Arena_00')
      const adidasArena = this.mergeObject(adidasArenaGroup)
      const edgeAdidasArena = this.edgeObject(adidasArena)
      const conditionalAdidasArena = this.conditionalObject(adidasArena)

      this.adidasArenaSecondFloor.add(adidasArena)
      this.adidasArenaSecondFloor.add(edgeAdidasArena)
      this.adidasArenaSecondFloor.add(conditionalAdidasArena)
    },

    initAdidasArenaRoof() {
      const { exterior } = useWebGL()

      this.adidasArenaRoof = new THREE.Group()
      exterior.add(this.adidasArenaRoof)

      const adidasArenaRoofGroup =
        this.gltfExterior.getObjectByName('PlaneArena')

      const adidasArenaRoof = this.mergeObject(adidasArenaRoofGroup)
      adidasArenaRoof.name = 'shadowModel'
      adidasArenaRoof.material = this.shadowMaterial.clone()
      adidasArenaRoof.material.color = this.modelShadowColor
      adidasArenaRoof.isShadow = true

      this.adidasArenaRoof.add(adidasArenaRoof)
    },

    onFocusPartAdidasArena(index) {
      // const { camera } = useWebGL()

      this.indexArrowPosition = index

      const notSelectedPartAdidasArena = [
        this.adidasArenaSecondFloor,
        this.adidasArenaFirstFloor,
        this.adidasArenaGroundFloor,
      ].filter((el, index) => index !== this.indexArrowPosition)

      const selectedPartAdidasArena = [
        this.adidasArenaSecondFloor,
        this.adidasArenaFirstFloor,
        this.adidasArenaGroundFloor,
      ].find((el, index) => index === this.indexArrowPosition)

      notSelectedPartAdidasArena.forEach((group) => {
        group.traverse((child) => {
          if (child.isMesh) {
            child.material.emissive = new THREE.Color(0xffffff)
          }
        })
      })

      selectedPartAdidasArena.traverse((child) => {
        if (child.isMesh) {
          child.material.emissive = this.modelColorSelected
        }
      })

      if (this.indexArrowPosition === 0) {
        this.adidasArenaRoof.children[0].material.color =
          this.modelShadowColorSelected
      } else {
        this.adidasArenaRoof.children[0].material.color = this.modelShadowColor
      }

      gsap.to(this.arrow.position, {
        x: this.arrowPositions[this.indexArrowPosition].x,
        z: this.arrowPositions[this.indexArrowPosition].z,
      })
    },

    edgeObject(object) {
      const mergedGeom = object.geometry

      const lineGeom = new THREE.EdgesGeometry(mergedGeom, this.thresholdAngle)

      const line = new THREE.LineSegments(lineGeom, this.lineMaterial)
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

      const mesh = new THREE.LineSegments(lineGeom, this.conditionalMaterial)
      mesh.position.copy(object.position)
      mesh.scale.copy(object.scale)
      mesh.rotation.copy(object.rotation)
      mesh.name = 'conditional'

      return mesh
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
      mesh.material = this.modelMaterial.clone()
      mesh.isShadow = false

      mesh.material.polygonOffset = true
      mesh.material.polygonOffsetFactor = this.polygonOffsetFactor
      mesh.material.polygonOffsetUnits = this.polygonOffsetUnits
      mesh.material.needsUpdate = true

      return mesh
    },
    initGUI() {
      const gui = useGUI()

      const { exterior, scene } = useWebGL()

      this.guiAmbientLight = gui.addFolder({
        title: `Ambient Light`,
        expanded: false,
      })

      this.guiAmbientLight.addInput(this.ambientLight, 'color', {
        color: { type: 'float' },
        label: 'Color',
      })

      this.guiAmbientLight.addInput(this.ambientLight, 'intensity', {
        min: 0,
        max: 1,
        step: 0.01,
        label: 'Intensity',
      })

      this.guiDirectionalLight = gui.addFolder({
        title: `Directional Light`,
        expanded: false,
      })

      this.guiDirectionalLight
        .addInput(this, 'directionalLightIsStatic', {
          label: 'Static',
        })
        .on('change', (e) => {
          if (e.value) {
            scene.remove(this.directionalLight)
            // scene.remove(this.directionalLightHelper)

            exterior.add(this.directionalLight)
            // exterior.add(this.directionalLightHelper)
          } else {
            exterior.remove(this.directionalLight)
            // exterior.remove(this.directionalLightHelper)

            scene.add(this.directionalLight)
            // scene.add(this.directionalLightHelper)
          }
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
        max: 1,
        step: 0.01,
        label: 'Intensity',
      })

      this.guiDirectionalLight
        .addInput(this.directionalLight.shadow.camera, 'near', {
          min: 0,
          max: 1,
          step: 0.01,
          label: 'Near',
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
          label: 'Far',
        })
        .on('change', (e) => {
          this.directionalLight.shadow.camera.far = e.value

          this.directionalLight.shadow.camera.updateProjectionMatrix()
        })

      this.guiDrag = gui.addFolder({ title: `Drag`, expanded: false })

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

      this.guiZoom = gui.addFolder({ title: `Zoom`, expanded: false })

      this.guiZoom.addInput(this.zoom, 'range', {
        min: 5,
        max: 50,
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

      this.guiClouds = gui.addFolder({ title: `Clouds`, expanded: false })

      this.guiClouds.addInput(this.cloudsParams, 'speed', {
        min: 0.0025,
        max: 0.25,
        label: 'Speed ',
        step: 0.001,
      })

      this.guiModel = gui.addFolder({ title: `Model`, expanded: false })

      this.guiModel
        .addInput(this, 'modelCastShadow', {
          label: 'Cast shadow',
        })
        .on('change', (e) => {
          exterior.traverse((child) => {
            if (child.isMesh && !child.isShadow) {
              child.castShadow = e.value
            }
          })
        })

      this.guiModel
        .addInput(this, 'modelReceiveShadow', {
          label: 'Receive shadow',
        })
        .on('change', (e) => {
          exterior.traverse((child) => {
            if (child.isMesh && !child.isShadow) {
              child.receiveShadow = e.value
            }
          })
        })

      this.guiModel.addSeparator()

      this.guiModel.addInput(this, 'modelColorSelected', {
        color: { type: 'float' },
        label: 'Color selected',
      })

      this.guiModel.addInput(this, 'modelShadowColorSelected', {
        color: { type: 'float' },
        label: 'Shadow color selected',
      })

      this.guiModel.addSeparator()
      this.guiModel
        .addInput(this, 'modelLineColor', {
          color: { type: 'float' },
          label: 'Outline color',
        })
        .on('change', (e) => {
          exterior.traverse((child) => {
            if (child.isLine || child.isLineSegments) {
              child.material.color = e.value
            }
          })
        })

      this.guiModel.addSeparator()

      this.guiModel
        .addInput(this.modelMaterial, 'color', {
          color: { type: 'float' },
          label: 'Color',
        })
        .on('change', (e) => {
          exterior.traverse((child) => {
            if (child.isMesh && !child.isShadow) {
              child.material.emissive = e.value
            }
          })
        })

      this.guiModel
        .addInput(this.modelMaterial, 'emissiveIntensity', {
          min: 0,
          max: 1,
          step: 0.01,
          label: 'Color intensity',
        })
        .on('change', (e) => {
          exterior.traverse((child) => {
            if (child.isMesh && !child.isShadow) {
              child.material.emissiveIntensity = e.value
            }
          })
        })

      this.guiModel.addSeparator()

      this.guiModel
        .addInput(this.shadowMaterial, 'color', {
          color: { type: 'float' },
          label: 'Shadow color',
        })
        .on('change', (e) => {
          exterior.traverse((child) => {
            if (child.isMesh && child.isShadow) {
              child.material.color = e.value
            }
          })
        })

      this.guiModel
        .addInput(this.shadowMaterial, 'opacity', {
          min: 0,
          max: 1,
          step: 0.01,
          label: 'Shadow color opacity',
        })
        .on('change', (e) => {
          exterior.traverse((child) => {
            if (child.isMesh && child.isShadow) {
              child.material.opacity = e.value
            }
          })
        })
    },

    ...mapMutations({}),

    lerp(p1, p2, t) {
      return p1 + (p2 - p1) * t
    },

    genRand(min, max, decimalPlaces) {
      const rand = Math.random() * (max - min) + min
      const power = Math.pow(10, decimalPlaces)
      return Math.floor(rand * power) / power
    },
  },
}
</script>

<style lang="scss">
.app-webgl-exterior {
  height: 100vh;
  width: 100%;
  position: fixed;
  .arrow-debug {
    position: absolute;
    bottom: 10px;
    right: 10px;
    display: flex;
    z-index: 2;

    span {
      padding: 10px 20px;
      margin: 0 5px;
      cursor: pointer;
      background: var(--c-red-adidas);

      &.is-active {
        background: var(--c-blue-adidas);
      }
    }
  }
  .test {
    background: red;
    width: 200px;
    height: 200px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
