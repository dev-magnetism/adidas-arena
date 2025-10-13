<template>

	<div class="app-paris-basketball-merch grid-inner">

		<div class="app-paris-basketball-merch__f-row__content">
			<ERichText
				ref="maintitle"
				tag="h2"
				weight="regular"
				:content="contents.maintitle"
				class="app-paris-basketball-merch__f-row__content__title"
			/>
		</div>

		<EParallax
			v-if="contents.pictureFramed?.src"
			ref="withoutFrame"
			class="app-paris-basketball-merch__visual-without-frame"
			:speed="0.75"
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
    	</EParallax>

    	<EParallax
			v-if="contents.picture?.src"
			ref="frameWrapper"
			class="app-paris-basketball-merch__visual-with-frame"
			:speed="0.85"
		>
			<EKinesis :speed="8.5">

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
   		</EParallax>
   		<ELottie
			id="Fleche_2"
			start="top bottom-=15%"
			class="app-paris-basketball-merch__lottie-arrow"
		/>
    	<div class="app-paris-basketball-merch__content">

			<ERichText
				ref="paragraph"
				tag="div"
				weight="medium"
				:content="contents.paragraph"
			    :scrub="true"
				class="app-paris-basketball-merch__content__paragraph"
			/>

			 <AtomsCTA
            	class="app-paris-basketball-merch__content__cta"
            	bg="blue-adidas"
            	color="white"
            	:href="contents.cta.link"
            	target="_blank"
            	layer-color="black"
          		>
           		{{contents.cta.label}}
          	</AtomsCTA>
		</div>


	</div>

</template>

<script>
import { gsap } from 'gsap'

export default {
	props: {
		contents: {
			type: Object,
			default: () => {},
		},
	},
	mounted() {
		this.initMatchMedia()
	},
	beforeDestroy() {
		this.mm?.revert()
	},
	methods: {
		initMatchMedia() {
			this.mm = gsap.matchMedia()

			this.mm.add('(min-width: 768px)', (context) => {
				const tweenFrame = gsap.fromTo(
					this.$refs.frameWrapper?.$el,
					{
						rotate: -10,
					},
					{
						rotate: -6,
						scrollTrigger: {
							trigger: this.$refs.frameWrapper?.$el,
							scrub: 0.5,
							end: 'bottom top',
						},
					}
				)
				const tweenWithoutFrame = gsap.fromTo(
					this.$refs.withoutFrame?.$el,
					{
						rotate: 14,
					},
					{
						rotate: 2,
						scrollTrigger: {
							trigger: this.$refs.withoutFrame?.$el,
							scrub: 0.5,
							end: 'bottom top',
						},
					}
				)

				return () => {
					tweenFrame?.kill()
					tweenWithoutFrame?.kill()
				}
			})
		},
	},	

}
</script>

<style lang="scss">
	.app-paris-basketball-merch {
		position: relative;
		padding-top: desktop-vw(220px);
		margin-bottom: desktop-vw(60px);
		row-gap: desktop-vw(85px);

		@include mobile {
			overflow-x: hidden;
			padding-top: mobile-vw(100px);
			margin-bottom: mobile-vw(175px);
			row-gap: mobile-vw(85px);
		}

		&__f-row {
			&__content {
				grid-column: 1 / span 8;
				grid-row: 1;

				@include mobile {
					grid-column: 1 / span 6;
				}

				&__title {

					@include mobile{
						margin-bottom: mobile-vw(500px);
					}

					.H2{
						@include font-ITCFranklinGothicLT-BkCp();
						font-weight: 400;

						strong{
							font-weight: 600;
						}

						@include mobile{
							font-size: mobile-vx(64px);
						}
					}
				}
			}
		}

		&__lottie-trait1.app-element-lottie {
			position: absolute;
			width: 30%;
			bottom: desktop-vw(10px);
			left: desktop-vw(45px);
			height: auto !important;

			@include mobile {
				bottom: mobile-vw(10px);
				left: mobile-vw(45px);
			}

		}

		&__lottie-arrow.app-element-lottie {
			position: absolute;
			grid-column: 6 / span 2;
			width: 30%;
			top: desktop-vw(300px);
			left: desktop-vw(45px);
			transform: rotate(45deg);
			aspect-ratio: 12 / 48;
			height: auto !important;

			@include mobile {
				grid-column: 4 / span 3;
				top: mobile-vw(150px);
				left: mobile-vw(75px);
				width: 35%;
				transform: rotate(30deg);
			}
		}

		&__visual-without-frame {
			position: relative;
			grid-column: 1 / span 5;
			aspect-ratio: 641 / 427;
			width: 110%;
			top: 0;
			left: desktop-vw(30px);
			transform: rotate(-6deg);
			margin-bottom: desktop-vw(300px);

			@include mobile {
				position: absolute;
				grid-column: 1 / span 6;
				aspect-ratio: 382 / 254;
				top: mobile-vw(300px);
				left: mobile-vw(-5px);
				width: 100%;
				margin-bottom: mobile-vw(140px);
			}


			picture {
				
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

		&__visual-with-frame {
			position: absolute;
			grid-column: 5 / span 3;
			aspect-ratio: 339 / 420;
			width: 100%;
			top: desktop-vw(600px);
			left: desktop-vw(30px);
			transform: rotate(8deg);

			@include mobile {
				grid-column: 2 / span 4;
				top: mobile-vw(500px);
				left: mobile-vw(10px);
				width: 90%;
				aspect-ratio: 238 / 290;
			}

			picture {
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

			.app-element-lottie {
				width: 111%;
				top: 50%;
				left: 50%;
				height: auto;
				transform: translate(-50%, -50%) rotate(6deg);
			}
		}

		&__content {
			position: relative;
			grid-column: 8 / span 3;

			@include mobile {
				grid-row: 2;
				grid-column: 1 / span 6;
			}

			&__paragraph.app-element-rich-text {
				opacity: 0.8;
			}


			&__paragraph.app-element-rich-text {
				margin: 0 0 desktop-vw(48px);

				@include mobile{
					margin: 0 0 mobile-vw(48px);
				}

				.P2 {
					font-size: desktop-vw(17px);

					@include mobile{
						font-size: mobile-vw(16px);
					}
				}

				.app-element-lottie-word.Trait_1{

					@include font-ITCFranklinGothicLT-DmCp();

					svg{
						left: unset !important;
						right: 0;
						width: 80% !important;
						transform: translate(0, 100%) !important;
					}
				}
			}

			.app-atoms-cta {
				margin-top: desktop-vw(50px);

				@include mobile {
					margin-top: mobile-vw(25px);
					width: 75%;
				}

				&::after {
					background: var(--c-black);
				}
			}

			.P2 {
				text-transform: initial;
			}
		}

	}
</style>