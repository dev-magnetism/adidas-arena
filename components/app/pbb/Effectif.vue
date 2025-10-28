<template>
	<div class="app-paris-basketball-effectif">
		<ERichText
			:split="true"
			:scrub="false"
			:overflow="true"
			class="app-paris-basketball-effectif__title"
			:content="contents.maintitle"
			tag="h2"
		/>


		<div
			v-if="this.selectContents?.length > 0"
			class="app-paris-basketball-effectif__content"
		>

			<div class="app-paris-basketball-effectif__players">
				<div
					class="app-paris-basketball-effectif__player"
					v-for="(player, playerI) in sortedPlayers"
					:key="`effectif-${player.id}-${playerI}`"
				>
					<div class="app-paris-basketball-effectif__player__content">

						<div class="app-paris-basketball-effectif__player__square"></div>
						<div class="app-paris-basketball-effectif__player__square"></div>
						<div class="app-paris-basketball-effectif__player__square"></div>
						<div class="app-paris-basketball-effectif__player__square"></div>
						<div class="app-paris-basketball-effectif__player__line"></div>
						<div class="app-paris-basketball-effectif__player__line"></div>
						<div class="app-paris-basketball-effectif__player__line"></div>
						<div class="app-paris-basketball-effectif__player__line"></div>

						<div
							class="app-paris-basketball-effectif__player__number"
							v-if="player.number"
						>
							{{player.number}}
						</div>
						<div
							class="app-paris-basketball-effectif__player__name"
							v-if="player.name"
						>
							{{player.name}}
						</div>
					<div
						class="app-paris-basketball-effectif__player__pos"
						v-if="player.position"
					>
						{{player.position}}
					</div>
						<div
							class="app-paris-basketball-effectif__player__picture"
							v-if="player.picture"
						>
							<AppPbbImage
				                :src="player.picture"
				                :alt="player.name"
				                :lazy="true"
				             />
				        </div>
				        <div class="app-paris-basketball-effectif__player__sheet">
						    <AtomsCTA
				            	class="app-paris-basketball-effectif__player__cta"
				            	bg="carmin-red"
				            	color="white"
				            	:href="player.url"
				            	target="_blank"
				            	layer-color="black"
				          		>
				           		Voir la fiche du joueur
				          	</AtomsCTA>
				        </div>

			        </div>

				</div>
			</div>

			<button
				v-if="this.selectContents?.length > displayNumber"
				class="app-paris-basketball-effectif__cta"
            	@click="toggleDisplayed()"
			>
				<div>
					{{ (this.displayedContents === this.displayNumber && this.selectContents?.length > this.displayNumber)?this.contents.cta.all: this.contents.cta.less}}

				</div>
			</button>

		</div>


		<div class="app-paris-basketball-effectif__banner">
			<img
				class="app-paris-basketball-effectif__banner__img"
				src="/imgs/pbb/banner_paris-pour-paris.png"
				alt="Paris pour Paris"
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
			displayNumber: {
				type: Number,
				default: () => 6,
			}
		},

	data() {
		return {
			selectContents: this.contents?.sources || [],
			displayedContents: this.displayNumber,
		}
	},

	watch: {
		'contents.sources': {
			handler(newSources) {
				if (newSources && newSources.length > 0) {
					this.selectContents = newSources
				}
			},
			immediate: true,
		}
	},

	computed: {
		sortedPlayers() {
			if (!this.selectContents || this.selectContents.length === 0) return []
			// Créer une copie du tableau avant de trier pour éviter la boucle infinie
			return [...this.selectContents]
				.sort((a, b) => parseInt(a.number) - parseInt(b.number))
				.slice(0, this.displayedContents)
		}
	},

		mounted() {

			//	this.selectedCategory = this.contents?.sources[0].id;

		},

		methods: {
			toggleDisplayed(){
				//	console.log('toggleDisplayed // this.displayedContents', this.displayedContents);
				//	console.log('toggleDisplayed // this.displayNumber', this.displayNumber);
				//	console.log('toggleDisplayed // this.selectContents.datas.length', this.selectContents.length);
				this.displayedContents = (this.displayedContents === this.displayNumber)?this.selectContents.length:this.displayNumber;
			}
		}

	}
</script>

<style lang="scss">

	.app-paris-basketball-effectif {
		position: relative;
		background-color: var(--c-black);
		padding-top: desktop-vw(48px);
		padding-bottom: desktop-vw(160px);


		@include mobile {
			padding-top: mobile-vw(50px);
			padding-bottom: mobile-vw(100px);
		}

		&__banner{
			position: absolute;
			bottom: 0;
			left: 0;
			width: 100%;
			height: auto;
			pointer-events: none;

			img{
				position: absolute;
				top:0;
				left: 50%;
				width: auto;
				height: desktop-vw(250px);
				transform: translate(-50%, -50%);

				@include mobile{
					height: mobile-vw(167px);
				}
			}
		}

		&__title{
			margin: 0 0 desktop-vw(80px);

			@include mobile{
				margin: 0 0 mobile-vw(32px);
			}

			.H2{
				color: var(--c-white) !important;
				text-align: center;

				.line-parent{
					display: flex !important;
					justify-content: center;
				}

				.line-child{
					display: block;
					flex: 0 0 auto;
					width: auto;
					margin: 0;
				}
			}
		}

		&__content{
			padding: 0 desktop-vw(40px);

			@include mobile{
				padding: 0 mobile-vw(16px);
			}
		}

		&__players{
			display: flex;
			flex-wrap: wrap;
			margin: 0 desktop-vw(-12px);
			justify-content: flex-start;
			align-items: flext-start;

			@include mobile{
				margin: 0 mobile-vw(-6px);
			}
		}

		&__player{

			display: block;
			flex: 0 0 33.333%;
			padding: desktop-vw(12px);

			@include mobile{
				flex: 0 0 50%;
				padding: mobile-vw(6px);
			}

			&__content{
				position:relative;
				padding: desktop-vw(4px);

				@include mobile{
					padding: mobile-vw(4px);
				}

				&:hover{

					.app-paris-basketball-effectif__player__name{
						z-index: 9;
						border-color: #5a5a5a;
						color: #5a5a5a;
						left: desktop-vw(4px);
						transform: translateX(0);

						@include mobile{
							left: mobile-vw(4px);
						}
					}
					.app-paris-basketball-effectif__player__number{
						color: #878686;
					}
					.app-paris-basketball-image{
						opacity: .5;
					}
					.app-paris-basketball-effectif__player__pos{
						z-index: 9;
						border-color: #5a5a5a;
						color: #5a5a5a;
						top: desktop-vw(4px);
						left: desktop-vw(4px);
						transform: translateX(0);

						@include mobile{
							top: mobile-vw(4px);
							left: mobile-vw(4px);
						}
					}

					.app-paris-basketball-effectif__player__sheet{
						opacity: 1;
					}
				}

				.app-atoms-cta{
					display: block;
					flex: 0 0 auto;

				    &.arrow{
				    	.app-atoms-cta-click{
							@include mobile{
								padding: mobile-vw(10px);
							}

				    	}
				    }

					.P2{
						@include mobile{
							font-size: mobile-vw(11px);
						}

					}

				}
			}


			&__line{
				position: absolute;
				z-index: 13;
				background-color: var(--c-white);
				line-height: 0;

				&:nth-of-type(5){
					top: desktop-vw(4px);
					left: desktop-vw(4px);
					height: desktop-vw(1px);
					width: calc(100% - desktop-vw(8px));

					@include mobile{
						top: mobile-vw(4px);
						left: mobile-vw(4px);
						height: mobile-vw(1px);
						width: calc(100% - mobile-vw(8px));
					}
				}

				&:nth-of-type(6){
					top: desktop-vw(4px);
					right: desktop-vw(4px);
					height: calc(100% - desktop-vw(8px));
					width: desktop-vw(1px);

					@include mobile{
						top: mobile-vw(4px);
						right: mobile-vw(4px);
						height: calc(100% - mobile-vw(8px));
						width: mobile-vw(1px);
					}
				}

				&:nth-of-type(7){
					z-index: 13;
					bottom: desktop-vw(4px);
					right: desktop-vw(4px);
					height: desktop-vw(1px);
					width: calc(100% - desktop-vw(8px));

					@include mobile{
						bottom: mobile-vw(4px);
						right: mobile-vw(4px);
						height: mobile-vw(1px);
						width: calc(100% - mobile-vw(8px));
					}
				}

				&:nth-of-type(8){
					z-index: 13;
					bottom: desktop-vw(4px);
					left: desktop-vw(4px);
					height: calc(100% - desktop-vw(8px));
					width: desktop-vw(1px);

					@include mobile{
						bottom: mobile-vw(4px);
						left: mobile-vw(4px);
						height: calc(100% - mobile-vw(8px));
						width: mobile-vw(1px);
					}
				}
			}

			&__name{
				position: absolute;
				z-index: 11;
				left: desktop-vw(4px);
				bottom: desktop-vw(4px);
				padding: desktop-vw(10px) desktop-vw(19px);
				width: auto;
				border: 1px solid var(--c-white);
				background-color: var(--c-black);
				@include font-ITCFranklinGothicLT-BkCp();
				font-size: desktop-vw(48px);
				line-height: desktop-vw(48px);
				color: var(--c-white);
				font-weight: 600;
				letter-spacing: desktop-vw(-1.92px);
				text-transform: uppercase;
				white-space: nowrap;
				transition: all 240ms ease-in-out;
        border-left: none;
        border-bottom: none;

				@include mobile{
					left: mobile-vw(4px);
					bottom: mobile-vw(4px);
					transform: unset;
					width: calc(100% - mobile-vw(8px));
					padding: mobile-vw(8px) mobile-vw(8px);
					font-size: mobile-vw(24px);
					line-height: mobile-vw(24px);
					letter-spacing: mobile-vw(-0.96px);
				}
			}

			&__number{
				position: absolute;
				z-index:2;
				right: desktop-vw(18px);
				top: desktop-vw(4px);
				padding: 0;
				@include font-ITCFranklinGothicLT-BkCp();
				font-size: desktop-vw(110px);
				line-height: desktop-vw(110px);
				color: #F5F5F3;
				font-weight: 600;
				letter-spacing: desktop-vw(1.1px);
				opacity: .5;
				transition: all 360ms ease-in-out;

				@include mobile{
					right: mobile-vw(11px);
					top: mobile-vw(11px);
					font-size: mobile-vw(56px);
					line-height: mobile-vw(56px);
					letter-spacing: mobile-vw(0.56px);
				}
			}

			&__picture{
				position:relative;
				z-index:0;
				padding: 125.171% 0 0;



				.app-paris-basketball-image{
					filter: grayscale(100%);
					transition: opacity 360ms ease-in-out;
				}

			}

			&__pos{
				position: absolute;
				z-index:11;
				left: desktop-vw(4px);
				top: desktop-vw(4px);
				padding: desktop-vw(10px) desktop-vw(19px);
				border: 1px solid var(--c-white);
				background-color: var(--c-black);
				@include font-ITCFranklinGothicLT-BkCp();
				font-size: desktop-vw(48px);
				line-height: desktop-vw(48px);
				color: var(--c-white);
				font-weight: 600;
				letter-spacing: desktop-vw(-1.92px);
				text-transform: uppercase;
				transition: all 120ms ease-in-out;
        border-left: none;
        border-top: none;

				@include mobile{
					top: mobile-vw(4px);
					left: mobile-vw(4px);
					transform: unset;
					padding: mobile-vw(8px) mobile-vw(8px);
					font-size: mobile-vw(14px);
					line-height: mobile-vw(14px);
					letter-spacing: mobile-vw(-0.56px);
				}
			}

			&__sheet{
				position: absolute;
				z-index:2;
				top: desktop-vw(4px);
				right: desktop-vw(4px);
				bottom: desktop-vw(4px);
				left: desktop-vw(4px);
				display: flex;
				justify-content: center;
				align-items: center;
				opacity: 0;
				transition: opacity 360ms ease-in-out;

				@include mobile{
					top: mobile-vw(4px);
					right: mobile-vw(4px);
					bottom: mobile-vw(4px);
					left: mobile-vw(4px);
				}
			}

			&__square{
				position: absolute;
				z-index: 13;
				height: desktop-vw(8px);
				width: desktop-vw(8px);
				background-color: var(--c-white);
				line-height: 0;

				@include mobile{
					height: mobile-vw(8px);
					width: mobile-vw(8px);
				}

				&:nth-of-type(1){
					top: 0;
					left: 0;
				}
				&:nth-of-type(2){
					top: 0;
					right: 0;
				}
				&:nth-of-type(3){
					bottom: 0;
					left: 0;
				}
				&:nth-of-type(4){
					bottom: 0;
					right: 0;
				}
			}
		}


		&__cta{
			display: block;
			margin: desktop-vw(40px) auto 0;
			@include font-ITCFranklinGothicLT-BkCp();
			font-size: desktop-vw(16px);
			line-height: desktop-vw(24px);
			color: var(--c-white);
			font-weight: 600;
			border-bottom: 1px solid var(--c-white);
			text-transform: uppercase;
			cursor: pointer;


			@include mobile{
				margin: mobile-vw(40px) auto 0;
				font-size: mobile-vw(16px);
				line-height: mobile-vw(24px);
			}
		}

	}
</style>
