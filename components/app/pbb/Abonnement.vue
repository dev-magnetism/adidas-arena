<template>
	<div class="app-paris-basketball-abonnement grid-inner">


    	<div class="app-paris-basketball-abonnement__content">
			<ERichText
				ref="maintitle"
				tag="h2"
				weight="regular"
				:split="false"
				:content="contents.maintitle"
				class="app-paris-basketball-abonnement__content__title"
			/>

			<ERichText
				ref="introduction"
				tag="p"
				weight="medium"
				:content="contents.introduction"
				class="app-paris-basketball-abonnement__content__introduction"
			/>

			<ERichText
				ref="detail"
				tag="p"
				weight="medium"
				:content="contents.detail"
				class="app-paris-basketball-abonnement__content__text"
			/>

			<AtomsCTA
				:href="contents.cta.link"
				class="app-paris-basketball-abonnement__content__cta"
			>
				{{ contents.cta.label }}
			</AtomsCTA>
   		</div>

		<div
			ref="bigVisual"
			v-if="contents.pictureFramed?.src"
			class="app-paris-basketball-abonnement__visual"
		>
			<EKinesis :speed="5">
				<AtomsCornerPoints :size-points="8" />
				<nuxt-picture
					provider="directus"
					:src="contents.pictureFramed.src"
					format="webp"
					:alt="contents.pictureFramed.alt"
					sizes="sm:80vw md:90vw lg:100vw"
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
				.addLabel('visuals', 'texts')
				.fromTo(
					this.$refs.bigVisual,
					{
						y: '50%',
						rotate: 10,
					},
					{
						y: '0%',
						rotate: 5,
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
			margin-bottom: mobile-vw(130px);
			overflow-x: hidden;
			row-gap: mobile-vw(32px);
		}

		&__content {
			grid-column: 1 / span 10;
			grid-row: 1;

			@include mobile {
				grid-column: 1 / span 6;
				grid-row: 2;
			}

			&__title {
				margin-bottom: desktop-vw(40px);

				@include mobile{
					margin-bottom: mobile-vw(40px);
				}

				.H2{
					@include font-ITCFranklinGothicLT-BkCp();
					font-size: desktop-vw(135px);
					line-height: desktop-vw(135px);
					font-weight: 400;
					letter-spacing: desktop-vw(-4.05px);

					@include mobile{
						font-size: mobile-vw(64px);
						line-height: mobile-vw(64px);
						letter-spacing: mobile-vw(-1.92px);
					}

					strong{
						display: unset !important;
						font-weight: 600;
					}
				}
			}

			&__introduction {
				margin: 0 0 desktop-vw(41px) desktop-vw(115px);
				width: 30%;

				text-transform: uppercase;

				@include mobile {
					margin: 0 auto mobile-vw(20px);
					width: 100%;
				}

				.P2{

					font-size: desktop-vw(18px);
					line-height: desktop-vw(20px);

					@include mobile {
						font-size: mobile-vw(18px);
						line-height: mobile-vw(20px);
					}
				}


			}

			&__text {
				margin: 0 0 desktop-vw(064px) desktop-vw(115px);
				width: 30%;

				@include mobile {
					margin: 0 auto mobile-vw(20px);
					width: 100%;
				}

				.P2{

					font-size: desktop-vw(17px);
					line-height: desktop-vw(20px);

					@include mobile {
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
						list-style-position: inside;

						@include mobile {
							font-size: mobile-vw(17px);
							line-height: mobile-vw(20px);
						}

						&::marker{
							font-size: desktop-vw(8px);

							@include mobile {
								font-size: mobile-vw(8px);
							}
						}
					}
				}
			}

			&__cta{
				margin: 0 0 desktop-vw(20px) desktop-vw(115px);
				width: 25%;

				@include mobile {
					margin: 0 0 mobile-vw(20px);
					width: 66%;
				}

			}
		}
		&__visual {
			position: relative;
			grid-column: 8 / span 7;
			aspect-ratio: 669 / 680;
			left: columns(-1);
			margin-top: desktop-vw(400px);
			transform: rotate(5deg);
			grid-row: 1;

			@include mobile {
				grid-column: 2 / span 5;
				left: columns(-0.25);
				top: 0;
				grid-row: 1;
				margin-top: mobile-vw(20px);
				aspect-ratio: 325/330;
				margin-bottom: mobile-vw(45px);
			}

			picture {
				z-index: 0;
				@include noise();
			}

		}
	}
</style>
