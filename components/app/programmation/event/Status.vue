<template>
  <TH4 v-if="statusText" :color="color" class="app-programmation-event-status">
    {{ statusText }}
  </TH4>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: {
    color: {
      type: String,
      default: 'white',
    },
    status: {
      type: String,
      default: 'D',
    },
  },
  computed: {
    ...mapState({
      programmationsEventContent: (state) => state.programmationsEventContent,
    }),
    statusText() {
      let status

      // Preventes
      // Reporté

      if (this.status === 'K') {
        status = this.programmationsEventContent.glossary_full
      } else if (this.status === 'H') {
        status = this.programmationsEventContent.glossary_cancelled
      }

      return status
    },
  },
}
</script>

<style lang="scss">
.app-programmation-event-status {
  padding: desktop-vw(5px) desktop-vw(8px);
  display: inline-flex;
  background-color: #fbf5ee;
  border: 1px solid var(--c-black);
  z-index: 3;

  @include mobile {
    padding: mobile-vw(5px) mobile-vw(8px);
  }
}
</style>
