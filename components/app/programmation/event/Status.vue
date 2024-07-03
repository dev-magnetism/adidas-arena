<template>
  <div class="app-programmation-event-statuses">

    <div class="app-programmation-event-statuses__row">
      <TH4 v-if="statusText" :color="'red-adidas'" class="app-programmation-event-status">
        {{ statusText }}
      </TH4>
    </div>
    <div class="app-programmation-event-statuses__row">
      <TH5 v-if="reported && waitnewdate" :color="'blue-adidas'" class="app-programmation-event-status newdate">
      {{this.programmationsEventContent.glossary_waiting_new_date}}
      </TH5>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: {
    presale: {
      type: Boolean,
      default: false,
    },
    reported: {
      type: Boolean,
      default: false,
    },
    waitnewdate: {
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
.app-programmation-event-statuses__row{
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.app-programmation-event-status {
  display: block;
  flex: 0 0 auto;
  width: auto;
  padding: desktop-vw(5px) desktop-vw(8px);
  background-color: #fbf5ee;
  border: 1px solid var(--c-black);
  border-top: none;
  border-right: none;
  z-index: 3;
  font-size: desktop-vw(28px);
  color: var(--c-red-adidas);

  @include mobile {
    padding: mobile-vw(5px) mobile-vw(8px);
    font-size: mobile-vw(28px);
  }

  &.newdate{
    flex: 1 0 0%;
    width: 100%;
    margin-top: -1px;
    color: var(--c-blue-adidas);
    font-size: desktop-vw(18px);
    border-top: 1px solid var(--c-black);

    @include mobile {
      font-size: mobile-vw(18px);
    }
  }
}
</style>
