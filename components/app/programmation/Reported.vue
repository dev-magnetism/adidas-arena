<template>
  <div class="app-programmation-list__reported">
  
    <div
      class="container app-programmation-list-events grid-inner"
    > 

      <TH3
       class="app-programmation-list-events__reported__title"
      >
        <div class="app-programmation-list-events__reported__title__col">
        évènements reportés

          <svg width="356" height="21" viewBox="0 0 356 21" fill="none" xmlns="http://www.w3.org/2000/svg" class="app-programmation-list-events__reported__title__svg">
          <path d="M2 3.81436C93.2391 3.81436 184.517 -1.28019 275.741 5.60438C280.039 5.92876 321.895 8.96184 296.781 5.60438C246.03 -1.18049 191.471 5.43959 140.783 9.18443C102.523 12.0111 60.3444 9.63222 22.8281 17.339C21.9969 17.5097 75.6957 19.3809 87.4377 18.9301C152.686 16.425 218.515 14.8225 283.817 14.5545C294.156 14.5121 355.96 17.1952 353.952 18.1346" stroke="#0000FF" stroke-width="4" stroke-linecap="round"/>
          </svg>


        </div>
      </TH3>

      <div
        class="app-programmation-list-events__reported"
      >
        <AppProgrammationCard
          v-for="(event, indexEvent) in reported"
          :key="indexEvent"
          ref="events"
          :event="event"
        />
      </div>
    </div>
  </div>
</template>

<script>


export default {
  props: {
    reported: {
      type: Array,
      default: () => [],
    }
  },
  computed: { },
  watch: { },
  mounted() { },
  methods: { },
}
</script>

<style lang="scss">
.app-programmation-list{
  &__reported {
    margin-top: desktop-vw(110px);
    padding-top: desktop-vw(110px);
    padding-bottom: desktop-vw(110px);
    position: relative;

    @include mobile {
      margin-top: mobile-vw(30px);
      padding-top: mobile-vw(34px);
      padding-bottom: mobile-vw(90px);
    }
  }

  &-events {
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: desktop-vw(120px) desktop-vw(0px);
    position: relative;

    @include mobile {
      grid-gap: mobile-vw(0px) mobile-vw(0px);
    }

    &__reported {
      display: grid;
      grid-template-columns: repeat(12, 1fr);
      grid-gap: desktop-vw(25px);
      position: relative;

      @include mobile {
        grid-template-columns: repeat(6, 1fr);
        grid-gap: mobile-vw(20px);
      }

      &__title{
        display: flex;
        justify-content: center;

        &__svg{
          position: absolute;
          bottom: desktop-vw(-32px);
          right: 0;

          @include mobile {
            width: 50%;
            height: auto;
          }
        }


        &__col{
          position: relative;
          flex: 0 0 auto;
          width: auto;
          font-size: desktop-vw(101px);

          @include mobile {
            margin: 0 0 mobile-vw(48px);
            font-size: mobile-vw(48px);
          }
        }
      }
    }

    .app-programmation-card {
      width: auto;
      height: auto;
    }
  }
}

.article {
  grid-column: span 4;
}
</style>
