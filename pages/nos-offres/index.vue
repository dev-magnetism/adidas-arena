<template>
   <main class="app-business">

		<div class="app-business-offers" ref="offers">

			<div class="app-business-offers-filters">
				<div
					v-for="(cat) in this.businessCatContent"
					:key="`key-${cat.id}`"
					class="app-business-offers-filters__radio"
				>
					<input
						:id="`category${cat.id}`"
						ref="radioButtons"
						v-model="selectedCategory"
						type="radio"
						name="filters-radio"
						:value="cat.id"
					/>
					<label :for="`category${cat.id}`">
						<TP1 weight="bold">
							{{ cat.name }}
						</TP1>

						<TP1 weight="regular">
							{{ cat.numArt }}
						</TP1>
					</label>
				</div>

			</div>

			<div class="app-business-offers__container">

	   			<div class="app-business-offers__title__block">

	   				<ERichText
						ref="title"
						class="app-business-offers__title__block__title"
						:content="`${(this.selectedCategory)?this.businessCatContent.find(_cat=>_cat.id === this.selectedCategory).Title:''}`"
						tag="h1"
					/>

					<ERichText
		          		ref="paragraph"
			          	class="app-business-offers__title__block__introduction"
			          	:content="`<p>${(this.selectedCategory)?this.businessCatContent.find(_cat=>_cat.id === this.selectedCategory).Text:''}</p>`"
			          	tag="p"
			       	 />

			         <AtomsCTA
		            	class="app-business-offers__title__block__cta"
		            	bg="white"
		            	color="blue-adidas"
		            	layer-color="black"
		            	button
		            	@click.native="onClickContact()"
		          		>
		            	Nous contacter
		          	</AtomsCTA>

					<EOffresContactOverlay
						form-type="`VEUILLEZ REMPLIR LE FORMULAIRE POUR ACCÉDER AUX INFORMATIONS SUPPLÉMENTAIRES SUR NOS OFFRES ${(this.selectedCategory)?this.businessCatContent.find(_cat=>_cat.id === this.selectedCategory).Name.toUpperCase():''}`"
						subject="contents.emailSubject"
						mail-to="mail@domain.com"
				   	/>

   				</div>

   				<div class="app-business-offers__list">

					<div class="app-business-offers__list__block">

						<AppBusinessOfferCard
							v-for="(offer, index) in this.selectContents"
							:key="`offer-${offer.id}`"
							ref="offer"
							:offer="offer"
							:options="businessOptContent"
							:rotate-negative="!(index % 2)"
							:theme="index % 3 === 0 ? 'blue' : index % 3 === 1 ? 'red' : 'grey'"
							:clickContact="onClickContact.bind(this)"
						/>

					</div>

   			</div>

   		</div>

		</div>

		<div class="app-business-prog" ref="prog">

			<div class="app-business-prog__container">

	   			<div class="app-business-prog__title__block">

	   				<ERichText
						ref="title"
						class="app-business-prog__title__block__title"
						:content="businessContent.Programmation_Title"
						tag="h1"
					/>

					<ERichText
			          	ref="paragraph"
			          	class="app-business-prog__title__block__introduction"
			          	:content="businessContent.Programmation_Text"
			          	tag="p"
		        	/>

			         <AtomsCTA
		            	class="app-business-prog__title__block__cta"
		            	bg="white"
		            	color="red-adidas"
		            	href="/programmation?categorie=concert"
		            	target="_blank"
		            	layer-color="black"
		          		>
		           		{{businessContent.Programmation_Cta}}
		          	</AtomsCTA>

	   			</div>

   				<div class="app-business-prog__events__slider">

   					<div
		        		ref="wrapper"
		        		:class="{ hold: cursorSliderHold, 'slide-init' : true }"
		        		class="app-business-prog__events__slider__wrapper"
		        		@mouseenter="setCursorState('slider')"
		        		@mouseleave="setCursorState('hide')"
		        		@click="onClickSlider"
        			>
			        	<div
			          		class="app-business-prog__events__slider__inner"
			         	>

					        <AppBusinessProgrammationCard
					          v-for="(event, index) in programmesSlider"
					          :key="`programmation-slider-${index}`"
					          :event="event"
					          :theme="index % 3 === 0 ? 'grey' : index % 3 === 1 ? 'red' : 'blue'"
					          :rotate-negative="!(index % 2)"
					        />


		        		</div>

	    			</div>

	    		</div>

   		</div>

		</div>

		<div class="app-business-map">

			<div class="app-business-map__container">

	   			<div class="app-business-map__title__block">

					<ERichText
						ref="title"
						class="app-business-map__title__block__title"
						:content="businessContent.Map_Title"
						tag="h1"
					/>

				</div>

			</div>

			<div class="app-business-map__webview">

				<AppBusinessMap />

			</div>
		</div>

    	<AppBusinessExperience v-if="experienceContents" :content="experienceContents" />

		<div class="app-business-contact-question">
	    	<AppContactQuestion ref="questform" :contents="contentContactQuestion" />
		</div>

		<div class="app-business-contact-newsletter">
	    	<AppContactNewsletter :contents="contentContactNewsletter" />
		</div>

		<AppFooter v-if="this.webview !== 'ok'" :contents="appContent" :logos="partnersContent.data" />

   </main>

</template>

<script>
import { gsap } from 'gsap'
import EmblaCarousel from 'embla-carousel'
import { mapState, mapMutations, mapGetters } from 'vuex'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import scroll from '@/mixins/scroll'
import pageTransition from '@/mixins/page-transition'

const removeSpecialChar = (string) => {
  return string
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036F]/g, '')
    .replace(/[^\w\s]/gi, '-');
}


export default {
	mixins: [scroll],
	transition(to, from) {
		if (!to || !from) return

		return pageTransition.basic
	},
	data() {
		return {
			selectedCategory: null,
			selectContents: [],
			experienceContents: null,
		}
	},
	head({ $seo }) {
		return $seo({
				title: 'Nos offres VIP',
				description: 'Une nouvelle expérience qui casse les codes',
				openGraph: {
				title: 'Nos offres VIP',
				description: 'Une nouvelle expérience qui casse les codes',
			},
			twitter: {
				title: 'Nos offres VIP',
				description: 'Une nouvelle expérience qui casse les codes',
			},
		})
	},
	computed: {
	    ...mapGetters({
	      programmesSlider: 'programmesSlider',
	    }),
		...mapState({
			partnersContent: (state) => state.partnersContent,
			appContent: (state) => state.appContent,
			allLoadedFake: (state) => state.allLoadedFake,
			allowScroll: (state) => state.allowScroll,
			cursorSliderHold: (state) => state.cursorSliderHold,
			cursorSliderLeftZone: (state) => state.cursorSliderLeftZone,
			overlayContactOpen: (state) => state.overlayContactOpen,
			businessContent: (state) => state.businessContent,
			businessCatContent: (state) => state.businessCatContent,
			businessArtContent: (state) => state.businessArtContent,
			businessOptContent: (state) => state.businessOptContent,
      		programmationsContent: (state) => state.programmationsContent,
     		webview: (state) => state.webview,
		}),
	    contentContactQuestion() {
			return {
				title: this.businessContent.contact_question,
				cta: this.businessContent.contact_question_cta,
				email: this.businessContent.contact_question_email,
				emailSubject: this.businessContent.contact_question_email_sujet,
				formType: this.businessContent.contact_question_form_type,
			}
	    },
	    contentContactNewsletter() {
			return {
				title: this.businessContent.contact_newsletter,
				placeholder: this.appContent.data.footer_input_placeholder,
				text: this.businessContent.contact_newsletter_text,
				ctaText: this.businessContent.contact_newsletter_cta_text,
				ctaHref: this.businessContent.contact_newsletter_cta_href,
			}
	    },

	},
	watch: {
		cursorSliderLeftZone() {
			const _limit = this.$viewport.isLargeDesktop?4:this.$viewport.isDesktop?3:1;
			if(_limit < 12){
				this.handleDisabledCursor()
			}
		},

		selectedCategory() {
			console.log('watch selectedCategory:', this.selectedCategory);

			this.selectContents = this.businessArtContent.filter(_art => _art.Category === this.selectedCategory);

			console.log('watch selectContents:', this.selectContents);

      const newCat = this.businessCatContent.find((cat) => cat.id === this.selectedCategory)
      this.$router.replace({ query: { ...this.$route.query, category: removeSpecialChar(newCat.name) } });

      setTimeout(() => {
        gsap.set('.app-webgl', {
        position: 'absolute',
        top: document.querySelector('.app-business-map__webview').offsetTop
      })
      }, 100)
		},
	},
	mounted() {
		const _limit = this.$viewport.isLargeDesktop?4:this.$viewport.isDesktop?3:1;
		this.setHeaderWhite(true);
		//	console.log('Business Categories :', this.businessCatContent);
		//	console.log('Business Options :', this.businessOptContent);
		//	console.log('Business Articles :', this.businessArtContent);

		this.selectedCategory = this.businessCatContent[0].id;

		this.experienceContents = {
			title:this.businessContent.Experience_Title,
    		text:this.businessContent.Experience_Text,
    		video_url:this.businessContent.Experience_Video_Url,
    		video_cover:this.businessContent.Experience_Video_Cover,
    		image1:this.businessContent.Experience_Image_1,
    		image2:this.businessContent.Experience_Image_2,
		}

    console.log(this.businessCatContent)
    console.log("Catégorie :", this.$route.query.category);

    const catFromUrl = this.businessCatContent.find((cat) => removeSpecialChar(cat.name) === this.$route.query.category)

    if (catFromUrl) {
      this.selectedCategory = catFromUrl.id
    }

			// console.log('this.experienceContents', this.experienceContents);

		if(_limit < 12){
			this.embla = EmblaCarousel(this.$refs.wrapper, {
				dragFree: true,
				containScroll: 'keepSnaps',
				speed: 7.5,
				slidesToScroll: 1,
				breakpoints: {
					'(max-width: 800px)': { dragFree: false, skipSnaps: false, speed: 10 },
				},
			})

			this.embla.on('pointerUp', this.onPointerUp)
			this.embla.on('pointerDown', this.onPointerDown)

			if (!this.$viewport.isMobile) {
				this.embla.on('select', this.onSelect)
			}
		}
		this.setAllowScroll(true);

		this.initScrollTrigger()
	},
	beforeDestroy() {
		const _limit = this.$viewport.isLargeDesktop?4:this.$viewport.isDesktop?3:1;

		if(_limit < 12){
			this.embla?.off('pointerUp', this.onPointerUp)
			this.embla?.off('pointerDown', this.onPointerDown)

			if (!this.$viewport.isMobile) {
				if(_limit < 12){
					this.embla?.off('select', this.onSelect)
				}
			}

			this.embla?.destroy()
		}
	},
	methods: {
		onMouseEnter() {
			const _limit = this.$viewport.isLargeDesktop?4:this.$viewport.isDesktop?3:1;
			if(_limit < 12){
				if (this.$viewport.isMobile) return
					this.setCursorState('hide')
				}
		},
		onMouseLeave() {
			const _limit = this.$viewport.isLargeDesktop?4:this.$viewport.isDesktop?3:1;
			if(_limit < 12){
				if (this.$viewport.isMobile) return

				this.setCursorState('slider')
			}
		},
		onClickContact() {

			if (this.overlayContactOpen) return

			this.setOverlayContactOpen(true)
		},
		...mapMutations({
			setOverlayContactOpen: 'setOverlayContactOpen',
		}),
		onClickSlider(e) {
			const _limit = this.$viewport.isLargeDesktop?4:this.$viewport.isDesktop?3:1;
			if(_limit < 12){
				if (this.$viewport.isMobile) return

				const isLeft = e.clientX < this.$viewport.width / 2
				const canScrollPrev = this.embla.canScrollPrev()
				const canScrollNext = this.embla.canScrollNext()

				if (isLeft && canScrollPrev) {
					this.embla.scrollPrev()
				} else if (!isLeft && canScrollNext) {
					this.embla.scrollNext()
				}
			}
		},
		initScrollTrigger() {

			// if(this.$viewport.isMobile){
			// 	this.setHeaderWhite(true);
			// }
			this.scrollTrigger = ScrollTrigger.create({
				trigger: this.$refs.offers,
				start: 'top-=7.5% top',
				onToggle: ((self) => {
					this.setHeaderWhite(self.isActive)
					//	console.log('self', self);
				}),
			})
		},
		onSelect(e) {
			const _limit = this.$viewport.isLargeDesktop?4:this.$viewport.isDesktop?3:1;
			if(_limit < 12){
				this.handleDisabledCursor()
			}
		},
		onPointerDown() {
			const _limit = this.$viewport.isLargeDesktop?4:this.$viewport.isDesktop?3:1;
			if(_limit < 12){
				this.setCursorSliderHold(true)
			}
		},
		onPointerUp() {
			const _limit = this.$viewport.isLargeDesktop?4:this.$viewport.isDesktop?3:1;
			if(_limit < 12){
				this.setCursorSliderHold(false)
			}
		},
		handleDisabledCursor() {
			const _limit = this.$viewport.isLargeDesktop?4:this.$viewport.isDesktop?3:1;
			if(_limit < 12){
				const canScrollPrev = this.embla.canScrollPrev()
				const canScrollNext = this.embla.canScrollNext()

				if (
					(this.cursorSliderLeftZone && !canScrollPrev) ||
					(!this.cursorSliderLeftZone && !canScrollNext)
				) {
					this.setCursorSliderDisabled(true)
				} else {
					this.setCursorSliderDisabled(false)
				}
			}
		},
		...mapMutations({
			setAllowScroll: 'setAllowScroll',
			setCursorState: 'setCursorState',
			setCursorSliderHold: 'setCursorSliderHold',
			setCursorSliderDisabled: 'setCursorSliderDisabled',
			setHeaderWhite: 'setHeaderWhite',
		}),
	},
}
</script>

<style lang="scss">

.app-business{
	display: flex;
	flex-wrap: wrap;
	margin: 0;
	padding: 0;

	&-offers{
		position: relative;
		flex: 0 0 100%;

		background: radial-gradient(66.61% 80.1% at 70.11% 37.32%, #113694 0%, #0B1846 100%);
		background-blend-mode: overlay, normal;

		@include desktop {
			padding: desktop-vw(150px) 0 desktop-vw(80px) desktop-vw(40px);
		}

		@include mobile {
			padding: mobile-vw(90px) mobile-vw(32px) mobile-vw(40px);
		}

		&-filters {
			display: flex;
			margin: 0 0 desktop-vw(60px);
			flex-flow: row wrap;
			gap: desktop-vw(10px);
			grid-column: 1 / span 6;
			justify-content: center;


			@include mobile {
				margin: 0 0 mobile-vw(60px);
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
					background-color: var(--c-grey);
					border: 1px solid var(--c-black);
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

          @include mobile {
            padding: mobile-vw(10px) mobile-vw(12px)
          }
				}

				.P1.regular {
					border-left: 1px solid var(--c-black);
				}

				input[type='radio']:checked + label {
					background-color: var(--c-blue-adidas);
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

		&__container{
			display: flex;
			flex-wrap: wrap;
			margin: 0;
			padding: 0;
			align-items: flex-start;
		}

		&__title{

			&__block{
				display: block;
				flex: 0 0 auto;

				@include desktop {
					width: desktop-vw(414px);
				}

				@include mobile {
					margin: 0 0 mobile-vw(32px);
					width: 100%;
				}

				&__notes{
					position: absolute;
					bottom: desktop-vw(24px);
					left: desktop-vw(42px);

					@include mobile{
						bottom: mobile-vw(16px);
						left: mobile-vw(16px);
					}

					&__text{
						text-transform: uppercase;
			      		@include font-ITCFranklinGothicLT-DmCp();
						color: var(--c-white);
						font-size: desktop-vw(12px);
						line-height: desktop-vw(12px);
						color: var(--c-white);

						@include mobile{
							font-size: mobile-vw(12px);
							line-height: mobile-vw(12px);
						}

					}
				}

				&__title{
					.H2{
						color: var(--c-white)!important;

						@include desktop {
							margin-bottom: desktop-vw(24px);
							font-size: desktop-vw(100px);
							line-height: desktop-vw(90px);
							letter-spacing: desktop-vw(-3px);
						}

						@include mobile {
							margin-bottom: mobile-vw(10px);
							font-size: mobile-vw(64px);
							line-height: mobile-vw(57px);
							letter-spacing: mobile-vw(-1.92px);
						}

						.sup{
							font-size: desktop-vw(50px);
							vertical-align: super;


							@include mobile {
								font-size: mobile-vw(32px);
							}
						}
					}

				    .app-atoms-stroke-text {
				      -webkit-text-stroke: 1px var(--c-white);
				      -webkit-text-fill-color: transparent;
				    }

				}

				&__introduction{
					text-transform: uppercase;
		      		@include font-ITCFranklinGothicLT-DmCp();
					color: var(--c-white);

					@include desktop {
						margin-bottom: desktop-vw(40px);
						font-size: desktop-vw(18px);
						line-height: desktop-vw(20px);
					}

					@include mobile {
						margin-bottom: mobile-vw(10px);
						font-size: mobile-vw(18px);
						line-height: mobile-vw(20px);
					}

				}

				&__cta{
					display: inline-block;

					.app-atoms-cta-click{
						width: auto;
					}

					.P2{
						@include desktop {
							font-size: desktop-vw(16px);
							line-height: desktop-vw(20px);
						}

						@include mobile {
							font-size: mobile-vw(16px);
							line-height: mobile-vw(20px);
						}

					}
				}
			}

		}

		&__list{

			flex: 1 0 0%;

			@include mobile {
				flex: 0 0 100%;
			}

			&__block{
				display: flex;
				flex-wrap: wrap;
				padding: 0 desktop-vw(32px);
				align-items: stretch;
				justify-content: space-between;

				@include mobile {
					display: block;
					padding: 0 mobile-vw(16px);
				}

			}
		}
	}

	&-prog{
		display: block;
		flex: 0 0 100%;
		width: 100%;

		&__container{
			display: flex;
			flex-wrap: wrap;
			width: 100%;
			margin: 0;
			padding: 0;
			align-items: flex-start;

			@include desktop {
				padding: desktop-vw(80px) 0 desktop-vw(80px) desktop-vw(40px);
			}

			@include mobile {
				padding: mobile-vw(85px) 0 mobile-vw(40px) mobile-vw(16px);
			}
		}

		&__title{

			&__block{
				display: block;
				flex: 0 0 auto;

				@include desktop {
					width: desktop-vw(340px);
				}

				@include mobile {
					margin-bottom: mobile-vw(24px);
					width: 100%;
				}

				&__title{
					.H2{
						@include desktop {
							margin-bottom: desktop-vw(24px);
							font-size: desktop-vw(100px);
							line-height: desktop-vw(90px);
							letter-spacing: desktop-vw(-3px);
						}

						@include mobile {
							margin-bottom: mobile-vw(10px);
							font-size: mobile-vw(64px);
							line-height: mobile-vw(57px);
							letter-spacing: mobile-vw(-1.92px);
						}
					}

				    .app-atoms-stroke-text {
				      -webkit-text-stroke: 1px var(--c-black);
				      -webkit-text-fill-color: transparent;
				    }

				}

				&__introduction{

					text-transform: uppercase;
		      		@include font-ITCFranklinGothicLT-DmCp();
		      		color: var(--c-black);

					@include desktop {
						margin-bottom: desktop-vw(40px);
						font-size: desktop-vw(18px);
						line-height: desktop-vw(20px);
					}

					@include mobile {
						margin-bottom: mobile-vw(20px);
						font-size: mobile-vw(20px);
						line-height: mobile-vw(20px);
					}

				}

				&__cta{
					display: inline-block;

					.app-atoms-cta-click{
						width: auto;
					}

					.P2{
						@include desktop {
							font-size: desktop-vw(16px);
							line-height: desktop-vw(20px);
						}

						@include mobile {
							font-size: mobile-vw(16px);
							line-height: mobile-vw(20px);
						}

					}
				}
			}

		}

		&__events{

			&__slider{
				flex: 1 0 0%;
				//	width: 100%;
				position: relative;
				//	display: flex;
				//	flex-direction: column;
				padding: desktop-vw(30px) 0;
				overflow-x: hidden;

				@include mobile {
					flex: unset;
					display: flex;
					flex-direction: column;
					padding: mobile-vw(30px) 0;
				}

				&__wrapper {
					width: 100%;

					padding: 0;

					@include mobile {
						padding: 0;
					}
				}

				&__inner {
					display: flex;
					column-gap: 0;
					flex-direction: row;
					will-change: transform;

					@include mobile {
						column-gap: 0;
					}
				}

				&__card{
					display: flex;
					flex-direction: column;
					background-color: var(--bg);
					position: relative;
					border: 1px solid var(--c-black);
					transform: rotate(var(--rotation));
					flex: 0 0 20%;
					min-width: 0;

					&:nth-child(2n + 2) {
						top: desktop-vw(20px);

						@include mobile {
							top: mobile-vw(10px);
						}
					}

					&:first-child {
						margin-left: var(--layout-margin);

						@include mobile {
							margin-left: 0;
						}
					}

					&:last-child {
						margin-right: var(--layout-margin);

						@include mobile {
							margin-right: 0;
						}
					}

					@include mobile {
						flex: 0 0 50%;
					}

					@include desktop-l {
						flex: 0 0 20%;
					}

					&__visual {
						width: 100%;
						display: block;
						position: relative;
						z-index: 0;
					}

					&__visual__wrapper {
						aspect-ratio: 435/435;
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
						padding: desktop-vw(15px) desktop-vw(15px);
						height: 100%;
						border-top: 1px solid var(--c-black);
						cursor: pointer;

						@include mobile {
							padding: mobile-vw(8px) mobile-vw(8px) mobile-vw(40px);
							margin-top: mobile-vw(0px);
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
						justify-content: flex-start;

						.P2 {
							font-size: desktop-vw(12px);
							line-height: desktop-vw(12px);
							text-transform: uppercase;

							@include mobile{
								font-size: mobile-vw(11px);
								line-height: mobile-vw(10px);
							}
						}

						.date{
							margin-left: desktop-vw(30px);

							@include mobile{
								margin-left: mobile-vw(30px);
							}

							&.reported{
								position: relative;
								text-decoration: line-through;
							}

							&:last-child{
								margin-left: desktop-vw(16px);

								@include mobile{
									margin-left: mobile-vw(16px);
								}
							}
						}

						// .type {
						// }

					    // .date {
					    // }
			  		}

					.H2.bold {
						font-size: desktop-vw(40px);
						line-height: desktop-vw(35px);
						margin-top: desktop-vw(10px);
						user-select: none;
						letter-spacing: 0;
						@include font-ITCFranklinGothicLT-DmXtraCp();

						@include mobile {
							margin-top: mobile-vw(10px);
							font-size: mobile-vw(32px);
							line-height: mobile-vw(28px);
						}

						@include desktop-l {
							font-size: desktop-vw(40px);
							line-height: desktop-vw(35px);
						}
					}

					&__from-price.P2 {
						margin-top: auto;
						max-width: 50%;

						@include mobile {
							margin-left: auto;
							max-width: 100%;
						}
					}

				}

			}


		}

	}

	&-map{
		display: block;
		flex: 0 0 100%;
		width: 100%;

		&__container{
			display: flex;
			flex-wrap: wrap;
			width: 100%;
			margin: 0;
			padding: 0;
			align-items: flex-start;

			@include desktop {
				padding: desktop-vw(40px) 0 0 desktop-vw(40px);
			}

			@include mobile {
				padding: mobile-vw(85px) 0 mobile-vw(20px) mobile-vw(16px);
			}
		}

		&__title{

			&__block{
				display: block;
				flex: 0 0 100%;

				&__title{
					display: block;
					flex: 0 0 100%;
					.H2{
						@include desktop {
							font-size: desktop-vw(62px);
							line-height: desktop-vw(62px);
							letter-spacing: desktop-vw(-1.5px);
						}

						@include mobile {
							font-size: mobile-vw(64px);
							line-height: mobile-vw(57px);
							letter-spacing: mobile-vw(-1.92px);
						}
					}

				    .app-atoms-stroke-text {
				      -webkit-text-stroke: 1px var(--c-black);
				      -webkit-text-fill-color: transparent;
				    }

				}

			}

		}

		&__webview{
			display: block;
			flex: 0 0 100%;

			@include desktop {
				padding: 0 0 desktop-vw(40px) 0;
			}

			@include mobile {
				padding: 0 0 mobile-vw(20px) 0;
			}
		}
	}

	&-experience{
		position: relative;
		flex: 0 0 100%;

		&__title{

			&__block{
				display: block;
				flex: 0 0 auto;

				@include desktop {
					width: desktop-vw(340px);
				}

				@include mobile {
					margin-bottom: mobile-vw(24px);
					width: 100%;
				}

				&__title{
					.H1{
						@include desktop {
							margin-bottom: desktop-vw(24px);
							font-size: desktop-vw(100px);
							line-height: desktop-vw(90px);
							letter-spacing: desktop-vw(-3px);
						}

						@include mobile {
							margin-bottom: mobile-vw(40px);
							font-size: mobile-vw(64px);
							line-height: mobile-vw(57px);
							letter-spacing: mobile-vw(-1.92px);
						}
					}

				    .app-atoms-stroke-text {
				      -webkit-text-stroke: 1px var(--c-black);
				      -webkit-text-fill-color: transparent;
				    }

				}

				&__introduction{

					text-transform: uppercase;
		      		@include font-ITCFranklinGothicLT-DmCp();
		      		color: var(--c-black);

					@include desktop {
						margin-bottom: desktop-vw(40px);
						font-size: desktop-vw(18px);
						line-height: desktop-vw(20px);
					}

					@include mobile {
						margin-bottom: mobile-vw(20px);
						font-size: mobile-vw(20px);
						line-height: mobile-vw(20px);
					}

				}

				&__cta{
					display: inline-block;

					.app-atoms-cta-click{
						width: auto;
					}

					.P2{
						@include desktop {
							font-size: desktop-vw(16px);
							line-height: desktop-vw(20px);
						}

						@include mobile {
							font-size: mobile-vw(16px);
							line-height: mobile-vw(20px);
						}

					}
				}
			}

		}
	}

	&-contact{
		&-question{
			position: relative;
			flex: 0 0 100%;
		    margin-top: desktop-vw(175px);

		    @include mobile {
				margin-bottom: 0;
		    }
		}
		&-newsletter{
			position: relative;
			flex: 0 0 100%;
		}
	}

	.app-contact-question {
		margin-top: desktop-vw(175px);

		@include mobile {
			margin-bottom: 0;
		}
	}
	.app-contact-actus {
		margin-bottom: desktop-vw(180px);

		@include mobile {
			margin-bottom: mobile-vw(120px);
		}
	}

	.app-programmation-image {
		width: 100%;
		height: 100%;
		display: block;

		img {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}
}
</style>
