<template>
  <div class="app-element-floor-selector">
    <span v-for="i in 5" :key="i"></span>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  // props: {
  //   content: {
  //     type: Object,
  //     default: () => {},
  //   },
  // },
  computed: {
    ...mapState({
      exteriorFullwidth: (state) => state.exteriorFullwidth,
    }),
  },
}
</script>

<style lang="scss">
.app-element-floor-selector {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: blue;
  width: 200px;
  height: 200px;
  perspective: 2000px;
  perspective-origin: 50% 50%;
  display: flex;
  flex-direction: column;
  opacity: 0;
  span {
    width: 40px;
    height: 40px;
    background: red;
    display: inline-block;
    transform: scale3d(1, 1, 1) rotateX(58deg) rotateY(0deg) rotateZ(45deg)
      translate3d(0px, 0px, 0px) skew(0deg, 0deg);
  }
}
</style>
