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

import boundingRect from '@/mixins/bounding-rect-webgl'
import useWebGL from '~/hooks/webgl'

import vertexShader from '~/assets/webgl/arena-gallery-picture/vertex.glsl'
import fragmentShader from '~/assets/webgl/arena-gallery-picture/fragment.glsl'

export default {
  mixins: [boundingRect],
  computed: {},
  mounted() {
    this.initTexture()
  },
  beforeDestroy() {
    const { gallery } = useWebGL()

    this.$parent.interactionManager.remove(this.mesh)

    this.mesh.geometry.dispose()
    this.mesh.material.dispose()

    gallery.remove(this.mesh)
  },
  methods: {
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

      const { gallery } = useWebGL()

      gallery.add(this.mesh)

      this.$parent.interactionManager.add(this.mesh)

      this.mesh.addEventListener('click', (event) => {
        console.log('click', event)
        gsap.to(this.mesh.scale, {
          y: this.$viewport.height,
        })
        gsap.to(this.mesh.material.uniforms.uRatio.value, {
          y: this.$viewport.height,
        })
        gsap.to(this.mesh.position, {
          y: 0,
          x: 0,
        })
      })

      this.updateBoundingRect()
    },
    update({ scroll }) {
      if (!this.mesh) return

      const x = gsap.utils.wrap(
        -this.$viewport.width / 2 -
          this.mesh.scale.x / 2 -
          this.$viewport.width, // left
        this.$viewport.width / 2 + this.mesh.scale.x / 2 + this.$viewport.width, // right
        scroll.current + this.mesh.initialPosition.x
      )

      // console.log(x)

      this.mesh.position.x = x
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
