<template>
  <div class="app-webgl-interior" />
</template>

<script>
import { gsap } from 'gsap'
import { Observer } from 'gsap/Observer'

import { mapState, mapMutations } from 'vuex'

import {
  mergeBufferGeometries,
  mergeVertices,
} from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { MeshLineMaterial } from 'meshline'

import useWebGL from '~/hooks/webgl'
import useGUI from '~/hooks/gui'

import loaderManager from '~/assets/js/loaderManager'

import { ConditionalEdgesGeometry } from '~/assets/js/webgl/ConditionalEdgesGeometry'
import { ConditionalEdgesShader } from '~/assets/js/webgl/ConditionalEdgesShader'

export default {
  data() {
    return {
      colors: {
        ambientLightColor: new THREE.Color(0xf1e7d9),
        directionalLightColor: new THREE.Color(0xffffff),
        lambertMaterialColor: new THREE.Color(0xf1e7d9),
        lambertMaterialEmissive: new THREE.Color(0xffffff),
        outlineColor: new THREE.Color(0x000000),
        shadowColor: new THREE.Color(0xfbe7c9),
        lambertMaterialColorSelected: new THREE.Color(0x39000c),
        lambertMaterialEmissiveSelected: new THREE.Color(0x00df03),
        shadowColorSelected: new THREE.Color(0xf52ce3),
        arrowColor: new THREE.Color(0xff4a48),
        logoColor: new THREE.Color(0x000000),
      },
      rotation: [0, 0, 0],
      polar: [0, Math.PI / 2],
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
      modelsVisible: {
        rdc: true,
        first: true,
        second: true,
        third: true,
        fourth: true,
      },
    }
  },
  computed: {
    ...mapState({
      modelInteriorLoaded: (state) => state.modelInteriorLoaded,
      allLoadedActual: (state) => state.allLoadedActual,
      interiorVisible: (state) => state.interiorVisible,
    }),
  },
  watch: {
    modelInteriorLoaded() {
      console.log('loaded')
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
    const { interior } = useWebGL()

    this.cloud?.material?.dispose()
    this.cloud?.geometry?.dispose()

    interior.traverse((item) => {
      if (item instanceof THREE.Mesh || item instanceof THREE.Line) {
        item.geometry?.dispose()

        interior.remove(item)
      }
    })

    interior.remove(this.floor)
    interior.remove(this.groundFloor)
    interior.remove(this.footField)
    interior.remove(this.levelOne)
    interior.remove(this.levelTwo)
    interior.remove(this.levelThree)
    interior.remove(this.levelFour)

    // MATERIAL
    this.shadowMaterial?.dispose()
    this.modelMaterial?.dispose()
    this.conditionalMaterial?.dispose()
    this.lineMaterial?.dispose()

    this.gui?.dispose()
    this.guiDrag?.dispose()
    this.guiZoom?.dispose()

    // this.observer?.kill()
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
      this.initGroundFloor()
      this.initLevelOne()
      this.initLevelTwo()
      // this.initLevelThree()
      this.initLevelFour()
      this.initFootField()

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

    initGUI() {
      const gui = useGUI()

      this.gui = gui.addFolder({ title: `Interior` })

      const { camera } = useWebGL()

      this.gui
        .addInput(camera, 'position', {
          x: { step: 1 },
          y: { step: 1 },
          z: { step: 1 },
        })
        .on('change', (payload) => {
          const { value } = payload
          camera.position.copy(value)

          camera.zoom = 50

          console.log(camera)

          camera.updateProjectionMatrix()
        })

      this.gui
        .addInput(this.modelsVisible, 'rdc', { label: 'RDC' })
        .on('change', (payload) => {
          this.groundFloor.visible = payload.value
        })

      this.gui
        .addInput(this.modelsVisible, 'first', { label: 'First Floor' })
        .on('change', (payload) => {
          this.levelOne.visible = payload.value
        })

      this.gui
        .addInput(this.modelsVisible, 'second', { label: 'Second Floor' })
        .on('change', (payload) => {
          this.levelTwo.visible = payload.value
        })

      this.gui
        .addInput(this.modelsVisible, 'third', { label: 'Third Floor' })
        .on('change', (payload) => {
          this.levelThree.visible = payload.value
        })

      this.gui
        .addInput(this.modelsVisible, 'fourth', { label: 'Fourth Floor' })
        .on('change', (payload) => {
          this.levelFour.visible = payload.value
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

      console.log(this.cameras, this.cameraBase)

      camera.position.copy(this.cameraBase.position)
      camera.rotation.copy(this.cameraBase.rotation)
      // camera.zoom = 15

      camera.updateProjectionMatrix()
    },

    initMaterials() {
      this.modelMaterial = new THREE.MeshLambertMaterial({
        color: this.colors.lambertMaterialColor,
        emissive: this.colors.lambertMaterialEmissive,
        emissiveIntensity: 0.7,
      })

      this.shadowMaterial = new THREE.ShadowMaterial({
        color: this.colors.shadowColor,
        transparent: true,
      })

      this.conditionalMaterial = new THREE.ShaderMaterial(
        ConditionalEdgesShader
      )
      this.conditionalMaterial.uniforms.diffuse.value.set(
        this.colors.outlineColor
      )

      this.lineMaterial = new MeshLineMaterial({
        color: this.colors.outlineColor,
        sizeAttenuation: 0.5,
        transparent: true,
        resolution: new THREE.Vector2(
          this.$viewport.width,
          this.$viewport.height
        ),
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
      shadowFootField.material = this.shadowMaterial.clone()
      shadowFootField.isShadow = true

      const conditionalFootFied = this.conditionalObject(footField)

      this.footField.add(footField)
      this.footField.add(shadowFootField)
      this.footField.add(conditionalFootFied)
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
      shadowFloor.material = this.shadowMaterial.clone()
      shadowFloor.isShadow = true

      const conditionalFloor = this.conditionalObject(floor)

      this.floor.add(floor)
      this.floor.add(shadowFloor)
      this.floor.add(conditionalFloor)
    },
    initGroundFloor() {
      const { interior } = useWebGL()

      this.groundFloor = new THREE.Group()
      this.groundFloor.name = 'groundFloor'
      interior.add(this.groundFloor)

      const groundFloorGroup = this.model
        .getObjectByName('Arene')
        .getObjectByName('RDC')

      const groundFloor = this.mergeObject(groundFloorGroup)

      // const shadowGroundFloor = groundFloor.clone()
      // shadowGroundFloor.name = 'shadowModel'
      // shadowGroundFloor.material = this.shadowMaterial.clone()
      // shadowGroundFloor.isShadow = true

      const edgeGroundFloor = this.edgeObject(groundFloor)
      const conditionalFloor = this.conditionalObject(groundFloor)

      this.groundFloor.add(groundFloor)
      // this.groundFloor.add(shadowGroundFloor)
      this.groundFloor.add(edgeGroundFloor)
      this.groundFloor.add(conditionalFloor)
    },
    initLevelOne() {
      const { interior } = useWebGL()

      this.levelOne = new THREE.Group()
      this.levelOne.name = 'levelOne'
      interior.add(this.levelOne)

      const levelOneGroup = this.model
        .getObjectByName('Arene')
        .getObjectByName('NIveau_1')

      const levelOne = this.mergeObject(levelOneGroup)

      // const shadowGroundFloor = levelOne.clone()
      // shadowGroundFloor.name = 'shadowModel'
      // shadowGroundFloor.material = this.shadowMaterial.clone()
      // shadowGroundFloor.isShadow = true

      const edgeGroundFloor = this.edgeObject(levelOne)
      const conditionalFloor = this.conditionalObject(levelOne)

      this.levelOne.add(levelOne)
      // this.levelOne.add(shadowGroundFloor)
      this.levelOne.add(edgeGroundFloor)
      this.levelOne.add(conditionalFloor)
    },

    initLevelTwo() {
      const { interior } = useWebGL()

      this.levelTwo = new THREE.Group()
      this.levelTwo.name = 'levelTwo'
      interior.add(this.levelTwo)

      const levelTwoGroup = this.model
        .getObjectByName('Arene')
        .getObjectByName('Niveau_2')

      const levelTwo = this.mergeObject(levelTwoGroup)

      // const shadowGroundFloor = levelTwo.clone()
      // shadowGroundFloor.name = 'shadowModel'
      // shadowGroundFloor.material = this.shadowMaterial.clone()
      // shadowGroundFloor.isShadow = true

      const edgeGroundFloor = this.edgeObject(levelTwo)
      const conditionalFloor = this.conditionalObject(levelTwo)

      this.levelTwo.add(levelTwo)
      // this.levelTwo.add(shadowGroundFloor)
      this.levelTwo.add(edgeGroundFloor)
      this.levelTwo.add(conditionalFloor)
    },

    initLevelThree() {
      const { interior } = useWebGL()

      this.levelThree = new THREE.Group()
      this.levelThree.name = 'levelThree'
      interior.add(this.levelThree)

      const levelThreeGroup = this.model
        .getObjectByName('Arene')
        .getObjectByName('Niveau_3')

      const levelThree = this.mergeObject(levelThreeGroup)

      // const shadowGroundFloor = levelThree.clone()
      // shadowGroundFloor.name = 'shadowModel'
      // shadowGroundFloor.material = this.shadowMaterial.clone()
      // shadowGroundFloor.isShadow = true

      const edgeGroundFloor = this.edgeObject(levelThree)
      const conditionalFloor = this.conditionalObject(levelThree)

      this.levelThree.add(levelThree)
      // this.levelThree.add(shadowGroundFloor)
      this.levelThree.add(edgeGroundFloor)
      this.levelThree.add(conditionalFloor)
    },

    initLevelFour() {
      const { interior } = useWebGL()

      this.levelFour = new THREE.Group()
      this.levelFour.name = 'levelFour'
      interior.add(this.levelFour)

      const levelFourGroup = this.model
        .getObjectByName('Arene')
        .getObjectByName('Niveau_4')

      const levelFour = this.mergeObject(levelFourGroup)

      // const shadowGroundFloor = levelFour.clone()
      // shadowGroundFloor.name = 'shadowModel'
      // shadowGroundFloor.material = this.shadowMaterial.clone()
      // shadowGroundFloor.isShadow = true

      const edgeGroundFloor = this.edgeObject(levelFour)
      const conditionalFloor = this.conditionalObject(levelFour)

      this.levelFour.add(levelFour)
      // this.levelFour.add(shadowGroundFloor)
      this.levelFour.add(edgeGroundFloor)
      this.levelFour.add(conditionalFloor)
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
    lerp(p1, p2, t) {
      return p1 + (p2 - p1) * t
    },
    ...mapMutations({}),
  },
}
</script>
