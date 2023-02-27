<template>
  <div />
</template>

<script>
import { gsap } from 'gsap'
import { Observer } from 'gsap/Observer'

import { mapState, mapMutations } from 'vuex'

import {
  mergeBufferGeometries,
  mergeVertices,
} from 'three/examples/jsm/utils/BufferGeometryUtils.js'

import {
  Color,
  Matrix4,
  Object3D,
  Mesh,
  Line,
  Vector3,
  MeshLambertMaterial,
  MeshBasicMaterial,
  ShadowMaterial,
  ShaderMaterial,
  LineBasicMaterial,
  Group,
  InstancedMesh,
  DynamicDrawUsage,
  AmbientLight,
  DirectionalLight,
  Box3,
  BoxGeometry,
  EdgesGeometry,
  LineSegments,
} from 'three/build/three.module.js'

import useWebGL from '~/hooks/webgl'
import useGUI from '~/hooks/gui'

import loaderManager from '~/assets/js/loaderManager'

import { ConditionalEdgesGeometry } from '~/assets/js/webgl/ConditionalEdgesGeometry'
import { ConditionalEdgesShader } from '~/assets/js/webgl/ConditionalEdgesShader'

export default {
  data() {
    return {
      colors: {
        ambientLightColor: new Color(0xf1e7d9),
        directionalLightColor: new Color(0xffffff),
        lambertMaterialColor: new Color(0xd8d8d8),
        lambertMaterialEmissive: new Color(0xefefef),
        emissiveIntensity: 0.75,
        outlineColor: new Color(0x161616),
        shadowColor: new Color(0xede5db),
        arrowColor: new Color(0xe2540f),
        logoColor: new Color(0x161616),
      },
      azimuth: { min: -1.5, max: 0.9 },
      cloudsParams: {
        speed: 0.003,
      },
      drag: {
        ease: 0.04,
        current: 0,
        target: 0,
        last: 0,
        speed: 2,
        dragSpeed: 0.0025,
        enabled: true,
      },
      homeCustomPosition: {
        x: -0.0105,
        z: -0.0115,
      },
      zoom: {
        initial: this.$viewport.isMobile ? 12 : 18,
        current: this.$viewport.isMobile ? 12 : 18,
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
      speedCars: 0.00004,
      timeTrams: 0,
      speedTrams: 0.00015,
      delayRepeatTrams: 2,
      currentIntersect: null,
      speedClouds: [],
      directionClouds: [],
      matrix: new Matrix4(),
      dummy: new Object3D(),
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
      // this.initCloudsNew()
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
    exterior.zoom = this.zoom

    this.onResize()

    if (this.allLoadedActual) {
      this.initExterior()
      this.initClouds()
      // this.initCloudsNew()
      this.initGUI()
      this.resetView()
    }

    this.observer = Observer.create({
      axis: 'x',
      target: this.$nuxt.$el,
      type: 'touch,pointer,wheel',
      onDrag: this.onDrag,
      onDragStart: (e) => {
        if (e.axis === 'x') this.setAllowScroll(false)
      },
      onDragEnd: (e) => {
        if (e.axis === 'x') this.setAllowScroll(true)
      },
      dragMinimum: 10,
      lockAxis: true,
      tolerance: 5,
    })

    this.$viewport.events.on('resize', this.onResize)
    this.$nuxt.$on('reset:exterior', this.resetView)
    this.$raf.add(`webgl-exterior`, this.onFrame)
  },
  beforeDestroy() {
    const { exterior } = useWebGL()

    exterior.traverse((item) => {
      if ((item instanceof Mesh || item instanceof Line) && !item.isGroup) {
        item.geometry?.dispose()

        exterior.remove(item)
      }
    })

    exterior.remove(this.floor)
    exterior.remove(this.cars)
    exterior.remove(this.trams)
    // exterior.remove(this.cloudsBasic)
    // exterior.remove(this.cloudsEdge)
    exterior.remove(this.clouds)
    this.adidasArena.remove(this.hitbox)
    exterior.remove(this.adidasArena)
    exterior.remove(this.arrow)
    exterior.remove(this.logoArena)
    exterior.remove(this.staticObjects)
    exterior.remove(this.staticObjectsConditionalRender)

    // MATERIAL
    this.shadowMaterial?.dispose()
    this.modelMaterial?.dispose()
    this.conditionalMaterial?.dispose()
    this.lineMaterial?.dispose()
    this.logoMaterial?.dispose()
    this.arrowMaterial?.dispose()

    // LIGHTS
    this.ambientLight.dispose()
    exterior.remove(this.ambientLight)
    this.directionalLight.dispose()
    exterior.remove(this.directionalLight)

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

    this.observer?.kill()
    this.$viewport.events.off('resize', this.onResize)
    this.$nuxt.$off('reset:exterior', this.resetView)
    this.$raf.remove(`webgl-exterior`, this.onFrame)
  },
  methods: {
    onResize() {
      const { exterior } = useWebGL()

      const x = this.homeCustomPosition.x * this.$viewport.width
      const z = this.homeCustomPosition.z * this.$viewport.width

      exterior.homeCustomPosition = new Vector3(x, 0, z)

      if (!this.exteriorFullwidth && !this.$viewport.isMobile) {
        exterior.position.copy(exterior.homeCustomPosition)
      } else if (this.exteriorFullwidth && !this.$viewport.isMobile) {
        exterior.position.copy(new Vector3(0, 0, 0))
      } else {
        exterior.position.copy(new Vector3(0, 0, 0))
      }
    },
    onDrag(e) {
      if (!this.drag.enabled || !this.exteriorVisible) return

      const allowDrag = e.event.target.getAttribute('data-allow-drag')

      if (!allowDrag || allowDrag === null) return

      const delta = e.deltaX * this.drag.dragSpeed

      this.drag.target = gsap.utils.clamp(
        this.azimuth.min,
        this.azimuth.max,
        this.drag.target + delta
      )
    },
    onFrame({ time, deltaTime, frame, deltaRatio }) {
      if (!this.exteriorVisible) return

      const { exterior, raycaster } = useWebGL()

      if (this.adidasArena?.basicObjectRaycast && this.exteriorFullwidth) {
        const intersects = raycaster.intersectObject(
          this.adidasArena.basicObjectRaycast,
          false
        )

        if (intersects.length) {
          if (!this.currentIntersect) {
            this.onMouseEnterArena()
          }

          this.currentIntersect = intersects[0]
        } else {
          if (this.currentIntersect) {
            this.onMouseLeaveArena()
          }

          this.currentIntersect = null
        }
      }

      // this.planesGroup?.children?.forEach((plane, index) => {
      //   // this.cloudsBasic.getMatrixAt(index, this.matrix)
      //   // this.matrix.decompose(
      //   //   this.dummy.position,
      //   //   this.dummy.quaternion,
      //   //   this.dummy.scale
      //   // )
      //   // const positionZ = this.directionClouds[index]
      //   //   ? this.dummy.position.z -
      //   //     this.speedClouds[index] * this.cloudsParams.speed
      //   //   : this.dummy.position.z +
      //   //     this.speedClouds[index] * this.cloudsParams.speed
      //   // this.dummy.position.z = gsap.utils.wrap(100, -100, positionZ)
      //   // this.dummy.updateMatrix()
      //   // this.cloudsBasic.setMatrixAt(index, this.dummy.matrix)
      //   // this.cloudsBasic.instanceMatrix.needsUpdate = true
      // })

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
      const progressTrams = this.timeTrams % this.delayRepeatTrams

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
      this.initStaticObjectsConditionalRender()
      this.initFloor()
      this.initAdidasArena()
      this.initLogoArena()
      this.initCars()
      this.initTrams()
      this.initArrow()
    },
    onClickArena() {
      // if (!this.exteriorFullwidth || !this.exteriorVisible) return
      // console.log('clickedd', this.exteriorFullwidth)
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
      // console.log('click')
    },
    onMouseEnterArena() {
      if (!this.exteriorFullwidth || !this.exteriorVisible) return

      this.setCursorState('hover')

      this.tweenArrowTranslate?.timeScale(2.5)
      this.setExteriorArenaHovered(true)
    },
    onMouseLeaveArena() {
      if (!this.exteriorFullwidth || !this.exteriorVisible) return

      this.setCursorState('hide')

      this.tweenArrowTranslate?.timeScale(1)
      this.setExteriorArenaHovered(false)
    },
    initCamera() {
      const { exterior } = useWebGL()

      this.camera = loaderManager
        .getModel('exterior')
        .scene.getObjectByName('Camera_Zoom')

      exterior.initialCamera = { ...this.camera }
    },
    initMaterials() {
      this.modelMaterial = new MeshLambertMaterial({
        color: this.colors.lambertMaterialColor,
        emissive: this.colors.lambertMaterialEmissive,
        emissiveIntensity: this.colors.emissiveIntensity,
      })

      this.logoMaterial = new MeshBasicMaterial({
        color: this.colors.logoColor,
      })

      this.arrowMaterial = new MeshLambertMaterial({
        color: this.colors.arrowColor,
        emissive: this.colors.arrowColor,
        emissiveIntensity: this.colors.emissiveIntensity,
      })

      this.shadowMaterial = new ShadowMaterial({
        color: this.colors.shadowColor,
        transparent: true,
        opacity: 0.75,
      })

      this.conditionalMaterial = new ShaderMaterial(ConditionalEdgesShader)
      this.conditionalMaterial.clipping = false
      this.conditionalMaterial.uniforms.diffuse.value.set(
        this.colors.outlineColor
      )

      this.lineMaterial = new LineBasicMaterial({
        color: this.colors.outlineColor,
        linewidth: 1,
      })
      this.lineMaterial.fog = false
    },
    initClouds() {
      const { exterior } = useWebGL()
      this.clouds = new Group()
      this.clouds.name = 'clouds'
      exterior.add(this.clouds)

      this.gltfCloud = loaderManager.getModel('cloud').scene

      const cloud = this.mergeObject(this.gltfCloud)
      const edgeCloud = this.edgeObject(cloud)
      const conditionalCloud = this.conditionalObject(cloud)

      this.cloud = new Group()
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
    initCloudsNew() {
      const { exterior } = useWebGL()

      this.gltfCloud = loaderManager.getModel('cloud').scene
      this.planesGroup = this.gltfExterior.getObjectByName('Plane')

      const cloud = this.mergeObject(this.gltfCloud)
      // const edgeCloud = this.edgeObject(cloud)
      // const conditionalCloud = this.conditionalObject(cloud)

      this.cloudsBasic = new InstancedMesh(
        cloud.geometry,
        this.modelMaterial,
        this.planesGroup.children.length - 1
      )

      this.cloudsBasic.instanceMatrix.setUsage(DynamicDrawUsage)

      exterior.add(this.cloudsBasic)

      this.planesGroup.children.forEach((plane, index) => {
        const randomParallax = this.genRand(1, 10, 2)

        this.speedClouds.push(randomParallax)
        this.directionClouds.push(Math.random() < 0.5)

        this.dummy.position = plane.position.clone()
        this.dummy.updateMatrix()

        this.cloudsBasic.setMatrixAt(index, this.dummy.matrix)
      })
    },
    resetView() {
      this.setExteriorVisible(true)

      const { exterior, camera } = useWebGL()

      this.drag.current = 0
      this.drag.target = 0
      this.drag.last = 0

      camera.position.copy(exterior.initialCamera.position)
      camera.rotation.copy(exterior.initialCamera.rotation)
      camera.zoom = this.zoom.initial

      camera.updateProjectionMatrix()

      this.onResize()
    },
    initLights() {
      const { exterior } = useWebGL()

      this.ambientLight = new AmbientLight(this.colors.ambientLightColor)
      exterior.add(this.ambientLight)

      this.directionalLight = new DirectionalLight(
        this.colors.directionalLightColor,
        1
      )
      this.directionalLight.castShadow = true

      // this.directionalLight.position.set(-30, 50, 100) // near
      this.directionalLight.position.set(-100, 150, 300) // far

      this.directionalLight.shadow.mapSize.width = this.$viewport.isMobile
        ? 1024
        : window.devicePixelRatio !== 2
        ? 2048
        : 1024

      this.directionalLight.shadow.mapSize.height = this.$viewport.isMobile
        ? 1024
        : window.devicePixelRatio !== 2
        ? 2048
        : 1024

      this.directionalLight.shadow.camera.near = 1
      this.directionalLight.shadow.camera.far = 1000

      const size = this.$viewport.isMobile ? 50 : 85

      this.directionalLight.shadow.camera.left = size * -1
      this.directionalLight.shadow.camera.right = size * 1
      this.directionalLight.shadow.camera.top = size * 1
      this.directionalLight.shadow.camera.bottom = size * -1

      exterior.add(this.directionalLight)
    },
    initLogoArena() {
      const { exterior } = useWebGL()

      this.logoArena = new Group()

      exterior.add(this.logoArena)

      const logoArenaGroup = this.gltfExterior.getObjectByName('Logo_Arena')

      const logoArena = this.mergeObject(logoArenaGroup)
      logoArena.material = this.logoMaterial
      this.logoArena.add(logoArena)
    },
    initArrow() {
      const { exterior } = useWebGL()

      this.arrow = new Group()

      exterior.add(this.arrow)

      const arrowGroup = this.gltfExterior.getObjectByName('Arrow_001')

      const arrow = this.mergeObject(arrowGroup)
      arrow.material = this.arrowMaterial
      arrow.material.flatShading = true
      arrow.castShadow = true
      arrow.receiveShadow = true

      const edgeArrow = this.edgeObject(arrow)

      this.arrow.add(arrow)
      this.arrow.add(edgeArrow)

      this.tweenArrowTranslate = gsap.to(this.arrow.position, {
        y: 2,
        repeat: -1,
        yoyo: true,
        duration: 1,
      })
    },
    initTrams() {
      const { exterior } = useWebGL()

      this.trams = new Group()
      this.trams.name = 'trams'

      const tramRight = this.gltfExterior.getObjectByName('Tram_001')
      this.initTram(tramRight)

      const tramLeft = this.gltfExterior.getObjectByName('Tram_002')
      this.initTram(tramLeft)

      exterior.add(this.trams)
    },
    initTram(object) {
      const tramGroup = new Group()
      tramGroup.name = 'tram'

      const tramObject = object.children.find((obj) =>
        obj.name.includes('Tram')
      )
      const startMesh = object.children.find((obj) => obj.name.includes('part'))
      const finalMesh = object.children.find((obj) => obj.name.includes('nale'))

      tramGroup.startPosition = startMesh.position
        .clone()
        .sub(tramObject.position)
      tramGroup.finalPosition = finalMesh.position
        .clone()
        .sub(tramObject.position)

      const tram = this.mergeObject(tramObject)
      const edgeTram = this.edgeObject(tram)

      tramGroup.add(tram)
      tramGroup.add(edgeTram)

      tramGroup.position.copy(tramGroup.startPosition)

      this.trams.add(tramGroup)
    },
    initCars() {
      const { exterior } = useWebGL()

      this.cars = new Group()
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
      const carGroup = new Group()
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

      this.staticObjects = new Group()
      this.staticObjects.name = 'staticObjects'
      exterior.add(this.staticObjects)

      const group = new Group()

      const buildings = this.gltfExterior.getObjectByName('Buildings')
      group.add(buildings.clone())

      const tramStructure = this.gltfExterior.getObjectByName('Tram_Structure')
      group.add(tramStructure.clone())

      const road = this.gltfExterior.getObjectByName('Road')
      group.add(road.clone())

      const floorArena = this.gltfExterior.getObjectByName('Floor_Arena')
      group.add(floorArena.clone())

      const model = this.mergeObject(group)
      const edge = this.edgeObject(model)

      this.staticObjects.add(model)
      this.staticObjects.add(edge)
    },
    initStaticObjectsConditionalRender() {
      const { exterior } = useWebGL()

      this.staticObjectsConditionalRender = new Group()
      this.staticObjectsConditionalRender.name =
        'staticObjectsConditionalRender'
      exterior.add(this.staticObjectsConditionalRender)

      const group = new Group()

      const lamps = this.gltfExterior.getObjectByName('Lamps')
      group.add(lamps.clone())

      const trees = this.gltfExterior.getObjectByName('Trees')
      group.add(trees.clone())

      const footField = this.gltfExterior.getObjectByName('FootField')
      group.add(footField.clone())

      const model = this.mergeObject(group)
      const edge = this.edgeObject(model)
      const conditional = this.conditionalObject(model)

      this.staticObjectsConditionalRender.add(model)
      this.staticObjectsConditionalRender.add(edge)
      this.staticObjectsConditionalRender.add(conditional)
    },
    initFloor() {
      const { exterior } = useWebGL()

      this.floor = new Group()
      this.floor.name = 'floor'
      this.floor.position.y = -0.025
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

      this.adidasArena = new Group()
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

      const bounding = new Box3().setFromObject(adidasArenaGroup)

      const geometry = new BoxGeometry(1, 1, 1)

      const material = new MeshBasicMaterial({ color: 0xff0000 })
      this.hitbox = new Mesh(geometry, material)
      this.hitbox.visible = false

      const widthBox = Math.abs(bounding.min.x - bounding.max.x)
      const heightBox = Math.abs(bounding.min.y - bounding.max.y)
      const depthBox = Math.abs(bounding.min.z - bounding.max.z)

      this.hitbox.scale.set(widthBox, heightBox, depthBox)
      this.hitbox.position.x = -4
      this.hitbox.position.y = heightBox / 2

      this.adidasArena.basicObjectRaycast = this.hitbox
      this.adidasArena.add(this.hitbox)
    },
    edgeObject(object) {
      const mergedGeom = object.geometry

      const lineGeom = new EdgesGeometry(mergedGeom, this.thresholdAngle)
      const material = this.lineMaterial

      const line = new LineSegments(lineGeom, material)
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

      const mesh = new LineSegments(lineGeom, material)
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

      const mesh = new Mesh(mergedGeometry)

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

      this.gui = gui.addFolder({
        title: `Exterior`,
        expanded: false,
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

      this.guiModel.addInput(this, 'delayRepeatTrams', {
        min: 1,
        max: 10,
        step: 0.1,
        label: 'Delay Repeat Trams',
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

      this.guiColors.addInput(this.colors, 'emissiveIntensity', {
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
      setExteriorVisible: 'setExteriorVisible',
      setCursorState: 'setCursorState',
      setAllowScroll: 'setAllowScroll',
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
