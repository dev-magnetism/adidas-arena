import Stats from 'stats.js'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { InteractionManager } from 'three.interactive'
// import { InteractionManager } from '~/assets/js/webgl/InteractiveMouse'
import Raf from '~/plugins/raf'
import Viewport from '~/plugins/viewport'
// import Composer from '~/assets/webgl/composer-three'
import useGUI from '~/hooks/gui'

let gl

class GL {
  constructor() {
    this.scene = new THREE.Scene()

    this.exterior = new THREE.Group()
    this.exterior.name = 'exterior'
    this.exterior.drag = null
    this.scene.add(this.exterior)

    this.interior = new THREE.Group()
    this.interior.name = 'interior'
    this.interior.floors = []
    this.scene.add(this.interior)

    this.gallery = new THREE.Group()
    this.gallery.name = 'gallery'
    this.scene.add(this.gallery)

    this.renderer = new THREE.WebGLRenderer({
      powerPreference: 'high-performance',
      antialias: window.devicePixelRatio !== 2,
      stencil: true,
      precision: 'highp',
      alpha: true,
    })
    this.renderer.localClippingEnabled = true
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    this.scissors = {
      current: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      },
      fullscreen: null,
      hero: null,
    }

    this.calculateScissors()

    this.renderer.setScissorTest(true)

    this.renderer.physicallyCorrectLights = true
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    // THREE.BasicShadowMap
    // THREE.PCFShadowMap (default)
    // THREE.PCFSoftShadowMap
    // THREE.VSMShadowMap

    // this.renderer.outputEncoding = THREE.sRGBEncoding
    // this.renderer.toneMapping = THREE.LinearToneMapping

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

    if (!Viewport.isMobile) {
      this.stats = new Stats()

      document.body.appendChild(this.stats.dom)
    }

    // this.controls = new OrbitControls(
    //   this.camera,
    //   document.getElementById('__nuxt')
    // )
    // this.controls = new OrbitControls(this.camera, this.renderer.domElement)

    this.interactionManager = new InteractionManager(
      this.renderer,
      this.camera,
      document.getElementById('__nuxt')
    )

    this.onWindowResize()

    Viewport.events.on('resize', this.onWindowResize.bind(this))

    this.initGUI()

    Raf.add('webgl', this.update.bind(this), 1)
  }

  calculateScissors() {
    this.layoutMargin = 0.027 // 0.027 = css global variable --layout-margin * 0.01

    this.scissors.fullscreen = {
      x: 0,
      y: 0,
      width: Viewport.width,
      height: Viewport.height,
    }

    this.scissors.hero = {
      x: Viewport.width * this.layoutMargin,
      y: Viewport.width * this.layoutMargin,
      width: Viewport.width - Viewport.width * this.layoutMargin * 2,
      height: Viewport.height - Viewport.width * this.layoutMargin * 2,
    }
  }

  initGUI() {
    const gui = useGUI()

    this.gui = gui.addFolder({ title: `Global`, expanded: false })

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

    this.calculateScissors()

    this.renderer.setSize(Viewport.width, Viewport.height)
    this.camera.updateProjectionMatrix()
  }

  update({ deltaTime }) {
    this.stats?.begin()

    // this.controls.update()

    this.interactionManager.update()

    this.renderer.render(this.scene, this.camera)

    this.stats?.end()
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
