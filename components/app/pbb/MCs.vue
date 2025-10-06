<template>

	<div class="app-paris-basketball-mcs grid-inner">

    <EParallax
			ref="frameWrapper"
			class="app-paris-basketball-mcs__visual-with-frame"
			:speed="0.85"
		>
			<EKinesis :speed="8.5">
				<AppPbbImage
	                :src="contents.pictureFramed.src"
	                :alt="contents.pictureFramed.alt"
	                :lazy="true"
	                :sizes="{
	                  desktop: 'w600,h600,fcrop,q85',
	                  mobile: 'w600,h600,fcrop,q85',
	                }"
	             />
				<ELottie id="Cadre_01" />
			</EKinesis>
   	</EParallax>

		<EParallax
			ref="withoutFrame"
			class="app-paris-basketball-mcs__visual-without-frame"
			:speed="0.75"
		>
			<EKinesis :speed="5">
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
    </EParallax>

		<EKinesis
			:speed="9.5"
			class="app-paris-basketball-mcs__visual-with-transparency"
	    >
	    	<AppPbbImage
                :src="contents.pictureTransparent.src"
                :alt="contents.pictureTransparent.alt"
                :lazy="true"
                :sizes="{
                  desktop: 'w600,h600,fcrop,q85',
                  mobile: 'w600,h600,fcrop,q85',
                }"
             />
			<AtomsCornerPoints 
				:size-points="8" 
				:border-color="'white'" 
				:points-color="'white'" 

			/>
	    </EKinesis>

    	<div class="app-paris-basketball-mcs__content">
	    	<ERichText
				ref="maintitle"
				tag="h2"
				weight="regular"
				:content="contents.maintitle"
				class="app-paris-basketball-mcs__content__title"
			/>

			<div class="app-paris-basketball-mcs__list">

				<div 
					class="app-paris-basketball-mcs__list__item"
					v-for="(item, index) in contents.items"
					:key="`mcs-${index}`"
				>
					<div class="app-paris-basketball-mcs__list__item__head">
						<div class="app-paris-basketball-mcs__list__item__name">
							{{item.name}}
						</div>
						<div 
							class="app-paris-basketball-mcs__list__item__instagram"
							v-if="item.instagram"
							>
							(
							<a
								:href="item.instagram.url"
								target="_blank"
								class="app-paris-basketball-mcs__list__item__instagram__link"
							>
								{{item.instagram.label}}
							</a>
							)
						</div>
					</div>
					<ERichText
						tag="p"
						weight="regular"
						:content="item.text"
						class="app-paris-basketball-mcs__list__item__text"
					/>
				</div>

			</div>

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
					this.$refs.frameWrapper.$el,
					{
						rotate: -10,
					},
					{
						rotate: -6,
						scrollTrigger: {
							trigger: this.$refs.frameWrapper.$el,
							scrub: 0.5,
							end: 'bottom top',
						},
					}
				)
				const tweenWithoutFrame = gsap.fromTo(
					this.$refs.withoutFrame.$el,
					{
						rotate: 8,
					},
					{
						rotate: 1,
						scrollTrigger: {
							trigger: this.$refs.withoutFrame.$el,
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
	.app-paris-basketball-mcs {
		position: relative;
		padding-top: desktop-vw(145px);
		padding-bottom: desktop-vw(80px);
		row-gap: desktop-vw(85px);
		background-color: var(--c-black);

		@include mobile {
			overflow-x: hidden;
			padding-top: mobile-vw(69px);
			padding-bottom: mobile-vw(80px);
			row-gap: mobile-vw(85px);
		}

		&__visual-with-frame {
			position: absolute;
			grid-column: 1 / span 4;
			aspect-ratio: 440 / 548;
			width: 100%;
			top: desktop-vw(209px);
			left: desktop-vw(30px);
			transform: rotate(8deg);

			@include mobile {
				position: relative;
				z-index: 1;
				grid-row: 3;
				grid-column: 1 / span 3;
				top: mobile-vw(-120px);
				left: mobile-vw(-50px);
				width: 175%;
				aspect-ratio: 327 / 408;
				transform: rotate(-6deg);
			}

			picture {
				@include noise();
			}

			.app-element-lottie {
				width: 111%;
				top: 50%;
				left: 50%;
				height: auto;
				transform: translate(-50%, -50%) rotate(6deg);
			}
		}


		&__visual-without-frame {
			position: absolute;
			grid-column: 4 / span 2;
			aspect-ratio: 280 / 380;
			width: 140%;
			top: desktop-vw(424px);
			left: desktop-vw(0px);
			transform: rotate(1deg);

			@include mobile {
				position:relative;
				z-index: 3;
				grid-row: 3;
				grid-column: 4 / span 3;
				aspect-ratio: 208 / 280;
				width: 125%;
				top: mobile-vw(50px);
				left: mobile-vw(20px);
			}

		}

		&__visual-with-transparency {
			position: absolute;
			grid-column: 7 / span 2;
			aspect-ratio: 270 / 270;
			top: desktop-vw(77px);
			left: desktop-vw(-200px);
			transform: rotate(6deg);
			width: desktop-vw(270px);
			height: desktop-vw(270px);

			@include fake-transparent();

			@include mobile {
				position: relative;
				z-index: 2;
				grid-row: 2;
				grid-column: 4 / span 3;
				aspect-ratio: 260 / 260;
				top: unset;
				left: unset;
				width: unset;
				height: unset;
			}

			.app-paris-basketball-image{
				top: 50%;
				left: 50%;

				aspect-ratio: 152 / 152;
				width: 50%;
				height: auto;
				transform: translate(-50%, -50%) rotate(6deg);

				@include mobile{
					width: 60%;
				}
			}
		}

		&__content {
			position: relative;
			grid-column: 9 / span 4;

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
					font-size: desktop-vw(100px);
					line-height: desktop-vw(90px);
					letter-spacing: desktop-vw(-3px);

					@include mobile{
						font-size: mobile-vw(64px);
						line-height: mobile-vw(57px);
						letter-spacing: mobile-vw(-1.92px);
					}

					strong{
						color: var(--c-white);
					}
				}

				.app-atoms-stroke-text{
					-webkit-text-stroke: 1px var(--c-white);
					-webkit-text-fill-color: inherit;
				}
			}

		}

		&__list{
			&__item{
				margin: 0 0 desktop-vw(25px);

				@include mobile{
					margin: 0 0 mobile-vw(25px);
				}

				&__head{
					display: flex;
					flex-wrap: wrap;
					margin: 0 0 desktop-vw(25px);

					@include mobile{
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

					@include mobile{
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

					@include mobile{
						margin: 0 0 0 mobile-vw(8px);
					}

					&__link{
						font-size: desktop-vw(18px);
						line-height: desktop-vw(20px);
						cursor:pointer;
						text-decoration: underline;

						@include mobile{
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
					.app-paris-basketball-mcs__list__item__instagram__link{
						color: var(--c-blue-adidas);
					}
				}
				&:nth-child(2){
					.app-paris-basketball-mcs__list__item__instagram__link{
						color: var(--c-carmin-red);
					}
				}
			}
		}

	}
</style>