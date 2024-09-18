<template>

	<div 
		v-if="elHide" 
		class="app-programmation-event-timetable "
		>

		<div class="app-programmation-event-timetable__row">

			<TH2 weight="bold" class="app-programmation-event-timetable__title">
				{{ event.timetable_title }}
			</TH2>

			<div
				ref="wrapper"
				:class="{ hold: cursorSliderHold }"
				class="app-programmation-event-timetable-slider__wrapper"
				@mouseenter="setCursorState('slider')"
				@mouseleave="setCursorState('hide')"
				@click="onClickSlider"
			>
				<div class="app-programmation-event-timetable-slider__inner">
					<div
						v-for="(timetable_item, index) in event.timetable_list"
						:key="`app-programmation-event-timetable-slider-${index}`"
						class="app-programmation-event-timetable-slider__item"
						:class="index % 2 === 0 ? 'rotate1' : 'rotate2'"
					>

      					<AtomsCornerPoints :size-points="8" />

						<div 
							class="app-programmation-event-timetable-slider__label"

						>
							
							<TH4 weight="medium">
								{{ timetable_item.timetable_label}}
							</TH4>
						</div>
						<div 
							class="app-programmation-event-timetable-slider__date"

						>
							<TH4 weight="medium" 
								:color="index % 3 === 0 ? 'black' : index % 3 === 1 ? 'blue-adidas' : 'red-adidas'"
							>
								{{ timetable_item.timetable_date}}
							</TH4>
							
						</div>
					</div>
				</div>
			</div>
		</div>


	</div>

</template>

<script>

import { mapMutations, mapState, mapGetters } from 'vuex'
import EmblaCarousel from 'embla-carousel'

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
	
	computed: {
	    ...mapGetters({
	    	timetableSlider: 'timetableSlider',
	    }),

	    ...mapState({
			cursorSliderHold: (state) => state.cursorSliderHold,
			cursorSliderLeftZone: (state) => state.cursorSliderLeftZone,
			allowScroll: (state) => state.allowScroll,
	    }),

		elHide() {
			return (
		        this.event.timetable_list?.length > 0
	      	)
	    },
	    theme(_index) {

			if(this.$viewport.isMobile){
				return _index % 3 === 0
			? 'blue-adidas'
				: _index % 3 === 1
			? 'red-adidas'
				: 'grey'
			} else  if(this.totalItems <= 6){
				return _index % 3 === 0
			? 'blue-adidas'
				: _index % 3 === 1
			? 'red-adidas'
				: 'grey'
			} else {
				return _index % 6 < 2
			? 'blue-adidas'
				: _index % 6 < 4
			? 'red-adidas'
				: 'grey'
			}
		},
	},

	watch: {
		cursorSliderLeftZone() {
			this.handleDisabledCursor()
		},
	},

	mounted() {

		this.embla = EmblaCarousel(this.$refs.wrapper, {
			dragFree: true,
			containScroll: 'keepSnaps',
			speed: 7.5,
			slidesToScroll: 1,
			breakpoints: {
				'(max-width: 800px)': { dragFree: false, skipSnaps: false, speed: 10 },
			},
		})

		this.embla.on('pointerUp', this.onPointerUp)
		this.embla.on('pointerDown', this.onPointerDown)

		if (!this.$viewport.isMobile) {
			this.embla.on('select', this.onSelect)
		}

	},

	beforeDestroy() {
		
		this.embla?.off('pointerUp', this.onPointerUp)
		this.embla?.off('pointerDown', this.onPointerDown)

		if (!this.$viewport.isMobile) {
			this.embla?.off('select', this.onSelect)
		}

		this.embla?.destroy()
	},

	methods: {

    
		onSelect(e) {
			this.handleDisabledCursor()
		},

		onClickSlider(e) {
			if (this.$viewport.isMobile) return

			const isLeft = e.clientX < this.$viewport.width / 2
			const canScrollPrev = this.embla.canScrollPrev()
			const canScrollNext = this.embla.canScrollNext()

			if (isLeft && canScrollPrev) {
				this.embla.scrollPrev()
			} else if (!isLeft && canScrollNext) {
				this.embla.scrollNext()
			}
		},

		onPointerDown() {
			if (this.allowScroll) {
				this.setAllowScroll(false)
			}

			this.setCursorSliderHold(true)
		},

		onPointerUp() {
			if (!this.allowScroll) {
				this.setAllowScroll(true)
			}

			this.setCursorSliderHold(false)
		},


		handleDisabledCursor() {
			const canScrollPrev = this.embla.canScrollPrev()
			const canScrollNext = this.embla.canScrollNext()

			if (
				(this.cursorSliderLeftZone && !canScrollPrev) ||
				(!this.cursorSliderLeftZone && !canScrollNext)
			) {
				this.setCursorSliderDisabled(true)
			} else {
				this.setCursorSliderDisabled(false)
			}
		},


		...mapMutations({
			setCursorState: 'setCursorState',
			setCursorSliderHold: 'setCursorSliderHold',
			setCursorSliderDisabled: 'setCursorSliderDisabled',
			setAllowScroll: 'setAllowScroll',
		}),
	}
}

</script>

<style lang="scss">

	.app-programmation-event-timetable{

		margin-top: desktop-vw(75px);

		@include mobile {
			margin-top: mobile-vw(65px);
		}

		&__row{
			width: 100%;
		}


		&__title {
			margin-bottom: desktop-vw(30px);
			padding-left: var(--layout-margin);
			padding-right: var(--layout-margin);

			@include mobile {
				margin-bottom: mobile-vw(25px);
			}
		}

		&-slider {

			&__wrapper {
				width: 100%;
   				overflow: hidden;
				padding: desktop-vw(20px) var(--layout-margin) desktop-vw(120px);
			
				@include mobile {
					padding: mobile-vw(20px) var(--layout-margin) mobile-vw(80px);
				}
			}

			&__inner {
				display: flex;
				column-gap: desktop-vw(60px);
				flex-direction: row;
				will-change: transform;

				@include mobile {
					column-gap: mobile-vw(30px);
				}
			}

			&__item{
				position: relative;
				padding: desktop-vw(20px) desktop-vw(40px);
				background-color: #fff;
				min-width: desktop-vw(250px);
				user-select: none; 

				&.rotate1{
					transform: rotate(-6.572deg);
				}
				&.rotate2{
					transform: rotate(3.114deg);
				}

				@include mobile {
					padding: mobile-vw(20px) mobile-vw(40px);
					min-width: unset;
				}

			}

			&__label{


				@include mobile {
					display: block;
				}

				.H4{
					font-size: desktop-vw(18px);
					line-height: desktop-vw(18px);

					@include mobile {
						font-size: mobile-vw(18px);
						line-height: mobile-vw(18px);
						white-space: nowrap;
					}
				}
			}

			&__date{
				.H4{
					font-size: desktop-vw(64px);
					line-height: desktop-vw(64px);

					@include mobile {
						font-size: mobile-vw(64px);
						line-height: mobile-vw(64px);
					}
				}
				
			}
		}

	}

</style>