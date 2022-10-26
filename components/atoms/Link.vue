<template>
  <a
    v-if="external"
    class="app-atoms-link"
    :href="href"
    :target="blank ? '_blank' : false"
  >
    <slot />
  </a>
  <nuxt-link
    v-else
    class="app-atoms-link"
    :to="href"
    :target="blank ? '_blank' : false"
  >
    <slot />
  </nuxt-link>
</template>

<script>
export default {
  props: {
    external: {
      type: Boolean,
      default: false,
    },
    href: {
      type: String,
      default: '#link',
    },
    blank: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    this.initHoverAnimation()
  },
  methods: {
    initHoverAnimation() {
      this.$el.onmouseenter = this.$el.onmouseleave = (e) => {
        console.log('here')
        const tolerance = 10

        const left = 0
        const right = this.$el.clientWidth

        let x = e.pageX - this.$el.offsetLeft

        if (x - tolerance < left) x = left
        if (x + tolerance > right) x = right

        this.$el.style.setProperty('--x', `${x}px`)
      }
    },
  },
}
</script>

<style lang="scss">
.app-atoms-link {
  position: relative;
  display: inline-block;
  margin-right: auto;
  cursor: pointer;

  &:hover {
    opacity: 1;
  }

  &:hover::after {
    --scale: 1;
  }

  &::after {
    --scale: 0;

    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: calc(100% + 2px);
    height: 1px;
    background: var(--c-black);
    transform: scaleX(var(--scale));
    transform-origin: var(--x) 50%;
    transition: transform 0.3s cubic-bezier(0.51, 0.92, 0.24, 1);
    width: 100%;
  }
}
</style>
