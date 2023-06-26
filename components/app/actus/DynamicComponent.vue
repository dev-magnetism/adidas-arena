<template>
  <div class="app-actualite-dynamic-component">
    <component :is="tag" :content="content.item" />
    <div class="app-actualite__spacer" />
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: {
    content: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    tag() {
      return this.content.collection
        .replace('Actualites', 'AppActus')
        .replace(/_/g, '')
    },
    ...mapState({
      fontsLoaded: (state) => state.fontsLoaded,
    }),
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {},
}
</script>

<style lang="scss">
.app-actualite-dynamic-component {
}
</style>
