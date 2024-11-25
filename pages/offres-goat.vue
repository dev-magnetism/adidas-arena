<template>
   <main class="app-lp-offres-nov-2024">

		<div class="prog" ref="prog">

			<div class="prog__container">

   			<div class="prog__title__block">

   				<ERichText
						ref="title"
						class="prog__title__block__title"
						:content="`<h1 class='H1 bold'>Fosse ou <span class='app-atoms-stroke-text'>gradins</span></h1>`"
						tag="h1"
					/>

					<ERichText
		          	ref="paragraph"
		          	class="prog__title__block__introduction"
		          	:content="`<p>LE NOUVEAU TEMPLE PARISIEN DE LA MUSIQUE, <br/>DU SPORT ET DE L’ENTERTAINMENT</p>`"
		          	tag="p"
	        		/>

		         <AtomsCTA
	            	class="prog__title__block__cta"
	            	bg="white"
	            	color="red-adidas"
	            	href="/programmation"
	            	target="_blank"
	            	layer-color="black"
	          		>
	           		Toute la programmation
	          	</AtomsCTA>

   			</div>
   			
   			<div class="prog__events__slider">

   				<div
		        		ref="wrapper"
		        		:class="{ hold: cursorSliderHold, 'slide-init' : true }"
		        		class="prog__events__slider__wrapper"
		        		@mouseenter="setCursorState('slider')"
		        		@mouseleave="setCursorState('hide')"
		        		@click="onClickSlider"
        				>
			        	<div 
			          	class="prog__events__slider__inner"
			         	>

							<div style="--bg: var(--c-blue-adidas); --rotation: -1.29deg;" class="prog__events__slider__card">

								<div class="prog__events__slider__card__visual">

									<div class="prog__events__slider__card__visual__wrapper">

										<div class="prog__events__slider__card__layer" />

										<picture class="app-programmation-image">
											<source media="(min-width: 768px)" srcset="/imgs/offres/james-blunt__desktop.jpg" />
											<img src="/imgs/offres/james-blunt__mobile.jpg" alt="slider-image-james-blunt" loading="true" />
										</picture>

									</div>

								</div>

								<nuxt-link
									class="prog__events__slider__card__informations"
									to="programmation/james-blunt--496"
									target="_blank"

									:gtm-click="{
									id: `496`,
									name: `James Blunt`,
									category: `Concert`,
									category2: ``,
									price: `63€`,
									}"
									@mouseenter.native="onMouseEnter"
									@mouseleave.native="onMouseLeave"
									>
									<div class="prog__events__slider__card__head">

										<TP2 class="type" weight="bold" color="white" tag="h3">
											Concert
										</TP2>

										<TP2
											class="date"
											weight="medium"
											color="white"
											>
											20 février 2025
										</TP2>

									</div>

									<TH2 color="white" weight="bold">
										James Blunt
									</TH2>

								</nuxt-link>

							</div>

							<div style="--bg: var(--c-red-adidas); --rotation: 2.42deg;" class="prog__events__slider__card">

								<div class="prog__events__slider__card__visual">

									<div class="prog__events__slider__card__visual__wrapper">

										<div class="prog__events__slider__card__layer" />

										<picture class="app-programmation-image">
											<source media="(min-width: 768px)" srcset="/imgs/offres/parisbasketball-betclic__desktop.jpg" />
											<img src="/imgs/offres/parisbasketball-betclic__mobile.jpg" alt="slider-image-paris-basketball--betclic" loading="true" />
										</picture>

									</div>

								</div>

								<nuxt-link
									class="prog__events__slider__card__informations"
									to="programmation/paris-basketball-vs-as-monaco-basket--453"
									target="_blank"

									:gtm-click="{
									id: `453`,
									name: `PARIS BASKETBALL VS AS MONACO BASKET`,
									category: `Paris Basketball`,
									category2: ``,
									price: `0€`,
									}"
									@mouseenter.native="onMouseEnter"
									@mouseleave.native="onMouseLeave"
									>
									<div class="prog__events__slider__card__head">

										<TP2 class="type" weight="bold" color="white" tag="h3">
											Paris Basketball
										</TP2>

										<TP2
											class="date"
											weight="medium"
											color="white"
											>
											8 décembre 2024
										</TP2>

									</div>

									<TH2 color="white" weight="bold">
										PARIS BASKETBALL VS AS MONACO BASKET
									</TH2>

								</nuxt-link>

							</div>

							<div style="--bg: var(--c-grey); --rotation: -1.86deg;" class="prog__events__slider__card">

								<div class="prog__events__slider__card__visual">

									<div class="prog__events__slider__card__visual__wrapper">

										<div class="prog__events__slider__card__layer" />

										<picture class="app-programmation-image">
											<source media="(min-width: 768px)" srcset="/imgs/offres/rimk__desktop.jpg" />
											<img src="/imgs/offres/rimk__mobile.jpg" alt="slider-image-rimk" loading="true" />
										</picture>

									</div>

								</div>

								<nuxt-link
									class="prog__events__slider__card__informations"
									to="programmation/rimk--592"
									target="_blank"

									:gtm-click="{
									id: `592`,
									name: `Rim'K`,
									category: `Concert`,
									category2: ``,
									price: `45€`,
									}"
									@mouseenter.native="onMouseEnter"
									@mouseleave.native="onMouseLeave"
									>
									<div class="prog__events__slider__card__head">

									<TP2 class="type" weight="bold" color="black" tag="h3">
										Concert
									</TP2>

									<TP2
										class="date"
										weight="medium"
										color="black"
										>
										12 décembre 2025
									</TP2>

								</div>

								<TH2 color="black" weight="bold">
									Rim'K
								</TH2>

								</nuxt-link>

							</div>


							<div style="--bg: var(--c-blue-adidas); --rotation: -1.29deg;" class="prog__events__slider__card">

								<div class="prog__events__slider__card__visual">

									<div class="prog__events__slider__card__visual__wrapper">

										<div class="prog__events__slider__card__layer" />

										<picture class="app-programmation-image">
											<source media="(min-width: 768px)" srcset="/imgs/offres/harlem-globetrotters__desktop.jpg" />
											<img src="/imgs/offres/harlem-globetrotters__mobile.jpg" alt="slider-image-harlem-globetrotters" loading="true" />
										</picture>

									</div>

								</div>

								<nuxt-link
									class="prog__events__slider__card__informations"
									to="programmation/harlem-globetrotters--575"
									target="_blank"

									:gtm-click="{
									id: `575`,
									name: `Harlem Globetrotters`,
									category: `Sport`,
									category2: ``,
									price: `49.95€`,
									}"
									@mouseenter.native="onMouseEnter"
									@mouseleave.native="onMouseLeave"
									>
									<div class="prog__events__slider__card__head">

										<TP2 class="type" weight="bold" color="white" tag="h3">
											Sport
										</TP2>

										<TP2
											class="date"
											weight="medium"
											color="white"
											>
											29 mars 2025
										</TP2>

									</div>

									<TH2 color="white" weight="bold">
										Harlem Globetrotters
									</TH2>

								</nuxt-link>

							</div>

							<div style="--bg: var(--c-red-adidas); --rotation: 2.42deg;" class="prog__events__slider__card">
							    
							   <div class="prog__events__slider__card__visual">
							      
							      <div class="prog__events__slider__card__visual__wrapper">
							        
							        	<div class="prog__events__slider__card__layer" />

							        	<picture class="app-programmation-image">
									   	<source media="(min-width: 768px)" srcset="/imgs/offres/disneysurglace__desktop.jpg" />
									   	<img src="/imgs/offres/disneysurglace__mobile.jpg" alt="slider-image-disney-sur-glace-un-monde-de-reves" loading="true" />
									  	</picture>

							      </div>

							   </div>

							   <nuxt-link
							      class="prog__events__slider__card__informations"
							      to="programmation/disney-sur-glace-un-monde-de-reves--432"
	            				target="_blank"

							      :gtm-click="{
							        id: `432`,
							        name: `Disney sur Glace - Un Monde de Rêves`,
							        category: ` Spectacle et comedie musicale`,
							        category2: ``,
							        price: `26€`,
							      }"
							      @mouseenter.native="onMouseEnter"
							      @mouseleave.native="onMouseLeave"
							   	>
								   <div class="prog__events__slider__card__head">
								        
										<TP2 class="type" weight="bold" color="white" tag="h3">
											Spectacle et comedie musicale
										</TP2>

										<TP2
											class="date"
											weight="medium"
											color="white"
											>
											2 au 12 janvier 2025
										</TP2>

								   </div>

							      <TH2 color="white" weight="bold">
							      	Disney sur Glace - Un Monde de Rêves
							      </TH2>

								</nuxt-link>
							    
							</div>

							<div style="--bg: var(--c-grey); --rotation: -1.86deg;" class="prog__events__slider__card">

								<div class="prog__events__slider__card__visual">

									<div class="prog__events__slider__card__visual__wrapper">

										<div class="prog__events__slider__card__layer" />

										<picture class="app-programmation-image">
											<source media="(min-width: 768px)" srcset="/imgs/offres/malik-bentalha__desktop.jpg" />
											<img src="/imgs/offres/malik-bentalha__mobile.jpg" alt="slider-image-malik-bentalha" loading="true" />
										</picture>

									</div>

								</div>

								<nuxt-link
									class="prog__events__slider__card__informations"
									to="programmation/malik-bentalha--531"
									target="_blank"

									:gtm-click="{
									id: `531`,
									name: `Malik Bentalha`,
									category: `Humour et one (wo)man show`,
									category2: ``,
									price: `49€`,
									}"
									@mouseenter.native="onMouseEnter"
									@mouseleave.native="onMouseLeave"
									>
									<div class="prog__events__slider__card__head">

										<TP2 class="type" weight="bold" color="black" tag="h3">
											Humour et one (wo)man show
										</TP2>

										<TP2
											class="date"
											weight="medium"
											color="black"
											>
											11 avril 2025
										</TP2>

									</div>

									<TH2 color="black" weight="bold">
										Malik Bentalha
									</TH2>

								</nuxt-link>

							</div>

							<div style="--bg: var(--c-blue-adidas); --rotation: -1.29deg;" class="prog__events__slider__card">

								<div class="prog__events__slider__card__visual">

									<div class="prog__events__slider__card__visual__wrapper">

										<div class="prog__events__slider__card__layer" />

										<picture class="app-programmation-image">
											<source media="(min-width: 768px)" srcset="/imgs/offres/hoshi__desktop.jpg" />
											<img src="/imgs/offres/hoshi__mobile.jpg" alt="slider-image-hoshi" loading="true" />
										</picture>

									</div>

								</div>

								<nuxt-link
									class="prog__events__slider__card__informations"
									to="programmation/hoshi--348"
									target="_blank"

									:gtm-click="{
									id: `348`,
									name: `Hoshi`,
									category: `Concert`,
									category2: ``,
									price: `34€`,
									}"
									@mouseenter.native="onMouseEnter"
									@mouseleave.native="onMouseLeave"
									>
									<div class="prog__events__slider__card__head">

										<TP2 class="type" weight="bold" color="white" tag="h3">
											Concert
										</TP2>

										<TP2
											class="date"
											weight="medium"
											color="white"
											>
											12 décembre 2024
										</TP2>

									</div>

									<TH2 color="white" weight="bold">
										Hoshi
									</TH2>

								</nuxt-link>

							</div>

							<div style="--bg: var(--c-red-adidas); --rotation: 2.42deg;" class="prog__events__slider__card">

								<div class="prog__events__slider__card__visual">

									<div class="prog__events__slider__card__visual__wrapper">

										<div class="prog__events__slider__card__layer" />

										<picture class="app-programmation-image">
											<source media="(min-width: 768px)" srcset="/imgs/offres/hugotsr__desktop.jpg" />
											<img src="/imgs/offres/hugotsr__mobile.jpg" alt="slider-image-hugo-tsr" loading="true" />
										</picture>

									</div>

								</div>

								<nuxt-link
									class="prog__events__slider__card__informations"
									to="programmation/hugo-tsr--519"
									target="_blank"

									:gtm-click="{
									id: `519`,
									name: `Hugo TSR`,
									category: `Concert`,
									category2: ``,
									price: `44€`,
									}"
									@mouseenter.native="onMouseEnter"
									@mouseleave.native="onMouseLeave"
									>
									<div class="prog__events__slider__card__head">

										<TP2 class="type" weight="bold" color="white" tag="h3">
											Concert
										</TP2>

										<TP2
											class="date"
											weight="medium"
											color="white"
											>
											8 novembre 2025
										</TP2>

									</div>

									<TH2 color="white" weight="bold">
										Hugo TSR
									</TH2>

								</nuxt-link>

							</div>

							<div style="--bg: var(--c-grey); --rotation: -1.86deg;" class="prog__events__slider__card">

								<div class="prog__events__slider__card__visual">

									<div class="prog__events__slider__card__visual__wrapper">

										<div class="prog__events__slider__card__layer" />

										<picture class="app-programmation-image">
											<source media="(min-width: 768px)" srcset="/imgs/offres/waly-dia__desktop.jpg" />
											<img src="/imgs/offres/waly-dia__mobile.jpg" alt="slider-image-waly-dia" loading="true" />
										</picture>

									</div>

								</div>

								<nuxt-link
									class="prog__events__slider__card__informations"
									to="programmation/waly-dia--389"
									target="_blank"

									:gtm-click="{
									id: `389`,
									name: `Waly Dia`,
									category: `Humour et one (wo)man show`,
									category2: ``,
									price: `35€`,
									}"
									@mouseenter.native="onMouseEnter"
									@mouseleave.native="onMouseLeave"
									>
									<div class="prog__events__slider__card__head">

										<TP2 class="type" weight="bold" color="black" tag="h3">
											Humour et one (wo)man show
										</TP2>

										<TP2
											class="date"
											weight="medium"
											color="black"
											>
											8 février 2025
										</TP2>

									</div>

									<TH2 color="black" weight="bold">
										Waly Dia
									</TH2>

								</nuxt-link>

							</div>

							<div style="--bg: var(--c-blue-adidas); --rotation: -1.29deg;" class="prog__events__slider__card">

								<div class="prog__events__slider__card__visual">

									<div class="prog__events__slider__card__visual__wrapper">

										<div class="prog__events__slider__card__layer" />

										<picture class="app-programmation-image">
											<source media="(min-width: 768px)" srcset="/imgs/offres/vampire-weekend__desktop.jpg" />
											<img src="/imgs/offres/vampire-weekend__mobile.jpg" alt="slider-image-vampire-weekend" loading="true" />
										</picture>

									</div>

								</div>

								<nuxt-link
									class="prog__events__slider__card__informations"
									to="programmation/vampire-weekend--425"
									target="_blank"

									:gtm-click="{
									id: `425`,
									name: `Vampire Weekend`,
									category: `Concert`,
									category2: ``,
									price: `56.5€`,
									}"
									@mouseenter.native="onMouseEnter"
									@mouseleave.native="onMouseLeave"
									>
									<div class="prog__events__slider__card__head">

										<TP2 class="type" weight="bold" color="white" tag="h3">
											Concert
										</TP2>

										<TP2
											class="date"
											weight="medium"
											color="white"
											>
											13 décembre 2024
										</TP2>

									</div>

									<TH2 color="white" weight="bold">
										Vampire Weekend
									</TH2>

								</nuxt-link>

							</div>

							<div style="--bg: var(--c-red-adidas); --rotation: 2.42deg;" class="prog__events__slider__card">
					    
					   		<div class="prog__events__slider__card__visual">
					      
					      		<div class="prog__events__slider__card__visual__wrapper">
					        
						         	<div class="prog__events__slider__card__layer" />

							        	<picture class="app-programmation-image">
									    	<source media="(min-width: 768px)" srcset="/imgs/offres/parisbasketball-euroleague__desktop.jpg" />
									   	<img src="/imgs/offres/parisbasketball-euroleague__mobile.jpg" alt="slider-image-parisbasketball-euroleague" loading="true" />
									  	</picture>

						     		</div>

					    		</div>

							   <nuxt-link
							      class="prog__events__slider__card__informations"
							      to="programmation/paris-basketball-vs-virtus-bologna--469"
		         				target="_blank"

							      :gtm-click="{
							        id: `469`,
							        name: `PARIS BASKETBALL VS VIRTUS BOLOGNA`,
							        category: `Paris Basketball`,
							        category2: ``,
							        price: `13€`,
							      }"
							      @mouseenter.native="onMouseEnter"
							      @mouseleave.native="onMouseLeave"
							      >
							      <div class="prog__events__slider__card__head">
							        
										<TP2 class="type" weight="bold" color="white" tag="h3">
											Paris Basketball
										</TP2>

										<TP2
											class="date"
											weight="medium"
											color="white"
											>
											28 novembre 2024
										</TP2>

							      </div>

							      <TH2 color="white" weight="bold">
							      	PARIS BASKETBALL VS VIRTUS BOLOGNA
							      </TH2>

							   </nuxt-link>

							</div>

							<div style="--bg: var(--c-grey); --rotation: -1.86deg;" class="prog__events__slider__card">

								<div class="prog__events__slider__card__visual">

									<div class="prog__events__slider__card__visual__wrapper">

										<div class="prog__events__slider__card__layer" />

										<picture class="app-programmation-image">
											<source media="(min-width: 768px)" srcset="/imgs/offres/jamie-xx__desktop.jpg" />
											<img src="/imgs/offres/jamie-xx__mobile.jpg" alt="slider-image-jamie-xx" loading="true" />
										</picture>

									</div>

								</div>

								<nuxt-link
									class="prog__events__slider__card__informations"
									to="programmation/jamie-xx--583"
									target="_blank"

									:gtm-click="{
									id: `583`,
									name: `Jamie XX`,
									category: `Concert`,
									category2: ``,
									price: `45.5€`,
									}"
									@mouseenter.native="onMouseEnter"
									@mouseleave.native="onMouseLeave"
									>
									<div class="prog__events__slider__card__head">

										<TP2 class="type" weight="bold" color="black" tag="h3">
											Concert
										</TP2>

										<TP2
											class="date"
											weight="medium"
											color="black"
											>
											21 mars 2025
										</TP2>

									</div>

									<TH2 color="black" weight="bold">
										Jamie XX
									</TH2>

								</nuxt-link>

							</div>


							<div style="--bg: var(--c-blue-adidas); --rotation: -1.29deg;" class="prog__events__slider__card">

								<div class="prog__events__slider__card__visual">

									<div class="prog__events__slider__card__visual__wrapper">

										<div class="prog__events__slider__card__layer" />

										<picture class="app-programmation-image">
											<source media="(min-width: 768px)" srcset="/imgs/offres/lumineers__desktop.jpg" />
											<img src="/imgs/offres/lumineers__mobile.jpg" alt="slider-image-lumineers" loading="true" />
										</picture>

									</div>

								</div>

								<nuxt-link
									class="prog__events__slider__card__informations"
									to="programmation/the-lumineers--577"
									target="_blank"

									:gtm-click="{
									id: `577`,
									name: `The Lumineers`,
									category: `Concert`,
									category2: ``,
									price: `52.1€`,
									}"
									@mouseenter.native="onMouseEnter"
									@mouseleave.native="onMouseLeave"
									>
									<div class="prog__events__slider__card__head">

										<TP2 class="type" weight="bold" color="white" tag="h3">
											Concert
										</TP2>

										<TP2
											class="date"
											weight="medium"
											color="white"
											>
											20 mai 2025
										</TP2>

									</div>

									<TH2 color="white" weight="bold">
										The Lumineers
									</TH2>

								</nuxt-link>

							</div>

							<div style="--bg: var(--c-red-adidas); --rotation: 2.42deg;" class="prog__events__slider__card">
					    
					   		<div class="prog__events__slider__card__visual">
					      
					      		<div class="prog__events__slider__card__visual__wrapper">
					        
						         	<div class="prog__events__slider__card__layer" />

							        	<picture class="app-programmation-image">
									    	<source media="(min-width: 768px)" srcset="/imgs/offres/pantera__desktop.jpg" />
									   	<img src="/imgs/offres/pantera__mobile.jpg" alt="slider-image-pantera" loading="true" />
									  	</picture>

						     		</div>

					    		</div>

							   <nuxt-link
							      class="prog__events__slider__card__informations"
							      to="programmation/pantera--530"
		         				target="_blank"

							      :gtm-click="{
							        id: `530`,
							        name: `Pantera`,
							        category: `Concert`,
							        category2: ``,
							        price: `69.7€`,
							      }"
							      @mouseenter.native="onMouseEnter"
							      @mouseleave.native="onMouseLeave"
							      >
							      <div class="prog__events__slider__card__head">
							        
										<TP2 class="type" weight="bold" color="white" tag="h3">
											Concert
										</TP2>

										<TP2
											class="date"
											weight="medium"
											color="white"
											>
											15 février 2025
										</TP2>

							      </div>

							      <TH2 color="white" weight="bold">
							      	Pantera
							      </TH2>

							   </nuxt-link>

							</div>
		        		</div>

	    			</div>

	    		</div>

   		</div>

		</div>

		<div class="offers">

			<div class="offers__container">

   			<div class="offers__title__block">

   				<ERichText
						ref="title"
						class="offers__title__block__title"
						:content="`<h1 class='H1 bold'>Les OFFRES <span class='app-atoms-stroke-text'>GOAT</span></h1>`"
						tag="h1"
						/>

					<ERichText
	          		ref="paragraph"
		          	class="offers__title__block__introduction"
		          	:content="`<p>UNE NOUVELLE EXPÉRIENCE <br/>QUI CASSE LES CODES DES HOSPITALITÉS</p>`"
		          	tag="p"
		       	 	/>

		         <AtomsCTA
	            	class="offers__title__block__cta"
	            	bg="white"
	            	color="blue-adidas"
	            	layer-color="black"
	            	button
	            	@click.native="onClickContact()"
	          		>
	            	Je suis curieux
	          	</AtomsCTA>

					<EOffresContactOverlay
				      form-type="VEUILLEZ REMPLIR LE FORMULAIRE POUR ACCÉDER AUX INFORMATIONS SUPPLÉMENTAIRES SUR NOS OFFRES VIP"
				      subject="contents.emailSubject"
				      mail-to="mail@domain.com"
				   	/>

   			</div>

   			<div class="offers__list">

					<div class="offers__list__block">

						<div class="offers__list__item">

   						<div style="--bg: var(--c-blue-adidas); --rotation: 4deg;" class="offers__list__card">
						    
						   	<div class="offers__list__card__visual">
						      
						      	<div class="offers__list__card__visual__wrapper">
						        
						       		<div class="offers__list__card__layer" />

							        	<picture class="app-programmation-image">
									   	<source media="(min-width: 768px)" srcset="/imgs/offres/offre-privat__desktop.jpg" />
									   	<img src="/imgs/offres/offre-privat__desktop.jpg" alt="La privat'" loading="true" />
									  	</picture>

						      	</div>

						   	</div>

							   <button
							      class="offers__list__card__informations"
				            	@click="onClickContact()"
						      	>
						      	<div class="offers__list__card__head">

								      <TH2 class="name" color="white" weight="bold">
								      	LA PRIVAT’
								      </TH2>
						        
										<TP2 class="title" weight="bold" color="white" tag="h3">
											Salon privé. Design unique. La privat’ est pensée pour impressionner.
										</TP2>

										<TP2
											class="description"
											weight="medium"
											color="white"
											>
											Au plus près de la scène ou du parquet, organise ton événement dans ce spot et régale tes guests pour une soirée hors normes.
										</TP2>

						      	</div>

						      	<div class="offers__list__card__foot">

							      	<div class="offers__list__card__foot__item">
							      		<AppNosoffresIconBilletPrio />
							      	</div>

							      	<div class="offers__list__card__foot__item">
											<AppNosoffresIconRepasCocktail />
							      	</div>

							      	<div class="offers__list__card__foot__item">
											<AppNosoffresIconGradins />
							      	</div>

							      	<div class="offers__list__card__foot__item">
											<AppNosoffresIconSiegePrivatise />
							      	</div>

							      	<div class="offers__list__card__foot__item">
											<AppNosoffresIconEtincelles />
							      	</div>

							      	<div class="offers__list__card__foot__item">
											<AppNosoffresIconParking />
							      	</div>

					      		</div>

						   	</button>
						    
						  	</div>

						</div>

						<div class="offers__list__item">

   						<div style="--bg: var(--c-red-adidas); --rotation: -2deg;" class="offers__list__card">
						    
						   	<div class="offers__list__card__visual">
						      
						      	<div class="offers__list__card__visual__wrapper">
						        
						        		<div class="offers__list__card__layer" />

										<picture class="app-programmation-image">
											<source media="(min-width: 768px)" srcset="/imgs/offres/offre-loft__desktop.jpg" />
											<img src="/imgs/offres/offre-loft__desktop.jpg" alt="La privat'" loading="true" />
										</picture>

						     		</div>

						    	</div>

							   <button
							      class="offers__list__card__informations"
				            	@click="onClickContact()"
							      >
							      <div class="offers__list__card__head">

								      <TH2 class="name" color="white" weight="bold">
								      	LE LOFT
								      </TH2>
							        
										<TP2 class="title" weight="bold" color="white" tag="h3">
											Entre dans l’univers 3 bandes de l’adidas arena.
										</TP2>

										<TP2
											class="description"
											weight="medium"
											color="white"
											>
											Plus qu’une loge, le Loft t’embarque dans une immersion totale au cœur de l’action et du live. Niveau food : le parfait mix entre street-food et haute gastronomie.
										</TP2>

							      </div>

							      <div class="offers__list__card__foot">

							      	<div class="offers__list__card__foot__item">
							      		<AppNosoffresIconBilletPrio />
							      	</div>

							      	<div class="offers__list__card__foot__item">
											<AppNosoffresIconServiceATable />
							      	</div>

							      	<div class="offers__list__card__foot__item">
											<AppNosoffresIconSiegeVIP />
							      	</div>

							      	<div class="offers__list__card__foot__item">
											<AppNosoffresIconVerre />
							      	</div>

							      	<div class="offers__list__card__foot__item">
											<AppNosoffresIconEtincelles />
							      	</div>

							      	<div class="offers__list__card__foot__item">
											<AppNosoffresIconParking />
							      	</div>

							      </div>

							   </button>
						    
						  	</div>

						</div>

						<div class="offers__list__item">

   						<div style="--bg: var(--c-grey); --rotation: 1deg;" class="offers__list__card">
						    
						    	<div class="offers__list__card__visual">
						      
						     		<div class="offers__list__card__visual__wrapper">
						        
										<div class="offers__list__card__layer" />

										<picture class="app-programmation-image">
											<source media="(min-width: 768px)" srcset="/imgs/offres/offre-skybar__desktop.jpg" />
											<img src="/imgs/offres/offre-skybar__desktop.jpg" alt="La privat'" loading="true" />
										</picture>

						      	</div>

						    	</div>

							   <button
							      class="offers__list__card__informations"
				            	@click="onClickContact()"
							      >
							      <div class="offers__list__card__head">

								      <TH2 class="name" color="white" weight="bold">
								      	LE SKYBAR
								      </TH2>
							        
										<TP2 class="title" weight="bold" color="black" tag="h3">
											Moins cher qu’une paire de Samba :
										</TP2>

										<TP2
											class="description"
											weight="medium"
											color="black"
											>
											Un soir au skybar, c’est surplomber le show dans un cadre deja mythique. Ici, chaque moment est exceptionnel. les codes et l’esprit de l’entertainment made in usa avec le panache de paris : une expérience hors normes unique en france à vivre absolument. 
										</TP2>

							      </div>

							      <div class="offers__list__card__foot">

							      	<div class="offers__list__card__foot__item blue">
							      		<AppNosoffresIconBilletPrio />
							      	</div>

							      	<div class="offers__list__card__foot__item blue">
											<AppNosoffresIconEtoile />
							      	</div>

							      	<div class="offers__list__card__foot__item blue">
											<AppNosoffresIconRepasCocktail />
							      	</div>

							      	<div class="offers__list__card__foot__item blue">
											<AppNosoffresIconVerre />
							      	</div>

							      	<div class="offers__list__card__foot__item blue">
											<AppNosoffresIconEtincelles />
							      	</div>

							      </div>

							   </button>
						    
						  	</div>
						
						</div>

					</div>

   			</div>

   		</div>

		</div>

   </main>

</template>

<script>
import EmblaCarousel from 'embla-carousel'
import { mapState, mapMutations } from 'vuex'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import scroll from '@/mixins/scroll'
import pageTransition from '@/mixins/page-transition'



export default {
  mixins: [scroll],
  transition(to, from) {
    if (!to || !from) return

    return pageTransition.basic
  },
  head({ $seo }) {
    return $seo({
      title: 'Nos offres GOAT',
      description: 'Une nouvelle expérience qui casse les codes',
      openGraph: {
        title: 'Nos offres GOAT',
        description: 'Une nouvelle expérience qui casse les codes',
      },
      twitter: {
        title: 'Nos offres GOAT',
        description: 'Une nouvelle expérience qui casse les codes',
      },
    })
  },
  computed: {
    ...mapState({
      allLoadedFake: (state) => state.allLoadedFake,
      allowScroll: (state) => state.allowScroll,
      cursorSliderHold: (state) => state.cursorSliderHold,
      cursorSliderLeftZone: (state) => state.cursorSliderLeftZone,
      overlayContactOpen: (state) => state.overlayContactOpen,
    }),
  },
  watch: {
    cursorSliderLeftZone() {
      const _limit = this.$viewport.isLargeDesktop?4:this.$viewport.isDesktop?3:1;
      if(_limit < 12){
        this.handleDisabledCursor()
      }
    },
  },
  mounted() {
    const _limit = this.$viewport.isLargeDesktop?4:this.$viewport.isDesktop?3:1;
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
        trigger: this.$refs.prog,
        start: 'top-=7.5% top',
        onToggle: ((self) => {
        	this.setHeaderWhite(!self.isActive)
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

.app-lp-offres-nov-2024{
	display: flex;
	flex-wrap: wrap;
	margin: 0;
	padding: 0;

	.prog{
		display: block;
		flex: 0 0 100%;
		width: 100%;

		@include desktop {
			order: 1;
			padding-top: desktop-vw(130px);
		}
		
		@include mobile {
			order: 2;
			padding-top: mobile-vw(40px);
		}

		&__container{
			display: flex;
			flex-wrap: wrap;
			width: 100%;
			margin: 0;
			padding: 0;
			align-items: flex-start;

			@include desktop {
				padding: 0 0 desktop-vw(40px) desktop-vw(40px);
			}
			
			@include mobile {
				padding: 0 0 mobile-vw(40px) mobile-vw(16px);
			}
		}

		&__title{

			&__block{
				display: block;
				flex: 0 0 auto;

				@include desktop {
					width: desktop-vw(316px);
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

	.offers{
		flex: 0 0 100%;


		@include desktop {
			order: 2;
		}
		
		@include mobile {
			order: 1;
		}

		&__container{
			display: flex;
			flex-wrap: wrap;
			margin: 0;
			padding: 0;
			align-items: flex-start;

			background: radial-gradient(66.61% 80.1% at 70.11% 37.32%, #113694 0%, #0B1846 100%);
			background-blend-mode: overlay, normal;

			@include desktop {
				padding: desktop-vw(40px) 0 desktop-vw(40px) desktop-vw(40px);
			}
			
			@include mobile {
				padding: mobile-vw(85px) mobile-vw(16px) mobile-vw(40px);
			}
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

				&__title{
					.H1{
						color: var(--c-white);

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

				@include mobile {
					display: block;
					padding: 0 mobile-vw(16px); 
				}

			}

			&__item{
			  flex: 0 0 33.333%;
			  padding: 0  desktop-vw(8px);


			  @include mobile {
			  	position: relative;
					flex: 0 0 100%;
					padding: 0 0 mobile-vw(8px);

			    &:nth-child(1){
			    	z-index: 1;
					top: mobile-vw(20px);
			    }

			    &:nth-child(2){
			    	z-index: 2;
					top: mobile-vw(-10px);
			    }

			    &:nth-child(3){
			    	z-index: 3;
					top: mobile-vw(-40px);

					.offers__list__card__informations{
						padding: mobile-vw(15px) mobile-vw(15px) mobile-vw(70px);
					}

					.offers__list__card__foot{
						bottom: mobile-vw(15px)
					}
			    }

				}
			}

			&__card{
			  position: relative;
				display: block;
			  background-color: var(--bg);
			  border: 1px solid var(--c-black);
			  transform: rotate(var(--rotation));
			  height: 100%;


			  @include mobile {
			    flex: 0 0 100%;				  
			  }

			  @include desktop-l {
			    flex: 0 0 33.333%;
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
			    
			    border-top: 1px solid var(--c-black);
			    cursor: pointer;

			    @include mobile {
			      padding: mobile-vw(15px) mobile-vw(15px) mobile-vw(120px);
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
			  			color: var(--c-white);

			  			@include mobile{
			  				font-size: mobile-vw(30px);
			  			}
			  		}

			  		&.blue{
			  			svg{
			  				color: var(--c-blue-adidas)
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
