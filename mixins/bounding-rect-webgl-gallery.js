import { Vector2 } from 'three/build/three.module.js'

export default {
  data() {
    return {
      boundingRect: {
        width: null,
        height: null,
        top: null,
        left: null,
        xThree: null,
        yThree: null,
      },
    }
  },
  mounted() {
    this.resizeObserver = new ResizeObserver((entries) => {
      this.onResize(entries)
    })

    this.resizeObserver.observe(this.$el)
  },
  beforeDestroy() {
    this.resizeObserver.unobserve(this.$el)
  },
  methods: {
    onResize(entries) {
      const contentRect = entries
        ? entries[0].contentRect
        : this.$el.getBoundingClientRect()

      const el = entries ? entries[0].target : this.$el

      this.boundingRect.width = contentRect.width
      this.boundingRect.height = contentRect.height

      this.boundingRect.top = this.offsetTop(el)
      this.boundingRect.left = this.offsetLeft(el, -this.$viewport.width * 1.5)

      this.updateBoundingRect()
    },
    offsetTop(element, accumulator = 0) {
      const top = accumulator + element.offsetTop

      if (element.offsetParent) {
        return this.offsetTop(element.offsetParent, top)
      }

      return top
    },
    offsetLeft(element, accumulator = 0) {
      const left = accumulator + element.offsetLeft

      if (element.offsetParent) {
        return this.offsetLeft(element.offsetParent, left)
      }

      return left
    },
    updateBoundingRect() {
      if (!this.mesh) return

      this.mesh.scale.x = this.boundingRect.width
      this.mesh.scale.y = this.boundingRect.height

      this.mesh.initialScale = this.mesh.scale.clone()

      this.mesh.material.uniforms.uResolutionEl.value = new Vector2(
        this.boundingRect.width,
        this.boundingRect.height
      )

      if (this.texture.isVideoTexture) {
        this.mesh.material.uniforms.uRatio.value = new Vector2(
          this.texture.image.videoWidth,
          this.texture.image.videoHeight
        )
      } else {
        this.mesh.material.uniforms.uRatio.value = new Vector2(
          this.texture.image.naturalWidth,
          this.texture.image.naturalHeight
        )
      }

      this.boundingRect.xThree =
        -this.$viewport.width / 2 +
        this.boundingRect.width / 2 +
        this.boundingRect.left

      this.boundingRect.yThree =
        this.$viewport.height / 2 -
        this.boundingRect.height / 2 -
        this.boundingRect.top

      this.mesh.position.set(
        this.boundingRect.xThree,
        this.boundingRect.yThree,
        -(1 - this.mesh.scale.x * 0.001) + -(1 - this.mesh.scale.y * 0.001)
      )

      this.mesh.initialPosition = this.mesh.position.clone()
    },
  },
}
