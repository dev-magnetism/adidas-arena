<template>
	<div class="app-paris-basketball-experience grid-inner">

		
    	<div class="app-paris-basketball-experience__f-row__content">
			<ERichText
				ref="maintitle"
				tag="h2"
				weight="regular"
				:content="contents.maintitle"
				class="app-paris-basketball-experience__f-row__content__title"
			/>

			<ERichText
				ref="bloc1title"
				tag="h4"
				weight="regular"
				:content="contents.bloc1.title"
				class="app-paris-basketball-experience__f-row__content__subtitle"
			/>

			<ERichText
				ref="bloc1paragraph"
				tag="p"
				weight="medium"
				:content="contents.bloc1.paragraph"
				class="app-paris-basketball-experience__f-row__content__text"
			/>

			<a
				v-if="contents.bloc1.cta"
				:href="contents.bloc1.cta.url"
				target="_blank"
				class="app-paris-basketball-experience__f-row__content__cta"
			>
				{{contents.bloc1.cta.label}}
			</a>
   		</div>

		<div
			ref="withFrame"
			v-if="contents.pictureFramed?.src"
			class="app-paris-basketball-experience__f-row__visual"
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
			</EKinesis>
    	</div>

	    
		<div
			ref="withoutFrame"
			v-if="contents.picture?.src"
			class="app-paris-basketball-experience__s-row__visual"
		>
			<EKinesis :speed="8.5">
				<AppPbbImage
	                :src="contents.picture.src"
	                :alt="contents.picture.alt"
	                :lazy="true"
	                :sizes="{
	                  desktop: 'w600,h600,fcrop,q85',
	                  mobile: 'w600,h600,fcrop,q85',
	                }"
	             />
			</EKinesis>
   		</div>

    	<div class="app-paris-basketball-experience__s-row__content">

			<ERichText
				ref="bloc2title"
				tag="h4"
				weight="regular"
				:content="contents.bloc2.title"
				class="app-paris-basketball-experience__s-row__content__title"
			/>

			<ERichText
				ref="bloc2subtitle"
				tag="h5"
				weight="regular"
				:content="contents.bloc2.subtitle"
				class="app-paris-basketball-experience__s-row__content__subtitle"
			/>

			<ERichText
				ref="bloc2paragraph"
				tag="p"
				weight="medium"
				:content="contents.bloc2.paragraph"
				class="app-paris-basketball-experience__s-row__content__text"
			/>

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
					this.$refs.withFrame,
					{
						y: '50%',
						rotate: 20,
					},
					{
						y: '0%',
						rotate: 10,
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
					rotate: 2,
					yPercent: -30,
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
	.app-paris-basketball-experience {
		position: relative;
		row-gap: desktop-vw(85px);
		background-color: var(--c-black);

		@include mobile {
			overflow-x: hidden;
			row-gap: mobile-vw(85px);
		}

		&__f-row {
			&__content {
				grid-column: 2 / span 4;
				grid-row: 1;

				@include mobile {
					grid-column: 1 / span 6;
				}

				&__title {
					margin-bottom: desktop-vw(72px);

					@include mobile {
						margin-bottom: mobile-vw(35px);
					}

					.H2{
						@include font-ITCFranklinGothicLT-BkCp();
						font-size: desktop-vw(100px);
						line-height: desktop-vw(90px);
						color: var(--c-white) !important;
						font-weight: 400;
						letter-spacing: desktop-vw(-3px);

						@include mobile {
							font-size: mobile-vw(64px);
							line-height: mobile-vw(57px);
							letter-spacing: mobile-vw(-1.92px);
						}

						strong{
							font-weight: 600;
						}
					}
				}

				&__subtitle {
					margin-bottom: desktop-vw(25px);

					@include mobile {
						margin-bottom: mobile-vw(20px);
					}

					.H4{
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
					margin-bottom: desktop-vw(25px);

					@include mobile{
						margin-bottom: mobile-vw(25px);
					}

					.P2{
						font-size: desktop-vw(17px);
						line-height: desktop-vw(20px);
						color: var(--c-white) !important;

						@include mobile{
							font-size: mobile-vw(17px);
							line-height: mobile-vw(20px);
						}
					}

				}

				&__cta{
					@include font-ITCFranklinGothicLT-BkCp();
					font-size: desktop-vw(16px);
					line-height: desktop-vw(24px);
					color: var(--c-light-blue);
					font-weight: 600;
					cursor:pointer;
					text-decoration: underline;
					text-transform: uppercase;

					@include mobile{
						font-size: mobile-vw(16px);
						line-height: mobile-vw(24px);
					}
				}
			}

			&__visual {
				position: relative;
				z-index:2;
				grid-column: 7 / span 5;
				aspect-ratio: 508 / 635;
				margin-top: desktop-vw(300px);
				transform: rotate(10deg);
				grid-row: 1;
				border: desktop-vw(20px) solid var(--c-red-adidas);

				@include mobile {
					grid-column: 3 / span 4;
					left: columns(-0.125);
					top: 0;
					grid-row: 2;
					margin-top: 0;
					aspect-ratio: 239/298;
					margin-bottom: mobile-vw(280px);
					border: mobile-vw(10px) solid var(--c-red-adidas);
				}

				picture {
					z-index: 0;
					@include noise();
				}
			}
		}

		&__s-row {
			&__content {
				grid-column: 9 / span 3;
				grid-row: 2;

				@include mobile {
					grid-column: 1 / span 6;
					grid-row: 3;
				}

				&__title {
					margin-bottom: desktop-vw(43px);

					@include mobile{
						margin-bottom: mobile-vw(24px);
					}

					.H4{
						@include font-ITCFranklinGothicLT-BkCp();
						font-size: desktop-vw(32px);
						line-height: desktop-vw(32px);
						color: var(--c-white) !important;
						letter-spacing: desktop-vw(-0.32px);
						font-weight: 600;

						@include mobile{
							font-size: mobile-vw(18px);
							line-height: mobile-vw(20px);
							font-weight: 600;
						}
					}
				}

				&__subtitle {
					margin-bottom: desktop-vw(25px);

					@include mobile {
						margin-bottom: mobile-vw(20px);
					}

					.H5{
						font-size: desktop-vw(18px);
						line-height: desktop-vw(20px);
						color: var(--c-white) !important;
						text-transform: uppercase;

						@include mobile {
							@include font-ITCFranklinGothicLT-BkCp();
							font-size: mobile-vw(18px);
							line-height: mobile-vw(20px);
							font-weight: 400;
						}
					}
				}

				&__text {
					
					.P2{
						font-size: desktop-vw(17px);
						line-height: desktop-vw(20px);
						color: var(--c-white) !important;

						@include mobile {
							font-size: mobile-vw(17px);
							line-height: mobile-vw(20px);
						}
					}

				}
			}

			&__visual {
				grid-column: 2 / span 5;
				z-index:1;
				aspect-ratio: 594/739;
				transform: rotate(5.5deg);
				left: desktop-vw(30px);
				position: absolute;
				top: desktop-vw(-200px);
				grid-row: 2;
				width: 100%;

				@include mobile {
					grid-column: 1 / span 5;
					top: 0;
					aspect-ratio: 239/298;
					left: 0;
					top: mobile-vw(230px);
					transform: rotate(-3.5deg);
				}

				picture {
					z-index: 0;
					@include noise();
				}
			}
		}

	}
</style>
