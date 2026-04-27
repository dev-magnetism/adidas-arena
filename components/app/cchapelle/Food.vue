<template>
	<div class="page-cchapelle__food">
		<div class="page-cchapelle__food__heading grid-inner">
			<ERichText
				:scrub="false"
				:overflow="true"
				class="page-cchapelle__food__heading__title"
				:content="contents.title"
				weight="regular"
				tag="h3"
			/>
			<EEntertainmentTotal
				class="page-cchapelle__food__heading__spaces"
				:total="contents.items.length"
				:text="contents.totalText"
			/>
		</div>

		<div
			ref="wrapper"
			:class="{ cursorSliderHold }"
			class="page-cchapelle__food__wrapper"
			@mouseenter="onSliderMouseEnter"
			@mouseleave="onSliderMouseLeave"
			@click="onClickSlider"
		>
			<div class="page-cchapelle__food__inner">
				<div
					v-for="(item, index) in contents.items"
					:key="index"
					ref="items"
					class="page-cchapelle__food__item"
				>
					<div
						v-if="item.visual"
						class="page-cchapelle__food__item__wrapper-visual">
						<div class="page-cchapelle__food__item__visual">
							<nuxt-picture
								provider="directus"
								:src="item.visual"
								format="webp"
								:alt="item.title"
								sizes="sm:80vw md:90vw lg:100vw"
								/>
						</div>
					</div>

					<div class="page-cchapelle__food__item__content">
						<div class="page-cchapelle__food__item__content__titles">

							<ERichText
								tag="h4"
								weight="bold"
								:content="item.title"
								class="page-cchapelle__food__item__content__maintitle"
							/>

						</div>
						<div class="page-cchapelle__food__item__content__texts">

							<ERichText
								tag="p"
								weight="regular"
								:content="item.text"
								class="page-cchapelle__food__item__content__text"
							/>
							<a
								:href="item.cta_url"
								target="_blank"
								class="page-cchapelle__food__item__content__cta"
							>
								{{item.cta_label}}
							</a>
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
			onSliderMouseEnter() {
				if (this.$viewport.isMobile) return
				this.setCursorState('slider')
				this.setAppCursor('none')
			},
			onSliderMouseLeave() {
				if (this.$viewport.isMobile) return
				this.setCursorState('hide')
				this.setAppCursor('initial')
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
					s.querySelector('.page-cchapelle__food__item__visual')
				)
				const parallaxTransforms = this.calculateParallaxTransforms()


					parallaxTransforms.forEach((transform, index) => {
						if(layers[index]){
							layers[index].style.transform = `translateX(${transform}%)`
						}
					})
			},
			...mapMutations({
				setCursorState: 'setCursorState',
				setAppCursor: 'setAppCursor',
				setCursorSliderHold: 'setCursorSliderHold',
				setAllowScroll: 'setAllowScroll',
				setCursorSliderDisabled: 'setCursorSliderDisabled',
			}),
		},
	}
</script>

<style lang="scss">
	.page-cchapelle__food {
		width: 100%;
		position: relative;
		margin-bottom: desktop-vw(60px);
		padding: desktop-vw(80px) 0;
		background-color: var(--c-red-adidas);

		@include mobile {
			margin-bottom: mobile-vw(120px);
			padding: mobile-vw(80px) 0;
		}

		&__wrapper {
			overflow: hidden;

			&.hold {
				.page-cchapelle__food__item__visual {
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
				margin-bottom: mobile-vw(85px);
			}

			&__title {
				grid-column: 1 / span 8;

				@include mobile {
					grid-column: 1 / span 6;
					grid-row: 1;
					width: 85%;
				}

				.H3{
					font-size: desktop-vw(135px);
					line-height: desktop-vw(121px);

					@include mobile {
						font-size: mobile-vw(80px);
						line-height: mobile-vw(72px);
					}
				}
			}

			&__spaces {
				grid-column: 10 / span 2;
				align-self: center;

				@include mobile {
					grid-column: 1 / span 6;
					position: relative;
					grid-row: 2;
				}

				.app-element-entertainment-total__number{
					//	overflow: visible;
					
					.H1{
						padding: 0 desktop-vw(5px);
					}
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
			flex: 0 0 41%;
			display: flex;
			flex-direction: column;

			@include mobile {
				flex: 0 0 72%;
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
					@include font-ITCFranklinGothicLT-BkCp();
					font-size: desktop-vw(48px);
					line-height: desktop-vw(48px);
					letter-spacing: desktop-vw(-1.92px);
					font-weight: 600;
					text-transform: uppercase;

					@include mobile {
						display: inline-block;
						font-size: mobile-vw(40px);
						line-height: mobile-vw(40px);
					}
				}
				&__texts{
					flex: 3;
					margin-right: desktop-vw(60px);
					
				}

				&__text{
					text-transform: uppercase;
					@include font-ITCFranklinGothicLT-BkCp();
					@include mobile {
						margin-right: mobile-vw(0px);
						margin-left: mobile-vw(40px);
					}
				}

				&__cta{
					display: inline-block;
					margin-top: desktop-vw(24px);
					@include font-ITCFranklinGothicLT-BkCp();
					font-size: desktop-vw(16px);
					line-height: desktop-vw(24px);
					font-weight: 600;
					text-decoration: underline;
					text-transform: uppercase;

					@include mobile {
						margin-top: mobile-vw(15px);
						margin-left: mobile-vw(40px);
						font-size: mobile-vw(16px);
						line-height: mobile-vw(16px);
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
