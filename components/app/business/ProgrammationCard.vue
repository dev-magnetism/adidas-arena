<template>
  <div :style="styles" class="app-business-programmation-card">
    <AppProgrammationEventStatus
      v-if="event.status_code !== 'C'"
      :presale="event.presale"
      :reported="this.isReported"
      :status="event.status_code"
      :waitnewdate="this.isWaitingNewDate"
    />
    <div class="app-business-programmation-card__visual">
      <div class="app-business-programmation-card__visual__wrapper">
        <div
          :class="{ visible }"
          class="app-business-programmation-card__layer"
        />

        <AtomsSpotifyCardLink
          v-if="event.spotify_link !== '' && event.spotify_link !== null"
          :cta-link="event.spotify_link"
          />

        <AppProgrammationImage
          class="app-business-programmation-card__visual__picture"
          :src="event?.presentation_event?.filename_disk"
          :image-provider="event?.presentation_event?.image_provider || 'accorarena'"
          :alt="`slider-image-${event.artist_reference}`"
          :lazy="true"
          :sizes="{
            desktop: 'w800,h800,fcrop,q85',
            mobile: 'w800,h800,fcrop,q85',
          }"
        />
      </div>
    </div>

    <nuxt-link
      class="app-business-programmation-card__informations"
      :to="{
        name: 'programmation-id',
        params: {
          id: `${$convertToKebabCase(event.content.url)}--${event.id}`,
        }
      }"

      :gtm-click="{
        id: `${event.id}`,
        name: `${event.artist_reference}`,
        category: `${event.content.category}`,
        category2: `${event.content.sub_category}`,
        price: `${event.min_price}`,
      }"
      @mouseenter.native="onMouseEnter"
      @mouseleave.native="onMouseLeave"
      >
      <div class="app-business-programmation-card__head">
        <TP2 class="type" weight="bold" :color="whitedTexts" tag="h3">
          {{
            event.content.category.toLowerCase() !== 'no cat'
              ? event.content.category
              : ''
          }}
        </TP2>
        <TP2
          v-if="this.isReported"
          class="date reported"
          weight="medium"
          :color="whitedTexts"
        >
          {{ $formatDate(event.sessions, true, true, false, false) }}
        </TP2>
        <TP2
          v-if="this.isReported && !this.isWaitingNewDate"
          class="date"
          weight="medium"
          :color="whitedTexts"
        >
          {{ $formatDate(event.sessions, true, false, true, false) }}
        </TP2>
        <TP2
          v-if="!this.isReported && event.sessions"
          class="date"
          weight="medium"
          :color="whitedTexts"
        >
          {{ $formatDate(event.sessions, false) }}
          <br/>
          {{ (event.date_tbc)?`${programmationsEventContent.glossary_tbc}`:''}}
        </TP2>
      </div>
      <TH2 :color="whitedTexts" weight="bold">
        {{ event.artist_reference }}
      </TH2>

    </nuxt-link>
  </div>
</template>

<script>
//  import { gsap } from 'gsap'
import { mapState, mapMutations } from 'vuex'

export default {
  props: {
    event: {
      type: Object,
      default: () => {},
    },
    theme: {
      type: String,
      default: 'red',
    },
    rotateNegative: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      visible: false,
      isReported: false, // Check if all available dates are reported
      isWaitingNewDate: false, // Check if all available dates are waiting a new date
    }
  },
  computed: {
    ...mapState({
      programmationsEventContent: (state) => state.programmationsEventContent,
    }),
    styles() {
      return {
        '--bg':
          this.theme === 'blue'
            ? 'var(--c-blue-adidas)'
            : this.theme === 'red'
            ? 'var(--c-red-adidas)'
            : 'var(--c-grey)',
        '--rotation': `${
          this.genRand(1, 2.5, 2) * (this.rotateNegative ? -1 : 1)
        }deg`,
      }
    },
    statutColor() {
      return this.theme === 'blue'
        ? 'blue-adidas'
        : this.theme === 'red'
        ? 'red-adidas'
        : 'black'
    },
    ctaColor() {
      return this.theme === 'blue'
        ? 'blue-adidas'
        : this.theme === 'red'
        ? 'red-adidas'
        : 'black'
    },
    whitedTexts() {
      return this.theme === 'blue' || this.theme === 'red' ? 'white' : 'black'
    },
  },
  mounted() {

    let _reported = 0;
    let _waitnewdate = 0;

    this.event.sessions.map((_sess, _sessI)=>{

      if(_sess.reported) _reported = _reported + 1;
      if(_sess.waiting_new_date) _waitnewdate = _waitnewdate + 1;

      return _sess;
    })

    if(_reported === this.event.sessions.length){
      //  console.log('all sessions are reported');
      this.isReported = true;
    }
    if(_waitnewdate > 0){
      //  console.log('all sessions are waiting a new date');
      this.isWaitingNewDate = true;
    }
  
    if (this.$viewport.isMobile) return

    this.initTimelineArrow()
  },
  beforeDestroy() {
    //  this.tlArrow?.kill()
  },
  methods: {
    onMouseEnter() {
      if (this.$viewport.isMobile) return

      this.setCursorState('hide')

      // this.tlArrow?.play()
      // console.log('ref cta', this.$refs.cta);
      //	this.$refs.cta.onMouseEnter();
    },
    onMouseLeave() {
      if (this.$viewport.isMobile) return

      this.setCursorState('slider')

      // this.tlArrow?.reverse()
      // console.log('ref cta', this.$refs.cta);
      //	this.$refs.cta.onMouseLeave();
    },
    initTimelineArrow() {
      //  if (this.$viewport.isMobile) return
      // this.tlArrow = gsap.timeline({ paused: true })
      /*
      this.tlArrow.to(this.$refs.arrow.$el, {
        x: `${this.$viewport.width * 0.048611111111}px`, // width cta
        duration: 0.5,
        ease: 'power3.inOut',
      })

      this.tlArrow.set(this.$refs.arrow.$el, {
        x: `${this.$viewport.width * -0.048611111111}px`, // width cta
      })

      this.tlArrow.to(this.$refs.arrow.$el, {
        x: 0,
        duration: 0.25,
        ease: 'power3.out',
      })
      */
    },
    genRand(min, max, decimalPlaces) {
      const rand = Math.random() * (max - min) + min
      const power = Math.pow(10, decimalPlaces)
      return Math.floor(rand * power) / power
    },
    ...mapMutations({
      setCursorState: 'setCursorState',
      setCursorSliderHold: 'setCursorSliderHold',
    }),
  },
}
</script>

<style lang="scss">
.app-business-programmation-card {
	display: flex;
	flex-direction: column;
	background-color: var(--bg);
	position: relative;
	border: 1px solid var(--c-black);
	transform: rotate(var(--rotation));
	flex: 0 0 20%;
	min-width: 0;

	&:nth-child(2n + 2) {
		top: desktop-vw(20px);

		@include mobile {
			top: mobile-vw(10px);
		}
	}

	&:first-child {
		margin-left: var(--layout-margin);

		@include mobile {
			margin-left: 0;
		}
	}

	&:last-child {
		margin-right: var(--layout-margin);

		@include mobile {
			margin-right: 0;
		}
	}

	@include mobile {
		flex: 0 0 50%;
	}

	@include desktop-l {
		flex: 0 0 20%;
	}

	.app-programmation-event-statuses {
		position: absolute;
		right: 0;
		border-right: none;
		border-top: none;
		top: 0;
		z-index: 10;
	}


	&__visual {
		width: 100%;
		display: block;
		position: relative;
		z-index: 0;
	}

	&__visual__wrapper {
		aspect-ratio: 435/435;
		width: 100%;
		display: block;
		position: relative;
		overflow: hidden;
	}

	picture {
		width: 100%;
		display: block;
		position: relative;
		height: 100%;
		@include noise();
		will-change: transform;

		img {
			display: block;
			transform: scale(1.1);
			transition: transform 0.95s var(--ease-out-quart);
		}
	}

	&__informations {
		display: flex;
		flex-direction: column;
		padding: desktop-vw(15px) desktop-vw(15px);
		height: 100%;
		border-top: 1px solid var(--c-black);
		cursor: pointer;

		@include mobile {
			padding: mobile-vw(8px) mobile-vw(8px) mobile-vw(40px);
			margin-top: mobile-vw(0px);
		}

		&:hover{

			.app-atoms-cta{
				&::after {
					transform: scaleY(1);
				}
			}

		}
	}

	&__head {
		display: flex;
		justify-content: flex-start;

		.P2 {
			font-size: desktop-vw(12px);
			line-height: desktop-vw(12px);
			text-transform: uppercase;

			@include mobile{
				font-size: mobile-vw(11px);
				line-height: mobile-vw(10px);
			}
		}

		.date{
			margin-left: desktop-vw(30px);

			@include mobile{
				margin-left: mobile-vw(30px);
			}

			&.reported{
				position: relative;
				text-decoration: line-through;
			}

			&:last-child{
				margin-left: desktop-vw(16px);

				@include mobile{
					margin-left: mobile-vw(16px);
				}
			}
		}

	}

	.H2.bold {
		font-size: desktop-vw(40px);
		line-height: desktop-vw(35px);
		margin-top: desktop-vw(10px);
		user-select: none;
		letter-spacing: 0;
		@include font-ITCFranklinGothicLT-DmXtraCp();

		@include mobile {
			margin-top: mobile-vw(10px);
			font-size: mobile-vw(32px);
			line-height: mobile-vw(28px);
		}

		@include desktop-l {
			font-size: desktop-vw(40px);
			line-height: desktop-vw(35px);
		}
	}

	&__from-price.P2 {
		margin-top: auto;
		max-width: 50%;

		@include mobile {
			margin-left: auto;
			max-width: 100%;
		}
	}
}
</style>
