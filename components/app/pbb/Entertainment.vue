<template>
	<div class="app-paris-basketball-entertainment">
		<div class="app-paris-basketball-entertainment__heading grid-inner">
			<ERichText
				:scrub="false"
				:overflow="true"
				class="app-paris-basketball-entertainment__heading__title"
				:content="contents.title"
				weight="regular"
				tag="h2"
			/>
			<EEntertainmentTotal
				class="app-paris-basketball-entertainment__heading__spaces"
				:total="contents.items.length"
				:text="contents.totalText"
			/>
		</div>

		<div
			ref="wrapper"
			:class="{ cursorSliderHold }"
			class="app-paris-basketball-entertainment__wrapper"
			@mouseenter="setCursorState('slider')"
			@mouseleave="setCursorState('hide')"
			@click="onClickSlider"
		>
			<div class="app-paris-basketball-entertainment__inner">
				<div
					v-for="(item, index) in contents.items"
					:key="index"
					ref="items"
					class="app-paris-basketball-entertainment__item"
				>
					<div 
						v-if="item.parisbasketballentertainment_picture"
						class="app-paris-basketball-entertainment__item__wrapper-visual">
						<div class="app-paris-basketball-entertainment__item__visual">
							<nuxt-picture
								provider="directus"
								:src="item.parisbasketballentertainment_picture"
								format="webp"
								:alt="item.parisbasketballentertainment_picture_alt"
								sizes="sm:35vw md:50vw"
								/>
							<!-- AppPbbImage
								v-if="item.parisbasketballentertainment_picture"
								:src="item.parisbasketballentertainment_picture"
								:alt="item.parisbasketballentertainment_picture_alt"
								:lazy="true"
							/ -->
						</div>
					</div>

					<div class="app-paris-basketball-entertainment__item__content">
						<div class="app-paris-basketball-entertainment__item__content__titles">

							<ERichText
								tag="h4"
								weight="bold"
								:content="item.parisbasketballentertainment_title"
								class="app-paris-basketball-entertainment__item__content__maintitle"
							/>

							<ERichText
								v-if="item.parisbasketballentertainment_cta_label"
								tag="h5"
								weight="regular"
								:content="item.parisbasketballentertainment_cta_label"
								class="app-paris-basketball-entertainment__item__content__subtitle"
							/>
						</div>
						<ERichText
							tag="p"
							weight="regular"
							:content="item.parisbasketballentertainment_text"
							class="app-paris-basketball-entertainment__item__content__text"
						/>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import { mapMutations, mapState } from 'vuex'
	import EmblaCarousel from 'embla-carousel'

	export default {
		props: {
			contents: {
				type: Object,
				default: () => {},
			},
		},
		data() {
			return {
				parallaxFactor: 5,
			}
		},
		computed: {
			...mapState({
				cursorSliderHold: (state) => state.cursorSliderHold,
				cursorSliderLeftZone: (state) => state.cursorSliderLeftZone,
				allowScroll: (state) => state.allowScroll,
			}),
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
				this.embla.on('init', this.onScroll)
				this.embla.on('scroll', this.onScroll)
				this.embla.on('resize', this.onScroll)
				this.embla.on('select', this.onSelect)
			}
		},
		beforeDestroy() {
			this.embla?.off('pointerUp', this.onPointerUp)
			this.embla?.off('pointerDown', this.onPointerDown)

			if (!this.$viewport.isMobile) {
				this.embla?.off('init', this.onScroll)
				this.embla?.off('scroll', this.onScroll)
				this.embla?.off('resize', this.onScroll)
				this.embla?.off('select', this.onSelect)
			}

			this.embla?.destroy()
		},
		methods: {
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
			onScroll() {
				this.setParallax()
			},
			onSelect(e) {
				this.handleDisabledCursor()
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
			calculateParallaxTransforms() {
				const engine = this.embla.internalEngine()
				const scrollProgress = this.embla.scrollProgress()

				return this.embla.scrollSnapList().map((scrollSnap, index) => {
					if (!this.embla.slidesInView().includes(index)) return 0
					let diffToTarget = scrollSnap - scrollProgress

					if (engine.options.loop) {
						engine.slideLooper.loopPoints.forEach((loopItem) => {
							const target = loopItem.getTarget()
							if (index === loopItem.index && target !== 0) {
								const sign = Math.sign(target)
								if (sign === -1) diffToTarget = scrollSnap - (1 + scrollProgress)
								if (sign === 1) diffToTarget = scrollSnap + (1 - scrollProgress)
							}
						})
					}
					return diffToTarget * (-1 / this.parallaxFactor) * 100
				})
			},
			setParallax() {
				const slides = this.embla.slideNodes()
				const layers = slides.map((s) =>
					s.querySelector('.app-paris-basketball-entertainment__item__visual')
				)
				const parallaxTransforms = this.calculateParallaxTransforms()

				parallaxTransforms.forEach((transform, index) => {
					layers[index].style.transform = `translateX(${transform}%)`
				})
			},
			...mapMutations({
				setCursorState: 'setCursorState',
				setCursorSliderHold: 'setCursorSliderHold',
				setAllowScroll: 'setAllowScroll',
				setCursorSliderDisabled: 'setCursorSliderDisabled',
			}),
		},
	}
</script>

<style lang="scss">
	.app-paris-basketball-entertainment {
		width: 100%;
		position: relative;
		margin-bottom: desktop-vw(60px);

		@include mobile {
			margin-bottom: mobile-vw(120px);
		}

		&__wrapper {
			overflow: hidden;

			&.hold {
				.app-paris-basketball-entertainment__item__visual {
					img {
						transform: scale(1.35);
					}
				}
			}
		}

		&__heading {
			margin-bottom: desktop-vw(85px);
			position: relative;

			@include mobile {
				row-gap: 0px;
			}

			&__title {
				grid-column: 1 / span 8;

				@include mobile {
					grid-column: 1 / span 6;
					grid-row: 1;
					width: 85%;
				}

				.H2{
					@include font-ITCFranklinGothicLT-BkCp();
					font-weight: 400;
				}
			}

			&__spaces {
				grid-column: 12 / span 1;
				align-self: center;
				position: absolute;

				@include mobile {
					grid-column: 1 / span 6;
					position: relative;
					grid-row: 2;
				}
			}
		}

		&__inner {
			display: flex;
			column-gap: desktop-vw(25px);
			flex-direction: row;
			will-change: transform;

			@include mobile {
				column-gap: mobile-vw(25px);
			}
		}

		&__item {
			flex: 0 0 45%;
			display: flex;
			flex-direction: column;

			@include mobile {
				flex: 0 0 77.5%;
			}

			&:first-child {
				margin-left: var(--layout-margin);
			}

			&:last-child {
				margin-right: var(--layout-margin);
			}

			&__content {
				margin-top: desktop-vw(40px);
				display: flex;
				flex-direction: row;
				align-items: flex-start;

				@include mobile {
					margin-top: mobile-vw(25px);
					flex-direction: column;
				}

				&__titles {
					flex: 2;
					margin-right: desktop-vw(40px);

					@include mobile {
						display: flex;
        				justify-content: space-between;
						width: 100%;
						margin-right: 0px;
						margin-bottom: mobile-vw(15px);
					}
				}

				&__maintitle{
					.H4 {
						@include font-ITCFranklinGothicLT-BkCp();
						font-size: desktop-vw(48px);
						line-height: desktop-vw(48px);
						letter-spacing: desktop-vw(-1.92px);
						font-weight: 600;

						@include mobile {
							display: inline-block;
							font-size: mobile-vw(40px);
							line-height: mobile-vw(40px);
						}
					}
				}

				&__subtitle {
					.H5 {
						margin-top: desktop-vw(10px);
						@include font-ITCFranklinGothicLT-BkCp();
						font-size: desktop-vw(17px);
						line-height: desktop-vw(20px);
						font-weight: 400;
						letter-spacing: desktop-vw(1.36px);

						@include mobile {
							display: inline-block;
							margin-top: mobile-vw(15px);
							font-size: mobile-vw(20px);
							line-height: mobile-vw(20px);
						}
					}
				}
				&__text{
					flex: 3;
					margin-right: desktop-vw(60px);
					.P2 {
						text-transform: uppercase;

						@include mobile {
							margin-right: mobile-vw(0px);
							margin-left: mobile-vw(40px);
						}
					}
				}
			}

			&__wrapper-visual {
				aspect-ratio: 670 / 680;
				display: block;
				width: 100%;
				height: auto;
				position: relative;
				overflow: hidden;
				max-height: 85vh;
			}

			&__visual {
				position: absolute;
				top: 0;
				left: 0;
				display: block;
				width: 100%;
				height: 100%;
				will-change: transform;
				@include noise();

				img {
					transition: transform 0.95s var(--ease-out-quart);

					transform: scale(1.45);
				}
			}
		}
	}
</style>
