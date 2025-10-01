<template>
	<div class="app-paris-basketball-abonnement grid-inner">

		
    	<div class="app-paris-basketball-abonnement__f-row__content">
			<ERichText
				ref="maintitle"
				tag="h2"
				weight="regular"
				:content="contents.maintitle"
				class="app-paris-basketball-abonnement__f-row__content__title"
			/>

			<ERichText
				ref="introduction"
				tag="p"
				weight="medium"
				:content="contents.introduction"
				class="app-paris-basketball-abonnement__s-row__content__text"
			/>

			<ERichText
				ref="detail"
				tag="p"
				weight="medium"
				:content="contents.detail"
				class="app-paris-basketball-abonnement__s-row__content__text"
			/>

			<AtomsCTA
				:href="contents.cta.link"
				class="app-element-programmation-slider__cta"
			>
				{{ contents.cta.label }}
			</AtomsCTA>
   		</div>

		<div
			ref="bigVisual"
			v-if="contents.pictureFramed?.src"
			class="app-paris-basketball-abonnement__f-row__visual"
		>
			<EKinesis :speed="5">
				<AppPbbImage
	                :src="contents.pictureFramed.src"
	                :alt="contents.pictureFramed.alt"
	                :lazy="true"
	                :sizes="{
	                  desktop: 'w600,h600,fcrop,q85',
	                  mobile: 'w600,h600,fcrop,q85',
	                }"
	             />
				<ELottie id="Cadre_02" />
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
					this.$refs.bigVisual,
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
					this.$refs.bigVisual,
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

				const tweenBigVisual = gsap.to(this.$refs.bigVisual, {
					yPercent: -20,
					rotate: 0,
					scrollTrigger: {
						trigger: this.$el,
						scrub: 0.5,
						start: `top top+=${window.innerWidth * 0.138888}`, // padding-top value
					},
				})

				return () => {
					tweenBigVisual?.kill()
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
	.app-paris-basketball-abonnement {
		position: relative;
		margin-bottom: desktop-vw(130px);
		row-gap: desktop-vw(85px);

		@include mobile {
			overflow-x: hidden;
		}

		&__visual-transparent.app-element-kinesis {
			position: absolute;
			width: columns(1.5);
			grid-column: 6 / span 2;
			top: desktop-vw(25px);
			transform: rotate(7deg);
			aspect-ratio: 128 / 128;
			// left: 30%;
			display: flex;
			align-items: center;
			justify-content: center;
			height: auto;

			@include mobile {
				aspect-ratio: 64/64;
				width: 70%;
				grid-column: 5 / span 2;
				top: mobile-vw(25px);
			}

			@include fake-transparent();

			svg {
				display: block;
				width: 85%;
				height: auto;
			}
		}

		&__f-row {
			&__content {
				grid-column: 2 / span 5;
				grid-row: 1;

				@include mobile {
					grid-column: 1 / span 6;
				}

				&__title {
				}

				&__subtitle {
					text-transform: uppercase;
					margin-top: desktop-vw(20px);
					width: 65%;

					@include mobile {
						margin-top: mobile-vw(20px);
					}
				}
				&__subtitle-list {
					margin-top: desktop-vw(25px);
					width: 80%;

					li {
						list-style-position: outside;
						margin-left: 1em;
					}

					@include mobile {
						margin-top: mobile-vw(20px);
					}
				}
			}
			&__visual {
				position: relative;
				grid-column: 8 / span 5;
				aspect-ratio: 650 / 785;
				left: columns(-1);
				margin-top: desktop-vw(150px);
				transform: rotate(-5deg);
				grid-row: 1;

				@include mobile {
					grid-column: 2 / span 5;
					left: 0;
					top: 0;
					grid-row: 2;
					margin-top: mobile-vw(20px);
					aspect-ratio: 270/320;
					margin-bottom: mobile-vw(185px);
				}

				picture {
					z-index: 0;
					@include noise();
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
		}

		&__s-row {
			&__content {
				grid-column: 9 / span 4;
				grid-row: 2;

				@include mobile {
					grid-column: 1 / span 6;
					grid-row: 3;
				}

				&__title {
					@include mobile {
						text-align: right;
					}
				}

				&__text {
					margin-left: columns(1.35);
					margin-top: desktop-vw(30px);
					width: 65%;

					@include mobile {
						margin-top: mobile-vw(30px);
						margin-left: auto;
						width: 75%;
					}
				}
			}
			&__visual {
				grid-column: 4 / span 4;
				aspect-ratio: 460/550;
				transform: rotate(5.5deg);
				left: 0;
				position: absolute;
				top: desktop-vw(-100px);
				grid-row: 2;
				width: 100%;

				@include mobile {
					grid-column: 1 / span 4;
					top: 0;
					aspect-ratio: 230/290;
					top: mobile-vw(230px);
				}

				picture {
					z-index: 0;
					@include noise();
				}
			}
		}

		&__social-networks {
			display: flex;
			margin-top: desktop-vw(36px);

			@include mobile {
				margin-top: mobile-vw(24px);
			}
		}

		&__social-network {
			width: 56px;
			height: 56px;
			display: flex;
			justify-content: center;
			align-items: center;
			border-top: 1px solid var(--c-black);
			border-left: 1px solid var(--c-black);
			border-bottom: 1px solid var(--c-black);
			cursor: pointer;
			position: relative;

			svg {
				z-index: 1;

				path {
					fill: var(--c-black);
					// transition: fill 0.25s 0.1s var(--ease-out-expo);
				}
			}

			@include hover {
				&:hover {
					&::after {
						transform: scaleY(1);
					}
					svg {
						path {
							fill: var(--c-white);
						}
					}
				}
			}

			&::after {
				content: '';
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				background: var(--c-black);
				transform-origin: top center;
				transform: scaleY(0);
				transition: transform 0.65s var(--ease-out-expo);
			}

			&:last-child {
				border-left: 1px solid var(--c-black);
				border-right: 1px solid var(--c-black);
			}
		}

	}
</style>
