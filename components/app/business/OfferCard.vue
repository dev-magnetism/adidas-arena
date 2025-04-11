<template>

	<div
    	:style="styles"
		class="app-business-offers__card"
	>

	   	<div class="app-business-offers__card__visual">

	      	<div class="app-business-offers__card__visual__wrapper">

	       		<div class="app-business-offers__card__layer" />

						<nuxt-img
							ref="offervisual"
							:src="offer.Visual"
							:alt="offer.Name"
							provider="directus"
							loading="lazy"
						/>

	      	</div>

	   	</div>

	   <button
	    	class="app-business-offers__card__informations"
	    	@click="clickContact()"
      	>
      		<div class="app-business-offers__card__head">

				<TH2
					class="name"
					weight="bold"
					color="white"
				>
					{{offer.Name}}
				</TH2>

				<TP2
					class="title"
					weight="bold"
					tag="h3"
           			:color="whitedTexts"
				>
					{{offer.Title}}
				</TP2>

				<TP2
					class="description"
					weight="medium"
           			:color="whitedTexts"
				>
					{{offer.Text}}
				</TP2>

      		</div>

	      	<div
	      		class="app-business-offers__card__foot"
            :class="svgColor"
    			:style="{ color: `var(--c-${whitedTexts})` }"
	      		>
		      	<div
		      		class="app-business-offers__card__foot__item"
		      		v-for="(option) in offer.Options"
		      		:key="`offer-${offer.id}-option-${option}`"
					ref="option"

					>
					<div
						v-html="options?.find(_opt => _opt.id === option)?.SVG"
						>
					</div>
				</div>
	  	</div>

   	</button>

</div>

</template>

<script>
//	import { mapState } from 'vuex'

export default {
  props: {
  	clickContact: {
  		type: Function,
  		default: () => {

  			//	console.log('clickContact')
  		},
  	},
    offer: {
      type: Object,
      default: () => {},
    },
    options: {
    	type: Array,
    	default: () => [],
    },
    rotateNegative: {
      type: Boolean,
      default: false,
    },
    theme: {
      type: String,
      default: 'grey',
    },
  },
  data() {
    return {
      isVisible: false, // If the card is visible in the listing
      isAppear: false, // If the layer card has already appeared
      inView: false, // If the card is present in the viewport zone
      isReported: false, // Check if all available dates are reported
      isWaitingNewDate: false, // Check if all available dates are waiting a new date
    }
  },
  computed: {
    styles() {
      return {
        '--bg':
          this.theme === 'blue'
            ? 'var(--c-blue-adidas)'
            : this.theme === 'red'
            ? 'var(--c-red-adidas)'
            : 'var(--c-grey)',
        '--rotation': `${
          this.genRand(1, 2.5, 2) * (this.rotateNegative ? -1 : 1)
        }deg`,
      }
    },
    bgColor() {
      return {
        '--bg': `var(--c-${this.theme})`,
      }
    },
    svgColor() {
      return this.theme === 'blue' || this.theme === 'red'
        ? 'white'
        : 'blue'
    },
    whitedTexts() {
      return this.theme === 'blue' || this.theme === 'red'
        ? 'white'
        : 'black'
    },
  },
  watch: {},
  mounted() {
    //	console.log('Card Business Offer', this.offer);
    //	console.log('Card Business Options', this.options);
  },
  beforeDestroy() {

  },
  methods: {
    genRand(min, max, decimalPlaces) {
      const rand = Math.random() * (max - min) + min
      const power = Math.pow(10, decimalPlaces)
      return Math.floor(rand * power) / power
    },
  },
}
</script>

<style lang="scss">
.app-business{
	&-offers{
		&__card{
			display: block;
			position: relative;
			flex: 0 0 32.5%;
			background-color: var(--bg);
			border: 1px solid var(--c-black);
			transform: rotate(var(--rotation));

			@include mobile {
				flex: 0 0 100%;
			}

			@include desktop-l {
				flex: 0 0 32.5%;
			}

			&__visual {
				width: 100%;
				display: block;
				position: relative;
				z-index: 0;
			}

			&__visual__wrapper {
				aspect-ratio: 620/500;
				width: 100%;
				display: block;
				position: relative;
				overflow: hidden;
			}

			picture {
				width: 100%;
				display: block;
				position: relative;
				height: 100%;
				@include noise();
				will-change: transform;

				img {
					display: block;
					transform: scale(1.1);
					transition: transform 0.95s var(--ease-out-quart);
				}
			}

			&__informations {
				display: flex;
				flex-direction: column;
				padding: desktop-vw(15px) desktop-vw(15px) desktop-vw(70px);
				min-height: desktop-vw(200px);

				border-top: 1px solid var(--c-black);
				cursor: pointer;

				@include mobile {
					padding: mobile-vw(15px) mobile-vw(15px) mobile-vw(120px);
					margin-top: mobile-vw(0px);
					min-height: mobile-vw(200px);
				}

				&:hover{

					.app-atoms-cta{
						&::after {
							transform: scaleY(1);
						}
					}

				}
			}

			&__head {
				display: flex;
				flex-wrap: wrap;
				justify-content: flex-start;


				.name{
					position: absolute;
					top: desktop-vw(18px);
					left: desktop-vw(18px);
					z-index: 2;
					display: block;
					flex: 0 0 100%;
					font-size: desktop-vw(40px);
					line-height: desktop-vw(30px);
					text-transform: uppercase;

					@include mobile{
						top: mobile-vw(18px);
						left: mobile-vw(18px);
						font-size: mobile-vw(18px);
						line-height: mobile-vw(22px);
					}
				}

				.title{
					display: block;
					flex: 0 0 100%;
					margin: 0 0 desktop-vw(8px);
					font-size: desktop-vw(18px);
					line-height: desktop-vw(18px);
					text-transform: uppercase;

					@include mobile{
						font-size: mobile-vw(18px);
						line-height: mobile-vw(18px);
					}
				}

				.introduction{
					display: block;
					flex: 0 0 100%;
					font-size: desktop-vw(12px);
					line-height: desktop-vw(13px);
					text-transform: uppercase;

					@include mobile{
						font-size: mobile-vw(12px);
						line-height: mobile-vw(13px);
					}
				}

			}

			&__foot{

				position: absolute;
				bottom: desktop-vw(15px);
				left: desktop-vw(15px);
				display: flex;
				width: calc(100% - desktop-vw(30px));
				justify-content: space-between;
        align-items: center;

				@include mobile{
					bottom: mobile-vw(55px);
					left: mobile-vw(15px);
					width: calc(100% - mobile-vw(30px));
				}

				&__item{
					display: block;
					flex: 0 0 auto;
					padding: 0;
					align: center;

					svg{
						font-size: desktop-vw(30px);
            width: desktop-vw(30px);
            height: auto;
            max-height: desktop-vw(30px);

						@include mobile{
							font-size: mobile-vw(30px);

              width: mobile-vw(30px);
              max-height: mobile-vw(30px);
						}

            .blue & {
              path {
                fill:  var(--c-blue-adidas);
              }
            }
					}

				}

			}

			.H2.bold {
				font-size: desktop-vw(40px);
				line-height: desktop-vw(30px);
				user-select: none;
				letter-spacing: 0;
				@include font-ITCFranklinGothicLT-DmXtraCp();

				@include mobile {
					font-size: mobile-vw(40px);
					line-height: mobile-vw(40px);
				}

				@include desktop-l {
					font-size: desktop-vw(40px);
					line-height: desktop-vw(30px);
				}
			}

		}
	}
}
</style>
