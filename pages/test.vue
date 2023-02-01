<template>
  <div>
    <EFloorSelector />
    <ESceneSelector />
    <div class="floors">
      <span
        v-for="i in 5"
        :key="i"
        :class="{ active: i - 1 === interiorIndexFloor.id }"
        @click="setInteriorIndexFloor({ id: i - 1, immediate: true })"
        >floor {{ i - 1 }}</span
      >
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  computed: {
    ...mapState({
      allLoadedFake: (state) => state.allLoadedFake,
      interiorVisible: (state) => state.interiorVisible,
      interiorIndexFloor: (state) => state.interiorIndexFloor,
    }),
  },
  watch: {
    allLoadedFake() {
      this.setInteriorVisible(true)
    },
  },

  mounted() {
    if (!this.interiorVisible) this.setInteriorVisible(true)
  },
  methods: {
    ...mapMutations({
      setInteriorVisible: 'setInteriorVisible',
      setInteriorIndexFloor: 'setInteriorIndexFloor',
    }),
  },
}
</script>

<style lang="scss">
.floors {
  display: flex;
  width: 100%;
  grid-column: 1 / span 12;
  justify-content: flex-end;
  align-items: flex-end;

  span {
    padding: 20px;
    background: red;
    margin-right: 10px;
    cursor: pointer;

    &.active {
      background: blue;
    }

    &:last-child {
      margin-right: 0px;
    }
  }
}
</style>
