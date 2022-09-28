<template>
  <div class="app-3d">
    <div ref="test" class="test"></div>
  </div>
</template>

<script>
// import { gsap } from 'gsap'
import { Observer } from 'gsap/Observer'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DragGesture } from '@use-gesture/vanilla'

import useWebGL from '~/hooks/webgl'
import useGUI from '~/hooks/gui'

export default {
  data() {
    return {
      speed: 1,
      rotation: [0, 0, 0],
      polar: [0, Math.PI / 2],
      azimuth: [-Infinity, Infinity],
      oldDeltaX: 0,
      deltaX: 0,
    }
  },
  computed: {},
  mounted() {
    const gltfLoader = new GLTFLoader()

    gltfLoader.load(
      '/models/map-2.gltf',
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

    const gesture = new DragGesture(
      this.$el,
      ({ active, delta: [x, y] }, ...params) => {}
    )

    console.log(gesture)

    this.observer = Observer.create({
      target: this.$el,
      type: 'touch,pointer',
      onDrag: this.onDrag,
      onDragStart: () => {
        this.onDrag = true
      },
      dragMinimum: 5,
      tolerance: 5,
    })
  },
  beforeDestroy() {
    const { map } = useWebGL()

    map.traverseAncestors((item) => {
      if (item instanceof THREE.Mesh) {
        item.material.dispose()
        item.geometry.dispose()

        map.remove(item)
      }
    })
  },
  methods: {
    initModel(gltf) {
      const { map } = useWebGL()

      const model = gltf.scenes[0]

      map.add(...model.children)

      const material = new THREE.MeshStandardMaterial({})

      map.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material = material.clone()
          child.material.side = THREE.DoubleSide
          child.material.needsUpdate = true
        }
      })

      this.initGUI()
    },
    onDrag(e) {
      // const { map } = useWebGL()
      // console.log('here', e)
      // x = MathUtils.clamp(
      //   oldX + (x / this.$viewport.width) * Math.PI * this.speed,
      //   ...rAzimuth
      // )
      // y = MathUtils.clamp(oldY + (y / this.$viewport.height) * Math.PI * this.speed, ...rPolar)
      // map.rotation.y = y
      // map.rotation.x = x
    },
    initGUI() {
      const { map } = useWebGL()

      const gui = useGUI()
      this.gui = gui.addFolder({ title: `Model` })

      this.gui
        .addInput(map, 'position', {
          x: { step: 1 },
          y: { step: 1 },
          z: { step: 1 },
        })
        .on('change', (e) => {
          map.position.set(e.value.x, e.value.y, e.value.z)
        })

      this.gui
        .addInput(map, 'rotation', {
          x: { step: 0.01, min: -Math.PI * 2, max: Math.PI * 2 },
          y: { step: 0.01, min: -Math.PI * 2, max: Math.PI * 2 },
          z: { step: 0.01, min: -Math.PI * 2, max: Math.PI * 2 },
        })
        .on('change', (e) => {
          map.rotation.x = e.value.x
          map.rotation.y = e.value.y
          map.rotation.z = e.value.z
        })
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
