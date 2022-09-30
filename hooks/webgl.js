import Stats from 'stats.js'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import Raf from '~/plugins/raf'
import Viewport from '~/plugins/viewport'
// import Composer from '~/assets/webgl/composer-three'
import useGUI from '~/hooks/gui'

let gl

class GL {
  constructor() {
    this.scene = new THREE.Scene()

    this.map = new THREE.Group()
    this.map.name = 'map'
    this.scene.add(this.map)

    this.gallery = new THREE.Group()
    this.gallery.name = 'gallery'
    this.scene.add(this.gallery)

    this.renderer = new THREE.WebGLRenderer({
      powerPreference: 'high-performance',
      antialias: true,
      stencil: false,
      precision: 'highp',
      alpha: true,
    })

    // this.camera = new THREE.PerspectiveCamera(
    //   45,
    //   Viewport.width / Viewport.height,
    //   0.1,
    //   1000
    // )

    this.camera = new THREE.OrthographicCamera(
      Viewport.width / -2,
      Viewport.width / 2,
      Viewport.height / 2,
      Viewport.height / -2,
      1,
      1000
      // -100000,
      // 100000
    )

    this.camera.lookAt(0, 0, 0)

    this.camera.position.z = 500
    // this.camera.position.y = 0

    // const light = new THREE.PointLight(0xffffff, 1, 250)
    // light.position.set(50, 10, 50)
    // this.scene.add(light)

    this.axesHelper = new THREE.AxesHelper(35)
    this.scene.add(this.axesHelper)

    this.stats = new Stats()

    document.body.appendChild(this.stats.dom)

    // this.controls = new OrbitControls(
    //   this.camera,
    //   document.getElementById('__nuxt')
    // )
    // this.controls = new OrbitControls(this.camera, this.renderer.domElement)

    this.onWindowResize()

    Viewport.events.on('resize', this.onWindowResize.bind(this))

    this.initGUI()

    Raf.add('webgl', this.update.bind(this), 1)
  }

  initGUI() {
    const gui = useGUI()

    this.gui = gui.addFolder({ title: `Global` })

    this.guiCamera = this.gui.addFolder({ title: `Camera` })

    this.guiCamera
      .addInput(this.camera, 'position', {
        x: { step: 1 },
        y: { step: 1 },
        z: { step: 1 },
      })
      .on('change', (e) => {
        this.camera.position.set(e.value.x, e.value.y, e.value.z)

        this.camera.updateProjectionMatrix()
      })

    this.guiCamera
      .addInput(this.camera, 'rotation', {
        x: { step: 0.01, min: -Math.PI * 2, max: Math.PI * 2 },
        y: { step: 0.01, min: -Math.PI * 2, max: Math.PI * 2 },
        z: { step: 0.01, min: -Math.PI * 2, max: Math.PI * 2 },
      })
      .on('change', (e) => {
        this.camera.rotation.x = e.value.x
        this.camera.rotation.y = e.value.y
        this.camera.rotation.z = e.value.z

        this.camera.updateProjectionMatrix()

        console.log(this.camera)
      })

    this.guiCamera
      .addInput(this.camera, 'zoom', {
        min: 0,
        max: 30,
        step: 0.01,
      })
      .on('change', (e) => {
        this.camera.zoom = e.value

        this.camera.updateProjectionMatrix()
      })

    this.guiCamera
      .addInput(this.camera, 'near', {
        min: -100,
        max: 100,
      })
      .on('change', (e) => {
        this.camera.near = e.value

        this.camera.updateProjectionMatrix()
      })

    this.guiCamera
      .addInput(this.camera, 'far', {
        min: 100,
        max: 10000,
      })
      .on('change', (e) => {
        this.camera.far = e.value

        this.camera.updateProjectionMatrix()
      })

    // this.btnExportPosition = this.guiCamera
    //   .addButton({
    //     title: 'Export',
    //     label: 'Position',
    //   })
    //   .on('click', () => {
    //     console.log(camera)
    //   })

    // this.btnExportRotation = this.gui.addButton({
    //   title: 'Export',
    //   label: 'Rotation',
    // })
  }

  onWindowResize() {
    if (this.camera.type === 'OrthographicCamera') {
      this.camera.left = Viewport.width / -2
      this.camera.right = Viewport.width / 2
      this.camera.top = Viewport.height / 2
      this.camera.bottom = Viewport.height / -2
    } else {
      this.camera.aspect = Viewport.width / Viewport.height
    }

    this.camera.updateProjectionMatrix()

    this.renderer.setSize(Viewport.width, Viewport.height)
    // this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  }

  update({ deltaTime }) {
    this.stats.begin()

    // this.controls.update()

    this.renderer.render(this.scene, this.camera)

    this.stats.end()
  }

  destroy() {
    this.guiCamera.dispose()
    this.gui.dispose()

    Viewport.events.off('resize', this.onWindowResize.bind(this))

    Raf.remove('webgl', this.update.bind(this))
  }
}

const WebGL = () => {
  return gl || (gl = new GL())
}

export default WebGL
