<template>
    <div class="page-cchapelle__introduction">

   		<div class="page-cchapelle__introduction__content grid-inner">

			<div class="page-cchapelle__introduction__col-left">

				<div class="page-cchapelle__introduction__logo">
					<nuxt-img
						v-if="contents.logo"
						:src="contents.logo"
						alt="Central Chapelle"
						format="webp"
						provider="directus"
						loading="lazy"
						sizes="sm:100vw md:100vw lg:100vw"
					/>
				</div>

      		</div>

			<div class="page-cchapelle__introduction__col-right">
				<ERichText
					ref="paragraph"
					tag="div"
					weight="regular"
					:content="delayedTitleContent"
					:scrub="false"
					class="page-cchapelle__introduction__title"
				/>
			</div>

			<div 
				class="page-cchapelle__introduction__opening"
				v-if="this.countdown"
				>
				<div class="page-cchapelle__introduction__opening__title">
					Opening soon
				</div>
				<div class="page-cchapelle__introduction__opening__count">
					<div class="page-cchapelle__introduction__opening__count__item">
						<div class="page-cchapelle__introduction__opening__count__number">
							{{this.countdown.days}}
						</div>
						<div class="page-cchapelle__introduction__opening__count__label">
							Jours
						</div>
					</div>

					<div class="page-cchapelle__introduction__opening__count__item">
						<div class="page-cchapelle__introduction__opening__count__number">
							{{this.countdown.hours}}
						</div>
						<div class="page-cchapelle__introduction__opening__count__label">
							Heures
						</div>
					</div>

					<div class="page-cchapelle__introduction__opening__count__item">
						<div class="page-cchapelle__introduction__opening__count__number">
							{{this.countdown.minutes}}
						</div>
						<div class="page-cchapelle__introduction__opening__count__label">
							Minutes
						</div>
					</div>
				</div>

			</div>

    	</div>

		<div class="page-cchapelle__introduction__visual">
			<nuxt-img
				v-if="contents.visual"
				:src="contents.visual"
				alt="Scroll down"
				format="webp"
				provider="directus"
				loading="lazy"
				sizes="sm:100vw md:100vw lg:100vw"
			/>
		</div>

	</div>

</template>

<script>

export default {
	data() {
		return {
			timer: null, 
     		countdown: false,
			lottieDelayTimer: null,
			lottiesVisible: false,
		}
	},
	computed: {
		delayedTitleContent() {
			return this.decorateLottieTags(this.contents.title)
		},
	},
	props: {
		contents: {
			type: Object,
			default: () => {},
		},
	},
	mounted() {

		console.log('Introduction / contents', this.contents);

		// Sécurité : en cas de réutilisation de l'instance, repartir caché.
		this.lottiesVisible = false
		this.openingCount();

		// Le rideau de transition dure ~2s ; on déclenche le dessin des lotties
		// quelques secondes après la fin perçue de l'animation d'arrivée.
		this.lottieDelayTimer = setTimeout(() => {
			this.lottiesVisible = true
			this.$nuxt?.$emit('centralChapelle:triggerLottieAnimation')
		}, 1000)
	}, 
	beforeUnmount() { // ou beforeDestroy() si Vue 2
		if (this.timer) clearInterval(this.timer);
		if (this.lottieDelayTimer) clearTimeout(this.lottieDelayTimer);
	},
	methods: {
		decorateLottieTags(content = '') {
			return content.replace(
				/<lottie-word\b/gi,
				'<lottie-word deferred-draw="true" deferred-duration="1.8"'
			)
		},
   		openingCount() {
			this.updateCount(); // appel initial
      		this.timer = setInterval(this.updateCount, 1000);

   		},
   		updateCount(){
   			const _now = new Date;
			const _opening = new Date(this.contents.opening_date);


			const _diff = _opening - _now; // différence en millisecondes

			if (_diff <= 0) {
				this.countdown = false;
				clearInterval(this.timer);
       			//	return;
			} else {

				const _tSecs = Math.floor(_diff / 1000);
				const _days = Math.floor(_tSecs / (3600 * 24));
				const _hours = Math.floor((_tSecs % (3600 * 24)) / 3600);
				const _minutes = Math.floor((_tSecs % 3600) / 60);
				const _seconds = _tSecs % 60;

				const _obj = {
					days: _days,
					hours: (_hours < 10)?`0${_hours}`:_hours,
					minutes: (_minutes < 10)?`0${_minutes}`:_minutes,
					seconds: (_seconds < 10)?`0${_seconds}`:_seconds,
				};

			    this.countdown = _obj;
			}
   		}
   	}
}
</script>

<style lang="scss">
.page-cchapelle{

	&__introduction{

		&__opening{
			grid-column: 1 / span 3;
			position: relative;
			top: desktop-vw(-180px);

			@include mobile{

				grid-column: 1 / span 3;
				top: 0;
				margin-top: mobile-vw(25px);
			}

			&__title{
				margin-bottom: desktop-vw(5px);
				@include font-ITCFranklinGothicLT-DmXtraCp();
				font-size: desktop-vw(19px);
				line-height: desktop-vw(20px);
				color: #FF4A48;
				text-transform: uppercase;

				@include mobile {
					margin-bottom: mobile-vw(5px);
					font-size: mobile-vw(19px);
					line-height: mobile-vw(19px);
				}
			}

			&__count{
				display: flex;
				

				&__item{
					display: block;
					flex: 0 0 auto;
					margin-right: -1px;
					padding: desktop-vw(12px);
					background-color: var(--c-white);
					border:1px solid var(--c-black);

					@include mobile {
						padding: mobile-vw(12px);
					}

					&:last-child{
						margin: 0;
					}
				}

				&__number{

					font-size: desktop-vw(72px);
					line-height: desktop-vw(72px);
					@include font-ITCFranklinGothicLT-DmXtraCp();
					color: var(--c-black);

					@include mobile {
						font-size: mobile-vw(72px);
						line-height: mobile-vw(72px);
					}
				}

				&__label{
					font-size: desktop-vw(14px);
					line-height: desktop-vw(14px);
					@include font-ITCFranklinGothicLT-BkCp();
					color: var(--c-black);
					@include mobile {
						font-size: mobile-vw(14px);
						line-height: mobile-vw(14px);
					}
				}
			}
		}

		&__col-left{
			grid-column: 1 / span 3;
			position: relative;

			@include mobile{
				margin-bottom: mobile-vw(56px);
				grid-column: 2 / span 4;
				grid-row: 1;
			}
		}

		&__col-right{
			grid-column: 5 / span 7;

			@include mobile{
				grid-column: 1 / span 6;
				grid-row: 2;
			}
		}

		&__visual{
			margin: desktop-vw(116px) 0 0;
			width: 100%;

			@include mobile{
				margin: mobile-vw(60px) 0 0;
				aspect-ratio: 380/453;
				grid-row: 4;
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

				.lottie-word.Cercle_6 svg{
					position: absolute;
					bottom: desktop-vw(-10px);
				}

				.lottie-word.Trait_3 svg{
					position: absolute;
					bottom: desktop-vw(-10px);

					@include mobile{
						bottom: mobile-vw(-10px);
					}
				}

			}
		}

	}

}
</style>
