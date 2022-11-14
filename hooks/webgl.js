import Stats from 'stats.js'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
// import { InteractionManager } from 'three.interactive'
// import { InteractionManager } from '~/assets/js/webgl/InteractiveMouse'
import Raf from '~/plugins/raf'
import Viewport from '~/plugins/viewport'
// import Composer from '~/assets/webgl/composer-three'
import useGUI from '~/hooks/gui'

let gl

// const guiObject = {
//   shadowMapType: 0,
// }

class GL {
  constructor() {
    this.scene = new THREE.Scene()

    this.exterior = new THREE.Group()
    this.exterior.name = 'exterior'
    this.scene.add(this.exterior)

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

    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    this.renderer.physicallyCorrectLights = true

    //  basic: THREE.BasicShadowMap,
    //  default: THREE.PCFShadowMap,
    //  PCFSoft: THREE.PCFSoftShadowMap

    // this.renderer.outputEncoding = THREE.sRGBEncoding
    // this.renderer.toneMapping = THREE.LinearToneMapping

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

    this.gui
      .addInput(this.camera, 'near', {
        min: -100,
        max: 100,
        label: 'Camera near',
      })
      .on('change', (e) => {
        this.camera.near = e.value

        this.camera.updateProjectionMatrix()
      })

    this.gui
      .addInput(this.camera, 'far', {
        min: 100,
        max: 10000,
        label: 'Camera far',
      })
      .on('change', (e) => {
        this.camera.far = e.value

        this.camera.updateProjectionMatrix()
      })

    this.gui.addSeparator()

    this.gui.addInput(this.renderer, 'physicallyCorrectLights')

    // this.gui
    //   .addInput(guiObject, 'shadowMapType', {
    //     options: {
    //       default: 0,
    //       basic: 1,
    //       PCFSoft: 2,
    //       VSMS: 3,
    //     },
    //   })
    //   .on('change', (e) => {
    //     console.log(e.value)
    //     if (e.value === 0) {
    //       this.renderer.shadowMap.type = THREE.PCFShadowMap
    //     } else if (e.value === 1) {
    //       this.renderer.shadowMap.type = THREE.BasicShadowMap
    //     } else if (e.value === 2) {
    //       this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    //     } else if (e.value === 3) {
    //       this.renderer.shadowMap.type = THREE.VSMShadowMap
    //     }
    //   })
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
    this.gui?.dispose()

    Viewport.events.off('resize', this.onWindowResize.bind(this))

    Raf.remove('webgl', this.update.bind(this))
  }
}

const WebGL = () => {
  return gl || (gl = new GL())
}

export default WebGL
