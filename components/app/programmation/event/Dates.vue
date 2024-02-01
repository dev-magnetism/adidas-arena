<template>
  <div class="app-programmation-event-dates block-inner">
    <div class="app-programmation-event-dates__row">

      <TH2 weight="bold" class="app-programmation-event-dates__title">
        {{ content.title }}
      </TH2>

      <div 
        :class="{open: toggleFilter}"
        class="app-programmation-event-dates__filter"
        @click="datesFilter(true)"
        @mouseleave="datesFilter(false)"
        >
        <div class="app-programmation-event-dates__filter__toggler">
          <span class="app-programmation-event-dates__filter__toggler__label">
            {{(this.$viewport.isMobile)?'Filtrer':'Sélectionner une date'}}
          </span>
          <div class="app-programmation-event-dates__filter__toggler__icon-container">
            <svg class="app-programmation-event-dates__filter__toggler__icon" width="9" height="6" viewBox="0 0 9 6" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.13672 5.02696C3.65507 4.65842 4.515 0.973022 4.515 0.973022C4.515 0.973022 5.4302 5.00239 7.86256 5.02696" stroke="#181818" stroke-width="1.01348" stroke-linecap="square" stroke-linejoin="bevel"/>
            </svg>
          </div>
        </div>
        <div class="app-programmation-event-dates__filter__toggle">
          <button
            v-for="(session, index) in sessionsdates"
            :key="index"
            class="app-programmation-event-dates__filter__toggle__button"
            @click="onFilterDate(session)"
            >
              <span class="app-programmation-event-dates__filter__toggle__label">{{session}}</span>
              <div 
                :class="{active: filteredDate === session && filteredDate !== null}"
                class="app-programmation-event-dates__filter__toggle__icon-container"
                >
                <svg class="app-programmation-event-dates__filter__toggle__icon" width="21" height="18" viewBox="0 0 21 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.6002 7.4959C9.6002 9.18908 8.71423 13.1677 11.1277 10.9398C11.9429 10.1874 15.7622 6.16465 15.0994 6.49604" stroke="#36AD63" stroke-linecap="round"/>
                  <path d="M10.6001 2.99653C2.76458 3.45744 0.0235324 21.4046 12.1276 16.1335C16.1707 14.3728 22.9617 8.34906 19.3765 3.32981C17.5786 0.812718 12.7749 0.605356 10.1001 1.4412C5.34752 2.9264 3.06439 7.64709 0.601562 11.4953" stroke="#36AD63" stroke-linecap="round"/>
              </svg>
            </div>
          </button>
        </div>
      </div>

    </div>
    <div 
      class="app-programmation-event-dates__items grid"
      >
      <AppProgrammationEventDatesItem
        v-for="(session, index) in sessions"
        :key="index"
        :index="index"
        :session="session"
        :event-id="event.id"
        :date="$formatDate(session.date, true)"
        :day="$formatDate(session.date, false)"
        :filtered-date="filteredDate"
        :artist="event.artist_reference"
        :total-items="event.sessions.length"
        :disabled="indexDate !== index && indexDate !== null"
        @click.native="onSelectDate(index)"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    event: {
      type: Object,
      default: () => {},
    },
    content: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      indexDate: null,
      filteredDate: null,
      toggleFilter: false
    }
  },
  computed: {
    sessions() {
      const sessions = JSON.parse(JSON.stringify(this.event.sessions))

      sessions.forEach((session) => {

        session.content = session.translations.find(
          (translation) => translation.language === 'fr'
        )

        session.day = this.formatDay(session.date);
      })

      const _filteredSessions = (this.filteredDate !== null)?sessions.filter( _s => _s.day === this.filteredDate):sessions;
      return _filteredSessions
    },

    sessionsdates() {
      const _sessions = JSON.parse(JSON.stringify(this.event.sessions))

      const _sessionsdates = []

      _sessions.forEach((session) => {
        const sessiondate = this.formatDay(session.date);
        if(_sessionsdates.findIndex(_sd => _sd === sessiondate) < 0){
          _sessionsdates.push(sessiondate)
        }
      })

      return _sessionsdates
      
    },
  },

  methods: {
    formatDay(_dateObj){

      const dateObj = _dateObj.toString();

      const _formatDateObj = (dateObj)?dateObj?.replaceAll('-', '/'):'';

      const _date = new Date(_formatDateObj);
      const day = _date.getDate()
      const month = _date
        .toLocaleString('fr-FR', { month: 'long' })
        .toUpperCase()
      const year = _date.getFullYear()

      const _stringDate = `${day} ${month} ${year}`;

      return _stringDate;

    },
    onSelectDate(index) {
      if (index === this.indexDate) {
        this.indexDate = null
      } else {
        this.indexDate = index
      }

      this.$emit('onSelectDate', this.indexDate)
    },
    onFilterDate(index) {
      if (index === this.filteredDate) {
        this.filteredDate = null
      } else {
        this.filteredDate = index
      }

      this.toggleFilter = false;
    },
    datesFilter(boolean) {
      this.toggleFilter = boolean;
    },
  },
}
</script>

<style lang="scss">
.app-programmation-event-dates {
  margin-top: desktop-vw(75px);

  @include mobile {
    margin-top: mobile-vw(65px);
  }

  &__row{
    display: flex;
    flex-wrap: wrap;
    margin: 0;
    margin-bottom: desktop-vw(50px);
    width: 100%;
    align-items: center;
    justify-content: space-between;

    @include mobile {
      margin-bottom: mobile-vw(25px);
    }
  }

  &__filter{
    position: relative;
    display: inline-block;
    flex: 0 0 auto;
    width: auto;

      &.open{

      }

      &__toggler{
        display: flex;
        flex-wrap: wrap;
        margin: 0;
        padding: 0;
        width: 100%;
        border: 1px solid var(--c-black);
        align-items: stretch;
        justify-content: space-between;
        cursor: pointer;

        &__label{
          display: inline-block;
          flex: 0 0 auto;
          padding: desktop-vw(12px) desktop-vw(12px) desktop-vw(6px);
          width: auto;
          @include font-ITCFranklinGothicLT-DmXtraCp();
          font-size: desktop-vw(16px);
          line-height: desktop-vw(16px);
          color: var(--c-black);
          text-transform: uppercase;

          @include mobile{
            padding: mobile-vw(12px) mobile-vw(12px) mobile-vw(6px);
            font-size: mobile-vw(16px);
            line-height: mobile-vw(16px);
          }
        }

        &__icon-container{
          position: relative;
          display: inline-block;
          padding: desktop-vw(12px) desktop-vw(12px) desktop-vw(6px);
          flex: 0 0 auto;
          width: desktop-vw(9px);
          border-left: 1px solid var(--c-black);
          
          @include mobile{
            padding: mobile-vw(12px) mobile-vw(12px) mobile-vw(6px);
            width: mobile-vw(9px);
          }
        }

        &__icon{ 
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(180deg);
          transition: all 360ms ease-in-out;

        }
      }

      &__toggle{
        position: absolute;
        top: 100%;
        left: 0;
        z-index: 100;
        display: none;
        flex: 0 0 100%;
        width: 100%;
        background-color: var(--c-white);
        border: 1px solid var(--c-black);
        border-top: none;

        @include mobile{
          left: unset;
          right: 0;
          flex: 0 0 auto;
          width: mobile-vw(154px);
          border-top: 1px solid var(--c-black);
        }

        &__button{
          display: flex;
          flex-wrap: wrap;
          margin: 0;
          padding: desktop-vw(4px) desktop-vw(12px) 0;
          width: 100%;
          height: desktop-vw(28px);
          cursor: pointer;
          border-bottom: 1px solid var(--c-black);
          align-items:center;
          justify-content: space-between;

          @include mobile{
            padding: mobile-vw(4px) mobile-vw(12px);
            height: mobile-vw(28px);
          }

          &:last-child{
            border-bottom: none;
          }
        }

        &__label{
          display: inline-block;
          flex: 0 0 auto;
          width: auto;
          @include font-ITCFranklinGothicLT-DmXtraCp();
          font-size: desktop-vw(16px);
          line-height: desktop-vw(16px);
          color: var(--c-black);
          text-transform: uppercase;

          @include mobile{
            font-size: mobile-vw(16px);
            line-height: mobile-vw(16px);
          }
        }

        &__icon-container{
          display: inline-block;
          flex: 0 0 auto;
          width: auto;
          opacity: 0;
          transition: all 360ms ease-in-out;

          &.active{
            opacity: 1;
          }
        }

      }


      &.open{
        .app-programmation-event-dates__filter__toggle{
          display: inline-block;
        }
        .app-programmation-event-dates__filter__toggler{
          @include mobile{
            border-bottom: none;
          }
        }
        .app-programmation-event-dates__filter__toggler__icon{
          transform: translate(-50%, -50%) rotate(0deg);
        }
      }
  }

  &__title {
    display: inline-block;
    flex: 0 0 auto;
    width: auto;
  }

  &__items {
  }
}
</style>
