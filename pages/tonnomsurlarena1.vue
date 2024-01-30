<template>
  
  <main class="app-tonnomsurlarena">

    <div 
      ref="step1"
      class="app-tonnomsurlarena__step grid-inner"
      >

        <div
          ref="step1visual"
          class="app-tonnomsurlarena__visual">
          <EKinesis :speed="5">
            <div class="app-tonnomsurlarena__visual__container">
              <AppTonnomsurlarenaImage
                :src="`adidas-arena-vue-ext.jpg`"
                :alt="`Test`"
                :lazy="true"
                :sizes="{
                  desktop: 'w600,h600,fcrop,q85',
                  mobile: 'w600,h600,fcrop,q85',
                }"
                />
            </div>
          </EKinesis>

          <EParallax
            ref="visualTransparent"
            :speed="0.6"
            class="app-tonnomsurlarena__visual__logo"
          >
            <EKinesis :speed="10">
              <nuxt-picture
                :src="`/imgs/tonnomsurlarena/logo_adidas.webp`"
                format="webp"
                :alt="`Adidas`"
              />
              <AtomsCornerPoints :size-points="6" />
            </EKinesis>
          </EParallax>
        </div>

        <div 
          ref="step1intro"
          class="app-tonnomsurlarena__intro">
          <svg class="app-tonnomsurlarena__intro__lottie" width="515" height="170" viewBox="0 0 515 170" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M63.6621 157.79C96.8721 157.963 129.671 154.073 162.758 151.729C237.741 146.417 313.186 145.609 387.568 133.729C410.544 130.06 470.464 123.772 479.307 94.1188C490.228 57.4984 409.181 45.1167 390.168 41.067C272.58 16.02 152.86 43.7323 49.8313 102.765C22.9302 118.178 1.17638 141.687 44.7417 152.254C106.981 167.351 178.553 158.192 241.653 155.401C265.826 154.332 547.085 147.315 509.199 77.1905C493.971 49.0059 435.268 34.8251 408.155 26.6459C348.824 8.74811 281.315 2.42007 219.727 8.16284C161.478 13.5943 105.55 33.3951 55.3878 63.2539C40.6494 72.0268 -12.3638 108.628 7.1038 132.378C34.7213 166.072 112.326 154.084 148.786 153.261C257.324 150.81 365.563 145.177 473.881 138.037" stroke="#E3530F" stroke-width="4" stroke-linecap="round"/>
          </svg>

          <ERichText
            ref="title"
            :content="`<h1 class='H1 app-tonnomsurlarena__intro__title regular'><span class='H1 bold'>L'Adidas Arena,</span><br/>c'est chez toi maintenant !</h1>`"
            tag="h1"
          />
          <ERichText
            ref="paragraph"
            :content="`<p class='app-tonnomsurlarena__intro__paragraph'>Big up, t’as les clés ! Inscris ton prénom et affiche-le sur la façade de l’arena les 10 et 11 février.</p>`"
            tag="p"
          />

          <AtomsCTA
            class="app-tonnomsurlarena__intro__cta"
            @click.native="displayStep(2)"
          >
            Je participe
          </AtomsCTA>
        </div>

    </div>

    <div 
      ref="step2"
      class="app-tonnomsurlarena__step grid-inner hidden"
      >
      <div class="app-tonnomsurlarena__formstep">

         <ERichText
            ref="titleform"
            :content="`<h2 class='H2 app-tonnomsurlarena__formstep__title bold'>Formulaire</h2>`"
            tag="h2"
          />

          <form
            :class="{ submited }"
            class="app-tonnomsurlarena__form"
            @submit.prevent="onSubmit"
          >
            <div class="app-tonnomsurlarena__field-group">
              <input
                v-model="nom"
                placeholder=" "
                required
                class="app-tonnomsurlarena__field"
                type="text"
              />
              <TH4 tag="p">Nom</TH4>
            </div>
            <div class="app-tonnomsurlarena__field-group">
              <input
                v-model="prenom"
                placeholder=" "
                required
                class="app-tonnomsurlarena__field"
                type="text"
              />
              <TH4 tag="p">Prénom</TH4>
            </div>
            <div class="app-tonnomsurlarena__field-group">
              <input
                v-model="email"
                placeholder=" "
                required
                class="app-tonnomsurlarena__field"
                type="email"
              />
              <TH4 tag="p">Email</TH4>
            </div>

            <div class="app-tonnomsurlarena__accept-adiclub">
              <input
                id="accept-adiclub-tonnomsurlarena"
                v-model="optin"
                type="checkbox"
              />
              <label for="accept-adiclub-tonnomsurlarena">
                <TP2 color="black">
                  {{ `JE SOUHAITE REJOINDRE ADICLUB, LE PROGRAMME DE FIDÉLITÉ ADIDAS, POUR ACCÉDER À DES EXPÉRIENCES EXCLUSIVES, DES PRODUITS ET DES RÉDUCTIONS.` }}
                </TP2>
              </label>
              <span class="checkmark" />
            </div>
            <div class="app-tonnomsurlarena__baseline">
              <AtomsCTA 
                type="submit" 
                button
                > 
                Je participe * 
              </AtomsCTA>
            </div>
          </form>
        </div>
        <div class="app-tonnomsurlarena__formlegals">
          <TP1 weight="bold">{{ `* EN PARTICIPANT, J’ACCEPTE DE RECEVOIR DES COMMUNICATIONS DE LA PART DE L’ADIDAS ARENA CONCERNANT CE CONCOURS ET SES ACTUS.` }}</TP1>
        </div>
    </div>

    <div 
      ref="step3"
      class="app-tonnomsurlarena__step grid-inner hidden"
      >

      <div
        ref="step3visual"
        class="app-tonnomsurlarena__visual">
        <EKinesis :speed="5">
          <div class="app-tonnomsurlarena__visual__container">
            <AppTonnomsurlarenaImage
              :src="`adidas-arena-vue-ext.jpg`"
              :alt="`Test`"
              :lazy="true"
              :sizes="{
                desktop: 'w600,h600,fcrop,q85',
                mobile: 'w600,h600,fcrop,q85',
              }"
              />
          </div>
        </EKinesis>

        <EParallax
          ref="visualTransparent"
          :speed="0.6"
          class="app-tonnomsurlarena__visual__logo"
        >
          <EKinesis :speed="10">
            <nuxt-picture
              :src="`/imgs/tonnomsurlarena/logo_adidas.webp`"
              format="webp"
              :alt="`Adidas`"
            />
            <AtomsCornerPoints :size-points="6" />
          </EKinesis>
        </EParallax>
      </div>

      <div 
        ref="step3intro"
        class="app-tonnomsurlarena__intro">
        <ERichText
          ref="title"
          :content="`<h1 class='H1 app-tonnomsurlarena__intro__title confirmation regular'><span class='H1 bold'>Confirmation</span></h1>`"
          tag="h1"
        />
        <ERichText
          ref="paragraph"
          :content="`<p class='app-tonnomsurlarena__intro__paragraph confirmation'>Rendez-vous les 10 et 11 février pour voir ton prénom projeté <br class='br-hidden'/>sur l’adidas arena !</p>`"
          tag="p"
        />
        <ERichText
          ref="paragraph"
          :content="`<p class='app-tonnomsurlarena__intro__paragraph regular'>De 14h00 à 18h00 plusieurs animations sont ouvertes au public au sein de l'adidas arena <br class='br-hidden'/>et des ses 2 gymnases.<br/><br/>
          Inscris-toi ci-dessous pour participer aux activités.</p>`"
          tag="p"
        />
        <ERichText
          ref="paragraph"
          :content="`<ul class='app-tonnomsurlarena__intro__paragraph regular list'>
          <li><strong>Visite de l’arena :</strong> ça ne sera ton adidas arena que si tu la connais comme ta poche. Viens la visiter et découvre ses coulisses et son histoire.</li>
          <li><strong>L'upcycling featuring 093 lab :</strong> venez créer votre maillot upcyclé personnalisé avec les génies créatifs de l’association du designer Bastien J.Laurent. Flow garanti à la sortie.</li>
          <li><strong>Le beatmaking feat Kera Beatz :</strong> il a travaillé avec Freeze Corleone et Gucci Mane, mais ce 11 février, il compose avec et répond à toutes vos questions.</li>
          <li><strong>La cabine à rêves :</strong> on te donne la parole pour que tu lui parles de tes passions, tes objectifs et tes reves avec un but simple : mieux te comprendre pour mieux d'accompagner.</li>
          <li><strong>Danse avec HipHop Turgot, Barbès Street Dance & InBeatween :</strong> trois associations de danse hip-hop, un seul et même but : apprendre en bougeant. Entre show, héritage culture et initiations.</li>
          <li><strong>Basket-fauteuil avec Paris Basketball Fauteuil :</strong> entre intensité et précision, viens découvrir ce sport spectaculaire avec l'équipe made in 18ème fondée par le crack Sofyane Mehiaoui.</li>
          <li><strong>Escrime by escrime ParisNord :</strong> encadrés par 3 boss de la discipline (deux maîtres d'armes et un jeune champion de France, venez découvrir le sport qui fait briller la France aux Jeux Olympiques.</li>
          </ul>`"
          tag="p"
        />

          <AtomsCTA
            class="app-tonnomsurlarena__confirm__cta"
            href="https://www.adidasarena-opening.com"
          >
            Je m'inscris
          </AtomsCTA>
      </div>

    </div>
  </main>

</template>

<script>
import { mapState, mapMutations } from 'vuex'

import { gsap } from 'gsap'
import scroll from '@/mixins/scroll'
import pageTransition from '@/mixins/page-transition'

export default {
  mixins: [scroll],
  transition(to, from) {
    if (!to || !from) return

    return pageTransition.basic
  },
  data() {
    return {
      submited: false,
      prenom: '',
      nom: '',
      email: '',
      optin: false,
    }
  },
  computed: {
    ...mapState({
      allLoadedFake: (state) => state.allLoadedFake,
      initialHeroDisplayed: (state) => state.initialHeroDisplayed,
      step: (state) => state.step
    }),
  },
  watch: {
    initialHeroDisplayed(newVal) {
      if (!newVal) return

      this.setAllowScroll(true)
    },
  },
  mounted() {
    if (this.allLoadedFake) {
      this.setAllowScroll(true)
      this.setStep(1)
    }
  },
  methods: {
    ...mapMutations({
      setAllowScroll: 'setAllowScroll',
      setStep: 'setStep',
    }),
    displayStep(num, delay = 0){

      if(num === 2){

        if (this.$viewport.isMobile) {
          if(!this.$refs[`step${this.step}`].classList.contains('hidden')){
            this.$refs[`step${this.step}`].classList.add('hidden')
          }
          if(this.$refs[`step${num}`].classList.contains('hidden')){
            this.$refs[`step${num}`].classList.remove('hidden')
          }
        } else { 
          this.tlStep1 = gsap
            .timeline({
              delay,
              onComplete: () => {
               
              },
            })
            .fromTo(
              this.$refs.step1visual,
              {
                x: '0',
              },
              {
                x: '-100vW',
                duration: 0.5,
                stagger: 0.065,
                ease: 'power3.out',
              }
            )
            .fromTo(
              this.$refs.step1intro,
              {
                x: 0,
              },
              {
                x: '100vW',
                duration: 0.5,
                stagger: 0.065,
                ease: 'power3.out',
              }
            )
            .fromTo(
              this.$refs.step1,
              {
                y: '0',
              },
              {
                y: '-100vH',
                duration: 0.6,
                stagger: 0.065,
                ease: 'power3.out',
              }
            )
            .fromTo(
              this.$refs.step2,
              {
                y: '0',
              },
              {
                y: '-100vH',
                duration: 0.6,
                stagger: 0.065,
                ease: 'power3.out',
              }
            )
        }
      }

      if(num === 3){

        if (this.$viewport.isMobile) {
          if(!this.$refs[`step${this.step}`].classList.contains('hidden')){
            this.$refs[`step${this.step}`].classList.add('hidden')
          }
          if(this.$refs[`step${num}`].classList.contains('hidden')){
            this.$refs[`step${num}`].classList.remove('hidden')
          }
        } else { 
          this.tlStep2 = gsap
            .timeline({
              delay,
              onComplete: () => {
               
              },
            })
            .fromTo(
              this.$refs.step1,
              {
                y: '-100vH',
              },
              {
                y: '-200vH',
                duration: 0.6,
                stagger: 0.065,
                ease: 'power3.out',
              }
            )
            .fromTo(
              this.$refs.step2,
              {
                y: '-100vH',
              },
              {
                y: '-200vH',
                duration: 0.6,
                stagger: 0.065,
                ease: 'power3.out',
              }
            )
            .fromTo(
              this.$refs.step3,
              {
                y: '-100vH',
              },
              {
                y: '-200vH',
                duration: 0.6,
                stagger: 0.065,
                ease: 'power3.out',
              }
            )
            .fromTo(
              this.$refs.step3visual,
              {
                x: '-100vW',
              },
              {
                x: '0',
                duration: 0.5,
                stagger: 0.065,
                ease: 'power3.out',
              }
            )
            .fromTo(
              this.$refs.step3intro,
              {
                x: '100vW',
              },
              {
                x: 0,
                duration: 0.5,
                stagger: 0.065,
                ease: 'power3.out',
              }
            )
        }
      }
      this.setStep(num)
    },
    onSubmit() {
      this.submited = true

      const url = 'https://hooks.delight-data.com/v1/contacts'
      const apiKey = this.$config.apiKeyDelightContest1;
      const xhr = new XMLHttpRequest()

      xhr.open('POST', url)
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.setRequestHeader("x-api-key", apiKey);
    
      const data = {
        listname: "Adidas Contest - 100% Winner",
        email: this.email,
        firstname: this.prenom,
        lastname: this.nom,
        misc:{
          optin1: this.optin
        }
      }

      // console.log('data: ', data);

      xhr.send(JSON.stringify(data))
      
      this.displayStep(3)
    },
  },
}
</script>

<style lang="scss">
.app-tonnomsurlarena{

  @include desktop {
    padding-top: desktop-vw(130px);
    height: 100vH;
    overflow: hidden;
  }

  @include mobile {
    padding-top: mobile-vw(85px);
    grid-gap: mobile-vw(10px);
  }

  &__step{
    width: 100%;

    @include mobile{
      transition: all 500ms ease-in-out;
    }


    @include desktop{
      height: 100vH;
    }

    &.hidden{
      
      @include mobile{
        height: 0px;
        opacity: 0;
        overflow: hidden;
      }
    }
  }

  &__formstep{
    position: relative;
    display: flex;
    flex-direction: column;
    background: white;
    background: linear-gradient(rgba(251, 245, 238, 0.8) 0.1em, transparent 0.1em),
      linear-gradient(90deg, rgba(251, 245, 238, 0.8) 0.1em, transparent 0.1em),
      white;
    background-size: 1.15em 1.15em;
    border: 1px solid #000;

    @include mobile{
      grid-column: 1 / span 11;
      padding: mobile-vw(24px) mobile-vw(24px);
    }

    @include desktop{
      grid-column: 4 / span 6;
      padding: desktop-vw(35px) desktop-vw(56px) 0;
    }

    &__title{

      margin: 0 auto;

      &.H2.bold {
        text-align: center;

        @include mobile {
          // @include font-ITCFranklinGothicLT-BkCp();
          font-size: mobile-vw(44px);
          line-height: mobile-vw(40px);
          letter-spacing: mobile-vw(.25px);
        }

        @include desktop {
          font-size: desktop-vw(64px);
          line-height: desktop-vw(60px);
          letter-spacing: desktop-vw(.25px);
        }
      }
    }
  }

  &__formlegals{
    display: flex;
    flex-direction: column;

    @include mobile{
      grid-column: 1 / span 11;
    }

    @include desktop{
      grid-column: 4 / span 6;
    }

    p.P1.bold{
      @include font-ITCFranklinGothicLT-BkCp();
      font-style: italic;

      @include mobile{
        font-size: mobile-vw(14px);
        line-height: mobile-vw(16px);
      }

      @include desktop{
        margin-top: desktop-vw(-10px);
        font-size: desktop-vw(14px);
        line-height: desktop-vw(16px);
      }
    }
  }

  &__form{
    height: 100%;
  }

  &__baseline{

    .app-atoms-cta{
      @include mobile{
        margin: 0 auto;
      }
    }

    @include desktop{
      position: absolute;
      right: 0;
      bottom: 0;
    }
  }

  &__field-group {
    position: relative;
    display: flex;
    width: 100%;
    padding: min(30px, desktop-vw(30px)) 0
      min(20px, desktop-vw(20px)) 0;
    flex-direction: row-reverse;

    @include mobile {
      flex-direction: column-reverse;
      padding: 0 0
        min(20px, mobile-vw(20px)) 0;
    }

    &:first-of-type {
      margin-top: desktop-vw(20px);

      @include mobile {
        margin-top: mobile-vw(30px);
      }
    }

    &.textarea {
      flex-direction: column-reverse;
      margin-top: desktop-vw(40px);

      .H4 {
        align-self: flex-start;
        margin-bottom: desktop-vw(20px);
      }
    }

    .H4 {
      align-self: flex-end;
      margin-right: desktop-vw(20px);

      @include mobile {
        align-self: flex-start;
        margin-right: 0px;
        font-size: mobile-vw(24px);
        line-height: mobile-vw(24px);


      }
    }

    &:focus-within {
      & > .app-element-contact-overlay__field {
        border-bottom: 2px solid;
      }
    }

  }

  &__field {
    position: relative;
    z-index: 1;
    flex: 1 1 auto;
    display: block;
    width: 100%;
    border-bottom: 2px dashed var(--c-black);
    padding: 0 0 0 desktop-vw(15px);
    @include h2();

    font-size: desktop-vw(32px);
    line-height: desktop-vw(28px);
    @include font-ITCFranklinGothicLT-DmCp();

    @include mobile {
      font-size: mobile-vw(16px);
      line-height: mobile-vw(16px);
      padding: mobile-vw(10px) 0 mobile-vw(5px) 0;
    }

    &.textarea {
      @include p1();
      @include font-ITCFranklinGothicLT-BkCp();
      height: desktop-vw(125px);
      text-transform: initial;

      @include mobile {
        height: mobile-vw(125px);
      }
    }

    &:required:valid {
      border-bottom: 2px solid var(--c-black);
    }

    &:required:invalid:not(:placeholder-shown) {
      border-bottom: 2px solid var(--c-red-adidas);

      & + .H4 {
        color: var(--c-red-adidas) !important;
      }
    }
  }

  &__accept-adiclub {
    flex-basis: 100%;
    display: flex;
    align-items: center;
    position: relative;
    padding-left: desktop-vw(25px);
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    margin-top: desktop-vw(5px);

    @include mobile {
      padding-left: mobile-vw(25px);
      margin-top: mobile-vw(20px);
      margin-bottom: mobile-vw(20px);
      order: 2;
      flex: 1;
    }

    @include hover {
      &:hover {
        input {
          &:not(:checked) ~ .checkmark {
            &::after {
              content: '';
              transform: translate(-50%, -50%) scale(0.35);
            }
          }
        }
      }
    }

    .P2 {
      font-size: desktop-vw(16px);
      line-height: desktop-vw(21px);
      color: var(--c-black);
      cursor: pointer;
      transition: color 0.4s var(--ease-out-cubic);

      @include font-ITCFranklinGothicLT-DmCp();

      @include mobile {
        font-size: mobile-vw(14px);
        line-height: mobile-vw(16px);
      }
    }

    input {
      opacity: 0;
      position: absolute;
      width: desktop-vw(25px);
      height: 100%;
      top: 0;
      left: 0;
      cursor: pointer;
      order: 1;

      &:checked ~ .checkmark {
        // background-color: var(--c-black);

        &::after {
          content: '';
          transform: translate(-50%, -50%) scale(1);
        }
      }
    }

    .checkmark {
      position: absolute;
      left: 0;
      height: 12px;
      width: 12px;
      background-color: transparent;
      border: 1px solid var(--c-black);
      pointer-events: none;
      cursor: pointer;

      @include mobile{
        top: 0;
      }

      @include desktop{
        top: 4px;
      }

      &::after {
        content: '';
        width: 75%;
        height: 75%;
        background: var(--c-black);
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0);
        transform-origin: center;
        transition: transform 0.3s var(--ease-out-cubic);
        will-change: transform;
      }
    }
  }

  &__visual{
    position: relative;
    display: flex;
    flex-direction: column;

    @include mobile{
      grid-column: 1 / span 11;
    }

    @include desktop{
      grid-column: 2 / span 5;
    }

    &__container{
      display: inline-block;
      overflow: hidden;


      @include mobile{
        width: 100%;
        max-height: mobile-vw(440px);
      }

      @include desktop{
        margin-top: desktop-vw(20px);
        width: 90%;
        transform: rotate(-4deg);
        max-width: desktop-vw(468px);
        max-height: desktop-vw(540px);
      }

      .app-tonnomsurlarena-image{
        @include desktop{
         transform: rotate(4deg) scale(1.1);
        }
      }
    }

    &__logo{
      @include mobile{
        display: none;
      }
      @include desktop{
        position: absolute;
        grid-row: 2;
        width: 30%;
        max-width: 30%;
        grid-column: 6 / span 2;
        top: 35%;
        transform: rotate(-9deg);
        aspect-ratio: 200 / 130;
        left: 70%;
        display: flex;
        align-items: center;
        justify-content: center;
        height: auto;
        transform-origin: center center;


        .app-element-kinesis {
          display: flex;
          justify-content: center;
          align-items: center;

          @include fake-transparent();
        }

        picture {
          display: block;
          width: 55%;
          height: auto;
        }
      }
    }
  }

  &__intro{
    position: relative;
    display: flex;
    flex-direction: column;


    &__lottie{
      @include mobile{
        display: none;
      }

      @include desktop{
        position: absolute;
        top: desktop-vw(20px);
        left: desktop-vw(-80px);
        width: 80%;
        transform: translateY(-50%);
      }

    }

    @include mobile{
      grid-column: 1 / span 11;
    }

    @include desktop{
      grid-column: 7 / span 5;
    }

    &__title {
      width: 100%;

      &.confirmation{
        @include mobile{
          margin-bottom: mobile-vw(20px);
        }
        @include desktop{
          margin-bottom: desktop-vw(50px);
        }
      }

      &.H1.regular{


        @include mobile {
          @include font-ITCFranklinGothicLT-DmCp();
          font-size: mobile-vw(50px);
          line-height: mobile-vw(50px);
          letter-spacing: mobile-vw(.25px);
        }

        @include desktop {
          @include font-ITCFranklinGothicLT-BkCp();
          font-size: desktop-vw(90px);
          line-height: desktop-vw(90px);
          letter-spacing: 0;
        }

      }


      .H1.bold {

        @include mobile {
          @include font-ITCFranklinGothicLT-BkCp();
          font-size: mobile-vw(50px);
          line-height: mobile-vw(50px);
          letter-spacing: mobile-vw(.25px);
        }

        @include desktop {
          font-size: desktop-vw(90px);
          line-height: desktop-vw(90px);
          letter-spacing: 0;
        }
      }
    }

    &__paragraph{
      width: 80%;
      text-transform: uppercase;
      @include font-ITCFranklinGothicLT-DmCp();
      color: var(--c-black);

      .br-hidden{
        @include mobile{
          display: none;
        }
      }

      @include mobile{
        padding-left: mobile-vw(2px);
        margin-top: mobile-vw(16px);
        font-size: mobile-vw(16px);
        line-height: mobile-vw(18px);
      }

      @include desktop{
        padding-left: desktop-vw(4px);
        margin-top: desktop-vw(20px);
        font-size: desktop-vw(17px);
        line-height: desktop-vw(20px);
      }

      @include mobile-l {
        font-size: mobile-vw(12px);
        line-height: mobile-vw(18px);
      }

      @include desktop-xl {
        font-size: desktop-vw(12px);
        line-height: desktop-vw(18px);
      }

      &.confirmation{

        @include mobile{
          margin-bottom: mobile-vw(32px);
        }

        @include desktop{
          margin-bottom: desktop-vw(32px);
        }
      }

      &.regular{
        width: 100%;

        @include font-ITCFranklinGothicLT-BkCp();

        @include mobile{
          margin-top: 0;
          font-size: mobile-vw(14px);
          line-height: mobile-vw(16px);
        }

        @include desktop{
          margin-top: 0;
          font-size: desktop-vw(14px);
          line-height: desktop-vw(16px);
        }
      }

      &.list{
        list-style: none;

        li{
          position: relative;

          @include mobile{
            padding: 0 0 0 mobile-vw(12px);
          }

          @include desktop{
            padding: 0 0 0 desktop-vw(24px);
          }

          strong{
           font-family:'ITCFranklinGothicLT-DmCp';
          }

          &:before{
            content:'';
            position: absolute;
            top: 50%;
            line-height: 0;
            font-size: 0;
            background-color: #000;
            transform: translateY(-50%);

            @include mobile{
              left: mobile-vw(5px);
              width: mobile-vw(2px);
              height: mobile-vw(2px);
            }

            @include desktop{
              left: desktop-vw(10px);
              width: desktop-vw(2px);
              height: desktop-vw(2px);
            }
          }
        }
      }

    }

    &__cta{
      width: 50%;

      @include mobile{
        margin-top: mobile-vw(30px);
        margin-bottom: mobile-vw(30px);

      }

      @include desktop{
        margin-top: desktop-vw(60px);
      }
    }

  }

  &__confirm{


    &__cta{
      width: 50%;

      @include mobile{
        margin-top: mobile-vw(16px);
        margin-bottom: mobile-vw(30px);

      }

      @include desktop{
        margin-top: desktop-vw(30px);
      }
    }
  }

}

</style>
