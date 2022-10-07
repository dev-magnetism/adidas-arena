<template>
  <div class="app-arena-gallery-picture">
    <nuxt-picture
      ref="picture"
      class="picture-absolute"
      src="imgs/placeholder.png"
      format="webp"
      alt="placeholder"
      loading="lazy"
      preload
    />
  </div>
</template>

<script>
import { gsap } from 'gsap'

import boundingRect from '@/mixins/bounding-rect-webgl-gallery'
import useWebGL from '~/hooks/webgl'

import vertexShader from '~/assets/webgl/arena-gallery-picture/vertex.glsl'
import fragmentShader from '~/assets/webgl/arena-gallery-picture/fragment.glsl'

export default {
  mixins: [boundingRect],
  props: {
    index: {
      type: Number,
      require: true,
      default: 0,
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
    this.initTexture()
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
      this.currentSrc = this.$img(this.$refs.picture.src, {
        format: 'webp',
      })

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

      this.updateBoundingRect()

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

      const x = gsap.utils.wrap(
        -this.$viewport.width / 2 -
          this.mesh.scale.x / 2 -
          this.$viewport.width, // left
        this.$viewport.width / 2 - this.mesh.scale.x / 2 + this.$viewport.width, // right
        scroll.current * this.parallaxCoef + this.mesh.initialPosition.x
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
  position: relative;
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
}
</style>
