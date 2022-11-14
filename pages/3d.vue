<template>
  <div class="app-3d">
    <div class="arrow-debug">
      <span @click="onFocusPartAdidasArena(0)">0</span>
      <span @click="onFocusPartAdidasArena(1)">1</span>
      <span @click="onFocusPartAdidasArena(2)">2</span>
    </div>
  </div>
</template>

<script>
import { gsap } from 'gsap'
import { Observer } from 'gsap/Observer'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import {
  mergeBufferGeometries,
  mergeVertices,
} from 'three/examples/jsm/utils/BufferGeometryUtils.js'

import useWebGL from '~/hooks/webgl'
import useGUI from '~/hooks/gui'

import { ConditionalEdgesGeometry } from '~/assets/js/webgl/ConditionalEdgesGeometry'
import { ConditionalEdgesShader } from '~/assets/js/webgl/ConditionalEdgesShader'

export default {
  data() {
    return {
      modelLoaded: false,
      rotation: [0, 0, 0],
      polar: [0, Math.PI / 2],
      azimuth: { min: -Math.PI / 1.4, max: Math.PI * 1 },
      directionalLightCastShadow: true,
      modelCastShadow: true,
      modelReceiveShadow: true,
      directionalLightIsStatic: false,
      drag: {
        ease: 0.065,
        current: 0,
        target: 0,
        last: 0,
        speed: 2,
        dragSpeed: 0.005,
      },
      indexArrowPosition: 0,
      thresholdAngle: 40,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
    }
  },
  computed: {},
  mounted() {
    this.dracoLoader = new DRACOLoader()
    this.dracoLoader.setDecoderPath('three/examples/js/libs/draco/')

    this.gltfLoader = new GLTFLoader()
    this.gltfLoader.setDRACOLoader(this.dracoLoader)

    this.gltfLoader.load(
      '/models/map.gltf',
      (gltf) => {
        this.initModel(gltf)
        this.loadCloudModel()
      },
      (progress) => {
        // console.log('progress model load')
        // console.log(progress)
      },
      (error) => {
        console.log('error model load', error)
      }
    )

    this.observer = Observer.create({
      target: this.$el,
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

    console.log('destroy')

    exterior.traverse((item) => {
      if (item instanceof THREE.Mesh || item instanceof THREE.Line) {
        item.material.dispose()
        item.geometry.dispose()

        exterior.remove(item)
      }
    })

    this.clouds.remove(this.cloud)

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

    // GLOBAL
    this.observer?.kill()
    this.$raf.remove(`3d`, this.onFrame)

    // LIGHTS
    this.directionalLight.dispose()
    this.directionalLightHelper.dispose()
    this.ambientLight.dispose()

    scene.remove(this.ambientLight)

    if (!this.directionalLightIsStatic) {
      scene.remove(this.directionalLight)
      scene.remove(this.directionalLightHelper)
    }

    this.guiAmbientLight?.dispose()
    this.guiDirectionalLight?.dispose()
    this.guiDrag?.dispose()
    this.guiModel?.dispose()

    this.tweenArrowTranslate?.kill()
  },
  methods: {
    onWheel(e) {
      const { camera } = useWebGL()

      camera.zoom -= e.deltaY * 0.01
      camera.updateProjectionMatrix()
    },
    onFrame() {
      if (!this.modelExterior && !this.modelCloud) return

      const { exterior } = useWebGL()

      this.clouds?.children?.forEach((cloud) => {
        const z = cloud.position.z + cloud.coefParallax
        cloud.position.z = gsap.utils.wrap(100, -100, z)
      })

      this.drag.current = this.lerp(
        this.drag.current,
        this.drag.target,
        this.drag.ease
      )

      const clamp = this.drag.current
      exterior.rotation.y = clamp
      this.drag.last = this.drag.current
    },
    onDrag(e) {
      const delta = e.deltaX * this.drag.dragSpeed

      this.drag.target = gsap.utils.clamp(
        this.azimuth.min,
        this.azimuth.max,
        this.drag.target + delta
      )
    },

    initModel(gltf) {
      this.modelExterior = gltf.scene

      this.modelLoaded = true

      const arrowsPositionGroup =
        this.modelExterior.getObjectByName('ArrowsPosition')
      this.arrowPositions = arrowsPositionGroup.children.map(
        (child) => child.position
      )

      console.log('initial model', this.modelExterior)

      this.initCamera()
      this.initMaterial()
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

      this.initGUI()
    },

    initCamera() {
      const { camera } = useWebGL()
      this.camera = this.modelExterior.getObjectByName('Camera_Zoom')

      camera.position.copy(this.camera.position)
      camera.rotation.copy(this.camera.rotation)
      camera.zoom = 15
      camera.updateProjectionMatrix()
    },

    initMaterial() {
      this.modelMaterial = new THREE.MeshLambertMaterial({
        color: new THREE.Color(0xffffff),
        emissive: new THREE.Color(0xffffff),
        emissiveIntensity: 0.85,
      })

      this.shadowMaterial = new THREE.ShadowMaterial({
        color: 0xff00e6,
      })

      this.conditionalMaterial = new THREE.ShaderMaterial(
        ConditionalEdgesShader
      )
      this.conditionalMaterial.uniforms.diffuse.value.set(
        new THREE.Color(0x000000)
      )

      this.lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 })
    },

    loadCloudModel() {
      this.gltfLoader.load(
        '/models/cloud.gltf',
        (gltf) => {
          this.initClouds(gltf)
        },
        (progress) => {
          // console.log('progress model load')
          // console.log(progress)
        },
        (error) => {
          console.log('error model load clouds', error)
        }
      )
    },

    initClouds(gltf) {
      const { exterior } = useWebGL()

      this.clouds = new THREE.Group()
      this.clouds.name = 'clouds'

      exterior.add(this.clouds)

      this.modelCloud = gltf.scenes[0].children[0]

      const cloud = this.mergeObject(this.modelCloud)
      const edgeCloud = this.edgeObject(cloud)
      const conditionalCloud = this.conditionalObject(cloud)

      this.cloud = new THREE.Group()
      this.cloud.name = 'cloud'

      this.cloud.add(cloud)
      this.cloud.add(edgeCloud)
      this.cloud.add(conditionalCloud)

      const planesGroup = this.modelExterior.getObjectByName('Plane')

      planesGroup.traverse((plane) => {
        const object = this.cloud.clone()
        object.coefParallax = this.genRand(0.025, 0.065, 3)
        object.position.copy(plane.position)
        object.initialPosition = object.position

        this.clouds.add(object)
      })
    },

    initLights() {
      const { scene, exterior } = useWebGL()

      this.ambientLight = new THREE.AmbientLight(0xff00e6)
      scene.add(this.ambientLight)

      this.directionalLight = new THREE.DirectionalLight(0xffffff, 1)
      this.directionalLight.castShadow = true
      this.directionalLight.position.set(-100, 150, 300)

      this.directionalLightHelper = new THREE.DirectionalLightHelper(
        this.directionalLight,
        15,
        new THREE.Color('#FF0000')
      )

      this.directionalLight.shadow.mapSize.width = 4096 // default
      this.directionalLight.shadow.mapSize.height = 4096 // default
      // this.directionalLight.shadow.radius = 1

      this.directionalLight.shadow.camera.near = 1
      this.directionalLight.shadow.camera.far = 1000

      this.directionalLight.shadow.camera.left = -80
      this.directionalLight.shadow.camera.right = 80
      this.directionalLight.shadow.camera.top = 80
      this.directionalLight.shadow.camera.bottom = -80

      if (this.directionalLightIsStatic) {
        exterior.add(this.directionalLightHelper)
        exterior.add(this.directionalLight)
      } else {
        scene.add(this.directionalLightHelper)
        scene.add(this.directionalLight)
      }
    },

    initArrow() {
      const { exterior } = useWebGL()

      this.arrow = new THREE.Group()
      this.arrow.castShadow = true
      this.arrow.receiveShadow = true
      exterior.add(this.arrow)

      const arrowGroup = this.modelExterior.getObjectByName('Arrow_001')

      const arrow = this.mergeObject(arrowGroup)
      const edgeArrow = this.edgeObject(arrow)
      const conditionalArrow = this.conditionalObject(arrow)

      this.arrow.add(arrow)
      this.arrow.add(edgeArrow)
      this.arrow.add(conditionalArrow)

      this.arrow.position.x = this.arrowPositions[this.indexArrowPosition].x
      this.arrow.position.z = this.arrowPositions[this.indexArrowPosition].z

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

      const basketGroup = this.modelExterior.getObjectByName('Basket')

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

      const carsGroup = this.modelExterior.getObjectByName('Cars')

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

      const paniersGroup = this.modelExterior.getObjectByName('Paniers')

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

      const roadGroup = this.modelExterior.getObjectByName('Road')

      const road = this.mergeObject(roadGroup)

      const shadowRoad = road.clone()
      shadowRoad.name = 'shadowModel'
      shadowRoad.material = this.shadowMaterial.clone()
      shadowRoad.isShadow = true

      const edgeRoad = this.edgeObject(road)
      const conditionalRoad = this.conditionalObject(road)

      this.road.add(road)
      this.road.add(shadowRoad)
      this.road.add(edgeRoad)
      this.road.add(conditionalRoad)
    },

    initLamps() {
      const { exterior } = useWebGL()

      this.lamps = new THREE.Group()
      exterior.add(this.lamps)

      const lampsGroup = this.modelExterior.getObjectByName('Lamps')

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

      const tramGroup = this.modelExterior.getObjectByName('Tram')

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
      exterior.add(this.trees)

      const treesGroup = this.modelExterior.getObjectByName('Trees')

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
      exterior.add(this.floor)
      // this.floor.position.y = -0.0001

      const floorGroup = this.modelExterior.getObjectByName('Floor')

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

      const buildingsGroup = this.modelExterior.getObjectByName('Buildings')

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

      const adidasArenaGroup = this.modelExterior.getObjectByName('Arena_02')

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

      const adidasArenaGroup = this.modelExterior.getObjectByName('Arena_01')

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

      const adidasArenaGroup = this.modelExterior.getObjectByName('Arena_00')

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
        this.modelExterior.getObjectByName('PlaneArena')

      const adidasArenaRoof = this.mergeObject(adidasArenaRoofGroup)
      adidasArenaRoof.name = 'shadowModel'
      adidasArenaRoof.material = this.shadowMaterial.clone()
      adidasArenaRoof.isShadow = true

      this.adidasArenaRoof.add(adidasArenaRoof)
    },

    onFocusPartAdidasArena(index) {
      this.indexArrowPosition = index

      gsap.to(this.arrow.position, {
        x: this.arrowPositions[this.indexArrowPosition].x,
        z: this.arrowPositions[this.indexArrowPosition].z,
      })
    },

    edgeObject(object) {
      const mergedGeom = object.geometry.clone()

      const lineGeom = new THREE.EdgesGeometry(mergedGeom, this.thresholdAngle)

      const line = new THREE.LineSegments(lineGeom, this.lineMaterial.clone())
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

      const mesh = new THREE.LineSegments(
        lineGeom,
        this.conditionalMaterial.clone()
      )
      mesh.position.copy(object.position)
      mesh.scale.copy(object.scale)
      mesh.rotation.copy(object.rotation)
      mesh.name = 'conditional'

      return mesh
    },

    mergeObject(object) {
      const obj = object.clone()

      obj.updateMatrixWorld(true)

      const geometry = []

      obj.traverse((child) => {
        if (child.isMesh) {
          const g = child.geometry
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

      this.guiDirectionalLight = gui.addFolder({ title: `Directional Light` })

      this.guiDirectionalLight
        .addInput(this, 'directionalLightIsStatic', {
          label: 'Static',
        })
        .on('change', (e) => {
          if (e.value) {
            scene.remove(this.directionalLight)
            scene.remove(this.directionalLightHelper)

            exterior.add(this.directionalLight)
            exterior.add(this.directionalLightHelper)
          } else {
            exterior.remove(this.directionalLight)
            exterior.remove(this.directionalLightHelper)

            scene.add(this.directionalLight)
            scene.add(this.directionalLightHelper)
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
        min: Math.PI * -2,
        max: Math.PI * 2,
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

      this.guiModel = gui.addFolder({ title: `Model` })

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
      this.guiModel
        .addInput(this.lineMaterial, 'color', {
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
.app-3d {
  height: 100vh;
  width: 100%;
  position: relative;
  .arrow-debug {
    position: absolute;
    bottom: 10px;
    right: 10px;
    display: flex;
    z-index: 999;

    span {
      padding: 10px 20px;
      margin: 0 5px;
      cursor: pointer;

      &:nth-child(1) {
        background: var(--c-red-adidas);
      }
      &:nth-child(2) {
        background: var(--c-blue-adidas);
      }
      &:nth-child(3) {
        background: var(--c-red-adidas);
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
