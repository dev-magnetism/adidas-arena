<template>
	<div class="app-paris-basketball-shows grid-inner">

		
    	<div class="app-paris-basketball-shows__content">
			<ERichText
				ref="maintitle"
				tag="h2"
				weight="regular"
				:content="contents.maintitle"
				class="app-paris-basketball-shows__content__title"
			/>

			<ERichText
				ref="introduction"
				tag="p"
				weight="medium"
				:content="contents.introduction"
				class="app-paris-basketball-shows__content__introduction"
			/>

			<ERichText
				ref="detail"
				tag="p"
				weight="medium"
				:content="contents.detail"
				class="app-paris-basketball-shows__content__text"
			/>

   		</div>

		<div
			ref="withFrame"
			v-if="contents.pictureFramed?.src"
			class="app-paris-basketball-shows__visual-frame"
		>
			<EKinesis :speed="5">

				<nuxt-picture
					provider="directus"
					:src="contents.pictureFramed.src"
					format="webp"
					:alt="contents.pictureFramed.alt"
					sizes="sm:35vw md:50vw"
					/>

				<!-- AppPbbImage
	                :src="contents.pictureFramed.src"
	                :alt="contents.pictureFramed.alt"
	                :lazy="true"
	                :sizes="{
	                  desktop: 'w600,h600,fcrop,q85',
	                  mobile: 'w600,h600,fcrop,q85',
	                }"
	             / -->
				<ELottie id="Cadre_02" />
			</EKinesis>
    	</div>

		<div
			ref="withoutFrame"
			v-if="contents.picture?.src"
			class="app-paris-basketball-shows__visual"
		>
			<EKinesis :speed="5">

				<nuxt-picture
					provider="directus"
					:src="contents.picture.src"
					format="webp"
					:alt="contents.picture.alt"
					sizes="sm:35vw md:50vw"
					/>

				<!-- AppPbbImage
	                :src="contents.picture.src"
	                :alt="contents.picture.alt"
	                :lazy="true"
	                :sizes="{
	                  desktop: 'w600,h600,fcrop,q85',
	                  mobile: 'w600,h600,fcrop,q85',
	                }"
	             / -->
			</EKinesis>
    	</div>
	</div>

</template>

<script>
import { gsap } from 'gsap'
import { mapState, mapMutations } from 'vuex'

export default {
	props: {
		contents: {
			type: Object,
			default: () => {},
		},
	},	
	computed: {
		...mapState({
			allLoadedFake: (state) => state.allLoadedFake,
			initialHeroDisplayed: (state) => state.initialHeroDisplayed,
		}),
	},
	watch: {
		initialHeroDisplayed(newVal) {
			if (!newVal) return

			if (this.$viewport.isMobile) {
				this.setAllowScroll(true)
			} else {
				this.appearHero(0.2)
			}
		},
	},
	mounted() {
		if (this.allLoadedFake && !this.$viewport.isMobile) {
			this.appearHero(0.85)
		} else if (this.allLoadedFake && this.$viewport.isMobile) {
			this.setAllowScroll(true)
		}
	},
	beforeDestroy() {
		this.tlAppear?.kill()
		this.mm?.revert()
	},
	methods: {
		appearHero(delay = 0) {
			this.tlAppear?.clear()
			this.tlAppear?.kill()

			this.tlAppear = gsap
				.timeline({
					delay,
					onComplete: () => {
						this.initMatchMedia()
					},
				})
				.addLabel('texts')
				.fromTo(
					this.$refs.maintitle,
					{
						y: '-120%',
					},
					{
						y: '0',
						duration: 0.6,
						stagger: 0.075,
						ease: 'power3.out',
					},
					'texts'
				)
				.fromTo(
					[this.$refs.introduction, this.$refs.detail.$el],
					{
						y: -30,
					},
					{
						y: 0,
						duration: 0.6,
						ease: 'power3.out',
					},
					'texts+=15%'
				)
				.fromTo(
					[this.$refs.introduction, this.$refs.detail.$el],
					{
						opacity: 0,
					},
					{
						opacity: 1,
						duration: 0.85,
						ease: 'power3.out',
					},
					'texts+=15%'
				)
				.addLabel('visuals', 'texts')
				.fromTo(
					this.$refs.withFrame,
					{
						y: '50%',
						rotate: -10,
					},
					{
						y: '0%',
						rotate: -5,
						duration: 0.5,
						ease: 'power3.out',
					},
					'visuals'
				)
				.fromTo(
					this.$refs.withFrame,
					{
						opacity: 0,
					},
					{
						opacity: 1,
						duration: 0.55,
						ease: 'power3.out',
					},
					'visuals+=5%'
				)
				.fromTo(
					this.$refs.withoutFrame,
					{
						y: '50%',
						rotate: -10,
					},
					{
						y: '0%',
						rotate: -5,
						duration: 0.5,
						ease: 'power3.out',
					},
					'visuals'
				)
				.fromTo(
					this.$refs.withoutFrame,
					{
						opacity: 0,
					},
					{
						opacity: 1,
						duration: 0.55,
						ease: 'power3.out',
					},
					'visuals+=5%'
				)
		},
		initMatchMedia() {
			this.mm = gsap.matchMedia()

			this.mm.add('(min-width: 768px)', (context) => {
    			this.setAllowScroll(true)

				const tweenWithFrame = gsap.to(this.$refs.withFrame, {
					yPercent: -20,
					rotate: 0,
					scrollTrigger: {
						trigger: this.$el,
						scrub: 0.5,
						start: `top top+=${window.innerWidth * 0.138888}`, // padding-top value
					},
				})

				const tweenWithoutFrame = gsap.to(this.$refs.withoutFrame, {
					yPercent: -20,
					rotate: 0,
					scrollTrigger: {
						trigger: this.$el,
						scrub: 0.5,
						start: `top top+=${window.innerWidth * 0.138888}`, // padding-top value
					},
				})

				return () => {
					tweenWithFrame?.kill()
					tweenWithoutFrame?.kill()
				}
			})
		},
		...mapMutations({
			setAllowScroll: 'setAllowScroll',
		}),
	},
}
</script>

<style lang="scss">
	.app-paris-basketball-shows {
		position: relative;
		row-gap: desktop-vw(85px);
		padding-top: desktop-vw(50px);
		padding-bottom: desktop-vw(50px);
		background-color: var(--c-black);

		@include mobile {
			overflow-x: hidden;
			row-gap: mobile-vw(85px);
			padding-top: mobile-vw(50px);
			padding-bottom: mobile-vw(50px);
		}

		&__content {
			grid-column: 2 / span 4;

			@include mobile {
				grid-column: 1 / span 6;
			}

			&__title {
				margin: 0 0 desktop-vw(25px);

				@include mobile{
					margin: 0 0 mobile-vw(25px);
				}


				.H2{
					font-size: desktop-vw(100px);
					line-height: desktop-vw(90px);
					color: var(--c-white) !important;

					@include mobile{
						font-size: mobile-vw(64px);
						line-height: mobile-vw(57px);
					}

					.app-atoms-stroke-text{
						-webkit-text-stroke: 1px var(--c-white);
						-webkit-text-fill-color: transparent;
					}

				}
			}

			&__introduction {
				margin: 0 0 desktop-vw(25px);

				@include mobile{
					margin: 0 0 mobile-vw(25px);
				}

				.P2{
					font-size: desktop-vw(18px);
					line-height: desktop-vw(20px);
					color: var(--c-white) !important;
					text-transform: uppercase;

					@include mobile{
						font-size: mobile-vw(18px);
						line-height: mobile-vw(20px);
					}
				}

			}

			&__text {
				

				.P2{
					margin: 0 0 desktop-vw(20px);
					font-size: desktop-vw(17px);
					line-height: desktop-vw(20px);
					color: var(--c-white) !important;

					@include mobile{
						margin: 0 0 mobile-vw(20px);
						font-size: mobile-vw(17px);
						line-height: mobile-vw(20px);
					}
				}

				ul{

					li{
						@include font-ITCFranklinGothicLT-BkCp();
						font-size: desktop-vw(17px);
						line-height: desktop-vw(20px);
						font-weight: 400;
						color: var(--c-white);
						list-style-position: inside;

						@include mobile{
							font-size: mobile-vw(17px);
							line-height: mobile-vw(20px);
						}

						&::marker{
							font-size: desktop-vw(8px);

							@include mobile{
								font-size: mobile-vw(8px);
							}
						}
					}
				}
			}

		}
		&__visual-frame {
			position: relative;
			grid-column: 6 / span 4;
			aspect-ratio: 440 / 548;
			margin-top: desktop-vw(206px);
			transform: rotate(-5deg);
			grid-row: 1;

			@include mobile {
				grid-column: 1 / span 4;
				left: 0;
				top: 0;
				grid-row: 2;
				margin-top: mobile-vw(50px);
				aspect-ratio: 299/373;
				margin-bottom: mobile-vw(100px);
			}

			picture {
				z-index: 0;
				@include noise();

				position: absolute;
				width: 100%;
				height: 100%;
				display: block;

				img {
					width: 100%;
					height: 100%;
					object-fit: cover;
				}
			}

			svg,
			canvas {
				position: absolute;
				top: 50%;
				left: 0;
				height: 115% !important;
				width: auto !important;
				left: 50%;
				transform: translate(-50%, -50%) rotate(4deg) !important;
			}
		}

		&__visual {
			position: relative;
			grid-column: 11 / span 2;
			aspect-ratio: 250 / 340;
			left: columns(-2);
			transform: rotate(-5deg);
			grid-row: 1;

			@include mobile {
				grid-column: 5 / span 2;
				left: columns(-0.5);
				top: mobile-vw(-100px);
				grid-row: 2;
				aspect-ratio: 170/231;
				margin-bottom: mobile-vw(185px);
				transform: rotate(5deg);
				width: 140%;
			}

			picture {
				z-index: 0;
				@include noise();

			
				position: absolute;
				width: 100%;
				height: 100%;
				display: block;

				img {
					width: 100%;
					height: 100%;
					object-fit: cover;
				}
			}
		}
	}
</style>
