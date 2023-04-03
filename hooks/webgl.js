import {
  Vector2,
  Raycaster,
  Group,
  WebGLRenderer,
  OrthographicCamera,
  PCFSoftShadowMap,
  BasicShadowMap,
  PCFShadowMap,
  VSMShadowMap,
  Scene,
  NoToneMapping,
  LinearToneMapping,
  ReinhardToneMapping,
  CineonToneMapping,
  ACESFilmicToneMapping,
  LinearEncoding,
  sRGBEncoding,
  WebGLRenderTarget,
  // ColorManagement,
} from 'three'

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'

import Stats from 'stats.js'

import { LayerShader } from '~/assets/webgl/layerShader'

import Raf from '~/plugins/raf'
import Viewport from '~/plugins/viewport'
import useGUI from '~/hooks/gui'

let gl

class GL {
  constructor() {
    this.scene = new Scene()

    this.exterior = new Group()
    this.exterior.name = 'exterior'
    this.exterior.drag = null
    this.scene.add(this.exterior)

    this.interior = new Group()
    this.interior.name = 'interior'
    this.scene.add(this.interior)

    this.gallery = new Group()
    this.gallery.name = 'gallery'
    this.scene.add(this.gallery)

    // ColorManagement.enabled = true

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

    this.camera = new OrthographicCamera(
      Viewport.width / -2,
      Viewport.width / 2,
      Viewport.height / 2,
      Viewport.height / -2,
      1,
      1000
    )
    this.camera.lookAt(0, 0, 0)
    this.camera.position.z = 500

    this.dpr = Math.min(window.devicePixelRatio, 2)

    this.renderer = new WebGLRenderer({
      precision: 'highp',
      powerPreference: 'high-performance',
      antialias: this.dpr < 2,
      stencil: false,
      alpha: true,
    })

    this.isWebgl2 = this.renderer.capabilities.isWebGL2
    this.maxSamples = this.renderer.capabilities.maxSamples

    this.renderer.localClippingEnabled = true
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = PCFSoftShadowMap
    // BasicShadowMap (Very performant but lousy quality)
    // PCFShadowMap (default) (Less performant but smoother edges)
    // PCFSoftShadowMap (best) (Less performant but even softer edges)
    // VSMShadowMap (Less performant, more constraints, can have unexpected results)

    this.renderer.useLegacyLights = false
    // this.renderer.outputEncoding = sRGBEncoding
    // this.renderer.toneMapping = LinearToneMapping
    this.renderer.setPixelRatio(this.dpr)
    this.renderer.setScissorTest(true)

    this.renderTarget = new WebGLRenderTarget(800, 600, {
      // samples: this.dpr < 2 ? this.maxSamples : 0,
      samples: this.dpr < 2 ? 6 : 0, //
    })

    this.composer = new EffectComposer(this.renderer, this.renderTarget)
    this.composer.setPixelRatio(this.dpr)

    this.renderPass = new RenderPass(this.scene, this.camera)
    this.composer.addPass(this.renderPass)

    this.layerPass = new ShaderPass(LayerShader)
    this.composer.addPass(this.layerPass)

    // /!\ POST PROCESSING FROM PMDRS /!\
    // /!\ POST PROCESSING FROM PMDRS /!\

    // this.composer = new EffectComposer(this.renderer, {
    //   frameBufferType: HalfFloatType,
    //   multisampling:
    //     this.isWebgl2 && this.dpr < 2
    //       ? this.maxSamples
    //       : 0,
    // })
    // this.renderPass = new RenderPass(this.scene, this.camera)
    // this.composer.addPass(this.renderPass)

    // if (!this.isWebgl2 && this.dpr < 2) {
    //   this.SMAAEffect = new SMAAEffect({
    //     blendFunction: BlendFunction.NORMAL,
    //     preset: SMAAPreset.MEDIUM,
    //     edgeDetectionMode: EdgeDetectionMode.COLOR,
    //     predicationMode: PredicationMode.DEPTH,
    //   })

    //   const edgeDetectionMaterial = this.SMAAEffect.edgeDetectionMaterial
    //   edgeDetectionMaterial.edgeDetectionThreshold = 0.02
    //   edgeDetectionMaterial.predicationThreshold = 0.002
    //   edgeDetectionMaterial.predicationScale = 1

    //   this.SMAAPass = new EffectPass(this.camera, this.SMAAEffect)
    //   this.composer.addPass(this.SMAAPass)
    // }

    // /!\ POST PROCESSING FROM PMDRS /!\
    // /!\ POST PROCESSING FROM PMDRS /!\

    if (process.env.NODE_ENV === 'development') {
      if (!Viewport.isMobile) {
        this.stats = new Stats()

        document.body.appendChild(this.stats.dom)
      }
    }

    this.raycaster = new Raycaster()

    this.mouse = new Vector2()

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

    this.gui
      .addInput(this.renderer, 'outputEncoding', {
        options: {
          LinearEncoding,
          sRGBEncoding,
        },
      })
      .on('change', (e) => {
        this.renderer.outputEncoding = e.value
      })

    this.gui
      .addInput(this.renderer, 'toneMapping', {
        options: {
          NoToneMapping,
          LinearToneMapping,
          ReinhardToneMapping,
          CineonToneMapping,
          ACESFilmicToneMapping,
        },
      })
      .on('change', (e) => {
        this.renderer.toneMapping = e.value
      })

    this.gui
      .addInput(this.renderer, 'toneMappingExposure', {
        min: 0,
        max: 10,
        step: 0.001,
      })
      .on('change', (e) => {
        this.renderer.toneMappingExposure = e.value
      })

    this.gui.addSeparator()

    this.gui
      .addInput(this.renderer.shadowMap, 'type', {
        options: {
          PCFSoftShadowMap,
          BasicShadowMap,
          PCFShadowMap,
          VSMShadowMap,
        },
        label: 'Shadow Type',
      })
      .on('change', (e) => {
        this.renderer.shadowMap.type = e.value
      })

    this.gui.addInput(this.renderer, 'useLegacyLights')

    this.gui.addSeparator()

    this.gui.addInput(this.layerPass.material.uniforms.uOpacity, 'value', {
      min: 0,
      max: 1,
      label: 'Layer Opacity',
    })
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
    this.composer.setSize(Viewport.width, Viewport.height)
  }

  update({ deltaTime }) {
    this.stats?.begin()

    this.raycaster?.setFromCamera(this.mouse, this.camera)

    // this.renderer?.render(this.scene, this.camera)
    this.composer?.render()

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
