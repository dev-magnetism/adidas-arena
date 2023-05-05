<template>
  <div class="app-programmation-event-more-events block-inner">
    <TH2 weight="bold" class="app-programmation-event-more-events__title">
      VOUS ALLEZ AIMER AUSSI
    </TH2>
    <div class="app-programmation-event-more-events__items grid">
      <AppProgrammationCard
        v-for="(event, index) in programmationsContent"
        :key="index"
        :content="event"
        :theme="
          index === 0 ? 'blue-adidas' : index === 1 ? 'red-adidas' : 'grey'
        "
      />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      programmationsContent: [
        {
          id: 1,
          name: 'Zola',
          date: '3 Mai 2024',
          type: 'Concert',
          full: false,
          link: 'https://www.ticketmaster.fr/fr/manifestation/zola-billet/idmanif/547596/codtypadh/FTT/numadh/01/codeconf/FTMS01/idtier/34019277',
          from_price: 45,
          visual: '172bfc82-1161-4d6a-93e7-7139c4fb28ee',
          inside_slider: true,
          main_event: true,
          manual_sort: 1,
        },
        {
          id: 1,
          name: 'Zola',
          date: '3 Mai 2024',
          type: 'Concert',
          full: false,
          link: 'https://www.ticketmaster.fr/fr/manifestation/zola-billet/idmanif/547596/codtypadh/FTT/numadh/01/codeconf/FTMS01/idtier/34019277',
          from_price: 45,
          visual: '172bfc82-1161-4d6a-93e7-7139c4fb28ee',
          inside_slider: true,
          main_event: true,
          manual_sort: 1,
        },
        {
          id: 1,
          name: 'Zola',
          date: '3 Mai 2024',
          type: 'Concert',
          full: false,
          link: 'https://www.ticketmaster.fr/fr/manifestation/zola-billet/idmanif/547596/codtypadh/FTT/numadh/01/codeconf/FTMS01/idtier/34019277',
          from_price: 45,
          visual: '172bfc82-1161-4d6a-93e7-7139c4fb28ee',
          inside_slider: true,
          main_event: true,
          manual_sort: 1,
        },
      ],
    }
  },
}
</script>

<style lang="scss">
.app-programmation-event-more-events {
  margin-top: desktop-vw(115px);

  &__title {
    margin-bottom: desktop-vw(30px);
  }

  &__items {
  }
}
</style>
