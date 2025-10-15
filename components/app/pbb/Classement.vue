<template>
	<div class="app-paris-basketball-classement">

		<div class="app-paris-basketball-classement__banner">
			<img
				class="app-paris-basketball-classement__banner__img"
				src="/imgs/pbb/banner_paris-pour-paris.png"
				alt="Paris pour Paris"
			/>
		</div>


		<ERichText
			:split="true"
			:scrub="false"
			:overflow="true"
			class="app-paris-basketball-classement__title"
			:content="contents.maintitle"
			tag="h2"
		/>

	<div v-if="contents.sources && contents.sources.length > 0" class="app-paris-basketball-classement__menu">
		<div
			v-for="(cat) in this.contents.sources"
			:key="`key-${cat.id}`"
			class="app-paris-basketball-classement__menu__radio"
			@click="switchCategory(cat.id)"
		>
			<input
				:id="`menu_${cat.id}`"
				:checked="selectedCategory === cat.id"
				:value="cat.id"
				type="radio"
				name="menu-radio"
			/>
			<label :for="`menu_${cat.id}`">
				<TP1 weight="regular">
					Classement {{cat.name}}
				</TP1>
				<TP1 weight="regular">
					N°{{cat.datas.find(_o => _o.team.name === 'Paris Basketball')?.pos?.value || '-'}}
				</TP1>
			</label>
		</div>
	</div>
	<div v-else class="app-paris-basketball-classement__menu">
		<p>Chargement du classement...</p>
	</div>

		<div
			v-if="this.selectContents?.datas?.length > 0"
			class="app-paris-basketball-classement__content"
			>

			<table class="app-paris-basketball-classement__table">
				<thead
					class="app-paris-basketball-classement__table__header"
					>
					<tr
						>
						<th
							v-if="this.selectContents?.headers?.pos"
							class="app-paris-basketball-classement__num"
							>
							{{this.selectContents.headers.pos.label}}
						</th>
						<th
							v-if="this.selectContents?.headers?.team"
							class="app-paris-basketball-classement__team"
							>
							{{this.selectContents.headers.team.label}}
						</th>
						<th
							v-if="this.selectContents?.headers?.games?.percent"
							class="app-paris-basketball-classement__percent"
							>
							{{this.selectContents.headers.games.percent}}
						</th>
						<th
							v-if="this.selectContents?.headers?.games?.played && !$viewport.isMobile"
							class="app-paris-basketball-classement__played"
							>
							{{this.selectContents.headers.games.played}}
						</th>
						<th
							v-if="this.selectContents?.headers?.games?.win && !$viewport.isMobile"
							class="app-paris-basketball-classement__win"
							>
							{{this.selectContents.headers.games.win}}
						</th>
						<th
							v-if="this.selectContents?.headers?.games?.lose && !$viewport.isMobile"
							class="app-paris-basketball-classement__lose"
							>
							{{this.selectContents.headers.games.lose}}
						</th>
						<th
							v-if="this.selectContents?.headers?.stats?.pos && !$viewport.isMobile"
							class="app-paris-basketball-classement__pos"
							>
							{{this.selectContents.headers.stats.pos}}
						</th>
						<th
							v-if="this.selectContents?.headers?.stats?.neg && !$viewport.isMobile"
							class="app-paris-basketball-classement__neg"
							>
							{{this.selectContents.headers.stats.neg}}
						</th>
						<th
							v-if="this.selectContents?.headers?.stats?.goal_average"
							class="app-paris-basketball-classement__goal_average"
							>
							{{this.selectContents.headers.stats.goal_average}}
						</th>
					</tr>
				</thead>
				<tbody
					:class="`app-paris-basketball-classement__table__body ${(displayedContents === displayNumber && selectContents.datas?.length > displayNumber)?'closed':''}`"
					>
				<tr
					v-for="(row, rowI) in sortedDatas"
					:key="`classement-${selectContents.id}-${rowI}`"
					class="app-paris-basketball-classement__table__row"
						>

						<td
							v-if="row.pos"
							 class="app-paris-basketball-classement__num"
							>
							<div class="app-paris-basketball-classement__num__container">
								<div class="app-paris-basketball-classement__num__label">
									{{row.pos.value}}
								</div>
								<svg
									class="app-paris-basketball-classement__num__svg"
									v-if="row.pos.status === 'dec'"
									height="1em"
									viewBox="0 0 17 16"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
									>
									<path d="M7.76953 14.2563C7.7604 14.2187 7.74695 14.1653 7.72949 14.0981C7.69105 13.9503 7.63192 13.7364 7.55078 13.479C7.38779 12.9619 7.13906 12.2789 6.79492 11.6011C6.11754 10.2669 5.2095 9.21392 4.06445 9.07666L3.83203 9.06201L3.16504 9.05518L3.17969 7.72119L3.8457 7.729L4.03906 7.73584C5.82863 7.85014 7.02665 9.27801 7.76953 10.5972L7.76953 1.33252L9.10352 1.33252L9.10352 10.7534C9.87942 9.43215 11.1158 8.01864 12.9736 7.73584L13.6328 7.63623L13.834 8.95361L13.1748 9.0542C11.7744 9.26733 10.751 10.4607 10.0479 11.7944C9.7065 12.442 9.46443 13.0792 9.30762 13.5562C9.22963 13.7934 9.17302 13.989 9.13672 14.1235C9.12265 14.1757 9.11178 14.2189 9.10352 14.2515L9.10352 14.6685L7.76953 14.6685L7.76953 14.2563Z" fill="#FF4A48"/>
								</svg>


								<svg
									class="app-paris-basketball-classement__num__svg"
									v-if="row.pos.status === 'inc'"
									height="1em"
									viewBox="0 0 17 16"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
									>
									<path d="M9.23047 1.74365C9.2396 1.78126 9.25309 1.83489 9.27051 1.90186C9.30895 2.04968 9.36813 2.26373 9.44922 2.521C9.61221 3.03804 9.86101 3.72119 10.2051 4.39893C10.8824 5.73296 11.7906 6.78609 12.9355 6.92334L13.168 6.93799L13.835 6.94482L13.8203 8.27881L13.1543 8.271L12.9609 8.26416C11.1711 8.14984 9.97333 6.72115 9.23047 5.40186L9.23047 14.6675L7.89648 14.6675L7.89648 5.24658C7.12057 6.5678 5.88416 7.9814 4.02637 8.26416L3.36719 8.36377L3.16602 7.04639L3.8252 6.9458C5.22562 6.73269 6.249 5.53934 6.95215 4.20557C7.29357 3.55788 7.53555 2.92086 7.69238 2.44385C7.77041 2.20652 7.82697 2.01109 7.86328 1.87646C7.87734 1.82434 7.88821 1.78113 7.89648 1.74854L7.89648 1.33154L9.23047 1.33154L9.23047 1.74365Z" fill="#3171FF"/>
								</svg>
							</div>
						</td>

						<td
							v-if="row.team"
							 class="app-paris-basketball-classement__team"
							>
							<div class="app-paris-basketball-classement__team__logo">
								<AppPbbImage
					                :src="row.team.logo"
					                :alt="row.team.name"
					                :lazy="true"
					             />
					        </div>
					        <div class="app-paris-basketball-classement__team__name">
								{{row.team.name}}

							</div>
						</td>

						<td
							v-if="row.games?.percent"
							 class="app-paris-basketball-classement__percent"
							>
							{{row.games.percent}}%
						</td>

						<td
							v-if="row.games?.played && !$viewport.isMobile"
							 class="app-paris-basketball-classement__played"
							>
							{{row.games.played}}
						</td>

						<td
							v-if="row.games?.win && !$viewport.isMobile"
							 class="app-paris-basketball-classement__win"
							>
							{{row.games.win}}
						</td>

						<td
							v-if="row.games?.lose && !$viewport.isMobile"
							 class="app-paris-basketball-classement__lose"
							>
							{{row.games.lose}}
						</td>

						<td
							v-if="row.stats?.pos && !$viewport.isMobile"
							 class="app-paris-basketball-classement__pos"
							>
							{{row.stats.pos}}
						</td>

						<td
							v-if="row.stats?.neg && !$viewport.isMobile"
							 class="app-paris-basketball-classement__neg"
							>
							{{row.stats.neg}}
						</td>

						<td
							v-if="row.stats?.goal_average"
							 class="app-paris-basketball-classement__goal_average"
							>
							{{row.stats.goal_average}}
						</td>
					</tr>

				</tbody>
			</table>

			<button
				v-if="this.selectContents.datas?.length > displayNumber"
				class="app-paris-basketball-classement__table__cta"
            	@click="toggleDisplayed()"
			>
				<div>
					{{ (this.displayedContents === this.displayNumber && this.selectContents.datas?.length > this.displayNumber)?this.contents.cta.all: this.contents.cta.less}}

				</div>
			</button>

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
			default: () => 8,
		}
	},

	data() {
		return {
			selectedCategory: this.contents?.sources?.[0]?.id || null,
			selectContents: this.contents?.sources?.[0] || null,
			displayedContents: this.displayNumber,
		}
	},

	watch: {
		'contents.sources': {
			handler(newSources) {
				if (newSources && newSources.length > 0 && !this.selectedCategory) {
					this.selectedCategory = newSources[0].id
					this.selectContents = newSources[0]
				}
			},
			immediate: true,
		}
	},

	computed: {
		sortedDatas() {
			if (!this.selectContents?.datas) return []
			// Créer une copie du tableau avant de trier pour éviter la boucle infinie
			return [...this.selectContents.datas]
				.sort((a, b) => a.pos.value - b.pos.value)
				.slice(0, this.displayedContents)
		}
	},

	mounted() {

		//	this.selectedCategory = this.contents?.sources[0].id;

	},

	methods: {
		switchCategory(_id) {
			this.selectContents = this.contents?.sources.find(_art => _art.id === _id);

			this.selectedCategory = _id;

		},
		toggleDisplayed(){
			console.log('toggleDisplayed // this.displayedContents', this.displayedContents);
			console.log('toggleDisplayed // this.displayNumber', this.displayNumber);
			console.log('toggleDisplayed // this.selectContents.datas.length', this.selectContents.datas.length);
			this.displayedContents = (this.displayedContents === this.displayNumber)?this.selectContents.datas.length:this.displayNumber;
		}
	}

}
</script>

<style lang="scss">

	.app-paris-basketball-classement {
		position: relative;
		background-color: var(--c-black);
		padding-top: desktop-vw(160px);
		padding-bottom: desktop-vw(96px);


		@include mobile {
			padding-top: mobile-vw(100px);
			padding-bottom: mobile-vw(100px);
		}

		&__banner{
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: auto;

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

		&__content{
			padding: 0 desktop-vw(40px);

			@include mobile{
				padding: 0 mobile-vw(16px);
			}
		}

		&__menu{
			display: flex;
			margin: 0 0 desktop-vw(80px);
			flex-flow: row wrap;
			gap: desktop-vw(10px);
			grid-column: 1 / span 6;
			justify-content: center;

			@include mobile {
				margin: 0 0 mobile-vw(56px);
				gap: mobile-vw(8px);
			}

			&__radio {
				display: flex;
				align-items: center;
				justify-content: center;

				input[type='radio'] {
					opacity: 0;
					position: absolute;
					width: 0;
				}

				label {
					display: flex;
					flex-direction: row;
					background-color: var(--c-black);
					border: 1px solid var(--c-grey);
					transition: background-color 0.4s var(--ease-out-cubic),
					border-color 0.4s var(--ease-out-cubic);

					@include hover {
						&:hover {
							cursor: pointer;
						}
					}
				}

				.P1 {
					padding: desktop-vw(10px) desktop-vw(12px);
					transition: color 0.4s var(--ease-out-cubic),
					border-color 0.4s var(--ease-out-cubic);
					color: var(--c-white) !important;

					@include mobile {
						padding: mobile-vw(10px) mobile-vw(10px);
						font-size: mobile-vw(16px);
						letter-spacing: mobile-vw(-0.86px);
					}
				}

				.P1.regular:last-child {
					border-left: 1px solid var(--c-grey);
				}

				input[type='radio']:checked + label {
					background-color: #FF4A48;
					border-color: var(--c-white);

					.P1 {
						color: var(--c-white) !important;
					}

					.P1.regular {
						border-color: var(--c-white);
					}
				}
			}
		}

		&__title{
			margin: 0 0  desktop-vw(80px);

			@include mobile{
				margin: 0 0  mobile-vw(56px);
			}

			.H2{
				font-size: desktop-vw(135px);
				line-height: desktop-vw(135px);
				color: var(--c-white) !important;
				text-align: center;

				@include mobile{
					font-size: mobile-vw(80px);
					line-height: mobile-vw(72px);
				}

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

		&__table{
			display: flex;
			flex-wrap: wrap;
			width: 100%;

			.picture-absolute{
				position: relative;
			}

			color: var(--c-white);

			&__header{
				display: block;
				flex: 0 0 100%;
				padding: 0 0 desktop-vw(24px);
				width: 100%;
				min-width: 100%;
				max-width: 100%;
				border-bottom: 1px solid var(--c-white);

				@include mobile{
					padding: 0 0 mobile-vw(24px);
				}

				tr{
					display: flex;
					flex-wrap: wrap;
					margin: 0 desktop-vw(-12px);
					justify-content: flex-start;
					align-items: center;

					@include mobile{
						margin: 0 mobile-vw(-6px)
					}
				}

				th{
					padding: 0 desktop-vw(12px);
					font-size: desktop-vw(32px);
					line-height: desktop-vw(32px);
					text-transform: uppercase;
					font-weight: 600;
					@include font-ITCFranklinGothicLT-BkCp();

					@include mobile{
						padding: 0 mobile-vw(6px);
						font-size: mobile-vw(18px);
						line-height: mobile-vw(18px);

						&.app-paris-basketball-classement__goal_average{
							text-align: right;
						}
					}
				}
			}

			&__body{
				position:relative;
				display: block;
				flex: 0 0 100%;
				width: 100%;
				min-width: 100%;
				max-width: 100%;

				&:after{
					content:'';
					position: absolute;
					bottom: 0;
					left: 0;
					z-index: 1;
					width: 100%;
					height: desktop-vw(160px);
					pointer-events: none;
					background: linear-gradient(180deg, rgba(24, 24, 24, 0.00) 0%, #181818 82.3%);
					opacity: 0;
					transition: opacity 360ms ease-in-out;

					@include mobile{
						height: mobile-vw(160px);
					}
				}

				&.closed{


					&:after{
						opacity: 1;
					}
				}

			}

			&__row{
				position: relative;
				display: flex;
				flex-wrap: wrap;
				margin: 0 desktop-vw(-12px);
				padding: desktop-vw(16px) 0;
				justify-content: flex-start;
				align-items: center;
				cursor: pointer;

				@include mobile{
					margin: 0 mobile-vw(-6px);
					padding: mobile-vw(16px) 0;
				}

				td{
					position:relative;
					z-index: 1;
					font-size: desktop-vw(17px);
					line-height: desktop-vw(17px);
					text-transform: uppercase;
					@include font-ITCFranklinGothicLT-BkCp();

					@include mobile{
						font-size: mobile-vw(14px);
						line-height: mobile-vw(14px);
					}
				}

				&:before{
					content:'';
					position: absolute;
					z-index: 0;
					left: desktop-vw(12px);
					bottom: 0px;
					width: calc(100% -  desktop-vw(24px));
					height: 100%;
					background-color: var(--c-black);
					transition: background-color 360ms ease-in-out;

					@include mobile{
						left: mobile-vw(12px);
						width: calc(100% -  mobile-vw(24px));
					}
				}

				&:hover{
					&:before{
						background-color: var(--c-blue-adidas);
					}
				}

				&:after{
					content:'';
					position: absolute;
					left: desktop-vw(12px);
					bottom: 0px;
					width: calc(100% -  desktop-vw(24px));
					height: desktop-vw(1px);
					line-height: 0px;

					background-color: rgba(245, 245, 243, 0.30);

					@include mobile{
						left: mobile-vw(12px);
						width: calc(100% -  mobile-vw(24px));
						height: mobile-vw(1px);
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

				@include mobile{
					margin: mobile-vw(40px) auto 0;
					font-size: mobile-vw(16px);
					line-height: mobile-vw(24px);
				}
			}
		}

		&__num{
			width: 6.804%;
			padding: 0 desktop-vw(12px) 0  desktop-vw(20px);

			@include mobile{
				width: 10%;
				padding: 0 mobile-vw(6px) 0  mobile-vw(10px);
			}

			&__container{
				display: flex;
				flex-wrap: wrap;
				justify-content: space-between;
				align-items: center;
			}

			&__label{
				display: inline-block;
				flex: 0 0 auto;
				margin: 0;
			}

			&__svg{
				display: inline-block;
				flex: 0 0 auto;
				font-size: desktop-vw(16px);

				@include mobile{
					display: none;
				}
			}
		}

		&__team{
			flex: 1 0 0%;
			width: auto;

			padding: 0 desktop-vw(12px);

			@include mobile{
				padding: 0 mobile-vw(6px);
			}

			&__logo{
				display: inline-block;
				margin: 0 desktop-vw(16px) 0 0;
				width: desktop-vw(48px);
				height: desktop-vw(48px);
				vertical-align: middle;

				@include mobile{
					margin: 0 mobile-vw(8px) 0 0;
					width: mobile-vw(24px);
					height: mobile-vw(24px);
				}
			}

			&__name{
				display: inline-block;

			}
		}

		&__percent{
			width: 6.804%;
			text-align: center;

			@include mobile{
				width: 15%;
			}
		}

		&__played{
			width: 6.804%;
			text-align: center;

			@include mobile {
				display: none;
			}
		}

		&__win{
			width: 9.467%;
			text-align: center;

			@include mobile {
				display: none;
			}
		}

		&__lose{
			width: 9.467%;
			text-align: center;

			@include mobile {
				display: none;
			}
		}

		&__pos{
			width: 4.733%;
			text-align: center;

			@include mobile {
				display: none;
			}
		}

		&__neg{
			width: 4.733%;
			text-align: center;

			@include mobile {
				display: none;
			}
		}

		&__goal_average{
			width: 13.757%;
			padding: 0 desktop-vw(20px) 0  desktop-vw(12px);
			text-align: center;


			@include mobile{
				width: 18%;
				padding: 0 mobile-vw(10px) 0  mobile-vw(12px);
			}
		}
	}
</style>
