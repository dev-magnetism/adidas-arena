<template>

	<div class="app-paris-basketball-dj grid-inner">

    	<EParallax
    		v-if="contents.pictureFirst.src"
			ref="imageFirst"
			class="app-paris-basketball-dj__visual-first"
			:speed="0.85"
			>
			<EKinesis :speed="5">
			<nuxt-picture
				provider="directus"
				:src="contents.pictureFirst.src"
				format="webp"
				:alt="contents.pictureFirst.alt"
				sizes="sm:80vw md:90vw lg:100vw"
				/>
				<!-- AppPbbImage
		          :src="contents.pictureFirst.src"
		          :alt="contents.pictureFirst.alt"
		          :lazy="true"
		          :sizes="{
		            desktop: 'w600,h600,fcrop,q85',
		            mobile: 'w600,h600,fcrop,q85',
		          }"
		       / -->
	   		</EKinesis>
	   	</EParallax>

    	<div class="app-paris-basketball-dj__content">
	    	<ERichText
				ref="maintitle"
				tag="h2"
				weight="regular"
				:content="contents.maintitle"
				class="app-paris-basketball-dj__content__title"
			/>

			<ERichText
				ref="paragraph"
				tag="p"
				weight="regular"
				:content="contents.paragraph"
			    :scrub="true"
				class="app-paris-basketball-dj__content__paragraph"
			/>

			<div
				class="app-paris-basketball-dj__content__dj"
				v-if="contents.dj"
				>
				<div class="app-paris-basketball-dj__content__dj__name">
					{{contents.dj?.name}}
				</div>
				<div
					class="app-paris-basketball-dj__content__dj__link"
					v-if="contents.dj?.link"
					>
					(
					<a
						:href="contents.dj.link.url"
						target="_blank"
						class="app-paris-basketball-dj__content__dj__link__cta"
					>
						{{contents.dj.link.label}}
					</a>
					)
				</div>
			</div>

		</div>

		<EParallax
    		v-if="contents.pictureSecond.src"
			ref="imageSecond"
			class="app-paris-basketball-dj__visual-second"
			:speed="0.70"
		>
			<EKinesis :speed="3">
			<nuxt-picture
				provider="directus"
				:src="contents.pictureSecond.src"
				format="webp"
				:alt="contents.pictureSecond.alt"
				sizes="sm:80vw md:90vw lg:100vw"
				/>
				<!-- AppPbbImage
	                :src="contents.pictureSecond.src"
	                :alt="contents.pictureSecond.alt"
	                :lazy="true"
	                :sizes="{
	                  desktop: 'w600,h600,fcrop,q85',
	                  mobile: 'w600,h600,fcrop,q85',
	                }"
	             / -->
			</EKinesis>
    	</EParallax>



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
				// Première image : réaction très rapide au scroll
				const tweenImageFirst = gsap.fromTo(
					this.$refs.imageFirst?.$el,
					{
						top: 240,
					},
					{
						top: 15,
						scrollTrigger: {
							trigger: this.$refs.imageFirst?.$el,
							scrub: 0.15,
							end: 'bottom top',
						},
					}
				)
				// Seconde image : réaction beaucoup plus lente (effet très doux, décalé)
				const tweenImageSecond = gsap.fromTo(
					this.$refs.imageSecond?.$el,
					{
						top: 360,
					},
					{
						top: -25,
						scrollTrigger: {
							trigger: this.$refs.imageSecond?.$el,
							scrub: 1.2,
							end: 'bottom top',
						},
					}
				)

				return () => {
					tweenImageFirst?.kill()
					tweenImageSecond?.kill()
				}
			})
		},
	},

}
</script>

<style lang="scss">
	.app-paris-basketball-dj {
		position: relative;
		padding-top: desktop-vw(145px);
		padding-bottom: desktop-vw(180px);
		row-gap: desktop-vw(85px);
		background-color: var(--c-black);

		@include mobile {
			overflow-x: hidden;
			padding-top: mobile-vw(46px);
			padding-bottom: mobile-vw(180px);
			row-gap: mobile-vw(85px);
		}

		&__visual-first {
			position: absolute;
			grid-column: 1 / span 4;
			aspect-ratio: 346 / 431;
			width: 80%;
			top: desktop-vw(200px);

			@include mobile {
				position: relative;
				grid-column: 1 / span 4;
				grid-row: 2;
				top: 0;
				width: 100%;
				aspect-ratio: 244 / 304;
				transform: rotate(-3deg);
			}

		}


		&__content {
			position: relative;
			grid-column: 5 / span 4;


			@include mobile {
				grid-row: 1;
				grid-column: 1 / span 6;
			}

			&__title{
				margin: 0 0 desktop-vw(25px);

				@include mobile{
					margin: 0 0 mobile-vw(25px);
				}

				.H2{
					@include font-ITCFranklinGothicLT-BkCp();
					font-size: desktop-vw(100px);
					line-height: desktop-vw(90px);
					letter-spacing: desktop-vw(-3px);
					color: var(--c-white) !important;
					text-align: center;

					@include mobile{
						font-size: mobile-vw(64px);
						line-height: mobile-vw(57px);
						letter-spacing: mobile-vw(-1.92px);
						text-align: left;
					}

					strong{
						letter-spacing: desktop-vw(-3px);

						@include mobile{
							letter-spacing: mobile-vw(-1.92px);
						}
					}
				}

			}

			&__paragraph{
				margin: 0 auto;
				width: 80%;

				@include mobile{
					margin: 0 0 mobile-vw(8px);
					width: 100%;
				}

				.P2 {
					font-size: desktop-vw(17px);
					line-height: desktop-vw(20px);
					color: var(--c-white) !important;
					text-transform: initial;
					text-align: center;

					@include mobile{
						font-size: mobile-vw(17px);
						line-height: mobile-vw(20px);
						text-align: left;
					}
				}
			}

			&__dj{
				display: flex;
				flex-wrap: wrap;
				justify-content: center;

				@include font-ITCFranklinGothicLT-BkCp();
				font-size: desktop-vw(18px);
				line-height: desktop-vw(20px);
				color: var(--c-white);
				text-transform: uppercase;

				@include mobile{
					justify-content: flex-start;
					font-size: mobile-vw(18px);
					line-height: mobile-vw(20px);
				}

				&__name{
					display: block;
					flex: 0 0 auto;
					@include font-ITCFranklinGothicLT-BkCp();
					font-size: desktop-vw(18px);
					line-height: desktop-vw(20px);
					color: var(--c-white);
					text-transform: uppercase;

					@include mobile{
						font-size: mobile-vw(18px);
						line-height: mobile-vw(20px);
					}

				}


				&__link{
					margin: 0 0 0 desktop-vw(8px);
					font-size: desktop-vw(18px);
					line-height: desktop-vw(20px);
					cursor:pointer;
					text-decoration: none;

					@include mobile{
						margin: 0 0 0 mobile-vw(8px);
						font-size: mobile-vw(18px);
						line-height: mobile-vw(20px);
					}

					&__cta{
						color: var(--c-carmin-red);
					}

				}


			}

		}

		&__visual-second {
			position: absolute;
			grid-column: 9 / span 4;
			aspect-ratio: 346 / 431;
			width: 80%;
			top: desktop-vw(200px);
			left: columns(1);

			@include mobile {
				position: relative;
				grid-column: 4 / span 3;
				grid-row: 2;
				left: 0;
				top: mobile-vw(202px);
				width: 100%;
				aspect-ratio: 191 / 238;
				transform: rotate(3deg);
			}

		}


		&__list{
			&__item{
				margin: 0 0 desktop-vw(25px);

				@include mobile {
					margin: 0 0 mobile-vw(25px);
				}

				&__head{
					display: flex;
					flex-wrap: wrap;
					margin: 0 0 desktop-vw(25px);

					@include mobile {
						margin: 0 0 mobile-vw(25px);
					}

				}

				&__name{
					display: block;
					flex: 0 0 auto;
					@include font-ITCFranklinGothicLT-BkCp();
					font-size: desktop-vw(18px);
					line-height: desktop-vw(20px);
					color: var(--c-white);
					text-transform: uppercase;

					@include mobile {
						font-size: mobile-vw(18px);
						line-height: mobile-vw(20px);
					}

				}

				&__instagram{
					display: block;
					flex: 0 0 auto;
					margin: 0 0 0 desktop-vw(8px);

					@include font-ITCFranklinGothicLT-BkCp();
					font-size: desktop-vw(18px);
					line-height: desktop-vw(20px);
					color: var(--c-white);
					text-transform: uppercase;

					@include mobile {
						margin: 0 0 0 mobile-vw(8px);
						font-size: mobile-vw(18px);
						line-height: mobile-vw(20px);
					}

					&__link{
						font-size: desktop-vw(18px);
						line-height: desktop-vw(20px);
						cursor:pointer;
						text-decoration: underline;

						@include mobile {
							font-size: mobile-vw(18px);
							line-height: mobile-vw(20px);
						}
					}


				}

				&__text.app-element-rich-text {
					opacity: 0.8;

					.P2 {
						font-size: desktop-vw(17px);
						color: var(--c-white) !important;
						text-transform: initial;

						@include mobile{
							font-size: mobile-vw(16px);
						}
					}
				}
				&:nth-child(1){
					.app-paris-basketball-dj__list__item__instagram__link{
						color: var(--c-blue-adidas);
					}
				}
				&:nth-child(2){
					.app-paris-basketball-dj__list__item__instagram__link{
						color: var(--c-carmin-red);
					}
				}
			}
		}

	}
</style>
