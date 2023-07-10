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
    presale: {
      type: Boolean,
      default: false,
    },
    reported: {
      type: Boolean,
      default: false,
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

      // console.log('Status', this.status)
      // console.log('Presale', this.presale)
      // console.log('Reported', this.reported)

      if (this.status === 'B') {
        // Bientôt disponible
        status = this.programmationsEventContent.glossary_soon_available
      } else if (this.status === 'C') {
        // Bientôt disponible
        status = this.programmationsEventContent.glossary_soon_available
      } else if (this.status === 'H') {
        // Annulé
        status = this.programmationsEventContent.glossary_cancelled
      } else if (this.status === 'K') {
        status = this.programmationsEventContent.glossary_full
      }

      /* Cas spécifiques (presale & reported)
        Si presale = true, la valeur du status est surchargée
        Si reported = true, la valeur du status est surchargée par cette dernière
      */
      // Cas spécifique à la clé 'presale'
      if(this.presale){
        status = this.programmationsEventContent.glossary_presales
      }
      // Cas spécifique à la clé 'reported'
      if(this.reported){
        status = this.programmationsEventContent.glossary_deferred
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
