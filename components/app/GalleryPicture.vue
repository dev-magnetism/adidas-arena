<template>
  <div class="app-arena-gallery-picture">
    <nuxt-picture
      v-if="!content.isVideo"
      ref="picture"
      provider="directus"
      :src="content.picture"
      format="webp"
      :alt="content.alt"
      sizes="sm:50vw md:100vw"
      @load="onLoad"
    />
    <div v-else />
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { gsap } from 'gsap'
import {
  RepeatWrapping,
  PlaneGeometry,
  ShaderMaterial,
  Vector2,
  FrontSide,
  Mesh,
  Vector3,
  MeshBasicMaterial,
  TextureLoader,
  VideoTexture,
} from 'three'

import boundingRect from '@/mixins/bounding-rect-webgl-gallery'
import useWebGL from '~/hooks/webgl'

import vertexShader from '~/assets/webgl/gallery-picture/vertex.glsl'
import fragmentShader from '~/assets/webgl/gallery-picture/fragment.glsl'

export default {
  mixins: [boundingRect],
  props: {
    index: {
      type: Number,
      require: true,
      default: 0,
    },
    content: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      open: false,
      corners: [],
      outlineSize: 0.3,
      cornerSizeInitial: 2,
      cornerSize: 8,
    }
  },
  watch: {
    open(newVal) {
      if (newVal) {
        this.focusPicture()
      } else {
        this.unFocusPicture()
      }
    },
  },
  mounted() {
    if (this.content.isVideo) this.initTexture()
  },

  beforeDestroy() {
    const { gallery } = useWebGL()

    this.texture?.dispose()
    this.mesh?.geometry.dispose()
    this.mesh?.material.dispose()

    this.mesh.children.forEach((el) => {
      el.geometry.dispose()

      this.mesh.remove(el)
    })

    this.materialBorder?.dispose()

    gallery.remove(this.mesh)
  },

  methods: {
    onLoad(e) {
      this.currentSrc = e.currentTarget.currentSrc

      this.initTexture()
    },
    async initTexture() {
      if (this.content.isVideo) {
        this.texture = await this.loadTextureVideo(this.content.video)
      } else {
        this.texture = await this.loadTexture(this.currentSrc)
      }

      this.texture.wrapS = this.texture.wrapT = RepeatWrapping

      this.initMesh()
    },
    hidePicture() {
      if (this.content.isVideo) this.texture.image.pause()

      gsap.to(this.material.uniforms.uThreshold, {
        value: 0.65,
        ease: 'power1.inOut',
        duration: 0.25,
      })
    },
    appearPicture() {
      if (this.content.isVideo) this.texture.image.play()

      gsap.to(this.material.uniforms.uThreshold, {
        value: 0,
        ease: 'power1.inOut',
        duration: 0.25,
      })
    },
    focusPicture() {
      this.mesh.renderOrder = 2
      this.setCursorState('hide')

      this.corners.forEach((el) => {
        el.visible = true
      })

      const ratio = this.mesh.scale.x / this.mesh.scale.y

      const windowHeight = this.$viewport.height * 0.8
      const windowWidth = this.$viewport.width * 0.9

      let finalWidth = windowHeight * ratio

      let height

      if (finalWidth > windowWidth) {
        finalWidth = windowWidth
        height = finalWidth / ratio
      } else {
        height = windowHeight
      }

      this.tlFocusPicture?.kill()

      this.tlFocusPicture = gsap
        .timeline({ delay: 0.1 })
        .addLabel('appear')
        .to(
          this.mesh.scale,
          {
            x: finalWidth,
            y: height,
            duration: 0.75,
            ease: 'power3.out',
            onUpdate: () => {
              this.corners.forEach((el) => {
                el.scale.set(this.cornerSize, this.cornerSize, 1)
                el.scale.divide(this.mesh.scale)
              })
            },
          },
          'appear'
        )
        .to(
          this.mesh.position,
          {
            z: 0,
            duration: 0.9,
            ease: 'power4.out',
          },
          'appear'
        )
        .to(
          this.mesh._uOffset,
          {
            x: -this.mesh.position.x,
            y: -this.mesh.position.y,
            duration: 0.9,
            ease: 'power4.out',
          },
          'appear'
        )
        .to(
          this.materialBorder,
          {
            opacity: 1,
            duration: 0.75,
            ease: 'power3.out',
          },
          'appear'
        )
        .to(
          this.mesh.material.uniforms.uResolutionEl.value,
          {
            x: finalWidth,
            y: height,
            duration: 0.75,
            ease: 'power3.out',
          },
          'appear'
        )

        .to(
          this.mesh.material.uniforms.uZoom,
          {
            value: 1,
            duration: 0.65,
            ease: 'power2.out',
          },
          'appear'
        )
    },
    unFocusPicture() {
      this.mesh.renderOrder = 0

      this.setCursorState('slider')

      this.tlFocusPicture?.kill()

      this.tlFocusPicture = gsap
        .timeline({})
        .addLabel('disappear')
        .to(
          this.mesh._uOffset,
          {
            x: 0,
            y: 0,
            duration: 0.9,
            ease: 'power4.out',
          },
          'disappear'
        )

        .to(
          this.mesh.position,
          {
            z: this.mesh.initialPosition.z,
            duration: 0.9,
            ease: 'power4.out',
          },
          'disappear'
        )
        .to(
          this.mesh.scale,
          {
            x: this.mesh.initialScale.x,
            y: this.mesh.initialScale.y,
            duration: 0.75,
            ease: 'power3.out',
            onUpdate: () => {
              this.corners.forEach((el) => {
                el.scale.set(2, 2, 1)
                el.scale.divide(this.mesh.scale)
              })
            },
          },
          'disappear'
        )
        .to(
          this.materialBorder,
          {
            opacity: 0,
            duration: 0.75,
            ease: 'power3.out',
            onComplete: () => {
              this.corners.forEach((el) => {
                el.visible = false
              })
            },
          },
          'disappear'
        )
        .to(
          this.mesh.material.uniforms.uZoom,
          {
            value: 0.8,
            duration: 0.65,
            ease: 'power2.out',
          },
          'disappear'
        )
        .to(
          this.mesh.material.uniforms.uResolutionEl.value,
          {
            x: this.mesh.initialScale.x,
            y: this.mesh.initialScale.y,
            duration: 0.75,
            ease: 'power3.out',
          },
          'disappear'
        )
    },
    initMesh() {
      this.geometry = new PlaneGeometry(1, 1, 1)

      this.material = new ShaderMaterial({
        uniforms: {
          uThreshold: {
            value: 0,
          },
          uMap: {
            value: this.texture,
          },
          uRatio: {
            value: new Vector2(0, 0),
          },
          uZoom: {
            value: 0.8,
          },
          uVelocity: {
            value: 1,
          },
          uResolutionEl: {
            value: new Vector2(this.$viewport.width, this.$viewport.height),
          },
        },
        vertexShader,
        fragmentShader,
        transparent: true,
        side: FrontSide,
      })

      this.mesh = new Mesh(this.geometry, this.material)
      this.mesh.idComponent = this.index
      this.mesh._uOffset = new Vector3(0, 0, 0)

      const { gallery } = useWebGL()

      gallery.add(this.mesh)

      this.onResize()

      this.createBorder()

      this.parallaxCoef = this.mesh.scale.x * 0.001 + this.mesh.scale.y * 0.001
    },
    createBorder() {
      const geometry = new PlaneGeometry(1, 1)

      this.materialBorder = new MeshBasicMaterial({
        color: 0x181818,
        transparent: true,
        opacity: 0,
        precision: 'lowp',
      })

      const point = new Mesh(geometry, this.materialBorder)
      point.visible = false

      point.scale.set(this.cornerSizeInitial, this.cornerSizeInitial, 0)
      point.scale.divide(this.mesh.scale)
      point.renderOrder = 2

      const pointBottomLeft = point.clone()
      pointBottomLeft.position.set(-0.5, -0.5, 0)

      const pointTopLeft = point.clone()
      pointTopLeft.position.set(-0.5, 0.5, 0)

      const pointTopRight = point.clone()
      pointTopRight.position.set(0.5, 0.5, 0)

      const pointBottomRight = point.clone()
      pointBottomRight.position.set(0.5, -0.5, 0)

      this.corners.push(
        pointBottomLeft,
        pointTopLeft,
        pointTopRight,
        pointBottomRight
      )

      this.outline = new Mesh(geometry, this.materialBorder)
      point.renderOrder = 1

      this.outline.scale.set(
        this.mesh.scale.x + this.outlineSize,
        this.mesh.scale.y + this.outlineSize,
        0
      )
      this.outline.scale.divide(this.mesh.scale)

      this.outline.position.z = -1

      this.mesh.add(
        pointBottomLeft,
        pointTopLeft,
        pointTopRight,
        pointBottomRight,
        this.outline
      )
    },
    update({ scroll, velocity, xMin, xMax }) {
      if (!this.mesh) return

      if (this.content.isVideo) this.texture.update()

      const x = gsap.utils.wrap(
        Math.min(this.$viewport.width / -2, xMin.picture.boundingRect.xThree) -
          xMin.picture.boundingRect.width, // left
        Math.max(this.$viewport.width / 2, xMax.picture.boundingRect.xThree) +
          xMax.picture.boundingRect.width, // right
        scroll.current * this.parallaxCoef + this.mesh?.initialPosition?.x
      )

      const position = new Vector3(
        x,
        this.mesh?.initialPosition?.y + window.lenis.scroll,
        this.mesh?.position?.z
      )

      this.mesh.position.copy(position).add(this.mesh._uOffset)
    },
    loadTexture(src) {
      const loader = new TextureLoader()

      return new Promise((resolve, reject) => {
        loader.load(
          src,
          (texture) => {
            resolve(texture)
          },
          undefined,
          (err) => {
            console.error('An error happened.', err)
          }
        )
      })
    },
    ...mapMutations({
      setCursorState: 'setCursorState',
    }),
    loadTextureVideo(src) {
      return new Promise((resolve) => {
        const video = document.createElement('video')

        const srcConcat = `${this.$img.options.providers.directus.defaults.baseURL}assets/${src}`

        video.src = srcConcat
        video.crossOrigin = 'anonymous'
        video.muted = true
        video.playsInline = true
        video.loop = true
        video.autoplay = true

        if (this.$viewport.isFirefox && this.$refs.video.readyState > 3) {
          this.texture = new VideoTexture(video)
          this.texture.image.pause()
          this.texture.image.currentTime = 0
          this.texture.needsUpdate = true

          resolve(this.texture)
        } else {
          video.onloadeddata = () => {
            this.texture = new VideoTexture(video)
            this.texture.image.pause()
            this.texture.image.currentTime = 0
            this.texture.needsUpdate = true

            resolve(this.texture)
          }
        }
      })
    },
  },
}
</script>

<style lang="scss">
.app-arena-gallery-picture {
  position: absolute;
  pointer-events: none;

  picture {
    width: 100%;
    height: 100%;
    display: block;
    visibility: hidden;
    opacity: 0;
    pointer-events: none;

    img {
      opacity: 0;
      visibility: hidden;
      @include draggable-false();
    }
  }

  &:nth-of-type(1) {
    // aspect-ratio: 215/260;
    top: desktop-vw(240px);
    grid-column: 16 / span 2;
    // width: 100%;
  }
  &:nth-of-type(2) {
    // aspect-ratio: 260/270;
    // width: 100%;
    left: desktop-vw(50px);
    top: desktop-vw(125px);
    grid-column: 18 / span 2;
  }
  &:nth-of-type(3) {
    // aspect-ratio: 410/270;
    left: desktop-vw(50px);
    top: desktop-vw(185px);
    grid-column: 22 / span 3;
    // width: 100%;
  }
  &:nth-of-type(4) {
    // aspect-ratio: 290/190;
    grid-column: 12 / span 3;
    // width: 85%;
    left: desktop-vw(0px);
    top: desktop-vw(90px);
  }
  &:nth-of-type(5) {
    // aspect-ratio: 255/170;
    top: desktop-vw(430px);
    z-index: 1;
    grid-column: 18 / span 2;
    // width: 100%;
    left: 30%;
  }
  &:nth-of-type(6) {
    grid-column: 20 / span 1;
    // width: 100%;
    // aspect-ratio: 118/142;
    left: desktop-vw(20px);
    top: desktop-vw(380px);
    z-index: 9;
  }
  &:nth-of-type(7) {
    // aspect-ratio: 230 / 135;
    grid-column: 14 / span 2;
    // width: 100%;
    left: desktop-vw(70px);
    top: desktop-vw(540px);
  }
  &:nth-of-type(8) {
    // width: 100%;
    // aspect-ratio: 685 / 715;
    grid-column: 19 / span 6;
    bottom: desktop-vw(0px);
  }
  &:nth-of-type(9) {
    grid-column: 12 / span 3;
    // width: 100%;
    // aspect-ratio: 335/390;
    bottom: desktop-vw(220px);
  }
  &:nth-of-type(10) {
    // width: 100%;
    grid-column: 16 / span 2;
    // aspect-ratio: 230 / 190;
    bottom: desktop-vw(120px);
  }
  &:nth-of-type(11) {
    // width: 100%;
    grid-column: 8 / span 3;
    // aspect-ratio: 340/510;
    top: desktop-vw(300px);
  }
  &:nth-of-type(12) {
    // width: 100%;
    grid-column: 6 / span 3;
    // aspect-ratio: 330/225;
    top: desktop-vw(150px);
  }
  &:nth-of-type(13) {
    // width: 100%;
    grid-column: 1 / span 3;
    // aspect-ratio: 330/220;
    top: desktop-vw(150px);
  }
  &:nth-of-type(14) {
    // width: 100%;
    grid-column: 2 / span 3;
    // aspect-ratio: 330/435;
    top: desktop-vw(550px);
  }
  &:nth-of-type(15) {
    // width: 100%;
    grid-column: 5 / span 3;
    // aspect-ratio: 330/195;
    bottom: desktop-vw(275px);
  }
  &:nth-of-type(16) {
    // width: 100%;
    grid-column: 4 / span 2;
    // aspect-ratio: 215/290;
    bottom: desktop-vw(25px);
  }
  &:nth-of-type(17) {
    // width: 100%;
    grid-column: 9 / span 2;
    // aspect-ratio: 215/140;
    bottom: desktop-vw(165px);
  }
  &:nth-of-type(18) {
    // aspect-ratio: 120 / 165;
    // width: 55%;
    grid-column: 27 / span 2;
    top: desktop-vw(80px);
  }
  &:nth-of-type(19) {
    // aspect-ratio: 330 / 220;
    grid-column: 29 / span 3;
    // width: 100%;
    top: desktop-vw(315px);
  }
  &:nth-of-type(20) {
    // width: 100%;
    // aspect-ratio: 325 / 420;
    grid-column: 33 / span 3;
    top: desktop-vw(35px);
  }
  &:nth-of-type(21) {
    // width: 100%;
    // aspect-ratio: 330/215;
    grid-column: 26 / span 3;
    top: desktop-vw(600px);
  }
  &:nth-of-type(22) {
    // width: 100%;
    // aspect-ratio: 235/160;
    grid-column: 31 / span 2;
    top: desktop-vw(650px);
  }
  &:nth-of-type(23) {
    // width: 100%;
    // aspect-ratio: 210/275;
    grid-column: 33 / span 2;
    top: desktop-vw(680px);
    left: desktop-vw(-60px);
  }
  &:nth-of-type(24) {
    // width: 100%;
    // aspect-ratio: 210/275;
    grid-column: 28 / span 2;
    bottom: desktop-vw(100px);
  }
  &:nth-of-type(25) {
    // width: 100%;
    // aspect-ratio: 475/315;
    grid-column: 32 / span 4;
    bottom: desktop-vw(50px);
    left: desktop-vw(-60px);
  }
}
</style>
