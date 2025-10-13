<template>
	<div class="app-paris-basketball-gallery">

		<div
			ref="wrapper"
			:class="{ cursorSliderHold }"
			class="app-paris-basketball-gallery__wrapper"
			@mouseenter="setCursorState('slider')"
			@mouseleave="setCursorState('hide')"
			@click="onClickSlider"
		>
			<div class="app-paris-basketball-gallery__inner">
				<div
					v-for="(item, index) in contents.items"
					:key="index"
					ref="items"
					class="app-paris-basketball-gallery__item"
				>
					<div 
						v-if="item.parisbasketballgallery_picture"
						class="app-paris-basketball-gallery__item__wrapper-visual">
						<div class="app-paris-basketball-gallery__item__visual">
							<nuxt-picture
								provider="directus"
								:src="item.parisbasketballgallery_picture"
								format="webp"
								:alt="item.parisbasketballgallery_picture_alt"
								sizes="sm:35vw md:50vw"
								/>

							<!-- AppPbbImage
								:src="item.parisbasketballgallery_picture"
								:alt="item.parisbasketballgallery_picture_alt"
								:lazy="true"
							/ -->
						</div>
					</div>

					<div class="app-paris-basketball-gallery__item__content">
						<div class="app-paris-basketball-gallery__item__content__titles">
							<TH4 tag="h3" class="app-paris-basketball-gallery__item__content__maintitle">
								{{
									item.parisbasketballgallery_name
								}}
							</TH4>
						</div>
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
					s.querySelector('.app-paris-basketball-gallery__item__visual')
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
	.app-paris-basketball-gallery {
		width: 100%;
		position: relative;
		background-color: var(--c-black);


		&__wrapper {
			overflow: hidden;

			&.hold {
				.app-paris-basketball-gallery__item__visual {
					img {
						transform: scale(1.35);
					}
				}
			}
		}

		&__inner {
			display: flex;
			column-gap: desktop-vw(24px);
			flex-direction: row;
			will-change: transform;

			@include mobile {
				column-gap: mobile-vw(25px);
			}
		}

		&__item {
			flex: 0 0 30%;
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
				margin-top: desktop-vw(16px);
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
						margin-right: 0px;
						margin-bottom: mobile-vw(15px);
					}
				}

				&__maintitle.H4 {
					font-size: desktop-vw(18px);
					line-height: desktop-vw(20px);
					color: var(--c-white) !important;

					@include mobile {
						font-size: mobile-vw(18px);
						line-height: mobile-vw(18px);
					}
				}

				
			}

			&__wrapper-visual {
				aspect-ratio: 437 / 600;
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
