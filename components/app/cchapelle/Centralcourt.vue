<template>
	<div class="page-cchapelle__centralcourt">

		<div class="page-cchapelle__centralcourt__introduction grid">
			<div class="page-cchapelle__centralcourt__introduction__content">

    		<ELottie 
    			id="Petite_Fleche_04" 
				start="top bottom-=15%"
				color="blue-adidas"
				class="page-cchapelle__centralcourt__introduction__arrowsmall1"
    			/>

    		<ELottie 
    			id="Petite_Fleche_05" 
				start="top bottom-=15%"
				color="white"
				class="page-cchapelle__centralcourt__introduction__arrowsmall2"
    			/>

				<ERichText
					ref="paragraph"
					tag="div"
					weight="regular"
					:content="contents.introduction"
				    :scrub="false"
					class="page-cchapelle__centralcourt__introduction__content__paragraph"
				/>

    		<ELottie 
    			id="Fleche_3" 
				start="top bottom-=15%"
				color="white"
				class="page-cchapelle__centralcourt__introduction__arrowsmall3"
    			/>
			</div>
		</div>

		<div class="page-cchapelle__centralcourt__f-r grid">
			<div class="page-cchapelle__centralcourt__f-r__visuals">
				<div class="page-cchapelle__centralcourt__f-r__fake-transparent">
					<EKinesis :speed="15">
						<EParallax :speed="0.5" />
					</EKinesis>
				</div>

				<EParallax :speed="0.75" class="page-cchapelle__centralcourt__f-r__card">
					<EKinesis :speed="7.5">
						<AtomsCornerPoints :size-points="8" />
						<div class="page-cchapelle__centralcourt__f-r__card__content">
							<div
								class="page-cchapelle__centralcourt__f-r__card__content__title"
							>
								<TH2
									tag="p"
									weight="bold"
								>

									{{ contents.paragraph1.card.title }}
								</TH2>
							</div>
							<div
								class="page-cchapelle__centralcourt__f-r__card__content__subtitle"
							>
								<ELottieWord id="Cercle_3" />
								<TH2
									tag="p"
									weight="bold"
								>
									{{ contents.paragraph1.card.subtitle }}
								</TH2>
							</div>
							<TH4
								tag="p"
								weight="medium"
								class="page-cchapelle__centralcourt__f-r__card__content__paragraph"
							>
								{{ contents.paragraph1.card.text }}
							</TH4>
						</div>
					</EKinesis>
				</EParallax>
			</div>
			<div class="page-cchapelle__centralcourt__f-r__content">
				<ERichText
					class="page-cchapelle__centralcourt__f-r__content__title"
					:content="contents.paragraph1.title"

				/>
				<ERichText
					class="page-cchapelle__centralcourt__f-r__content__paragraph"
					:content="contents.paragraph1.text"
				/>
			</div>
			<ELottie
				id="Petite_Fleche_02"
				class="page-cchapelle__centralcourt__f-r__lottie-arrow"
			/>
		</div>

		<div class="page-cchapelle__centralcourt__s-r grid">
			<div class="page-cchapelle__centralcourt__s-r__content">
				<ERichText
					class="page-cchapelle__centralcourt__s-r__content__title"
					:content="contents.paragraph2.title"
					tag="h3"
				/>
				<ERichText
					class="page-cchapelle__centralcourt__s-r__content__paragraph"
					:content="contents.paragraph2.text"
				/>
				<AtomsCTA 
					bg="blue-adidas" 
					color="white"
					:href="contents.paragraph2.cta.url"
					>
					{{ contents.paragraph2.cta.label }}
				</AtomsCTA>
			</div>

			<div class="page-cchapelle__centralcourt__s-r__visuals">
				<EParallax :speed="0.75" class="page-cchapelle__centralcourt__s-r__visual">
					<EKinesis :speed="15">
						<nuxt-picture
							v-if="contents.paragraph2.visual"
							provider="directus"
							:src="contents.paragraph2.visual"
							format="webp"
							:alt="contents.paragraph2.title"
							sizes="sm:40vw md:35vw lg:50vw"
							loading="lazy"
						/>
					</EKinesis>
				</EParallax>

				<EParallax :speed="0.5" class="page-cchapelle__centralcourt__s-r__card">
					<EKinesis :speed="7.5">
						<AtomsCornerPoints :size-points="8" />
						<div class="page-cchapelle__centralcourt__s-r__card__content">
							<div
								class="page-cchapelle__centralcourt__s-r__card__content__title"
							>
								<ELottieWord id="Cercle_4" />
								<TH2
									tag="p"
									weight="bold"
								>
									{{ contents.paragraph2.card.title }}
								</TH2>
							</div>
							<TH2
								tag="p"
								weight="bold"
								class="page-cchapelle__centralcourt__s-r__card__content__subtitle"
							>
								{{ contents.paragraph2.card.subtitle }}
							</TH2>
							<TH4
								tag="p"
								weight="medium"
								class="page-cchapelle__centralcourt__s-r__card__content__paragraph"
							>
								{{ contents.paragraph2.card.text }}
							</TH4>
							
						</div>
					</EKinesis>
				</EParallax>
			</div>
		</div>
	</div>
</template>

<script>

export default {
	props: {
		contents: {
			type: Object,
			default: () => {},
		},
	},
	mounted() {

		console.log('Introduction / contents', this.contents);

	},
}
</script>

<style lang="scss">
.page-cchapelle{

	&__centralcourt{

		margin-top: desktop-vw(258px);
		margin-bottom: desktop-vw(122px);

		@include mobile {
			margin-top: mobile-vw(200px);
			margin-bottom: mobile-vw(100px);
		}

		&__introduction{
			margin-bottom: desktop-vw(205px);

			@include mobile {
				margin-bottom: mobile-vw(220px);
			}


			&__arrowsmall1.app-element-lottie {
				position: absolute;
				top: desktop-vw(-140px);
				left: 10%;
				width: auto;
				height: desktop-vw(85px);

				@include mobile {
					top: mobile-vw(-150px);
					height: mobile-vw(80px);
				}
			}

			&__arrowsmall2.app-element-lottie {
				position: absolute;
				top: desktop-vw(-140px);
				right: 15%;
				width: auto;
				height: desktop-vw(80px);

				@include mobile {
					top: mobile-vw(-100px);
					height: mobile-vw(40px);
				}
			}

			&__arrowsmall3.app-element-lottie {
				position: absolute;
				bottom: desktop-vw(-250px);
				left: -5%;
				width: 20%;
				height: auto !important;

				@include mobile {
					left: 5%;
					bottom: mobile-vw(-100px);
					transform: rotate(-12deg)!important;
				}
			}

			&__content {
				position: relative;
				grid-column: 4 / span 8;

				left: columns(-.25);
				grid-row: 1;

				@include mobile {
					grid-row: 1;
					grid-column: 1 / span 6;
					left: unset;
				}

				&__paragraph{
					width: 95%;


					@include mobile{
						width: 100%;
					}

					.P2 {
						font-size: desktop-vw(100px);
						line-height: desktop-vw(90px);
						color: var(--c-black) !important;
						text-transform: uppercase;
						text-align: center;
						letter-spacing: desktop-vw(-2px);

						@include mobile{
							font-size: mobile-vw(64px);
							line-height: mobile-vw(48px);
							letter-spacing: mobile-vw(-1.28px);
						}

						.app-element-lottie-word.lottie-word.Cercle_2 svg{
							bottom: desktop-vw(-20px);

							@include mobile{
								bottom: mobile-vw(-20px);
							}
						}

						.app-element-lottie-word.lottie-word.Trait_3 svg{
							position: absolute;
							bottom: desktop-vw(-30px);
							transform: scale(1, 0.4)!important;

							@include mobile{
								bottom: mobile-vw(-30px);
							}
						}
						
						.app-atoms-stroke-text{
							display: unset;
							-webkit-text-stroke: 1px var(--c-white);
							-webkit-text-fill-color: transparent;
						}
					}
				}

			}
		}

		&__s-r {
			grid-row: 2;
			grid-column: 1 / span 12;
			width: 100%;

			@include mobile {
				grid-column: 1 / span 6;
				grid-row: 3;
			}

			&__visuals {
				grid-column: 7 / span 6;
				position: relative;

				@include mobile {
					grid-column: 2 / span 4;
					margin: 0 0 mobile-vw(25px);
					left: columns(-.125);

					grid-row: 1;
				}
			}

			&__visual.app-parallax {
				aspect-ratio: 345 / 430;
				display: block;
				width: columns(2.75);
				position: absolute;
				transform: rotate(-3deg);
				top: desktop-vw(-10px);
				left: desktop-vw(80px);

				@include mobile{
					display: none;
				}

			}

			&__card.app-parallax {
				width: columns(3.25);
				margin-left: auto;
				transform: rotate(5deg);
				position: relative;
				top: desktop-vw(-200px);


				@include mobile{
					top: 0;
					width: 120%;
					margin: 0;
				}

				.page-cchapelle__centralcourt__s-r__card__content {
					padding: desktop-vw(45px) desktop-vw(40px) desktop-vw(45px)
					desktop-vw(40px);
					background: linear-gradient(
							rgba(251, 245, 238, 0.8) 0.1em,
							transparent 0.1em
						),
						linear-gradient(
							90deg,
							rgba(251, 245, 238, 0.8) 0.1em,
							transparent 0.1em
						),
						white;
					background-size: 1.3em 1.3em;

					@include mobile{
						padding: mobile-vw(19px) mobile-vw(24px) mobile-vw(24px) mobile-vw(24px);
					}


					.page-cchapelle__centralcourt__s-r__card__content__title {
						
						position: relative;
						display: inline-block;

						.H2{
							@include font-ITCFranklinGothicLT-DmXtraCp();
							font-size: desktop-vw(190px);
							line-height: desktop-vw(160px);


							@include mobile{
								font-size: mobile-vw(100px);
								line-height: mobile-vw(100px);
							}
						}

						.app-element-lottie-word {
							position: absolute;
							width: 130%;
							height: auto;
							left: 50%;
							top: 40%;
							transform: translate(-50%, -50%);
							align-items: center;
						}
					}

					.page-cchapelle__centralcourt__s-r__card__content__subtitle {
						&.H2{
							@include font-ITCFranklinGothicLT-DmXtraCp();
							font-size: desktop-vw(64px);
							line-height: desktop-vw(76px);


							@include mobile{
								font-size: mobile-vw(64px);
								line-height: mobile-vw(46px);
							}
						}
					}

					.page-cchapelle__centralcourt__s-r__card__content__paragraph {
						opacity: 0.4;
						margin-top: desktop-vw(20px);						
						@include font-ITCFranklinGothicLT-DmXtraCp();

						@include mobile{
							@include font-ITCFranklinGothicLT-BkCp();
							font-weight: 400;
							margin-top: mobile-vw(24px);
							font-size: mobile-vw(24px);
							line-height: mobile-vw(24px);
						}
					}
				}
			}

			&__content {
				grid-column: 1 / span 6;

				@include mobile {
					grid-column: 1 / span 6;
				}

				&__title.app-element-rich-text {
					

					@include mobile {
						width: 75%;
					}

					.H3{

						@include font-ITCFranklinGothicLT-BkCp();
						font-size: desktop-vw(100px);
						line-height: desktop-vw(90px);
						letter-spacing: desktop-vw(-2px);

						strong{
							@include font-ITCFranklinGothicLT-DmCp();
						}

						@include mobile {
							font-size: mobile-vw(49px);
							line-height: mobile-vw(40px);
							letter-spacing: mobile-vw(-1.28px);
						}

						.app-atoms-stroke-text{
							@include font-ITCFranklinGothicLT-DmCp();
							-webkit-text-stroke: 1px var(--c-black);
							-webkit-text-fill-color: transparent;
						}
					}
				}

				&__paragraph.app-element-rich-text {
					position: relative;
					margin-top: desktop-vw(25px);
					margin-bottom: desktop-vw(25px);
					left: columns(1);
					width: columns(3);

					@include mobile {
						width: 100%;
						left: unset;
						margin-top: mobile-vw(20px);
						margin-bottom: mobile-vw(20px);
					}

					.P1.wysiwyg-text {
						text-transform: uppercase;
						font-weight: 400;

					}
				}

				.app-atoms-cta{
					left: columns(1);
					width: columns(3);
					@include mobile {
						width: 80%;
						left: unset;
					}
				}
			}
		}

		&__f-r {
			grid-row: 1;
			grid-column: 1 / span 12;
			margin-bottom: desktop-vw(200px);
			position: relative;

			@include mobile {
				grid-column: 1 / span 6;
				margin-bottom: mobile-vw(40px);
			}

			&__lottie-arrow.app-element-lottie {
				position: absolute;
				grid-column: 6 / span 1;
				width: 135%;
				aspect-ratio: 85 / 35;

				@include mobile {
					display: none;
				}

				svg {
					path {
						stroke: var(--c-blue-adidas);
					}
				}
			}

			&__visuals {
				grid-column: 2 / span 4;
				position: relative;
				margin-top: desktop-vw(120px);

				@include mobile {
					grid-column: 2 / span 4;
					margin: 0;
					left: columns(-.125);
					grid-row: 2;
				}
			}

			&__card.app-parallax {
				z-index: 1;
				position: relative;
				width: 85%;
				margin-left: auto;
				transform: rotate(-2.85deg);
				top: desktop-vw(50px);

				@include mobile{
					top: 0;
					width: 120%;
					margin: 0;
				}

				.page-cchapelle__centralcourt__f-r__card__content {
					padding: desktop-vw(25px) desktop-vw(40px) desktop-vw(15px)
					desktop-vw(40px);
					background: linear-gradient(
							rgba(251, 245, 238, 0.8) 0.1em,
							transparent 0.1em
						),
						linear-gradient(
							90deg,
							rgba(251, 245, 238, 0.8) 0.1em,
							transparent 0.1em
						),
						white;
					background-size: 1.3em 1.3em;

					@include mobile{
						padding: mobile-vw(19px) mobile-vw(24px) mobile-vw(24px) mobile-vw(24px);
					}

					.page-cchapelle__centralcourt__f-r__card__content__title {

						.H2{
							@include font-ITCFranklinGothicLT-DmXtraCp();
							font-size: desktop-vw(190px);
							line-height: desktop-vw(160px);

							@include mobile{
								font-size: mobile-vw(100px);
								line-height: mobile-vw(100px);
							}
						}
					}

					.page-cchapelle__centralcourt__f-r__card__content__subtitle {
						
						display: inline-block;
						position: relative;

						.H2{
							@include font-ITCFranklinGothicLT-DmXtraCp();
							font-size: desktop-vw(96px);
							line-height: desktop-vw(106px);

							@include mobile{
								font-size: mobile-vw(64px);
								line-height: mobile-vw(46px);
							}
						}

						.app-element-lottie-word {
							position: absolute;
							width: 160%;
							height: auto;
							left: 50%;
							top: 40%;
							transform: translate(-50%, -50%) rotate(5deg);
							align-items: center;
						}
					}

					.page-cchapelle__centralcourt__f-r__card__content__paragraph {
						opacity: 0.4;

						@include font-ITCFranklinGothicLT-DmXtraCp();


						@include mobile{
							@include font-ITCFranklinGothicLT-BkCp();
							font-weight: 400;
							margin-top: mobile-vw(24px);
							font-size: mobile-vw(24px);
							line-height: mobile-vw(24px);
						}
					}
				}

				.app-atoms-cta {
					width: 100%;
				}
			}

			&__fake-transparent {
				aspect-ratio: 250 / 315;
				width: 60%;
				transform: translateY(-30%) rotate(1.5deg);
				position: absolute;
				top: 0;
				left: 0;

				@include mobile{
					display: none;
				}

				.app-parallax {
					height: 100%;
					display: block;
					&__inner {
						@include fake-transparent();
					}
				}
			}
			&__content {
				grid-column: 8 / span 5;
				height: 100%;

				@include mobile {
					grid-column: 1 / span 6;
					margin-bottom: mobile-vw(25px);
					height: auto;
				}

				&__title.app-element-rich-text {
					.H3{
						@include font-ITCFranklinGothicLT-BkCp();
						font-size: desktop-vw(100px);
						line-height: desktop-vw(90px);
						letter-spacing: desktop-vw(-2px);
						font-weight: 400;

						strong{
							display: unset!important;
						}

						@include mobile {
							font-size: mobile-vw(54px);
							line-height: mobile-vw(50px);
							letter-spacing: mobile-vw(-1.28px);
						}

						width: 75%;
					}
				}

				&__paragraph.app-element-rich-text {
					margin-top: desktop-vw(25px);
					width: 70%;

					@include mobile {
						width: 100%;
						margin-top: mobile-vw(20px);
					}

					.P1.wysiwyg-text {
						text-transform: uppercase;

						@include mobile{
							font-size: mobile-vw(17px);
							line-height: mobile-vw(24px);
						}
					}
				}
			}
		}

	}

}
</style>
