<template>

	<div class="app-paris-basketball-animations grid-inner">

    	

    	<div class="app-paris-basketball-animations__content">
    		
    		<ELottie 
    			id="Petite_Fleche_01" 
				start="top bottom-=15%"
				color="blue-adidas"
				class="app-paris-basketball-animations__lottie-arrowsmall1"
    			/>

    		<ELottie 
    			id="Petite_Fleche_02" 
				start="top bottom-=15%"
				color="white"
				class="app-paris-basketball-animations__lottie-arrowsmall2"
    			/>

			<ERichText
				ref="paragraph"
				tag="div"
				weight="regular"
				:content="contents.text"
			    :scrub="true"
				class="app-paris-basketball-animations__content__paragraph"
			/>
			<ELottie 
    			id="Fleche_2" 
				color="red-adidas"
				start="top bottom-=5%"
				class="app-paris-basketball-animations__lottie-arrow2"
    			/>
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
		//	this.initMatchMedia()
	},
	beforeDestroy() {
		this.mm?.revert()
	},
	methods: {
		initMatchMedia() {
			this.mm = gsap.matchMedia()

			this.mm.add('(min-width: 768px)', (context) => {
				const tweenImageFirst = gsap.fromTo(
					this.$refs.imageFirst.$el,
					{
						top: -300,
					},
					{
						top: 0,
						scrollTrigger: {
							trigger: this.$refs.imageFirst.$el,
							scrub: 0.5,
							end: 'top bottom',
						},
					}
				)
				const tweenImageSecond = gsap.fromTo(
					this.$refs.imageSecond.$el,
					{
						top: 300,
					},
					{
						top: 0,
						scrollTrigger: {
							trigger: this.$refs.imageSecond.$el,
							scrub: 0.5,
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
	.app-paris-basketball-animations {
		position: relative;
		padding-top: desktop-vw(145px);
		padding-bottom: desktop-vw(180px);
		row-gap: desktop-vw(85px);
		background-color: var(--c-black);

		@include mobile {
			overflow-x: hidden;
		}

		&__lottie-arrow2.app-element-lottie {
			position: absolute;
			width: 10%;
			bottom: desktop-vw(-80px);
			left: desktop-vw(-80px);
			transform: rotate(220deg) scale(-1, 1);
			height: auto !important;

			@include mobile {
				display: none;
			}
		}

		&__lottie-arrowsmall1.app-element-lottie {
			position: absolute;
			top: desktop-vw(-140px);
			right: 0;
			width: 20%;
			transform: rotate(120deg);
			height: auto !important;

			@include mobile {
				display: none;
			}
		}

		&__lottie-arrowsmall2.app-element-lottie {
			position: absolute;
			top: desktop-vw(-140px);
			left: 0;
			width: 20%;
			transform: rotate(270deg);
			height: auto !important;

			@include mobile {
				display: none;
			}
		}

		&__content {
			position: relative;
			grid-column: 4 / span 6;

			@include mobile {
				grid-row: 2;
				grid-column: 1 / span 6;
			}

			&__paragraph{
				width: 125%;
				.P2 {
					font-size: desktop-vw(64px);
					line-height: desktop-vw(57px);
					color: var(--c-white) !important;
					text-transform: uppercase;
					text-align: center;
					letter-spacing: desktop-vw(-1.28px);

					@include mobile{
						font-size: mobile-vw(16px);
					}


					.app-atoms-stroke-text{
						-webkit-text-stroke: 1px var(--c-white);
						-webkit-text-fill-color: transparent;
					}
				}
			}

		}



	}
</style>