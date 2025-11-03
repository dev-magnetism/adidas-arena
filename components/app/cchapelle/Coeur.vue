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

			<div class="page-cchapelle__coeur__mobilescroll">
				<div class="page-cchapelle__coeur__map">

					<div class="page-cchapelle__coeur__map__content" ref="mapcontent">

						<div 
							class="page-cchapelle__coeur__map__sticker zone-1"
							:class="{
							 active: this.mapCCCoeurActive && this.mapCCCoeurActive === 'zone-1',
								 inactive: this.mapCCCoeurActive && this.mapCCCoeurActive !== 'zone-1'
							}"
							:style="{'top': this.zoneStickers?.zone1?.top +'px', 'left': this.zoneStickers?.zone1?.left +'px'}"
							>
							<div class="page-cchapelle__coeur__map__sticker__lineV"></div>
							<div class="page-cchapelle__coeur__map__sticker__lineH"></div>
							<div class="page-cchapelle__coeur__map__sticker__dot"></div>
							<div class="page-cchapelle__coeur__map__sticker__content">

								<div class="page-cchapelle__coeur__map__sticker__header">
									{{contents.map.zone1.title}}
								</div>
								<div class="page-cchapelle__coeur__map__sticker__body">
									<p>
										{{contents.map.zone1.text}}
									</p>
								</div>

							</div>
						</div>

						<div 
							class="page-cchapelle__coeur__map__sticker zone-2"
							:class="{
							 active: this.mapCCCoeurActive && this.mapCCCoeurActive === 'zone-2',
								 inactive: this.mapCCCoeurActive && this.mapCCCoeurActive !== 'zone-2'
							}"
							:style="{'top': this.zoneStickers?.zone2?.top +'px', 'left': this.zoneStickers?.zone2?.left +'px'}"
							>
							<div class="page-cchapelle__coeur__map__sticker__lineV"></div>
							<div class="page-cchapelle__coeur__map__sticker__lineH"></div>
							<div class="page-cchapelle__coeur__map__sticker__dot"></div>
							<div class="page-cchapelle__coeur__map__sticker__content">

								<div class="page-cchapelle__coeur__map__sticker__header">
									{{contents.map.zone2.title}}
								</div>
								<div class="page-cchapelle__coeur__map__sticker__body">
									<p>
										{{contents.map.zone2.text}}
									</p>
								</div>

							</div>
						</div>

						<div 
							class="page-cchapelle__coeur__map__sticker zone-3"
							:class="{
							 active: this.mapCCCoeurActive && this.mapCCCoeurActive === 'zone-3',
								 inactive: this.mapCCCoeurActive && this.mapCCCoeurActive !== 'zone-3'
							}"
							:style="{'top': this.zoneStickers?.zone3?.top +'px', 'left': this.zoneStickers?.zone3?.left +'px'}"
							>
							<div class="page-cchapelle__coeur__map__sticker__lineV"></div>
							<div class="page-cchapelle__coeur__map__sticker__lineH"></div>
							<div class="page-cchapelle__coeur__map__sticker__dot"></div>
							<div class="page-cchapelle__coeur__map__sticker__content">

								<div class="page-cchapelle__coeur__map__sticker__header">
									{{contents.map.zone3.title}}
								</div>
								<div class="page-cchapelle__coeur__map__sticker__body">
									<p>
										{{contents.map.zone3.text}}
									</p>
								</div>

							</div>
						</div>

						<div 
							class="page-cchapelle__coeur__map__sticker zone-4"
							:class="{
							 active: this.mapCCCoeurActive && this.mapCCCoeurActive === 'zone-4',
								 inactive: this.mapCCCoeurActive && this.mapCCCoeurActive !== 'zone-4'
							}"
							:style="{'top': this.zoneStickers?.zone4?.top +'px', 'left': this.zoneStickers?.zone4?.left +'px'}"
							>
							<div class="page-cchapelle__coeur__map__sticker__lineV"></div>
							<div class="page-cchapelle__coeur__map__sticker__lineH"></div>
							<div class="page-cchapelle__coeur__map__sticker__dot"></div>
							<div class="page-cchapelle__coeur__map__sticker__content">

								<div class="page-cchapelle__coeur__map__sticker__header">
									{{contents.map.zone4.title}}
								</div>
								<div class="page-cchapelle__coeur__map__sticker__body">
									<p>
										{{contents.map.zone4.text}}
									</p>
								</div>

							</div>
						</div>

						<div 
							class="page-cchapelle__coeur__map__sticker zone-5"
							:class="{
							 active: this.mapCCCoeurActive && this.mapCCCoeurActive === 'zone-5',
								 inactive: this.mapCCCoeurActive && this.mapCCCoeurActive !== 'zone-5'
							}"
							:style="{'top': this.zoneStickers?.zone5?.top +'px', 'left': this.zoneStickers?.zone5?.left +'px'}"
							>
							<div class="page-cchapelle__coeur__map__sticker__lineV"></div>
							<div class="page-cchapelle__coeur__map__sticker__lineH"></div>
							<div class="page-cchapelle__coeur__map__sticker__dot"></div>
							<div class="page-cchapelle__coeur__map__sticker__content">

								<div class="page-cchapelle__coeur__map__sticker__header">
									{{contents.map.zone5.title}}
								</div>
								<div class="page-cchapelle__coeur__map__sticker__body">
									<p>
										{{contents.map.zone5.text}}
									</p>
								</div>

							</div>
						</div>
						<div 
							class="page-cchapelle__coeur__map__sticker originals"
							:class="{
								 inactive: this.mapCCCoeurActive && this.mapCCCoeurActive !== 'originals'
							}"
							:style="{'top': this.zoneStickers?.originals?.top +'px', 'left': this.zoneStickers?.originals?.left +'px'}"
							>
							<div class="page-cchapelle__coeur__map__sticker__lineV"></div>
							<div class="page-cchapelle__coeur__map__sticker__lineH"></div>
							<div class="page-cchapelle__coeur__map__sticker__dot"></div>
							<div class="page-cchapelle__coeur__map__sticker__content">

								<div class="page-cchapelle__coeur__map__sticker__header">
									{{contents.map.originals.title}}
								</div>
								<div class="page-cchapelle__coeur__map__sticker__body">
									<p>
										{{contents.map.originals.text}}
									</p>
								</div>

							</div>
						</div>

						<div class="page-cchapelle__coeur__map__plan" ref="plan">
							<div 
								class="page-cchapelle__coeur__map__item zone-1"
								:class="{
									 active: this.mapCCCoeurActive && this.mapCCCoeurActive === 'zone-1',
		 							 inactive: this.mapCCCoeurActive && this.mapCCCoeurActive !== 'zone-1'
		 						}"
		 						@mouseenter="showZone('zone-1')"
		 						@mouseleave="resetZone()"
		 						ref="zone1"
								>
								<div class="page-cchapelle__coeur__map__item__square"></div>
								<div class="page-cchapelle__coeur__map__item__square"></div>
								<div class="page-cchapelle__coeur__map__item__square"></div>
								<div class="page-cchapelle__coeur__map__item__square"></div>
								<div class="page-cchapelle__coeur__map__item__square"></div>
								<div class="page-cchapelle__coeur__map__item__square"></div>
								<div class="page-cchapelle__coeur__map__item__square"></div>
								<div class="page-cchapelle__coeur__map__item__square"></div>
								<div class="page-cchapelle__coeur__map__item__square"></div>
								<div class="page-cchapelle__coeur__map__item__square"></div>
								<div 
									class="page-cchapelle__coeur__map__item__square anchor"
									ref="zone1sticker"
								>
								</div>
								<div class="page-cchapelle__coeur__map__item__square"></div>
								<div class="page-cchapelle__coeur__map__item__square"></div>
								<div class="page-cchapelle__coeur__map__item__square"></div>
								<div class="page-cchapelle__coeur__map__item__square"></div>
								<div class="page-cchapelle__coeur__map__item__square"></div>
								<div class="page-cchapelle__coeur__map__item__square"></div>
								<div class="page-cchapelle__coeur__map__item__square"></div>
							</div>

							<div 
								class="page-cchapelle__coeur__map__item zone-2"
								:class="{
									 active: this.mapCCCoeurActive && this.mapCCCoeurActive === 'zone-2',
		 							 inactive: this.mapCCCoeurActive && this.mapCCCoeurActive !== 'zone-2'
		 						}"
		 						@mouseenter="showZone('zone-2')"
		 						@mouseleave="resetZone()"
		 						ref="zone2"
								>
								<div class="page-cchapelle__coeur__map__item__square"></div>
								<div class="page-cchapelle__coeur__map__item__square"></div>
								<div class="page-cchapelle__coeur__map__item__square"></div>
								<div class="page-cchapelle__coeur__map__item__square"></div>
								<div class="page-cchapelle__coeur__map__item__square anchor"
									ref="zone2sticker"
								>
								</div>
								<div class="page-cchapelle__coeur__map__item__square"></div>
								<div class="page-cchapelle__coeur__map__item__square"></div>
								<div class="page-cchapelle__coeur__map__item__square"></div>
								<div class="page-cchapelle__coeur__map__item__square"></div>
								<div class="page-cchapelle__coeur__map__item__square"></div>
								<div class="page-cchapelle__coeur__map__item__square"></div>
								<div class="page-cchapelle__coeur__map__item__square"></div>
								<div class="page-cchapelle__coeur__map__item__square"></div>
								<div class="page-cchapelle__coeur__map__item__square"></div>
								<div class="page-cchapelle__coeur__map__item__square"></div>
							</div>

							<div 
								class="page-cchapelle__coeur__map__item zone-3"
								:class="{
									 active: this.mapCCCoeurActive && this.mapCCCoeurActive === 'zone-3',
		 							 inactive: this.mapCCCoeurActive && this.mapCCCoeurActive !== 'zone-3'
		 						}"
		 						@mouseenter="showZone('zone-3')"
		 						@mouseleave="resetZone()"
		 						ref="zone3"
								>
								<div class="page-cchapelle__coeur__map__item__square"></div>
								<div class="page-cchapelle__coeur__map__item__square"></div>
								<div class="page-cchapelle__coeur__map__item__square"></div>
								<div class="page-cchapelle__coeur__map__item__square"></div>
								<div class="page-cchapelle__coeur__map__item__square"></div>
								<div class="page-cchapelle__coeur__map__item__square"></div>
								<div class="page-cchapelle__coeur__map__item__square anchor"
									ref="zone3sticker"
								>
								</div>
								<div class="page-cchapelle__coeur__map__item__square"></div>
								<div class="page-cchapelle__coeur__map__item__square"
									ref="originalsSticker"
								>
								</div>
								<div class="page-cchapelle__coeur__map__item__square"></div>
								<div class="page-cchapelle__coeur__map__item__square"></div>
								<div class="page-cchapelle__coeur__map__item__square"></div>
								<div class="page-cchapelle__coeur__map__item__square"></div>
								<div class="page-cchapelle__coeur__map__item__square"></div>
								<div class="page-cchapelle__coeur__map__item__square"></div>
								<div class="page-cchapelle__coeur__map__item__square"></div>
								<div class="page-cchapelle__coeur__map__item__square"></div>
								<div class="page-cchapelle__coeur__map__item__square"></div>
								<div class="page-cchapelle__coeur__map__item__square"></div>
								<div class="page-cchapelle__coeur__map__item__square"></div>
								<div class="page-cchapelle__coeur__map__item__square"></div>
								<div class="page-cchapelle__coeur__map__item__square"></div>
								<div class="page-cchapelle__coeur__map__item__square"></div>
								<div class="page-cchapelle__coeur__map__item__square"></div>-
								<div class="page-cchapelle__coeur__map__item__square float pos1"></div>
								<div class="page-cchapelle__coeur__map__item__square float pos2"></div>
								<div class="page-cchapelle__coeur__map__item__square float pos3"></div>
							</div>

							<div 
								class="page-cchapelle__coeur__map__item zone-4"
								:class="{
									 active: this.mapCCCoeurActive && this.mapCCCoeurActive === 'zone-4',
		 							 inactive: this.mapCCCoeurActive && this.mapCCCoeurActive !== 'zone-4'
		 						}"
		 						@mouseenter="showZone('zone-4')"
		 						@mouseleave="resetZone()"
		 						ref="zone4"
								>
								<div class="page-cchapelle__coeur__map__item__square"></div>
								<div class="page-cchapelle__coeur__map__item__square"></div>
								<div class="page-cchapelle__coeur__map__item__square"></div>
								<div class="page-cchapelle__coeur__map__item__square"></div>
								<div class="page-cchapelle__coeur__map__item__square anchor"
									ref="zone4sticker"
								>
								</div>
								<div class="page-cchapelle__coeur__map__item__square"></div>
								<div class="page-cchapelle__coeur__map__item__square"></div>
								<div class="page-cchapelle__coeur__map__item__square"></div>
								<div class="page-cchapelle__coeur__map__item__square"></div>
								<div class="page-cchapelle__coeur__map__item__square"></div>
								<div class="page-cchapelle__coeur__map__item__square"></div>
								<div class="page-cchapelle__coeur__map__item__square"></div>
							</div>

							<div 
								class="page-cchapelle__coeur__map__item zone-5"
								:class="{
									 active: this.mapCCCoeurActive && this.mapCCCoeurActive === 'zone-5',
		 							 inactive: this.mapCCCoeurActive && this.mapCCCoeurActive !== 'zone-5'
		 						}"
		 						@mouseenter="showZone('zone-5')"
		 						@mouseleave="resetZone()"
		 						ref="zone5"
								>
								<div class="page-cchapelle__coeur__map__item__square"></div>
								<div class="page-cchapelle__coeur__map__item__square"></div>
								<div class="page-cchapelle__coeur__map__item__square"></div>
								<div class="page-cchapelle__coeur__map__item__square"></div>
								<div class="page-cchapelle__coeur__map__item__square"></div>
								<div class="page-cchapelle__coeur__map__item__square"></div>
								<div class="page-cchapelle__coeur__map__item__square"></div>
								<div class="page-cchapelle__coeur__map__item__square"></div>
								<div class="page-cchapelle__coeur__map__item__square anchor"
									ref="zone5sticker"
								>
								</div>
								<div class="page-cchapelle__coeur__map__item__square"></div>
								<div class="page-cchapelle__coeur__map__item__square"></div>
								<div class="page-cchapelle__coeur__map__item__square"></div>
								<div class="page-cchapelle__coeur__map__item__square"></div>
								<div class="page-cchapelle__coeur__map__item__square"></div>
								<div class="page-cchapelle__coeur__map__item__square"></div>
								<div class="page-cchapelle__coeur__map__item__square"></div>
								<div class="page-cchapelle__coeur__map__item__square"></div>
								<div class="page-cchapelle__coeur__map__item__square"></div>
								<div class="page-cchapelle__coeur__map__item__square float pos1"></div>
							</div>

							<div 
								class="page-cchapelle__coeur__map__item lonely-island"
								>
								<div class="page-cchapelle__coeur__map__item__square"></div>
							</div>

							<div 
								class="page-cchapelle__coeur__map__item west-aisle"
								>
								<div class="page-cchapelle__coeur__map__item__circle"></div>
							</div>
							<div 
								class="page-cchapelle__coeur__map__item right-aisle"
								>
							</div>
						</div>
					</div>

				</div>
			</div>

    	</div>

	</div>

</template>

<script>

import { mapState, mapMutations } from 'vuex'

export default {
	data() {
		return {
			zoneStickers: null, 
			resizeTimer: null,
		}
	},
	props: {
		contents: {
			type: Object,
			default: () => {},
		},
	},
	computed: {
		...mapState({
			mapCCCoeurActive: (state) => state.mapCCCoeurActive,
		}),
	},
	mounted() {

		console.log('Coeur / contents', this.contents);
		setTimeout(this.checkStickers(), 500);

		//	window.onresize = setTimeout(this.checkStickers(), 500);
		
		window.addEventListener("resize", ()=>{
			clearTimeout(this.resizeTimer);
			this.resizeTimer = setTimeout(this.checkStickers(), 500);
		});

	},
	methods: {
	    ...mapMutations({
	      setMapCCCoeurActive: 'setMapCCCoeurActive',
	    }),
	    checkStickers(){

	    	this.$refs.plan.style="transform: scaleY(.5) rotate(45deg)";

	    	const _mapcontent = this.$refs.mapcontent.getBoundingClientRect();
	    	const _plan = this.$refs.plan.getBoundingClientRect();
	    	//	this.$refs.mapcontent.style=`width: ${_plan.width}px; height: ${_plan.height}px; margin: 0 auto;`;
	    	this.$refs.plan.style=`width: ${_plan.width}px; height: ${_plan.height}px; transform: scaleY(.5) rotate(45deg); `;
	    	const _zone1sticker = this.$refs.zone1sticker.getBoundingClientRect();
	    	const _zone2sticker = this.$refs.zone2sticker.getBoundingClientRect();
	    	const _zone3sticker = this.$refs.zone3sticker.getBoundingClientRect();
	    	const _zone4sticker = this.$refs.zone4sticker.getBoundingClientRect();
	    	const _zone5sticker = this.$refs.zone5sticker.getBoundingClientRect();
	    	const _originalsSticker = this.$refs.originalsSticker.getBoundingClientRect();

	    	const _obj = {
	    		zone1: {
	    			top: (_zone1sticker.top + _zone1sticker.height / 2) - _mapcontent.top,
	    			left: (_zone1sticker.left + _zone1sticker.width / 2) - _mapcontent.left,
	    		},
	    		zone2: {
	    			top: (_zone2sticker.top + _zone2sticker.height / 2) - _mapcontent.top,
	    			left: (_zone2sticker.left + _zone2sticker.width / 2) - _mapcontent.left,
	    		},
	    		zone3: {
	    			top: (_zone3sticker.top + _zone3sticker.height / 2) - _mapcontent.top,
	    			left: (_zone3sticker.left + _zone3sticker.width / 2) - _mapcontent.left,
	    		},
	    		zone4: {
	    			top: (_zone4sticker.top + _zone4sticker.height / 2) - _mapcontent.top,
	    			left: (_zone4sticker.left + _zone4sticker.width / 2) - _mapcontent.left,
	    		},
	    		zone5: {
	    			top: (_zone5sticker.top + _zone5sticker.height / 2) - _mapcontent.top,
	    			left: (_zone5sticker.left + _zone5sticker.width / 2) - _mapcontent.left,
	    		},
	    		originals: {
	    			top: (_originalsSticker.top + _originalsSticker.height / 2) - _mapcontent.top,
	    			left: (_originalsSticker.left + _originalsSticker.width / 2) - _mapcontent.left,
	    		},
	    	}

	    	console.log('checkStickers / _obj', _obj);

	    	this.zoneStickers = _obj;
	    },
	    showZone(_id){
	    	console.log('showZone / _id', _id);
	    	this.setMapCCCoeurActive(_id);
	    },
	    resetZone(){
	    	this.setMapCCCoeurActive(false);
	    }
	},
}
</script>

<style lang="scss">
.page-cchapelle{

	&__coeur{
		position: relative;
		padding-top: desktop-vw(142px);
		padding-bottom: desktop-vw(142px);
		background-color: #E2E2E2;
		overflow: hidden;

		@include mobile{
			padding-top: mobile-vw(64px);
			padding-bottom: mobile-vw(60px);
		}



		&__mobilescroll{
			grid-column: 2 / span 10;
			margin-top: desktop-vw(200px);
			margin-bottom: desktop-vw(200px);

			@include mobile{
				grid-column: 1 / span 6;
				position: relative;
				margin: 0;
				padding: mobile-vw(50px) mobile-vw(100px) mobile-vw(50px) mobile-vw(200px) ;
				overflow-x: scroll;
				overflow-y: hidden;
			}
		}

		&__map{
			--square : 64px;

			position: relative;
			//	justify-items: center;

			@include mobile{
				height: mobile-vw(400px);
				width: mobile-vw(600px);
			}

			&__sticker{
				position: absolute;
				transform: translate(-50%, -50%); 
				
				z-index:3;
				pointer-events: none;
				transition: opacity 500ms ease-in-out;


				&__lineV{
					position: absolute;
					z-index:1;
					left: desktop-vw(-1px);
					bottom: 0;
					width: desktop-vw(2px);
					height: desktop-vw(100px);
					background-color: var(--c-black);

					@include mobile{
						left: mobile-vw(-1px);
						width: mobile-vw(2px);
						height: mobile-vw(50px);
					}
				}

				&__lineH{
					position: absolute;
					z-index:1;
					left: 0;
					top: desktop-vw(-100px);
					width: desktop-vw(50px);
					height: desktop-vw(2px);
					background-color: var(--c-black);

					@include mobile{
						top: mobile-vw(-50px);
						width: mobile-vw(25px);
						height: mobile-vw(2px);
					}
				}

				&__dot{
					position: absolute;
					z-index:1;
					left: 0;
					bottom: 0;
					width: desktop-vw(16px);
					height: desktop-vw(16px);
					background-color: var(--c-black);
					border-radius: 50%;
					transform: translate(-50%, 50%);

					@include mobile{
						width: mobile-vw(10px);
						height: mobile-vw(10px);
					}
				}

				&__content{
					position: absolute;
					z-index:1;
					left:  desktop-vw(50px);
					top: desktop-vw(-112px);
					min-width: desktop-vw(250px);


					@include mobile{
						left:  mobile-vw(25px);
						top: mobile-vw(-62px);
						min-width: mobile-vw(250px);
					}
				}

				&__header{
					border: 2px solid var(--c-black);
					padding: desktop-vw(4px) desktop-vw(4px) desktop-vw(2px);
					white-space: nowrap;
					@include font-ITCFranklinGothicLT-DmCp();
					font-size: desktop-vw(20px);
					line-height: desktop-vw(16px);
					letter-spacing: desktop-vw(1.28px);
					color: var(--c-black) !important;
					text-align: center;
					text-transform: uppercase;

					@include mobile{
						padding: mobile-vw(4px) mobile-vw(4px) mobile-vw(2px);
						font-size: mobile-vw(16px);
						line-height: mobile-vw(14px);
						letter-spacing: mobile-vw(.4px);
					}
				}

				&__body{
					margin: -2px 0 0;
					border: 2px solid var(--c-black);
					border-top: none;
					
					background-color: var(--c-white);
					height: 0;
					max-height: fit-content;
					overflow: hidden;
					transition: all 1000ms ease-in-out;


					p{
						padding: desktop-vw(4px) desktop-vw(8px) desktop-vw(4px);
						@include font-ITCFranklinGothicLT-BkCp();
						font-size: desktop-vw(12px);
						line-height: desktop-vw(14px);
						color: var(--c-black) !important;

						@include mobile{
							padding: mobile-vw(4px) mobile-vw(8px) mobile-vw(4px);
							font-size: mobile-vw(12px);
							line-height: mobile-vw(14px);
						}
					}
				}

				&.inactive{
					opacity: 0;
				}

				&.active{
					.page-cchapelle__coeur__map__sticker__body{
						margin: 0;
						height: desktop-vw(1000px);

						@include mobile{
							height: mobile-vw(1000px);
						}
					}
				}

				&.zone-1{
					// top: 44%;
					// left: desktop-vw(180px);
					.page-cchapelle__coeur__map__sticker__header{
						background-color: #4787c7;
					}

					.page-cchapelle__coeur__map__sticker__lineH{
						left: unset;
						right: 0;
					}

					.page-cchapelle__coeur__map__sticker__content{
						left: unset;
						right:  desktop-vw(50px);

						@include mobile{
							right: mobile-vw(25px);
						}
					}

				}
				&.zone-2{
					// top: 46.5%;
					// left: desktop-vw(393px);

					.page-cchapelle__coeur__map__sticker__header{
						background-color: #8384b0;
					}
				}
				&.zone-3{
					// top: 56%;
					// left: desktop-vw(564px);

					.page-cchapelle__coeur__map__sticker__header{
						background-color: #ea4e1b;
					}
				}
				&.zone-4{
					// top: 63.25%;
					// left: desktop-vw(692px);

					.page-cchapelle__coeur__map__sticker__header{
						background-color: #77a248;
					}
				}
				&.zone-5{
					// top: 77.5%;
					// left: desktop-vw(730px);

					.page-cchapelle__coeur__map__sticker__header{
						background-color: #ffe400;
					}

					.page-cchapelle__coeur__map__sticker__lineH{
						top: desktop-vw(98px);

						@include mobile{
							top: mobile-vw(48px);
						}
					}


					.page-cchapelle__coeur__map__sticker__lineV{
						bottom: unset;
						top: 0;
					}

					.page-cchapelle__coeur__map__sticker__content{
						top: desktop-vw(86px);

						@include mobile{
							top: mobile-vw(36px);
						}
					}
				}

				&.originals{
					.page-cchapelle__coeur__map__sticker__header{
						border-bottom: 0;
						padding-left: desktop-vw(4px);
						padding-right: desktop-vw(4px);

						@include mobile{
							padding-left: mobile-vw(4px);
							padding-right: mobile-vw(4px);
						}
					}

					.page-cchapelle__coeur__map__sticker__body{
						background: none;
						height: fit-content;
					}

					.page-cchapelle__coeur__map__sticker__lineV{
						height: desktop-vw(260px);
						bottom: unset;
						top: 0;

						@include mobile{
							height: mobile-vw(160px);
						}
					}

					.page-cchapelle__coeur__map__sticker__lineH{
						left: desktop-vw(-100px);
						top: desktop-vw(258px);
						width: desktop-vw(100px);


						@include mobile{
							left: mobile-vw(-50px);
							top: mobile-vw(158px);
							width: mobile-vw(50px);
						}
					}

					.page-cchapelle__coeur__map__sticker__content{
						left: unset;
						right:  desktop-vw(100px);
						top: desktop-vw(258px);
						min-width: auto;
						transform: translateY(-50%);

						@include mobile{
							right:  mobile-vw(50px);
							top: mobile-vw(158px);
						}
					}
				}


			}

			&__content{
				display: block;
			}

			&__plan{
				position: relative;
				display: block;
				margin: 0 auto;
				//	transform: scaleY(.5) rotate(45deg);

				@include mobile{
					margin: 0;
				}
			}
			
			&__item{
				position: absolute;
				z-index: 2;
				display: flex;
				flex-wrap: wrap;
				flex: 0 0 auto;
				//	width: calc(var(--square) * 3);
				width: calc(desktop-vw(64px) * 3);
				//	desktop-vw(236px);

				@include mobile{
					width: calc(mobile-vw(32px) * 3);
				}

				&.lonely-island{
					top: calc(desktop-vw(64px) * 4 - (2px * 4) + (desktop-vw(64px) * 0.75));
					left: calc(desktop-vw(64px) * 10 - (2px * 10) + (desktop-vw(64px) * 0.69));
					width: calc(desktop-vw(64px) * 1);
					// top: calc(var(--square) * 4 - (2px * 4) + (var(--square) * 0.75));
					// left: calc(var(--square) * 10 - (2px * 10) + (var(--square) * 0.69));
					// width: calc(var(--square) * 1);

					@include mobile{
						top: calc(mobile-vw(32px) * 4 - (2px * 4) + (mobile-vw(32px) * 0.75));
						left: calc(mobile-vw(32px) * 10 - (2px * 10) + (mobile-vw(32px) * 0.69));
						width: calc(mobile-vw(32px) * 1);
					}
					
					.page-cchapelle__coeur__map__item__square{
						background-color: #c6c6c6;
						cursor: default;
					}
				}

				&__circle{
					position: absolute;
					left: 50%;
					top: desktop-vw(10px);
					border: 1px dotted #a4a4a4;
					border-bottom: none;
					padding: 100% 0 0;
					width: 125%;
					height: 0;
					border-radius: 50%;
					transform: translateX(-50%);

					@include mobile{
						top: mobile-vw(10px);
					}
				}

				&.west-aisle{
					top: calc(desktop-vw(64px) * 6 - (2px * 6));
					//	top: calc(var(--square) * 6 - (2px * 6));
					left: 0;
					width: calc(desktop-vw(64px) * 10 - (2px * 10));
					//	width: calc(var(--square) * 10 - (2px * 10));
					height: desktop-vw(1200px);
					border-left: 1px dotted #a4a4a4;
					border-right: 1px dotted #a4a4a4;
					overflow: hidden;

					@include mobile{
						top: calc(mobile-vw(32px) * 6 - (2px * 6));
						width: calc(mobile-vw(32px) * 10 - (2px * 10));
						height: mobile-vw(1200px);
					}
				}

				&.right-aisle{
					top: calc(desktop-vw(64px) * 1.5 + desktop-vw(64px) * 6 - (2px * 6));
					left: calc(desktop-vw(64px) * 13 - (2px * 13) - desktop-vw(64px) * 0.5);
					//	top: calc(var(--square) * 1.5 + var(--square) * 6 - (2px * 6));
					//	left: calc(var(--square) * 13 - (2px * 13) - var(--square) * 0.5);
					height: desktop-vw(1200px);
					
					border-right: 1px dotted #a4a4a4;
					overflow: hidden;

					@include mobile{
						top: calc(mobile-vw(32px) * 1.5 + mobile-vw(32px) * 6 - (2px * 6));
						left: calc(mobile-vw(32px) * 13 - (2px * 13) - mobile-vw(32px) * 0.5);
						height: mobile-vw(1200px);
					}
				}

				&.zone-1{
					top: 0;
					left: 0;

					.page-cchapelle__coeur__map__item__square{
						background-color: #4787c7;
					}

					&.inactive{
						.page-cchapelle__coeur__map__item__square{
							background-color: #b2bcc6;
						}
					}
				}
				&.zone-2{
					top: 0;
					left: calc(desktop-vw(64px) * 3 - (2px * 3));
					//	left: calc(var(--square) * 3 - (2px * 3));

					@include mobile{
						left: calc(mobile-vw(32px) * 3 - (2px * 3));
					}

					.page-cchapelle__coeur__map__item__square{
						background-color: #8384b0;
					}

					&.inactive{
						.page-cchapelle__coeur__map__item__square{
							background-color: #acabb0;
						}
					}
				}
				&.zone-3{
					top: 0;
					left: calc(desktop-vw(64px) * 6 - (2px * 6));
					width: calc(desktop-vw(64px) * 4);
					// left: calc(var(--square) * 6 - (2px * 6));
					// width: calc(var(--square) * 4);

					@include mobile{
						left: calc(mobile-vw(32px) * 6 - (2px * 6));
						width: calc(mobile-vw(32px) * 4);
					}

					.page-cchapelle__coeur__map__item__square{
						background-color: #ea4e1b;
						&.float{

							position: absolute;
							bottom: 0;

							&.pos1{
								left: calc(desktop-vw(64px) * -3 + (2px * 3));
								//	left: calc(var(--square) * -3 + (2px * 3));
								@include mobile{
									left: calc(mobile-vw(32px) * -3 + (2px * 3));
								}
							}
							&.pos2{
								left: calc(desktop-vw(64px) * -2 + (2px * 2));
								//	left: calc(var(--square) * -2 + (2px * 2));
								@include mobile{
									left: calc(mobile-vw(32px) * -2 + (2px * 2));
								}
							}
							&.pos3{
								left: calc(desktop-vw(64px) * -1 + (2px * 1));
								//	left: calc(var(--square) * -1 + (2px * 1));
								@include mobile{
									left: calc(mobile-vw(32px) * -1 + (2px * 1));
								}
							}
						}
					}
					
					&.inactive{
						.page-cchapelle__coeur__map__item__square{
							background-color: #e9d8d1;
						}
					}
				}
				&.zone-4{
					left: calc(desktop-vw(64px) * 10 - (2px * 10));
					//	left: calc(var(--square) * 10 - (2px * 10));

					@include mobile{
						left: calc(mobile-vw(32px) * 10 - (2px * 10));
					}

					.page-cchapelle__coeur__map__item__square{
						background-color: #77a248;
					}
					
					&.inactive{
						.page-cchapelle__coeur__map__item__square{
							background-color: #d0dfbf;
						}
					}
				}
				&.zone-5{
					top: calc(desktop-vw(64px) * 1.5);
					left: calc(desktop-vw(64px) * 13 - (2px * 13) - desktop-vw(64px) * 0.5);
					//	top: calc(var(--square) * 1.5);
					//	left: calc(var(--square) * 13 - (2px * 13) - var(--square) * 0.5);
					z-index: 1;

					@include mobile{
						top: calc(mobile-vw(32px) * 1.5);
						left: calc(mobile-vw(32px) * 13 - (2px * 13) - mobile-vw(32px) * 0.5);
					}

					.page-cchapelle__coeur__map__item__square{
						background-color: #ffe400;

						&.float{

							position: absolute;
							bottom: 0;

							&.pos1{
								left: calc(desktop-vw(64px) * -1 + (2px * 1));
								//	left: calc(var(--square) * -1 + (2px * 1));

								@include mobile{
									left: calc(mobile-vw(32px) * -1 + (2px * 1));
								}
							}
						}
					}
					
					&.inactive{
						.page-cchapelle__coeur__map__item__square{
							background-color: #fefce7;
						}
					}
				}

				&__square{
					display: flex;
					flex: 0 0 auto;
					width: desktop-vw(64px);
					height: desktop-vw(64px);
					//	width: var(--square);
					//	height: var(--square);
					border: 2px solid var(--c-black);
					margin: 0 -2px -2px 0;
					transition: all 360ms ease-in-out;
					cursor: pointer;

					@include mobile{
						width: mobile-vw(32px);
						height: mobile-vw(32px);
					}

					// &.anchor{
					// 	background-color: var(--c-white) !important;
					// }
				}

			}
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

			@include mobile{				
				padding-right: mobile-vw(30px);
				padding-left: mobile-vw(30px);
			}

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

			@include mobile{
				margin-top: 0;
				margin-bottom: mobile-vw(100px);
				padding-right: mobile-vw(30px);
				padding-left: mobile-vw(30px);
			}
			
			.P1{
				font-size: desktop-vw(17px);
				line-height: desktop-vw(20px);
				color: var(--c-black) !important;
				text-align: left;
				text-transform: unset;

				@include mobile{
					font-size: mobile-vw(17px);
					line-height: mobile-vw(20px);
				}
			}
		}

	}

}
</style>
