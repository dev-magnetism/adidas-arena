<template>
  <div class="app-actualite-dynamic-component">
    <component :is="tag" :content="content.item" />
    <div class="app-actualite__spacer" />
  </div>
</template>

<script>
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
  },
}
</script>

<style lang="scss">
.app-actualite-dynamic-component {
}
</style>
