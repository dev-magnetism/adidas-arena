<template>

	<div class="app-paris-basketball-hypeteam grid-inner">

    	

    	<div class="app-paris-basketball-hypeteam__content">
    		
    		<ELottie 
    			id="Croix_01" 
				start="top bottom-=15%"
				color="red-adidas"
				class="app-paris-basketball-hypeteam__lottie-croix1"
    			/>

			<ERichText
				ref="paragraph"
				tag="div"
				weight="regular"
				:content="contents.text"
			    :scrub="true"
				class="app-paris-basketball-hypeteam__content__paragraph"
			/>
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
}
</script>

<style lang="scss">
	.app-paris-basketball-hypeteam {
		position: relative;
		padding-top: desktop-vw(145px);
		padding-bottom: desktop-vw(180px);
		row-gap: desktop-vw(85px);
		background-color: var(--c-black);

		@include mobile {
			overflow-x: hidden;
		}

		&__lottie-croix1.app-element-lottie {
			position: absolute;
			width: 10%;
			bottom: desktop-vw(-35px);
			right: desktop-vw(90px);
			transform: rotate(180deg) scale(-1,1);
			height: auto !important;

			@include mobile {
				display: none;
			}
		}

		&__content {
			position: relative;
			grid-column: 3 / span 8;

			@include mobile {
				grid-row: 2;
				grid-column: 1 / span 6;
			}

			&__paragraph{
				.P2 {
					font-size: desktop-vw(100px);
					line-height: desktop-vw(90px);
					color: var(--c-white) !important;
					text-transform: uppercase;
					text-align: center;
					letter-spacing: desktop-vw(-3px);

					@include mobile{
						font-size: mobile-vw(16px);
					}

					.app-element-lottie-word.Cercle_1 svg{
						top: desktop-vw(20px);
						transform: translate(-50%, -50%) scale(1, .65) !important;
					}

				}
			}

		}



	}
</style>