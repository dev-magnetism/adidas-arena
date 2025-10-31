<template>
	<div class="page-cchapelle__about grid-inner">


		<div
			ref="mainvisual"
			v-if="contents.visual"
			class="page-cchapelle__about__visual"
		>
			<EKinesis :speed="5">
				 <ECornerPointsPicture :size-points="6">
					
					<nuxt-picture
						provider="directus"
						:src="contents.visual"
						format="webp"
						alt="About us"
						sizes="sm:80vw md:90vw lg:100vw"
						/>
       			 </ECornerPointsPicture>
			</EKinesis>
    	</div>

		<div
			ref="floatlabel1"
			class="page-cchapelle__about__floatlabel1"
		>
			<EKinesis :speed="9.5">
				<ECornerPointsPicture :size-points="6">
					{{contents.floatlabel1}}
				</ECornerPointsPicture>
			</EKinesis>
   		</div>

		<div
			ref="floatlabel2"
			class="page-cchapelle__about__floatlabel2"
		>
			<EKinesis :speed="5.5">
				<ECornerPointsPicture :size-points="6">
					{{contents.floatlabel2}}
				 </ECornerPointsPicture>
			</EKinesis>
   		</div>

		<div
			ref="floatlabel3"
			class="page-cchapelle__about__floatlabel3"
		>
			<EKinesis :speed="7.5">
				<ECornerPointsPicture :size-points="6">
					{{contents.floatlabel3}}
				</ECornerPointsPicture>
			</EKinesis>
   		</div>


		<div
			ref="arrow"
			class="page-cchapelle__about__arrow"
		>
			<EKinesis :speed="5.5">
				<img src="/imgs/arrow_yellow.png" 
					class="page-cchapelle__about__arrow__img"
					/>
			</EKinesis>
   		</div>

    	<div class="page-cchapelle__about__content">

			<ERichText
				ref="paragraph"
				tag="div"
				weight="regular"
				:content="contents.text"
				:scrub="false"
				class="page-cchapelle__about__content__text"
			/>

			<div class="page-cchapelle__about__social-networks">

				<a
					v-if="contents.socials_facebook"
					:href="contents.socials_facebook"
					target="_blank"
					class="page-cchapelle__about__social-network"
				>
					<SvgFooterFacebook />
				</a>
				<a
					v-if="contents.socials_linkedin"
					:href="contents.socials_linkedin"
					target="_blank"
					class="page-cchapelle__about__social-network"
				>
					<SvgFooterLinkedin />
				</a>
				<a
					v-if="contents.socials_instagram"
					:href="contents.socials_instagram"
					target="_blank"
					class="page-cchapelle__about__social-network"
				>
					<SvgFooterInstagram />
				</a>
				<a
					v-if="contents.socials_tiktok"
					:href="contents.socials_tiktok"
					target="_blank"
					class="page-cchapelle__about__social-network"
				>
					<SvgFooterTiktok />
				</a>
			</div>
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
					[this.$refs.paragraph],
					{
						y: -100,
					},
					{
						y: 0,
						duration: 0.6,
						ease: 'power3.out',
					},
					'texts+=15%'
				)
				.addLabel('visuals', 'texts')
				.fromTo(
					this.$refs.mainvisual,
					{
						y: '50%',
						rotate: -6.61,
					},
					{
						y: '0%',
						rotate: 6.61,
						duration: 0.5,
						ease: 'power3.out',
					},
					'visuals'
				)
				.fromTo(
					this.$refs.mainvisual,
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

				const tweenBigVisual = gsap.to(this.$refs.mainvisual, {
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
					tweenPointsVisual?.kill()
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
	.page-cchapelle__about {
		position: relative;
		margin-top: desktop-vw(264px);

		@include mobile {
			margin-top: mobile-vw(64px);
		}

		&__content {
			grid-column: 7 / span 6;

			@include mobile {
				grid-column: 1 / span 6;
			}

			&__text {

				@include mobile {

					margin-left: 0;
					width: 100%;
				}

				.P2{
					@include font-ITCFranklinGothicLT-DmXtraCp();
					font-size: desktop-vw(72px);
					line-height: desktop-vw(65px);
					text-transform: uppercase;

					@include mobile {
						font-size: mobile-vw(40px);
						line-height: mobile-vw(36px);
					}
				}

				.app-element-lottie-word.lottie-word.Trait_1 svg{
					bottom: desktop-vw(10px);

					@include mobile {
						bottom: mobile-vw(10px);
					}
				}

			}
		}

		&__arrow{
			position: absolute;
			top: desktop-vw(-50px);
			left: desktop-vw(500px);

			@include mobile {
				top: mobile-vw(90px);
				left: unset;
				right: desktop-vw(50px);
			}

			&__img{
				width: desktop-vw(90px);
				height: auto;

				@include mobile {
					width: mobile-vw(90px);
				}
			}

		}

		&__floatlabel1,
		&__floatlabel2,
		&__floatlabel3{
			position: absolute;

			.app-element-kinesis{
				background-color: var(--c-white);
				padding: desktop-vw(16px) desktop-vw(32px);

				@include font-ITCFranklinGothicLT-DmXtraCp();
				font-size: desktop-vw(39px);
				line-height: desktop-vw(32px);
				color: var(--c-black);
				text-align: center;

				@include mobile {
					padding: mobile-vw(16px) mobile-vw(32px);
					font-size: mobile-vw(39px);
					line-height: mobile-vw(32px);
				}
			}
		}

		&__floatlabel1{
			top: desktop-vw(-50px);
			left: columns(.65);
			transform: rotate(-7.382deg);

			@include mobile {
				top: mobile-vw(0px);
			}


			.app-element-kinesis{
				background-color: #F5F5F3;
				width: desktop-vw(245px);

				@include mobile {
					width: mobile-vw(245px);
				}
			}
		}

		&__floatlabel2{
			top: desktop-vw(80px);
			left:  desktop-vw(220px);
			transform: rotate(-7.493deg);

			@include mobile {
				top: mobile-vw(230px);
				left:  mobile-vw(50px);
				.app-element-kinesis{
					font-size: mobile-vw(27px);
					line-height: mobile-vw(20px);
					text-transform: uppercase;
				}
			}
		}

		&__floatlabel3{
			top: desktop-vw(370px);
			left:  desktop-vw(290px);
			transform: rotate(-9.352deg);

			@include mobile {
				top: mobile-vw(490px);
				left: unset;
				right: mobile-vw(55px);
				.app-element-kinesis{
					font-size: mobile-vw(27px);
					line-height: mobile-vw(20px);
					text-transform: uppercase;
				}
			}
		}

		&__visual {
			grid-column: 2 / span 4;
			aspect-ratio: 876/508;
			transform: rotate(-6.61deg);
			left: 0;
			position: absolute;
			top: desktop-vw(140px);
			width: 100%;

			@include mobile {
				grid-column: 2 / span 4;
				position: relative;
				top: unset;
				left: columns(-.5);
				margin-top: mobile-vw(285px);
				margin-bottom: mobile-vw(165px);
				transform: rotate(6.61deg);
				width: 140%;
			}

			&::after {
				content: '';
				display: block;
				position: absolute;
				top: 0;
				left: 0;
				background: linear-gradient(
					rgba(251, 245, 238, 0.5) 0.1em,
					transparent 0.1em
				),
				linear-gradient(
					90deg,
					rgba(251, 245, 238, 0.5) 0.1em,
					transparent 0.1em
				),
				var(--c-white);
				background-size: 1em 1em;
				width: 100%;
				height: 100%;
				z-index: -3;
			}

			picture {
				z-index: 0;

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

		&__social-networks {
			display: flex;
			margin-top: desktop-vw(36px);

			@include mobile {
				margin-left: 0;
				margin-top: mobile-vw(24px);
			}
		}

		&__social-network {
			width: desktop-vw(56px);
			height: desktop-vw(56px);
			display: flex;
			justify-content: center;
			align-items: center;
			border-top: 1px solid var(--c-black);
			border-left: 1px solid var(--c-black);
			border-bottom: 1px solid var(--c-black);
			cursor: pointer;
			position: relative;

			@include mobile {
				width: mobile-vw(56px);
				height: mobile-vw(56px);
			}

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
