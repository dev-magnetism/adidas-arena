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
import { ColoredShadowMaterial } from '~/assets/js/webgl/ColoredShadowMaterial'

export default {
  data() {
    return {
      speed: 1,
      rotation: [0, 0, 0],
      polar: [0, Math.PI / 2],
      azimuth: { min: -Math.PI / 1.4, max: Math.PI * 1 },
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
      '/models/map-4.gltf',
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
    const { map } = useWebGL()

    map.traverse((item) => {
      if (item instanceof THREE.Mesh) {
        // item.material.dispose()
        // item.geometry.dispose()

        map.remove(item)
      }
    })

    map.remove(this.floor)
    map.remove(this.buildings)
    map.remove(this.cars)
    map.remove(this.basket)
    map.remove(this.road)
    map.remove(this.lamps)

    this.$raf.remove(`3d`, this.onFrame)

    this.gui?.dispose()
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
      const { camera, scene } = useWebGL()

      this.model = gltf.scene

      console.log('initial model', this.model)

      this.initFloor()
      this.initBuildings()
      // this.initRoad()
      this.initCars()
      // this.initBasket()
      // this.initLamps()

      // this.directionalLight = new THREE.DirectionalLight(0xffffff, 50)
      // this.directionalLight.castShadow = true
      // this.directionalLight.position.set(-100.502, 20.13, 300.036)
      // const helper = new THREE.DirectionalLightHelper(
      //   this.directionalLight,
      //   15,
      //   new THREE.Color('#FF0000')
      // )
      // scene.add(helper)
      // scene.add(this.directionalLight)

      const light = new THREE.PointLight(0xff0000, 1, 10)
      light.position.set(50, 30, 50)
      scene.add(light)
      light.castShadow = true

      const cameraModel = gltf.cameras[0]

      camera.position.copy(cameraModel.position)
      camera.rotation.copy(cameraModel.rotation)
      camera.zoom = 15

      console.log(camera)

      camera.updateProjectionMatrix()

      this.initGUI()
    },

    initBasket() {
      const { map } = useWebGL()

      this.basket = new THREE.Group()
      map.add(this.basket)

      const basket = this.mergeObject(this.model.getObjectByName('Basket'))

      const edgeBasket = this.edgeObject(basket)
      const conditionalBasket = this.conditionnalObject(basket)
      const shadowBasket = this.shadowObject(basket)

      this.basket.add(basket)
      this.basket.add(edgeBasket)
      this.basket.add(conditionalBasket)
      this.basket.add(shadowBasket)

      console.log(this.basket)
    },

    initCars() {
      const { map } = useWebGL()

      this.cars = new THREE.Group()
      map.add(this.cars)

      const cars = this.mergeObject(this.model.getObjectByName('Cars'))
      const edgeCars = this.edgeObject(cars)
      const conditionalCars = this.conditionnalObject(cars)
      // const shadowCars = this.shadowObject(cars)

      this.cars.add(cars)
      this.cars.add(edgeCars)
      this.cars.add(conditionalCars)
      // this.cars.add(shadowCars)
    },

    initRoad() {
      const { map } = useWebGL()

      this.road = new THREE.Group()
      map.add(this.road)

      const road = this.mergeObject(this.model.getObjectByName('Road'))
      const edgeRoad = this.edgeObject(road)
      const conditionalRoad = this.conditionnalObject(road)
      const shadowRoad = this.shadowObject(road)

      this.road.add(road)
      this.road.add(edgeRoad)
      this.road.add(conditionalRoad)
      this.road.add(shadowRoad)
    },

    initLamps() {
      const { map } = useWebGL()

      this.lamps = new THREE.Group()
      map.add(this.lamps)

      const lamps = this.mergeObject(this.model.getObjectByName('Lamps'))
      const edgeLamps = this.edgeObject(lamps)
      const conditionalLamps = this.conditionnalObject(lamps)
      const shadowLamps = this.shadowObject(lamps)

      this.lamps.add(lamps)
      this.lamps.add(edgeLamps)
      this.lamps.add(conditionalLamps)
      this.lamps.add(shadowLamps)
    },

    initFloor() {
      const { map } = useWebGL()

      this.floor = new THREE.Group()
      map.add(this.floor)

      const floor = this.mergeObject(this.model.getObjectByName('Floor'))
      const edgeFloor = this.edgeObject(floor)
      // const conditionalFloor = this.conditionnalObject(floor)
      // const shadowFloor = this.shadowObject(floor)

      this.floor.add(floor)
      this.floor.add(edgeFloor)
      // this.floor.add(conditionalFloor)
      // this.floor.add(shadowFloor)
    },

    initBuildings() {
      const { map } = useWebGL()

      this.buildings = new THREE.Group()
      map.add(this.buildings)

      const buildings = this.mergeObject(
        this.model.getObjectByName('Buildings')
      )

      buildings.geometry.computeBoundingBox()
      const edgeBuildings = this.edgeObject(buildings)
      // const conditionalBuildings = this.conditionnalObject(buildings)
      // const shadowBuildings = this.shadowObject(buildings)

      this.buildings.add(buildings)
      this.buildings.add(edgeBuildings)
      // this.buildings.add(conditionalBuildings)
      // this.buildings.add(shadowBuildings)
    },

    shadowObject(object) {
      const mesh = object.clone()

      console.log(mesh)

      mesh.material = new ColoredShadowMaterial({
        color: new THREE.Color('#ff0000'),
        shininess: 1.0,
      })

      mesh.material.polygonOffset = true
      mesh.material.polygonOffsetFactor = 1
      mesh.material.polygonOffsetUnits = 1
      mesh.receiveShadow = true
      mesh.renderOrder = 2

      mesh.name = 'shadow'

      return mesh
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

    mergeObject(object) {
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
      mesh.castShadow = true
      mesh.receiveShadow = true
      mesh.material = new THREE.MeshBasicMaterial({
        color: new THREE.Color('#ffffff'),
      })
      mesh.material.side = THREE.DoubleSide
      mesh.material.polygonOffset = true
      mesh.material.polygonOffsetFactor = 1
      mesh.material.polygonOffsetUnits = 1
      mesh.renderOrder = 2
      mesh.material.needsUpdate = true

      return mesh
    },
    initGUI() {
      const gui = useGUI()

      this.gui = gui.addFolder({ title: `Model` })

      this.gui.addInput(this, 'azimuth', {
        min: Math.PI * -2,
        max: Math.PI * 2,
        label: 'Clamp rotation',
        step: 0.001,
      })

      this.gui.addInput(this.drag, 'ease', {
        min: 0,
        max: 0.1,
        label: 'Drag ease',
        step: 0.0001,
      })

      this.gui.addInput(this.drag, 'dragSpeed', {
        min: 0,
        max: 0.03,
        label: 'Drag speed',
        step: 0.0001,
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
