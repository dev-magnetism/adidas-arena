<template>

	<div class="app-arena__gymnases grid-inner">

		<div class="app-arena__gymnases__heading">

			<div class="app-arena__gymnases__heading__title">
				 <ERichText ref="title" tag="h2" :content="contents.title" />
			</div>
			<div class="app-arena__gymnases__heading__subtitle">
				<ERichText
					ref="subtitle"
					tag="p"
					weight="medium"
					:content="contents.subtitle"
				/>
			</div>
			<div class="app-arena__gymnases__heading__paragraph">
				<ERichText
					ref="paragraph"
					tag="p"
					weight="medium"
					:content="contents.paragraph"
				/>
			</div>

		</div>

		<div class="app-arena__gymnases__list">

			<div 
				v-for="(item) in contents.list"
				:key="`gymnases-${item.id}`"
				class="app-arena__gymnases__list__card"
			>
				<div class="app-arena__gymnases__list__card__wrapper">

					<div class="app-arena__gymnases__list__card__visual">

		      			<div class="app-arena__gymnases__list__card__visual__wrapper">

		       				<div class="app-arena__gymnases__list__card__layer" />

							<nuxt-img
								v-if="item.visual"
								:src="item.visual"
								:alt="item.title"
								provider="directus"
								loading="lazy"
							/>
						</div>
					</div>

					<div class="app-arena__gymnases__list__card__informations">

						<div class="app-arena__gymnases__list__card__head">
							<TP2
								class="title"
								weight="bold"
								tag="h3"
							>
								{{item.title}}
							</TP2>

							<TP2
								class="text"
								weight="medium"
							>
								{{item.text}}
							</TP2>
						</div>

						<div class="app-arena__gymnases__list__card__socials">	
							<a
								v-if="item.social_facebook"
								:href="item.social_facebook"
								target="_blank"
								class="app-arena__gymnases__list__card__social-network"
							>
								<SvgFooterFacebook />
							</a>
							<a
								v-if="item.social_linkedin"
								:href="item.social_linkedin"
								target="_blank"
								class="app-arena__gymnases__list__card__social-network"
							>
								<SvgFooterLinkedin />
							</a>
							<a
								v-if="item.social_instagram"
								:href="item.social_instagram"
								target="_blank"
								class="app-arena__gymnases__list__card__social-network"
							>
								<SvgFooterInstagram />
							</a>
							<a
								v-if="item.social_tiktok"
								:href="item.social_tiktok"
								target="_blank"
								class="app-arena__gymnases__list__card__social-network"
							>
								<SvgFooterTiktok />
							</a>


						</div>

					</div>

				</div>

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

	  },
	  beforeDestroy() {

	  },
	  methods: {

	  }
	}
</script>

<style lang="scss">
.app-arena__gymnases {
	margin-bottom: desktop-vw(200px);

	@include mobile {
		margin-top: mobile-vw(100px);
		margin-bottom: mobile-vw(100px);
	}

	&__heading{
		grid-column: 2 / span 4;
		margin-bottom: desktop-vw(64px);
	    width: 100%;

		@include mobile {
			grid-column: 1 / span 5;
			margin-bottom: mobile-vw(32px);
		}

		&__title{
			.H2.wysiwyg-text {
				
				font-size: desktop-vw(100px);
				text-transform: uppercase;
				@include font-ITCFranklinGothicLT-BkCp();
				// font-weight: 700;

				@include mobile {
					font-size: mobile-vw(80px);
					margin-bottom: mobile-vw(24px);
				}
			}
		}

		&__subtitle{
			margin-bottom: desktop-vw(25px);

			@include mobile {
				margin-bottom: mobile-vw(25px);
			}

			.P2.wysiwyg-text {
				
				font-size: desktop-vw(18px);
				text-transform: uppercase;

				@include font-ITCFranklinGothicLT-DmCp();
				// font-weight: 700;

				@include mobile {
					font-size: mobile-vw(18px);
				}
			}
		}

		&__paragraph{
			ul{
				padding: 0 0 0 desktop-vw(16px);
				list-style: none;

				@include mobile {
					padding: 0 0 0 mobile-vw(16px);
				}

			}

			li{
				position: relative;
				padding: 0 0 0 desktop-vw(16px);				
				@include font-ITCFranklinGothicLT-BkCp();
				font-size: desktop-vw(17px);

				@include mobile {
					padding: 0 0 0 mobile-vw(16px);
					font-size: mobile-vw(17px);
				}

				&:before{
					content:'';
					position: absolute;
					top: desktop-vw(7px);
					left: 0;
					width: desktop-vw(2px);
					height: desktop-vw(2px);
					background-color: #181818;
					line-height: 0;

					@include mobile {
						top: mobile-vw(7px);
						width: mobile-vw(2px);
						height: mobile-vw(2px);
					}
				}

			}

			.P2.wysiwyg-text {
				
				@include font-ITCFranklinGothicLT-BkCp();
				font-size: desktop-vw(17px);

				@include mobile {
					font-size: mobile-vw(17px);
				}
			}
		}
	}

	&__list{
		grid-column: 1 / span 12;
		display: flex;
		flex-wrap: wrap;
		align-items: stretch;
		margin: 0 desktop-vw(-12px);

		@include mobile {
			grid-column: 1 / span 6;
			margin: 0 mobile-vw(-12px);
		}

		&__card{
			display: block;
			flex: 0 0 auto;
			padding: 0 desktop-vw(12px);
			width: 33.333%;

			@include mobile {
				margin-bottom: mobile-vw(24px);
				padding: 0 mobile-vw(12px);
				width: 100%;
			}
			
			&__wrapper{
				position: relative;
				border: 1px solid #181818;
				padding: 0 0 desktop-vw(64px) 0;
				height: 100%;
				min-height: desktop-vw(577px);

				@include mobile {
					padding: 0 0 mobile-vw(64px) 0;
					min-height: auto;
				}
			}

			&__informations{
				padding: desktop-vw(24px) desktop-vw(24px) 0 desktop-vw(24px);

				@include mobile {
					padding: mobile-vw(16px) mobile-vw(16px) 0 mobile-vw(16px);
				}
				
			}

			&__visual {
				width: 100%;
				display: block;
				position: relative;
				z-index: 0;
				border-bottom: 1px solid #181818;
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

			&__head{

				.title{
					
					@include font-ITCFranklinGothicLT-DmXtraCp();
					font-weight: 600;
					font-size: desktop-vw(64px);
					line-height: desktop-vw(57px);
					text-transform: uppercase;

					@include mobile {
						margin-bottom: mobile-vw(16px);
						font-size: mobile-vw(32px);
						line-height: mobile-vw(29px);
					}
				}

				.text{
					@include font-ITCFranklinGothicLT-BkCp();
					font-size: desktop-vw(17px);
					line-height: desktop-vw(20px);
					font-weight: 400;
					letter-spacing: desktop-vw(1.36px);
					text-transform: uppercase;

					@include mobile {
						font-size: mobile-vw(14px);
						line-height: mobile-vw(12px);
						letter-spacing: mobile-vw(1.36px);
					}
				}
			}

			&__socials{
				position: absolute;
				right: -1px;
				bottom: -1px;

				display: flex;
			}

			&__social-network {
				width: desktop-vw(32px);
				height: desktop-vw(32px);
				display: flex;
				justify-content: center;
				align-items: center;
				border-top: 1px solid var(--c-black);
				border-left: 1px solid var(--c-black);
				border-bottom: 1px solid var(--c-black);
				cursor: pointer;
				position: relative;

				@include mobile {
					width: mobile-vw(32px);
					height: mobile-vw(32px);
				}

				svg {
					z-index: 1;
					transform: scale(.75);


					path {
						fill: var(--c-black);
						// transition: fill 0.25s 0.1s var(--ease-out-expo);
					}
				}

				@include hover {
					&:hover {
						&::after {
							transform: scaleY(1);
						}
						svg {
							path {
								fill: var(--c-white);
							}
						}
					}
				}

				&::after {
					content: '';
					position: absolute;
					top: 0;
					left: 0;
					width: 100%;
					height: 100%;
					background: var(--c-black);
					transform-origin: top center;
					transform: scaleY(0);
					transition: transform 0.65s var(--ease-out-expo);
				}

				&:last-child {
					border-left: 1px solid var(--c-black);
					border-right: 1px solid var(--c-black);
				}
			}
		}
	}

}
</style>