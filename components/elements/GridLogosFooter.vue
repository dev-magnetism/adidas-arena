<template>
  <div class="app-element-grid-logos-footer">
    <div
      v-for="(logo, index) in logos"
      :key="index"
      :class="{
        big: logo.big,
      }"
      class="bloc"
    >
      <img
        v-if="index <= logos.length - 1"
        :src="logos[index].src"
        alt="test"
      />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      logos: [
        {
          src: '/imgs/placeholder-logo-home.png',
          big: false,
        },
        {
          src: '/imgs/placeholder-logo-home.png',
          big: false,
        },
        {
          src: '/imgs/placeholder-logo-home.png',
          big: false,
        },
        {
          src: '/imgs/placeholder-logo-home.png',
          big: false,
        },
        {
          src: '/imgs/placeholder-logo-home.png',
          big: false,
        },
        {
          src: '/imgs/placeholder-logo-home.png',
          big: false,
        },
        {
          src: '/imgs/placeholder-logo-home.png',
          big: false,
        },
        {
          src: '/imgs/placeholder-logo-home.png',
          big: false,
        },
        {
          src: '/imgs/placeholder-logo-home.png',
          big: true,
        },
        {
          src: '/imgs/placeholder-logo-home.png',
          big: false,
        },
        {
          src: '/imgs/placeholder-logo-home.png',
          big: false,
        },
        {
          src: '/imgs/placeholder-logo-home.png',
          big: false,
        },
        {
          src: '/imgs/placeholder-logo-home.png',
          big: false,
        },
      ],
    }
  },
}
</script>

<style lang="scss">
.app-element-grid-logos-footer {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  width: 80%;
  grid-gap: 1px;
  margin-top: desktop-vw(30px);

  .bloc {
    aspect-ratio: 90 / 90;
    position: relative;
    grid-row: span 1;
    grid-column: span 1;
    height: 100%;
    width: 100%;
    // order: var(--order);
    display: flex;
    align-items: center;
    justify-content: center;
    outline: 1px solid var(--c-black);

    img {
      width: 50%;
      height: auto;
    }

    &.visible {
      background: var(--c-white);
    }

    &.big {
      grid-row: span 2;
      grid-column: span 2;
      aspect-ratio: 175 / 175;
    }
  }
}
</style>
