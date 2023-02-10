// import Stats from 'stats.js'
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
    // THREE.PCFSoftShadowMap (best)
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

    // if (!Viewport.isMobile) {
    //   this.stats = new Stats()

    //   document.body.appendChild(this.stats.dom)
    // }

    this.raycaster = new THREE.Raycaster()

    this.mouse = new THREE.Vector2()

    window.addEventListener('mousemove', this.onMouseMove.bind(this))

    this.onWindowResize()

    Viewport.events.on('resize', this.onWindowResize.bind(this))

    this.initGUI()

    Raf.add('webgl', this.update.bind(this), 1)
  }

  onMouseMove(event) {
    this.mouse.x = (event.clientX / Viewport.width) * 2 - 1
    this.mouse.y = -(event.clientY / Viewport.height) * 2 + 1
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
  }

  onWindowResize() {
    this.calculateScissors()

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
  }

  update({ deltaTime }) {
    this.stats?.begin()

    this.raycaster?.setFromCamera(this.mouse, this.camera)

    this.renderer?.render(this.scene, this.camera)

    this.stats?.end()
  }

  destroy() {
    this.gui?.dispose()

    window.addEventListener('mousemove', this.onMouseMove.bind(this))
    Viewport.events.off('resize', this.onWindowResize.bind(this))

    Raf.remove('webgl', this.update.bind(this))
  }
}

const WebGL = () => {
  return gl || (gl = new GL())
}

export default WebGL
