<template>
  <div class="app-3d">
    <!-- <div ref="test" class="test"></div> -->
  </div>
</template>

<script>
import { gsap } from 'gsap'
import { Observer } from 'gsap/Observer'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
// import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import {
  mergeBufferGeometries,
  mergeVertices,
} from 'three/examples/jsm/utils/BufferGeometryUtils.js'
// import { LineSegmentsGeometry } from 'three/examples/jsm/lines/LineSegmentsGeometry.js'
// import { LineSegments2 } from 'three/examples/jsm/lines/LineSegments2.js'
// import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js'

// import { OutsideEdgesGeometry } from '~/assets/js/webgl/OutsideEdgesGeometry'

import useWebGL from '~/hooks/webgl'
import useGUI from '~/hooks/gui'

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
        dragSpeed: 0.01,
      },
    }
  },
  computed: {},
  mounted() {
    // this.dracoLoader = new DRACOLoader()
    // this.dracoLoader.setDecoderPath('three/examples/js/libs/draco/')

    this.gltfLoader = new GLTFLoader()
    // this.gltfLoader.setDRACOLoader(this.dracoLoader)

    this.gltfLoader.load(
      '/models/map-3.gltf',
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
      type: 'touch,pointer',
      onDrag: this.onDrag,
      dragMinimum: 5,
      tolerance: 5,
    })

    this.$raf.add(`3d`, this.onFrame)
  },
  beforeDestroy() {
    const { map } = useWebGL()

    this.model.traverse((item) => {
      if (item instanceof THREE.Mesh) {
        item.material.dispose()
        item.geometry.dispose()

        this.model.remove(item)
      }
    })
    this.edgesModel.traverse((item) => {
      if (item instanceof THREE.Mesh) {
        item.material.dispose()
        item.geometry.dispose()

        this.edgesModel.remove(item)
      }
    })

    map.remove(this.model)
    map.remove(this.edgesModel)

    this.$raf.remove(`3d`, this.onFrame)

    this.gui?.dispose()
  },
  methods: {
    onFrame() {
      if (!this.model && !this.edgesModel) return
      const { scene } = useWebGL()
      this.drag.current = this.lerp(
        this.drag.current,
        this.drag.target,
        this.drag.ease
      )
      const clamp = this.drag.current
      scene.rotation.y = clamp
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
    mergeObject(object) {
      object.updateMatrixWorld(true)

      const geometry = []
      object.traverse((c) => {
        if (c.isMesh) {
          const g = c.geometry
          g.applyMatrix4(c.matrixWorld)
          for (const key in g.attributes) {
            if (key !== 'position' && key !== 'normal') {
              g.deleteAttribute(key)
            }
          }
          geometry.push(g.toNonIndexed())
        }
      })

      const mergedGeometries = mergeBufferGeometries(geometry, false)
      const mergedGeometry = mergeVertices(mergedGeometries).center()

      const group = new THREE.Group()
      const mesh = new THREE.Mesh(mergedGeometry)
      group.add(mesh)
      return group
    },

    initModel(gltf) {
      const { camera, map } = useWebGL()

      this.model = gltf.scene
      // this.model = this.mergeObject(gltf.scene)

      map.add(this.model)

      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color('#ffffff'),
      })

      this.model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material = material
          child.material.side = THREE.DoubleSide
          child.material.needsUpdate = true
          child.material.polygonOffset = true
          child.material.polygonOffsetFactor = 1
          child.material.polygonOffsetUnits = 1
          child.renderOrder = 2
        }
      })

      const cameraModel = gltf.cameras[0]

      camera.position.copy(cameraModel.position)
      camera.rotation.copy(cameraModel.rotation)
      camera.zoom = 15

      camera.updateProjectionMatrix()

      this.initEdgesModel()

      // this.initConditionalModel()

      this.initGUI()
    },

    initEdgesModel() {
      const { map } = useWebGL()

      this.edgesModel = this.model.clone()
      map.add(this.edgesModel)

      // const material = new LineMaterial({
      //   color: new THREE.Color('#ffffff'),
      //   linewidth: 3,
      // })

      const meshes = []
      this.edgesModel.traverse((c) => {
        if (c.isMesh) {
          meshes.push(c)
        }
      })

      for (const key in meshes) {
        const mesh = meshes[key]
        const parent = mesh.parent

        const lineGeom = new THREE.EdgesGeometry(mesh.geometry, 40)

        const line = new THREE.LineSegments(
          lineGeom,
          new THREE.LineBasicMaterial({ color: new THREE.Color('#000000') })
        )
        line.position.copy(mesh.position)
        line.scale.copy(mesh.scale)
        line.rotation.copy(mesh.rotation)

        // const thickLineGeom = new LineSegmentsGeometry().fromEdgesGeometry(
        //   lineGeom
        // )
        // const thickLines = new LineSegments2(
        //   thickLineGeom,
        //   new LineMaterial({ color: new THREE.Color('#ffffff'), linewidth: 1 })
        // )
        // thickLines.position.copy(mesh.position)
        // thickLines.scale.copy(mesh.scale)
        // thickLines.rotation.copy(mesh.rotation)

        parent.remove(mesh)
        parent.add(line)
        // parent.add(thickLines)
      }
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
