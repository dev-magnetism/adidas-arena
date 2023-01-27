<template>
  <div class="app-webgl-exterior grid-inner">
    <EEnterArena
      :class="{ hide: !exteriorArenaHovered || !exteriorFullwidth }"
    />
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
      colors: {
        ambientLightColor: new THREE.Color(0xf1e7d9),
        directionalLightColor: new THREE.Color(0xffffff),
        lambertMaterialColor: new THREE.Color(0xf1e7d9),
        lambertMaterialEmissive: new THREE.Color(0xffffff),
        outlineColor: new THREE.Color(0x000000),
        shadowColor: new THREE.Color(0xfbe7c9),
        arrowColor: new THREE.Color(0xff4a48),
        logoColor: new THREE.Color(0x000000),
      },
      rotation: [0, 0, 0],
      polar: [0, Math.PI / 2],
      azimuth: { min: -Math.PI / 1.4, max: Math.PI * 1 },
      directionalLightCastShadow: true,
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
        enabled: true,
      },
      zoom: {
        initial: 12.5,
        current: 12.5,
        range: {
          min: 5,
          max: 30,
        },
      },
      indexArrowPosition: null,
      thresholdAngle: 40,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
      timeCars: 0,
      speedCars: 0.00005,
      timeTrams: 0,
      speedTrams: 0.0005,
    }
  },
  computed: {
    ...mapState({
      modelExteriorLoaded: (state) => state.modelExteriorLoaded,
      modelCloudLoaded: (state) => state.modelCloudLoaded,
      allLoadedActual: (state) => state.allLoadedActual,
      exteriorVisible: (state) => state.exteriorVisible,
      exteriorArenaHovered: (state) => state.exteriorArenaHovered,
      exteriorFullwidth: (state) => state.exteriorFullwidth,
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
    const { exterior } = useWebGL()

    exterior.drag = this.drag

    if (this.allLoadedActual) {
      this.initExterior()
      this.initClouds()
      this.initGUI()
    }

    this.observer = Observer.create({
      target: this.$nuxt.$el,
      type: 'touch,pointer,wheel',
      onDrag: this.onDrag,
      dragMinimum: 5,
      tolerance: 5,
    })

    this.$raf.add(`webgl-exterior`, this.onFrame)
  },
  beforeDestroy() {
    const { exterior, scene, interactionManager } = useWebGL()

    this.cloud?.material?.dispose()
    this.cloud?.geometry?.dispose()

    exterior.traverse((item) => {
      if (item instanceof THREE.Mesh || item instanceof THREE.Line) {
        item.geometry?.dispose()

        exterior.remove(item)
      }
    })

    exterior.remove(this.floor)
    exterior.remove(this.cars)
    exterior.remove(this.trams)
    exterior.remove(this.clouds)
    exterior.remove(this.adidasArena)
    exterior.remove(this.arrow)
    exterior.remove(this.logoArena)
    exterior.remove(this.staticObjects)

    // MATERIAL
    this.shadowMaterial?.dispose()
    this.modelMaterial?.dispose()
    this.conditionalMaterial?.dispose()
    this.lineMaterial?.dispose()
    this.logoMaterial?.dispose()
    this.arrowMaterial?.dispose()

    // LIGHTS
    this.ambientLight.dispose()
    scene.remove(this.ambientLight)

    this.directionalLight.dispose()

    if (this.directionalLightIsStatic) {
      exterior.remove(this.directionalLight)
    } else {
      scene.remove(this.directionalLight)
    }

    // GUI
    this.gui?.dispose()
    this.guiAmbientLight?.dispose()
    this.guiDirectionalLight?.dispose()
    this.guiDrag?.dispose()
    this.guiModel?.dispose()
    this.guiZoom?.dispose()
    this.guiClouds?.dispose()
    this.guiColors?.dispose()

    // TWEEN
    this.tweenArrowTranslate?.kill()
    this.tweenZoom?.kill()

    // GLOBAL
    this.adidasArena.removeEventListener('mouseenter', this.onMouseEnterArena)
    this.adidasArena.removeEventListener('mouseleave', this.onMouseLeaveArena)
    this.adidasArena.removeEventListener('click', this.onClickArena)
    interactionManager.remove(this.adidasArena)

    this.observer?.kill()
    this.$raf.remove(`webgl-exterior`, this.onFrame)
  },
  methods: {
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
      if (!this.exteriorVisible) return

      const { exterior } = useWebGL()

      this.clouds?.children?.forEach((cloud) => {
        const z = cloud.direction
          ? cloud.position.z - cloud.coefParallax * this.cloudsParams.speed
          : cloud.position.z + cloud.coefParallax * this.cloudsParams.speed
        cloud.position.z = gsap.utils.wrap(100, -100, z)
      })

      this.timeCars += deltaTime * this.speedCars
      const progressCars = this.timeCars % 1

      this.cars?.children?.forEach((car) => {
        car.position.x = this.mapRange(
          0,
          1,
          progressCars,
          car.startPosition.x,
          car.finalPosition.x
        )

        car.position.z = this.mapRange(
          0,
          1,
          progressCars,
          car.startPosition.z,
          car.finalPosition.z
        )
      })

      this.timeTrams += deltaTime * this.speedTrams
      const progressTrams = this.timeTrams % 1

      this.trams?.children?.forEach((tram) => {
        tram.position.x = this.mapRange(
          0,
          1,
          progressTrams,
          tram.startPosition.x,
          tram.finalPosition.x
        )

        tram.position.z = this.mapRange(
          0,
          1,
          progressTrams,
          tram.startPosition.z,
          tram.finalPosition.z
        )
      })

      this.drag.current = this.lerp(
        this.drag.current,
        this.drag.target,
        this.drag.ease
      )

      exterior.rotation.y = this.drag.current

      this.drag.last = this.drag.current
    },
    initExterior() {
      this.model = loaderManager.getModel('exterior')
      this.gltfExterior = this.model.scene

      this.initCamera()
      this.initMaterials()
      this.initLights()

      this.initStaticObjects()
      this.initFloor()
      this.initAdidasArena()
      this.initLogoArena()
      this.initCars()
      this.initTrams()
      this.initArrow()

      this.initEvents()
    },

    initEvents() {
      const { interactionManager } = useWebGL()
      interactionManager.add(this.adidasArena)
      this.adidasArena.addEventListener('click', this.onClickArena)
      this.adidasArena.addEventListener('mouseenter', this.onMouseEnterArena)
      this.adidasArena.addEventListener('mouseleave', this.onMouseLeaveArena)
    },
    onClickArena() {
      // const { camera } = useWebGL()

      // const params = {
      //   duration: 1,
      //   ease: 'power2.inOut',
      // }

      // gsap.to(camera.position, {
      //   y: 78,
      //   ...params,
      // })

      // gsap.to(camera.rotation, {
      //   x: THREE.MathUtils.degToRad(-158.06),
      //   y: THREE.MathUtils.degToRad(36.86),
      //   z: THREE.MathUtils.degToRad(166.84),
      //   ...params,
      // })

      // gsap.to(camera, {
      //   zoom: 28,
      //   ...params,
      //   onUpdate: () => {
      //     camera.updateProjectionMatrix()
      //   },
      // })

      console.log('click')
    },
    onMouseEnterArena() {
      if (!this.exteriorFullwidth) return

      document.documentElement.style.cursor = 'pointer'

      this.tweenArrowTranslate?.timeScale(2.5)
      this.setExteriorArenaHovered(true)
    },

    onMouseLeaveArena() {
      if (!this.exteriorFullwidth) return

      document.documentElement.style.cursor = 'initial'

      this.tweenArrowTranslate?.timeScale(1)
      this.setExteriorArenaHovered(false)
    },
    initCamera() {
      const { camera, exterior } = useWebGL()

      this.camera = loaderManager
        .getModel('exterior')
        .scene.getObjectByName('Camera_Zoom')

      exterior.initialCamera = { ...this.camera }

      camera.position.copy(this.camera.position)
      camera.rotation.copy(this.camera.rotation)
      camera.zoom = this.zoom.current
      camera.updateProjectionMatrix()

      exterior.zoom = this.zoom
    },

    initMaterials() {
      this.modelMaterial = new THREE.MeshLambertMaterial({
        color: this.colors.lambertMaterialColor,
        emissive: this.colors.lambertMaterialEmissive,
        emissiveIntensity: 0.7,
      })

      this.logoMaterial = new THREE.MeshBasicMaterial({
        color: this.colors.logoColor,
      })

      this.arrowMaterial = new THREE.MeshLambertMaterial({
        color: this.colors.arrowColor,
        emissive: this.colors.arrowColor,
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

      this.lineMaterial = new THREE.LineBasicMaterial({
        color: this.colors.outlineColor,
        linewidth: 1,
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
        object.coefParallax = this.genRand(1, 10, 2)
        object.direction = Math.random() < 0.5
        object.position.copy(plane.position)
        object.initialPosition = object.position

        this.clouds.add(object)
      })
    },
    initLights() {
      const { exterior, scene } = useWebGL()

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
        exterior.add(this.directionalLight)
      } else {
        scene.add(this.directionalLight)
      }
    },
    initLogoArena() {
      const { exterior } = useWebGL()

      this.logoArena = new THREE.Group()

      exterior.add(this.logoArena)

      const logoArenaGroup = this.gltfExterior.getObjectByName('Logo_Arena')

      const logoArena = this.mergeObject(logoArenaGroup)
      logoArena.material = this.logoMaterial
      this.logoArena.add(logoArena)
    },
    initArrow() {
      const { exterior } = useWebGL()

      this.arrow = new THREE.Group()

      exterior.add(this.arrow)

      const arrowGroup = this.gltfExterior.getObjectByName('Arrow_001')

      const arrow = this.mergeObject(arrowGroup)
      arrow.material = this.arrowMaterial
      arrow.castShadow = true
      arrow.receiveShadow = true

      const edgeArrow = this.edgeObject(arrow)
      const conditionalArrow = this.conditionalObject(arrow)

      this.arrow.add(arrow)
      this.arrow.add(edgeArrow)
      this.arrow.add(conditionalArrow)

      this.tweenArrowTranslate = gsap.to(this.arrow.position, {
        y: 2,
        repeat: -1,
        yoyo: true,
        duration: 1,
      })

      arrow.material.flatShading = true
    },
    initTrams() {
      const { exterior } = useWebGL()

      this.trams = new THREE.Group()
      this.trams.name = 'trams'

      const tramRight = this.gltfExterior.getObjectByName('Tram_001')
      this.initTram(tramRight)

      const tramLeft = this.gltfExterior.getObjectByName('Tram_002')
      this.initTram(tramLeft)

      exterior.add(this.trams)
    },
    initTram(object) {
      const tramGroup = new THREE.Group()
      tramGroup.name = 'tram'

      const tramObject = object.children.find((obj) =>
        obj.name.includes('Tram')
      )
      const startMesh = object.children.find((obj) => obj.name.includes('part'))
      const finalMesh = object.children.find((obj) => obj.name.includes('nale'))

      tramGroup.startPosition = startMesh.position.clone()
      // .sub(tramObject.position)
      tramGroup.finalPosition = finalMesh.position.clone()
      // .sub(tramObject.position)

      const tram = this.mergeObject(tramObject)
      const edgeTram = this.edgeObject(tram)
      const conditionalTram = this.conditionalObject(tram)

      tramGroup.add(tram)
      tramGroup.add(edgeTram)
      tramGroup.add(conditionalTram)

      tramGroup.position.copy(tramGroup.startPosition)

      this.trams.add(tramGroup)
    },
    initCars() {
      const { exterior } = useWebGL()

      this.cars = new THREE.Group()
      exterior.add(this.cars)

      const carsGroup = this.gltfExterior.getObjectByName('Cars')

      carsGroup.children.forEach((car, index) => {
        // if (index > 0) return

        this.initCar(car)
      })
    },
    mapRange(inMin, inMax, input, outMin, outMax) {
      return ((input - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
    },
    initCar(object) {
      const carGroup = new THREE.Group()
      carGroup.name = 'car'

      const carObject = object.children.find((obj) => obj.type === 'Object3D')
      const startMesh = object.children.find((obj) => obj.name.includes('part'))
      const finalMesh = object.children.find((obj) => obj.name.includes('nale'))

      carGroup.startPosition = startMesh.position
        .clone()
        .sub(carObject.position)
      carGroup.finalPosition = finalMesh.position
        .clone()
        .sub(carObject.position)

      const car = this.mergeObject(carObject)
      const edgeCar = this.edgeObject(car)
      const conditionalCar = this.conditionalObject(car)

      carGroup.add(car)
      carGroup.add(edgeCar)
      carGroup.add(conditionalCar)

      carGroup.position.copy(carGroup.startPosition)

      this.cars.add(carGroup)
    },
    initStaticObjects() {
      const { exterior } = useWebGL()

      this.staticObjects = new THREE.Group()
      this.staticObjects.name = 'staticObjects'
      exterior.add(this.staticObjects)

      const group = new THREE.Group()

      const buildings = this.gltfExterior.getObjectByName('Buildings')
      group.add(buildings.clone())

      const lamps = this.gltfExterior.getObjectByName('Lamps')
      group.add(lamps.clone())

      const trees = this.gltfExterior.getObjectByName('Trees')
      group.add(trees.clone())

      const footField = this.gltfExterior.getObjectByName('FootField')
      group.add(footField.clone())

      const tramStructure = this.gltfExterior.getObjectByName('Tram_2')
      group.add(tramStructure.clone())

      const road = this.gltfExterior.getObjectByName('Road')
      group.add(road.clone())

      const model = this.mergeObject(group)
      const edge = this.edgeObject(model)
      const conditional = this.conditionalObject(model)

      this.staticObjects.add(model)
      this.staticObjects.add(edge)
      this.staticObjects.add(conditional)
    },
    initFloor() {
      const { exterior } = useWebGL()

      this.floor = new THREE.Group()
      this.floor.name = 'floor'
      this.floor.position.y = -0.01
      exterior.add(this.floor)

      const floorGroup = this.gltfExterior.getObjectByName('Floor')

      const floor = this.mergeObject(floorGroup)

      const shadowFloor = floor.clone()
      shadowFloor.name = 'shadowModel'
      shadowFloor.material = this.shadowMaterial

      floor.castShadow = false
      floor.receiveShadow = false

      this.floor.add(floor)
      this.floor.add(shadowFloor)
    },
    initAdidasArena() {
      const { exterior } = useWebGL()

      this.adidasArena = new THREE.Group()
      this.adidasArena.name = 'AdidasArena'
      this.adidasArena.position.y = 0.01

      exterior.add(this.adidasArena)

      const adidasArenaGroup = this.gltfExterior.getObjectByName('Arena_00')

      const adidasArena = this.mergeObject(adidasArenaGroup)
      const edgeAdidasArena = this.edgeObject(adidasArena)
      const conditionalAdidasArena = this.conditionalObject(adidasArena)

      this.adidasArena.add(adidasArena)
      this.adidasArena.add(edgeAdidasArena)
      this.adidasArena.add(conditionalAdidasArena)
    },
    edgeObject(object) {
      const mergedGeom = object.geometry

      const lineGeom = new THREE.EdgesGeometry(mergedGeom, this.thresholdAngle)
      const material = this.lineMaterial

      const line = new THREE.LineSegments(lineGeom, material)
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
    initGUI() {
      const gui = useGUI()

      const { exterior, scene } = useWebGL()

      this.gui = gui.addFolder({
        title: `Exterior`,
        expanded: true,
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

      this.guiDirectionalLight = this.gui.addFolder({
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

            exterior.add(this.directionalLight)
          } else {
            exterior.remove(this.directionalLight)

            scene.add(this.directionalLight)
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
        max: 2,
        step: 0.01,
        label: 'Intensity',
      })

      this.guiDirectionalLight
        .addInput(this.directionalLight.shadow.camera, 'near', {
          min: 0,
          max: 1,
          step: 0.01,
          label: 'Near Shadow Camera',
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
          label: 'Far Shadow Camera',
        })
        .on('change', (e) => {
          this.directionalLight.shadow.camera.far = e.value

          this.directionalLight.shadow.camera.updateProjectionMatrix()
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

      this.guiClouds = this.gui.addFolder({ title: `Clouds`, expanded: false })

      this.guiClouds.addInput(this.cloudsParams, 'speed', {
        min: 0.0025,
        max: 0.25,
        label: 'Speed ',
        step: 0.001,
      })

      this.guiModel = this.gui.addFolder({ title: `Model`, expanded: false })

      this.guiModel.addInput(this, 'speedCars', {
        min: 0.000001,
        max: 0.0005,
        step: 0.000001,
        label: 'Speed Cars',
      })

      this.guiModel.addInput(this, 'speedTrams', {
        min: 0.00001,
        max: 0.002,
        step: 0.00001,
        label: 'Speed Trams',
      })

      this.guiModel.addInput(exterior, 'position', {
        x: { step: 1, max: 1000, min: -1000 },
        y: { step: 1, max: 1000, min: -1000 },
        z: { step: 1, max: 1000, min: -1000 },
        label: 'Position',
      })

      this.guiColors = this.gui.addFolder({ title: `Colors`, expanded: true })

      this.guiColors
        .addInput(this.colors, 'outlineColor', {
          color: { type: 'float' },
          label: 'Outline color',
        })
        .on('change', (e) => {
          this.lineMaterial.color = e.value

          this.conditionalMaterial.uniforms.diffuse.value.set(e.value)
        })

      this.guiColors.addSeparator()

      this.guiColors.addInput(this.modelMaterial, 'color', {
        color: { type: 'float' },
        label: 'Color',
      })

      this.guiColors.addInput(this.modelMaterial, 'emissive', {
        color: { type: 'float' },
        label: 'Emissive',
      })

      this.guiColors.addInput(this.modelMaterial, 'emissiveIntensity', {
        min: 0,
        max: 1,
        step: 0.01,
        label: 'Color intensity',
      })

      this.guiColors.addSeparator()

      this.guiColors.addInput(this.logoMaterial, 'color', {
        color: { type: 'float' },
        label: 'Logo Color',
      })

      this.guiColors.addSeparator()

      this.guiColors.addInput(this.arrowMaterial, 'color', {
        color: { type: 'float' },
        label: 'Arrow Color',
      })

      this.guiColors.addInput(this.arrowMaterial, 'emissive', {
        color: { type: 'float' },
        label: 'Arrow Emissive',
      })

      this.guiColors.addSeparator()

      this.guiColors.addInput(this.shadowMaterial, 'color', {
        color: { type: 'float' },
        label: 'Shadow color',
      })

      this.guiColors.addInput(this.shadowMaterial, 'opacity', {
        min: 0,
        max: 1,
        step: 0.01,
        label: 'Shadow color opacity',
      })
    },
    ...mapMutations({
      setExteriorArenaHovered: 'setExteriorArenaHovered',
    }),
    lerp(p1, p2, t) {
      return p1 + (p2 - p1) * t
    },
    genRand(min, max, decimalPlaces = 0) {
      const rand = Math.random() * (max - min) + min
      const power = Math.pow(10, decimalPlaces)
      return Math.floor(rand * power) / power
    },
  },
}
</script>

<style lang="scss">
.app-webgl-exterior {
  height: 100%;
  width: 100%;
  position: fixed;
}
</style>
