<template>
  <div class="app-3d">
    <!-- <div ref="test" class="test"></div> -->
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
      speed: 1,
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
      },
      (progress) => {
        console.log('progress model load')
        // console.log(progress)
      },
      (error) => {
        console.log('error model load')
        console.log(error)
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
    const { map, scene } = useWebGL()

    map.traverse((item) => {
      if (item instanceof THREE.Mesh) {
        item.material.dispose()
        item.geometry.dispose()

        map.remove(item)
      }
    })

    map.remove(this.floor)
    map.remove(this.buildings)
    map.remove(this.cars)
    map.remove(this.basket)
    map.remove(this.road)
    map.remove(this.lamps)
    map.remove(this.adidasArena)
    map.remove(this.trees)
    map.remove(this.tram)

    this.$raf.remove(`3d`, this.onFrame)

    this.directionalLight.dispose()
    this.directionalLightHelper.dispose()
    this.ambientLight.dispose()

    scene.remove(this.ambientLight)

    if (this.directionalLightIsStatic) {
      map.remove(this.directionalLight)
      map.remove(this.directionalLightHelper)
    } else {
      scene.remove(this.directionalLight)
      scene.remove(this.directionalLightHelper)
    }

    this.guiAmbientLight?.dispose()
    this.guiDirectionalLight?.dispose()
    this.guiDrag?.dispose()
    this.guiModel?.dispose()
  },
  methods: {
    onWheel(e) {
      const { camera } = useWebGL()

      camera.zoom -= e.deltaY * 0.01
      camera.updateProjectionMatrix()
    },
    onFrame() {
      if (!this.model && !this.edgesModel) return
      const { map } = useWebGL()
      this.drag.current = this.lerp(
        this.drag.current,
        this.drag.target,
        this.drag.ease
      )
      const clamp = this.drag.current
      map.rotation.y = clamp
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
      const { camera } = useWebGL()

      this.model = gltf.scene

      console.log('initial model', this.model)

      this.modelMaterial = new THREE.MeshLambertMaterial({
        color: new THREE.Color(0xffffff),
        emissive: new THREE.Color(0xffffff),
        emissiveIntensity: 0.85,
      })

      this.shadowMaterial = new THREE.ShadowMaterial({ color: 0xff00e6 })

      this.initLights()
      this.initFloor()
      this.initBuildings()
      this.initAdidasArena()
      this.initRoad()
      this.initCars()
      this.initTram()
      this.initTrees()
      this.initBasket()
      this.initLamps()

      const cameraModel = gltf.cameras[0]

      camera.position.copy(cameraModel.position)
      camera.rotation.copy(cameraModel.rotation)
      camera.zoom = 15

      camera.updateProjectionMatrix()

      this.initGUI()
    },

    initLights() {
      const { scene, map } = useWebGL()

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
      this.directionalLight.shadow.radius = 2

      this.directionalLight.shadow.camera.near = 1
      this.directionalLight.shadow.camera.far = 1000

      this.directionalLight.shadow.camera.left = -80
      this.directionalLight.shadow.camera.right = 80
      this.directionalLight.shadow.camera.top = 80
      this.directionalLight.shadow.camera.bottom = -80

      if (this.directionalLightIsStatic) {
        map.add(this.directionalLightHelper)
        map.add(this.directionalLight)
      } else {
        scene.add(this.directionalLightHelper)
        scene.add(this.directionalLight)
      }
    },

    initBasket() {
      const { map } = useWebGL()

      this.basket = new THREE.Group()
      map.add(this.basket)

      const basket = this.mergeObject(this.model.getObjectByName('Basket'))
      const basketShadow = this.mergeObject(basket, true)

      const edgeBasket = this.edgeObject(basket)
      const conditionalBasket = this.conditionnalObject(basket)

      this.basket.add(basket)
      this.basket.add(basketShadow)
      this.basket.add(edgeBasket)
      this.basket.add(conditionalBasket)
    },

    initCars() {
      const { map } = useWebGL()

      this.cars = new THREE.Group()
      map.add(this.cars)

      const cars = this.mergeObject(this.model.getObjectByName('Cars'))
      const edgeCars = this.edgeObject(cars)
      const conditionalCars = this.conditionnalObject(cars)

      this.cars.add(cars)
      this.cars.add(edgeCars)
      this.cars.add(conditionalCars)
    },

    initRoad() {
      const { map } = useWebGL()

      this.road = new THREE.Group()
      map.add(this.road)

      const road = this.mergeObject(this.model.getObjectByName('Road'), true)
      // const roadShadow = this.mergeObject(road, true)
      const edgeRoad = this.edgeObject(road)
      const conditionalRoad = this.conditionnalObject(road)

      this.road.add(road)
      // this.road.add(roadShadow)
      this.road.add(edgeRoad)
      this.road.add(conditionalRoad)
    },

    initLamps() {
      const { map } = useWebGL()

      this.lamps = new THREE.Group()
      map.add(this.lamps)

      const lamps = this.mergeObject(this.model.getObjectByName('Lamps'))
      const edgeLamps = this.edgeObject(lamps)
      const conditionalLamps = this.conditionnalObject(lamps)

      this.lamps.add(lamps)
      this.lamps.add(edgeLamps)
      this.lamps.add(conditionalLamps)
    },

    initTram() {
      const { map } = useWebGL()

      this.tram = new THREE.Group()
      map.add(this.tram)

      const tram = this.mergeObject(this.model.getObjectByName('Tram'))
      // const tramShadow = this.mergeObject(tram, true)
      const edgeTram = this.edgeObject(tram)
      const conditionalTram = this.conditionnalObject(tram)

      this.tram.add(tram)
      // this.tram.add(tramShadow)
      this.tram.add(edgeTram)
      this.tram.add(conditionalTram)
    },

    initTrees() {
      const { map } = useWebGL()

      this.trees = new THREE.Group()
      map.add(this.trees)

      const trees = this.mergeObject(this.model.getObjectByName('Trees'))
      const edgeTrees = this.edgeObject(trees)
      const conditionalTrees = this.conditionnalObject(trees)

      this.trees.add(trees)
      this.trees.add(edgeTrees)
      this.trees.add(conditionalTrees)
    },

    initFloor() {
      const { map } = useWebGL()

      this.floor = new THREE.Group()
      map.add(this.floor)

      const floor = this.mergeObject(this.model.getObjectByName('Floor'))
      const shadowFloor = this.mergeObject(floor, true)
      const edgeFloor = this.edgeObject(floor)
      const conditionalFloor = this.conditionnalObject(floor)

      this.floor.add(floor)
      this.floor.add(shadowFloor)
      this.floor.add(edgeFloor)
      this.floor.add(conditionalFloor)
    },

    initBuildings() {
      const { map } = useWebGL()

      this.buildings = new THREE.Group()
      map.add(this.buildings)

      const buildings = this.mergeObject(
        this.model.getObjectByName('Buildings')
      )

      const edgeBuildings = this.edgeObject(buildings)
      const conditionalBuildings = this.conditionnalObject(buildings)

      this.buildings.add(buildings)
      this.buildings.add(edgeBuildings)
      this.buildings.add(conditionalBuildings)
    },

    initAdidasArena() {
      const { map } = useWebGL()

      this.adidasArena = new THREE.Group()
      map.add(this.adidasArena)

      const adidasArena = this.mergeObject(
        this.model.getObjectByName('AdidasArena')
      )

      const edgeAdidasArena = this.edgeObject(adidasArena)
      const conditionalAdidasArena = this.conditionnalObject(adidasArena)

      this.adidasArena.add(adidasArena)
      this.adidasArena.add(edgeAdidasArena)
      this.adidasArena.add(conditionalAdidasArena)
    },

    edgeObject(object) {
      const initialMesh = object.clone()

      const lineGeom = new THREE.EdgesGeometry(initialMesh.geometry, 40)

      const line = new THREE.LineSegments(
        lineGeom,
        new THREE.LineBasicMaterial({ color: '#000000' })
      )
      line.position.copy(initialMesh.position)
      line.scale.copy(initialMesh.scale)
      line.rotation.copy(initialMesh.rotation)
      line.name = 'edge'

      return line
    },

    conditionnalObject(object) {
      const initialMesh = object.clone()

      const mergedGeom = initialMesh.geometry.clone()

      for (let index = 0; index < mergedGeom.attributes.length; index++) {
        if (index !== 'position') {
          mergedGeom.deleteAttribute(index)
        }
      }

      const lineGeom = new ConditionalEdgesGeometry(mergeVertices(mergedGeom))
      const material = new THREE.ShaderMaterial(ConditionalEdgesShader)
      material.uniforms.diffuse.value.set(new THREE.Color('#000000'))

      const mesh = new THREE.LineSegments(lineGeom, material)
      mesh.position.copy(initialMesh.position)
      mesh.scale.copy(initialMesh.scale)
      mesh.rotation.copy(initialMesh.rotation)
      mesh.name = 'conditionnal'

      return mesh
    },

    mergeObject(object, isShadow) {
      object.updateMatrixWorld(true)

      const geometry = []

      object.traverse((child) => {
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
      mesh.name = 'model'

      mesh.castShadow = this.modelCastShadow
      mesh.receiveShadow = this.modelReceiveShadow

      if (isShadow) {
        mesh.material = this.shadowMaterial.clone()
        mesh.isShadow = true
      } else {
        mesh.material = this.modelMaterial.clone()
        mesh.isShadow = false
      }

      // mesh.material.side = THREE.DoubleSide
      mesh.material.polygonOffset = true
      mesh.material.polygonOffsetFactor = 1
      mesh.material.polygonOffsetUnits = 1
      mesh.renderOrder = 3
      mesh.material.needsUpdate = true

      return mesh
    },
    initGUI() {
      const gui = useGUI()

      const { map, scene } = useWebGL()

      this.guiAmbientLight = gui.addFolder({ title: `Ambient Light` })

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
          label: 'Fix',
        })
        .on('change', (e) => {
          if (e.value) {
            scene.remove(this.directionalLight)
            scene.remove(this.directionalLightHelper)

            map.add(this.directionalLight)
            map.add(this.directionalLightHelper)
          } else {
            map.remove(this.directionalLight)
            map.remove(this.directionalLightHelper)

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

      this.guiDrag = gui.addFolder({ title: `Drag` })

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
          map.traverse((child) => {
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
          map.traverse((child) => {
            if (child.isMesh && !child.isShadow) {
              child.receiveShadow = e.value
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
          map.traverse((child) => {
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
          map.traverse((child) => {
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
          map.traverse((child) => {
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
          map.traverse((child) => {
            if (child.isMesh && child.isShadow) {
              child.material.opacity = e.value
            }
          })
        })
    },
    lerp(p1, p2, t) {
      return p1 + (p2 - p1) * t
    },
  },
}
</script>

<style lang="scss">
.app-3d {
  height: 100vh;
  width: 100%;
  position: relative;
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
