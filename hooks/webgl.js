// import Stats from 'stats.js'

import Raf from '~/plugins/raf'
import Viewport from '~/plugins/viewport'
// import Composer from '~/assets/webgl/composer-three'
// import useGUI from '~/hooks/gui'

let gl

class GL {
  constructor() {
    this.scene = new THREE.Scene()

    this.gallery = new THREE.Group()
    this.gallery.name = 'gallery'
    this.scene.add(this.gallery)

    this.renderer = new THREE.WebGLRenderer({
      powerPreference: 'high-performance',
      antialias: true,
      stencil: false,
      depth: false,
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
    )

    this.camera.position.z = 1

    this.onWindowResize()

    Viewport.events.on('resize', this.onWindowResize.bind(this))

    // this.initGUI()

    Raf.add('webgl', this.update.bind(this), 1)
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
    this.renderer.render(this.scene, this.camera)
  }

  destroy() {
    // this.gui.dispose()

    Viewport.events.off('resize', this.onWindowResize.bind(this))

    Raf.remove('webgl', this.update.bind(this))
  }
}

const WebGL = () => {
  return gl || (gl = new GL())
}

export default WebGL
