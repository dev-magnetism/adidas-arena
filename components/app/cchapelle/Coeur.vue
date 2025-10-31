<template>
    <div class="page-cchapelle__coeur">

   		<div class="page-cchapelle__coeur__content grid-inner">

			

			<div class="page-cchapelle__coeur__col-left">
				<ERichText
					ref="paragraph"
					tag="div"
					weight="regular"
					:content="contents.title"
					:scrub="false"
					class="page-cchapelle__coeur__title"
				/>
			</div>

			<div class="page-cchapelle__coeur__col-right">
				<ERichText
					ref="paragraph"
					tag="div"
					weight="regular"
					:content="contents.text"
					:scrub="false"
					class="page-cchapelle__coeur__text"
				/>
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

		console.log('Coeur / contents', this.contents);

	},
}
</script>

<style lang="scss">
.page-cchapelle{

	&__coeur{
		padding-top: desktop-vw(142px);
		padding-bottom: desktop-vw(142px);
		background-color: #E2E2E2;

		@include mobile{
			padding-top: mobile-vw(64px);
			padding-right: mobile-vw(30px);
			padding-bottom: mobile-vw(60px);
			padding-left: mobile-vw(30px);
		}

		&__col-left{
			grid-column: 1 / span 6;
		}

		&__col-right{
			grid-column: 9 / span 4;

			@include mobile{
				grid-column: 1 / span 6;
			}
		}

		&__title{
			.H2{
				font-size: desktop-vw(100px);
				line-height: desktop-vw(90px);
				letter-spacing: desktop-vw(-3px);
				color: var(--c-black) !important;
				text-align: left;

				.app-atoms-stroke-text{
					-webkit-text-stroke: 1px var(--c-black);
					-webkit-text-fill-color: transparent;
				}

				@include mobile{

					font-size: mobile-vw(64px);
					line-height: mobile-vw(57px);
					letter-spacing: mobile-vw(-1.92px);
				}

				span{
					display: unset!important;
				}

				strong{
					letter-spacing: desktop-vw(-3px);

					@include mobile{
						letter-spacing: mobile-vw(-1.92px);
					}
				}


			}
		}

		&__text{
			margin-top: desktop-vw(48px);
			
			.P1{
				font-size: desktop-vw(17px);
				line-height: desktop-vw(20px);
				color: var(--c-black) !important;
				text-align: left;
				text-transform: unset;
			}
		}

	}

}
</style>
