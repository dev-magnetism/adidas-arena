<template>
  <div class="app-arena-gallery-picture">
    <nuxt-picture
      ref="picture"
      provider="directus"
      class="picture-absolute"
      :src="src"
      format="webp"
      :alt="alt"
    />
  </div>
</template>

<script>
import { gsap } from 'gsap'

import boundingRect from '@/mixins/bounding-rect-webgl-gallery'
import useWebGL from '~/hooks/webgl'

import vertexShader from '~/assets/webgl/vertex.glsl'
import fragmentShader from '~/assets/webgl/fragment.glsl'

export default {
  mixins: [boundingRect],
  props: {
    index: {
      type: Number,
      require: true,
      default: 0,
    },
    src: {
      type: String,
      default: 'null',
    },
    alt: {
      type: String,
      default: 'alt',
    },
  },
  data() {
    return {
      open: false,
      offsetX: null,
    }
  },
  computed: {},
  watch: {
    '$parent.indexPictureSelected'(newVal, oldVal) {
      if (newVal === this.index || oldVal === this.index) return

      if (newVal !== null) {
        // disappear
        // console.log('disappear', newVal, this.index)
      } else {
        // console.log('appear', newVal, this.index)
        // appear
      }
    },
    open(newVal) {
      if (newVal) {
        this.focusPicture()
      } else {
        this.unFocusPicture()
      }
    },
  },
  mounted() {
    this.offsetX = this.$viewport.width * 1.5 // 300vw en CSS
    // this.initTexture()
    document.addEventListener('click', this.onClickDocument)
  },

  beforeDestroy() {
    this.mesh.removeEventListener('click', this.onClickPicture)
    document.removeEventListener('click', this.onClickDocument)

    this.$parent.interactionManager.remove(this.mesh)

    const { gallery } = useWebGL()

    this.mesh.geometry.dispose()
    this.mesh.material.dispose()

    gallery.remove(this.mesh)
  },

  methods: {
    onClickDocument(e) {
      if (!this.open) return

      setTimeout(() => {
        this.open = false

        e.stopPropagation()
      }, 100)
    },
    focusPicture() {
      this.$parent.pictureIsSelected = true
      this.$parent.pictureSelected = this
      this.$parent.pictureIndexSelected = this.index

      window.lenis.stop()

      const ratio = this.mesh.scale.x / this.mesh.scale.y

      const finalHeight = this.$viewport.height * 0.8

      const width = finalHeight * ratio

      gsap.to(this.mesh.position, {
        z: 0,
        duration: 0.9,
        ease: 'power4.out',
      })

      gsap.to(this.mesh._uOffset, {
        x: -this.mesh.position.x,
        y: -window.lenis.scroll - this.mesh.position.y,
        duration: 0.9,
        ease: 'power4.out',
      })

      gsap.to(this.mesh.scale, {
        x: width,
        y: finalHeight,
        duration: 0.75,
        ease: 'power3.out',
      })

      gsap.to(this.mesh.material.uniforms.uResolutionEl.value, {
        x: width,
        y: finalHeight,
        duration: 0.75,
        ease: 'power3.out',
      })

      gsap.to(this.mesh.material.uniforms.uZoom, {
        value: 1,
        duration: 0.65,
        ease: 'power2.out',
      })
    },
    unFocusPicture() {
      window.lenis.start()

      gsap.to(this.mesh._uOffset, {
        x: 0,
        y: 0,
        duration: 0.9,
        ease: 'power4.out',
      })

      gsap.to(this.mesh.position, {
        z: this.mesh.initialPosition.z,
        duration: 0.9,
        ease: 'power4.out',
      })

      gsap.to(this.mesh.scale, {
        x: this.mesh.initialScale.x,
        y: this.mesh.initialScale.y,
        duration: 0.75,
        ease: 'power3.out',
      })

      gsap.to(this.mesh.material.uniforms.uZoom, {
        value: 0.8,
        duration: 0.65,
        ease: 'power2.out',
      })

      gsap.to(this.mesh.material.uniforms.uResolutionEl.value, {
        x: this.mesh.initialScale.x,
        y: this.mesh.initialScale.y,
        duration: 0.75,
        ease: 'power3.out',
      })

      this.$parent.pictureIsSelected = false
      this.$parent.pictureSelected = null
      this.$parent.indexPictureSelected = null
    },
    async initTexture() {
      this.currentSrc = this.$img(
        this.$refs.picture.src,
        {
          format: 'webp',
        },
        {
          provider: 'directus',
        }
      )

      this.texture = await this.loadTexture(this.currentSrc)

      this.initMesh()
    },
    initMesh() {
      this.geometry = new THREE.PlaneGeometry(1, 1, 1)

      this.material = new THREE.ShaderMaterial({
        uniforms: {
          uOpacity: {
            value: 1,
          },
          uMap: {
            value: this.texture,
          },

          uRatio: {
            value: new THREE.Vector2(0, 0),
          },
          uZoom: {
            value: 0.8,
          },
          uVelocity: {
            value: 1,
          },
          uResolutionEl: {
            value: new THREE.Vector2(
              this.$viewport.width,
              this.$viewport.height
            ),
          },
        },
        vertexShader,
        fragmentShader,
        transparent: true,
        side: THREE.FrontSide,
        depthTest: false,
        depthWrite: false,
      })

      this.mesh = new THREE.Mesh(this.geometry, this.material)
      this.mesh._uOffset = new THREE.Vector3(0, 0, 0)

      const { gallery } = useWebGL()

      gallery.add(this.mesh)

      this.$parent.interactionManager.add(this.mesh)

      this.mesh.addEventListener('click', this.onClickPicture)

      this.onResize()

      this.parallaxCoef = this.mesh.scale.x * 0.001 + this.mesh.scale.y * 0.001
    },
    onClickPicture(e) {
      if (this.$parent.onDrag) return

      console.log('click onClickPicture')

      setTimeout(() => {
        if (!this.open && !this.$parent.pictureIsSelected) {
          this.open = true
        }

        e.stopPropagation()
      }, 100)
    },
    update({ scroll, velocity }) {
      if (!this.mesh) return

      // const test = -297
      // const testbis = 130.703125 + this.mesh.scale.x / 2

      // const x = gsap.utils.wrap(
      //   test - this.mesh.scale.x / 2, // left
      //   testbis, // right
      //   scroll.current + this.mesh.initialPosition.x
      // )

      const x = gsap.utils.wrap(
        -this.$viewport.width / 2 -
          this.mesh.scale.x / 2 -
          this.$viewport.width, // left
        this.$viewport.width / 2 - this.mesh.scale.x / 2 + this.$viewport.width, // right
        scroll.current + this.mesh.initialPosition.x
      )

      const position = new THREE.Vector3(
        x,
        this.mesh.initialPosition?.y,
        this.mesh.position?.z
      )

      this.mesh.material.uniforms.uVelocity.value = velocity

      this.mesh.position.copy(position).add(this.mesh._uOffset)
    },
    loadTexture(src) {
      const loader = new THREE.TextureLoader()

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
  },
}
</script>

<style lang="scss">
.app-arena-gallery-picture {
  position: absolute;
  pointer-events: none;

  &:nth-of-type(1) {
    aspect-ratio: 215/260;
    top: desktop-vw(240px);
    grid-column: 16 / span 2;
    width: 100%;
  }
  &:nth-of-type(2) {
    aspect-ratio: 260/270;
    width: 100%;
    left: desktop-vw(50px);
    top: desktop-vw(125px);
    grid-column: 18 / span 2;
  }
  &:nth-of-type(3) {
    aspect-ratio: 410/270;
    left: desktop-vw(50px);
    top: desktop-vw(500px);
    // top: desktop-vw(185px);
    grid-column: 16 / span 3;
    // grid-column: 22 / span 3;
    width: 100%;
  }
  &:nth-of-type(4) {
    aspect-ratio: 290/190;
    grid-column: 12 / span 3;
    width: 85%;
    left: desktop-vw(0px);
    top: desktop-vw(90px);
  }
  &:nth-of-type(5) {
    aspect-ratio: 255/170;
    top: desktop-vw(430px);
    z-index: 1;
    grid-column: 19 / span 2;
    width: 100%;
  }
  &:nth-of-type(6) {
    grid-column: 20 / span 2;
    width: 55%;
    aspect-ratio: 118/142;
    left: desktop-vw(60px);
    top: desktop-vw(380px);
    z-index: 9;
  }
  &:nth-of-type(7) {
    aspect-ratio: 230 / 135;
    grid-column: 14 / span 2;
    width: 100%;
    left: desktop-vw(70px);
    top: desktop-vw(540px);
  }
  &:nth-of-type(8) {
    width: 100%;
    aspect-ratio: 685 / 715;
    grid-column: 19 / span 6;
    bottom: desktop-vw(0px);
  }
  &:nth-of-type(9) {
    grid-column: 12 / span 3;
    width: 100%;
    aspect-ratio: 335/390;
    bottom: desktop-vw(220px);
  }
  &:nth-of-type(10) {
    width: 100%;
    grid-column: 16 / span 2;
    aspect-ratio: 230 / 190;
    bottom: desktop-vw(120px);
  }
  &:nth-of-type(11) {
    width: 100%;
    grid-column: 8 / span 3;
    aspect-ratio: 340/510;
    top: desktop-vw(300px);
  }
  &:nth-of-type(12) {
    width: 100%;
    grid-column: 6 / span 3;
    aspect-ratio: 330/225;
    top: desktop-vw(150px);
  }
  &:nth-of-type(13) {
    width: 100%;
    grid-column: 1 / span 3;
    aspect-ratio: 330/220;
    top: desktop-vw(150px);
  }
  &:nth-of-type(14) {
    width: 100%;
    grid-column: 2 / span 3;
    aspect-ratio: 330/435;
    top: desktop-vw(550px);
  }
  &:nth-of-type(15) {
    width: 100%;
    grid-column: 5 / span 3;
    aspect-ratio: 330/195;
    bottom: desktop-vw(275px);
  }
  &:nth-of-type(16) {
    width: 100%;
    grid-column: 4 / span 2;
    aspect-ratio: 215/290;
    bottom: desktop-vw(25px);
  }
  &:nth-of-type(17) {
    width: 100%;
    grid-column: 9 / span 2;
    aspect-ratio: 215/140;
    bottom: desktop-vw(165px);
  }
  &:nth-of-type(18) {
    aspect-ratio: 120 / 165;
    width: 55%;
    grid-column: 27 / span 2;
    top: desktop-vw(80px);
  }
  &:nth-of-type(19) {
    aspect-ratio: 330 / 220;
    grid-column: 29 / span 3;
    width: 100%;
    top: desktop-vw(315px);
  }
  &:nth-of-type(20) {
    width: 100%;
    aspect-ratio: 325 / 420;
    grid-column: 33 / span 3;
    top: desktop-vw(35px);
  }
  &:nth-of-type(21) {
    width: 100%;
    aspect-ratio: 330/215;
    grid-column: 26 / span 3;
    top: desktop-vw(600px);
  }
  &:nth-of-type(22) {
    width: 100%;
    aspect-ratio: 235/160;
    grid-column: 31 / span 2;
    top: desktop-vw(650px);
  }
  &:nth-of-type(23) {
    width: 100%;
    aspect-ratio: 210/275;
    grid-column: 33 / span 2;
    top: desktop-vw(680px);
    left: desktop-vw(-60px);
  }
  &:nth-of-type(24) {
    width: 100%;
    aspect-ratio: 210/275;
    grid-column: 28 / span 2;
    bottom: desktop-vw(265px);
  }
  &:nth-of-type(25) {
    width: 100%;
    aspect-ratio: 475/315;
    grid-column: 32 / span 4;
    bottom: desktop-vw(100px);
    left: desktop-vw(-60px);
  }

  picture {
    width: 100%;
    height: 100%;
    display: block;
    // visibility: hidden;
    opacity: 0.5;
    pointer-events: none;

    img {
      // opacity: 0;
      // visibility: hidden;
      @include draggable-false();
    }
  }
}
</style>
