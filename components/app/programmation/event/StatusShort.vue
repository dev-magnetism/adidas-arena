<template>
  <div 
    v-if="statusText"
    class="app-programmation-event-statuses-short"
    :class="{
      'wnd': reported && waitnewdate,
      'hasStatus': statusText
    }"
    >
    <TH4 :color="color" class="app-programmation-event-status-short">
      {{ statusText }}
    </TH4>
    <TH5 v-if="reported && waitnewdate" :color="'blue-adidas'" class="app-programmation-event-status-short newdate">
    {{this.programmationsEventContent.glossary_waiting_new_date}}
    </TH5>
  </div>
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
    waitnewdate: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapState({
      programmationsEventContent: (state) => state.programmationsEventContent,
    }),
    statusText() {
      let status

      if (this.status === 'B') {
        // Bientôt disponible
        status = this.programmationsEventContent.glossary_soon_available_short
      } else if (this.status === 'C') {
        // Bientôt disponible
        status = this.programmationsEventContent.glossary_soon_available_short
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
      if(this.presale && this.status === 'B'){
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
.app-programmation-event-status-short {
  padding: desktop-vw(5px) desktop-vw(8px);
  display: block;
  background-color: #fbf5ee;
  border: 1px solid var(--c-black);
  z-index: 3;
  font-size: desktop-vw(17px)!important;
  line-height:desktop-vw(17px)!important;
  white-space: wrap;

  @include mobile {
    padding: mobile-vw(5px) mobile-vw(8px);
    font-size: mobile-vw(28px)!important;
    line-height:mobile-vw(28px)!important;
  }

  &.newdate{
    color: var(--c-blue-adidas);
    font-size: desktop-vw(12px)!important;
    line-height: desktop-vw(12px);

    @include mobile {
      font-size: mobile-vw(12px)!important;
      line-height: mobile-vw(12px);
    }
  }
}
</style>
