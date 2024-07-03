// export const strict = false

const convertToKebabCase = (string) => {
  return string
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
}

const removeSpecialChar = (string) => {
  return string
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036F]/g, '')
    .replace(/[^\w\s]/gi, '-')
}

export const state = () => ({
  // Preloader
  fontsLoaded: false,
  allLoadedActual: false,
  allLoadedFake: false,
  modelExteriorLoaded: false,
  modelInteriorLoaded: false,
  modelCloudLoaded: false,
  modelsPreviewed: false,
  preloaderHidden: false,

  // Content
  partnersContent: null,
  appContent: null,
  interiorContent: null,
  menuContent: null,
  programmationsContent: null,
  programmationsEventContent: null,
  actualitesArticleContent: null,
  programmes: null,
  actualites: null,

  // Exterior scene
  exteriorVisible: true,
  exteriorFullscreen: false,
  exteriorArenaHovered: false,

  // Interior scene
  interiorVisible: true,
  interiorIndexFloor: { id: 0, focus: null, immediate: true },
  interiorMusicScene: true,
  interiorCurrentZoneName: null,
  interiorCurrentZoneHovered: null,
  interiorTimelineFloorsInProgress: false,

  // UI
  webview: false,
  allowScroll: false,
  webglInFront: false,
  initialHeroDisplayed: false,
  menuActive: false,
  popinNewsletterClosedInSession: false,
  popinNewsletterOpen: false,
  overlayContactOpen: false,
  headerReduced: false,
  headerWhite: false,
  headerHide: false,
  appCursor: 'initial',
  cursorState: 'hide',
  cursorSliderHold: false,
  cursorSliderLeftZone: false,
  cursorSliderDisabled: false,
  instructionsWebglVisible: true,
  step: 1,
  concoursDatas: [],
})

export const getters = {
  programmesCategories: (state) => {
    const result = Object.values(
      state.programmes.reduce((acc, { content: { category } }) => {
        const key = category ? category.toLowerCase() : 'no cat'

        acc[key] = acc[key] || { category: key, count: 0 }
        acc[key].count++
        return acc
      }, {})
    )

    const _reported = state.programmes.filter(_v => _v.reported);

    //  console.log('programmesCategories / _reported', _reported);

    result.unshift({ category: 'Tout', count: state.programmes.length })

    result.push({ category: 'Reports', count: _reported.length })

    //  console.log('programmesCategories / result', result);
    return result
  },
  actualitesCategories: (state) => {
    const result = Object.values(
      state.actualites.reduce((acc, { category }) => {
        const key = category ? category.toLowerCase() : 'no cat'

        acc[key] = acc[key] || { category: key, count: 0 }
        acc[key].count++
        return acc
      }, {})
    )

    result.unshift({ category: 'Tout', count: state.actualites.length })

    return result
  },
  programmesSlider: (state) => {
    return state.programmes.slice(0, 8)
  },
  programmesMonths: (state) => {
    return (
      Object.values(
        state.programmes
          .filter((event) => !event.is_cover)
          .reduce((groups, program) => {
            // Create a date object from the program's start date
            const date = new Date(program.start)
            // Format the month name using the French locale
            const monthName = new Intl.DateTimeFormat('fr', {
              month: 'long',
            }).format(date)
            // Get the year of the program's start date
            const year = date.getFullYear()
            // Create a key for the group by combining the month name and year
            const key = `${monthName}-${year}`
            // If the group doesn't exist yet, create it with an empty events array
            if (!groups[key]) {
              groups[key] = { month: monthName, year, events: [] }
            }
            // Add the program to the events array of the corresponding group
            groups[key].events.push(program)
            // Return the updated groups object
            return groups
          }, {})
      )
        // Filter out any empty groups and return an array of group objects
        .filter((group) => group.events.length > 0)
    )
  },
}

export const mutations = {
  setFontsLoaded: (state, value) => {
    state.fontsLoaded = value
  },
  setInstructionsWebglVisible: (state, value) => {
    state.instructionsWebglVisible = value
  },
  setAppCursor: (state, value) => {
    state.appCursor = value
  },
  setWebglInFront: (state, value) => {
    state.webglInFront = value
  },

  setActualites: (state, value) => {
    state.actualites = value
  },
  setInteriorCurrentZoneHovered: (state, value) => {
    state.interiorCurrentZoneHovered = value
  },
  setPopinNewsletterClosedInSession: (state, value) => {
    state.popinNewsletterClosedInSession = value
  },
  setPopinNewsletterOpen: (state, value) => {
    state.popinNewsletterOpen = value
  },
  setProgrammes: (state, value) => {
    state.programmes = value
  },
  setInteriorContent: (state, value) => {
    state.interiorContent = value
  },
  setHeaderReduced: (state, value) => {
    state.headerReduced = value
  },
  setInteriorTimelineFloorsInProgress: (state, value) => {
    state.interiorTimelineFloorsInProgress = value
  },
  setHeaderHide: (state, value) => {
    state.headerHide = value
  },
  setWebview: (state, value) => {
    state.webview = value
  },
  setAllowScroll: (state, value) => {
    state.allowScroll = value
  },
  setInteriorCurrentZoneName: (state, value) => {
    state.interiorCurrentZoneName = value
  },
  setOverlayContactOpen: (state, value) => {
    state.overlayContactOpen = value
  },
  setInteriorMusicScene: (state, value) => {
    state.interiorMusicScene = value
  },
  setCursorSliderHold: (state, value) => {
    state.cursorSliderHold = value
  },
  setCursorSliderDisabled: (state, value) => {
    state.cursorSliderDisabled = value
  },
  setCursorSliderLeftZone: (state, value) => {
    state.cursorSliderLeftZone = value
  },
  setExteriorFullscreen: (state, value) => {
    state.exteriorFullscreen = value
  },
  setInteriorIndexFloor: (state, value) => {
    state.interiorIndexFloor = value
  },
  setHeaderWhite: (state, value) => {
    state.headerWhite = value
  },
  setInitialHeroDisplayed: (state, value) => {
    state.initialHeroDisplayed = value
  },
  setModelsPreviewed: (state, value) => {
    state.modelsPreviewed = value
  },
  setModelExteriorLoaded: (state, value) => {
    state.modelExteriorLoaded = value
  },
  setModelInteriorLoaded: (state, value) => {
    state.modelInteriorLoaded = value
  },
  setModelCloudLoaded: (state, value) => {
    state.modelCloudLoaded = value
  },
  setExteriorArenaHovered: (state, value) => {
    state.exteriorArenaHovered = value
  },
  setAllLoadedActual: (state, value) => {
    state.allLoadedActual = value
  },
  setAllLoadedFake: (state, value) => {
    state.allLoadedFake = value
  },
  setPreloaderHidden: (state, value) => {
    state.preloaderHidden = value
  },
  setPartnersContent: (state, value) => {
    state.partnersContent = value
  },
  setAppContent: (state, value) => {
    state.appContent = value
  },
  setProgrammationsContent: (state, value) => {
    state.programmationsContent = value
  },
  setProgrammationOfferContent: (state, value) => {
    state.programmationOfferContent = value
  },
  setProgrammationsEventContent: (state, value) => {
    state.programmationsEventContent = value
  },
  setActualitesArticleContent: (state, value) => {
    state.actualitesArticleContent = value
  },
  setMenuContent: (state, value) => {
    state.menuContent = value
  },
  setMenuActive: (state, value) => {
    state.menuActive = value
  },
  setCursorState: (state, value) => {
    state.cursorState = value
  },
  setExteriorVisible: (state, value) => {
    state.exteriorVisible = value
  },
  setInteriorVisible: (state, value) => {
    state.interiorVisible = value
  },
  setStep: (state, value) => {
    state.step = value
  },
  setConcoursDatas: (state, value) => {
    state.concoursDatas = value
  },
}

export const actions = {
  async nuxtServerInit(
    { dispatch, commit },
    { route, query, params, $directus }
  ) {
    const partners = await $directus.items('Partners').readByQuery({
      limit: -1,
    })

    commit('setPartnersContent', partners)

    const app = await $directus.items('App').readByQuery({
      limit: -1,
    })

    commit('setAppContent', app)

    const menu = await $directus.items('Menu').readByQuery({
      limit: -1,
    })

    commit('setMenuContent', menu)

    const interiorFloors = await $directus
      .items('Interior_Floors')
      .readByQuery({
        limit: -1,
      })

    commit('setInteriorContent', interiorFloors.data)

    const programmations = await $directus.items('Programmations').readByQuery({
      limit: -1,
      fields: [
        '*',
        'offer.*'
        ],
    })

    commit('setProgrammationsContent', programmations.data)

    const programmationOffers = await $directus.items('Programmation_Offer').readByQuery({
      limit: -1,
      fields: ['*'],
    })

    commit('setProgrammationOfferContent', programmationOffers.data)

    const actualites = await $directus.items('Actualites').readByQuery({
      limit: -1,
      fields: [
        '*',
        'cover.*',
        'body.*',
        'items.*',
        'body.item.*',
        'body.item.picture.*',
        'body.item.items.*',
        'body.item.items.item.*',
        'body.item.items.item.picture.*',
        '*.collection',
      ],
    })

    // SORT ACTUALITES BY DATE DESC
    actualites.data = actualites.data.sort(function (a, b) {
      return new Date(b.date) - new Date(a.date)
    })

    actualites.data.forEach((actu) => {
      const _slug = removeSpecialChar(actu.title)
      //  console.log('actualites slug ', convertToKebabCase(_slug));
      actu.slug = convertToKebabCase(_slug)
    })

    commit('setActualites', actualites.data)

    const programmationsEvent = await $directus
      .items('Programmation_Event')
      .readByQuery({
        limit: -1,
      })

    commit('setProgrammationsEventContent', programmationsEvent.data)

    const actualitesArticle = await $directus
      .items('Actualites_article')
      .readByQuery({
        limit: -1,
      })

    commit('setActualitesArticleContent', actualitesArticle.data)

    const { meta } = await this.$axios.$get(
      `https://www.accorarena.com/api-svc/partners/adidas-arena/events?limit=1&page=1`
    )

    // PROD     : `https://www.accorarena.com/api-svc/partners/adidas-arena/events?limit=1&page=1`
    // PREPROD  : `https://www.accorarena-onepointpprod.com/api-svc/partners/adidas-arena/events?limit=1&page=1`

    const limit = 50

    const lengthPages = Math.ceil(meta.total_count / limit)

    const programmes = []

    const pages = Array(lengthPages)
      .fill(0)
      .map((_, index) => index + 1)

    for (const index of pages) {
      // 1 / Récupération de la liste complète des Events via accorarena

      const payload = await this.$axios.$get(
        `https://www.accorarena.com/api-svc/partners/adidas-arena/events?limit=${limit}&page=${index}`
      )

      // PROD     : `https://www.accorarena.com/api-svc/partners/adidas-arena/events?limit=${limit}&page=${index}`
      // PREPROD  : `https://www.accorarena-onepointpprod.com/api-svc/partners/adidas-arena/events?limit=${limit}&page=${index}`

      // 2 / Récupération des données Programmations via Directus (réutilisation de la variable programmations plus haut)
      const contents = payload.data
      const progDirectContents = programmations.data

      const progOffersDirectContents = programmationOffers.data

      let _testInd = 0;

      // 3 / Récupération des données complètes par Event
      for (let i = 0; i < contents.length; i++) {
        // Récupération du flux par event pour la clé 'instruction_id' qui n'est pas complète dans le flux global
        const payloadEvent = await this.$axios.$get(
          `https://www.accorarena.com/api-svc/partners/adidas-arena/event/${contents[i].id}`
        )

        // PROD     : `https://www.accorarena.com/api-svc/partners/adidas-arena/event/${contents[i].id}`
        // PREPROD  : `https://www.accorarena-onepointpprod.com/api-svc/partners/adidas-arena/event/${contents[i].id}`


        // Complétion des données 1 avec données 2 et 3

        const contentEvent = payloadEvent

        const progDirectContent = progDirectContents.find(
          (cont) => parseInt(cont.id_event) === contents[i].id
        )

        //  console.log('progDirectContent offers', progDirectContent.offers)

        contents[i].is_draft = progDirectContent?.is_draft
        contents[i].main_event = progDirectContent?.main_event
        contents[i].inside_slider = progDirectContent?.inside_slider
        contents[i].instruction_id = contentEvent.instruction_id
          ? contentEvent.instruction_id
          : []

        contents[i].spotify_link = progDirectContent?.spotify_link
        contents[i].cover_video = progDirectContent?.cover_video


        // REPORTED USE CASE TEST
        if(i % 2 === 0) {
          contents[i].reported = true;
          contents[i].initial_date = "2024-06-08 20:00:00";

          if(_testInd % 2 === 0) {
            contents[i].report_date_announcement = "2025-11-08 20:00:00";
            contents[i].waiting_new_date = false;
          } else {
            contents[i].waiting_new_date = true;
          }

          _testInd = _testInd +1;
        }

        contents[i].ticketing_std_title = (progDirectContent?.ticketing_std_title)?progDirectContent.ticketing_std_title:programmationsEvent.data.ticketing_std_title
        contents[i].ticketing_std_description = (progDirectContent?.ticketing_std_description)?progDirectContent.ticketing_std_description:programmationsEvent.data.ticketing_std_description
        contents[i].ticketing_prem_title = (progDirectContent?.ticketing_prem_title)?progDirectContent.ticketing_prem_title:programmationsEvent.data.ticketing_prem_title
        contents[i].ticketing_prem_description = (progDirectContent?.ticketing_prem_description)?progDirectContent.ticketing_prem_description:programmationsEvent.data.ticketing_prem_description

        contents[i].offers = progDirectContent?.offer.map((_item)=>{
            return progOffersDirectContents.find(_offer => _offer.id === _item.Programmation_Offer_id)
        });

        contents[i].content = contents[i].translations.find(
          (translation) => translation.language === 'fr'
        )

        contents[i].content.category = contents[i].content.category
          ? contents[i].content.category.toLowerCase()
          : 'no cat'

        // Make sure dates are sorted properly
        contents[i].sessions.sort((a, b) => new Date(a.date) - new Date(b.date))

        contents[i].sessions.forEach((session) => {
          session.content = session.translations.find(
            (translation) => translation.language === 'fr'
          )
        })

        contents[i].instruction_id.forEach((instruction) => {
          instruction.content = instruction.translations.find(
            (translation) => translation.language === 'fr'
          )
        })



      }

      // Copie de l'array "contents" dans la variable "test".
      let finalContents = contents

      // Si l'environnement est en mode "production", filtrer les éléments non brouillons.
      if (process.env.SITE_ENV === 'production') {
        finalContents = contents.filter((content) => !content.is_draft)
      }

      //  console.log('EVENTS length ', contents.length);

      // Ajout de tous les éléments de "test" à "programmes".
      programmes.push(...finalContents)
    }

    commit('setProgrammes', programmes)

    const _concoursDatas = [
      { name: 'REMY' },
      { name: 'RICHARD' },
      { name: 'VICTOR' },
      { name: 'MINIER' },
      { name: 'MOHAMED' },
      { name: 'XAVIER' },
      { name: 'NAOMI' },
      { name: 'MAUD' },
      { name: 'NAJMA' },
      { name: 'SARAH' },
      { name: 'UGO' },
      { name: 'MELODY' },
      { name: 'MOUADH' },
      { name: 'YASSINE' },
      { name: 'VICTORINE' },
      { name: 'RENZO' },
      { name: 'NICOLAS' },
      { name: 'MAX' },
      { name: 'STEPHANIE' },
      { name: 'NOAH' },
      { name: 'VICTORIA' },
      { name: 'REJENA' },
      { name: 'SIRINE' },
      { name: 'MERLIN' },
      { name: 'MOUNIA' },
      { name: 'STEPHAN' },
      { name: 'NITAN' },
      { name: 'MAXIME' },
      { name: 'REMI' },
      { name: 'URIEL' },
      { name: 'TANYA' },
      { name: 'SADIO' },
      { name: 'VINCENT' },
      { name: 'VALERIE' },
      { name: 'STEPHANE' },
      { name: 'MURIEL' },
      { name: 'SANTIAGO' },
      { name: 'MYRIEM' },
      { name: 'ROMEO' },
      { name: 'MYLAN' },
      { name: 'OUMOU' },
      { name: 'PATRICK' },
      { name: 'YVAN' },
      { name: 'ROBIN' },
      { name: 'MAYA' },
      { name: 'PIERRELOUIS' },
      { name: 'NADIA' },
      { name: 'RAKIB' },
      { name: 'VLADIMIR' },
      { name: 'SIMON' },
      { name: 'OMAR' },
      { name: 'MICHELLE' },
      { name: 'RACHEL' },
      { name: 'OUARDI' },
      { name: 'THOMAS' },
      { name: 'RENE' },
      { name: 'PRISCA' },
      { name: 'VALENTIN' },
      { name: 'THEO' },
      { name: 'SALE' },
      { name: 'SYLVER' },
      { name: 'THAO' },
      { name: 'PAPE' },
      { name: 'NOE' },
      { name: 'YVES' },
      { name: 'NESRINE' },
      { name: 'TAO' },
      { name: 'THIERRY' },
      { name: 'SALIM' },
      { name: 'YOUNESSE' },
      { name: 'NICKO' },
      { name: 'RADE' },
      { name: 'QUENTIN' },
      { name: 'NAYA' },
      { name: 'YANN' },
      { name: 'TRISTAN' },
      { name: 'SYLVAIN' },
      { name: 'SARATA' },
      { name: 'TATIANA' },
      { name: 'RAJAA' },
      { name: 'ROMAIN' },
      { name: 'RAHIM' },
      { name: 'PASCAL' },
      { name: 'REGIS' },
      { name: 'NINON' },
      { name: 'STACY' },
      { name: 'SOFIA' },
      { name: 'TOM' },
      { name: 'MIEL' },
      { name: 'SAINI' },
      { name: 'SIEMOUSTAPHA' },
      { name: 'NATHAN' },
      { name: 'ROSYMAE' },
      { name: 'NOURDINE' },
      { name: 'VANESSA' },
      { name: 'PAUL' },
      { name: 'SALAH' },
      { name: 'MERYAM' },
      { name: 'MOUSSA' },
      { name: 'MICKAEL' },
      { name: 'WILLIAM' },
      { name: 'NOUREDDINE' },
      { name: 'YOGASHA' },
      { name: 'OCEANE' },
      { name: 'PAPESAN' },
      { name: 'NASSIM' },
      { name: 'PAULINE' },
      { name: 'SAMIRA' },
      { name: 'NAJOUA' },
      { name: 'REDHA' },
      { name: 'SAID' },
      { name: 'NATHALIE' },
      { name: 'YACINE' },
      { name: 'PAULIN' },
      { name: 'POL ELIOTT' },
      { name: 'STEFAN' },
      { name: 'WENDY' },
      { name: 'REBEKKA' },
      { name: 'POLYXENI' },
      { name: 'ROUDAYNA' },
      { name: 'SOFIANE' },
      { name: 'NINE' },
      { name: 'TIMOTE ALOYS' },
      { name: 'MICHEL' },
      { name: 'SEBASTIEN' },
      { name: 'SAIDYASSER' },
      { name: 'ROMANE' },
      { name: 'TONY' },
      { name: 'OLIVIER' },
      { name: 'MELANIE' },
      { name: 'YOANN' },
      { name: 'MEHDI' },
      { name: 'SOPHIE' },
      { name: 'PHILIPPINE' },
      { name: 'SOULEYMANE' },
      { name: 'THEOTIME' },
      { name: 'MATTHIAS' },
      { name: 'SANDRA' },
      { name: 'OSMAN' },
      { name: 'RITA' },
      { name: 'MOHAND' },
      { name: 'MAXIMILIEN' },
      { name: 'NORA' },
      { name: 'NOLAN' },
      { name: 'ZAKARYE' },
      { name: 'MELISSANDRE' },
      { name: 'MICHAEL' },
      { name: 'RAPH' },
      { name: 'SONIA' },
      { name: 'MATTEO' },
      { name: 'TESS' },
      { name: 'YANNICK' },
      { name: 'SCHERRER' },
      { name: 'NINO' },
      { name: 'SABRINA' },
      { name: 'MAGUI' },
      { name: 'ESTELLE' },
      { name: 'IDRISS' },
      { name: 'FLORENT' },
      { name: 'ELODIE' },
      { name: 'ELIZABETH' },
      { name: 'MAMADOU' },
      { name: 'JULIAN' },
      { name: 'JOSEPHINE' },
      { name: 'BELMO' },
      { name: 'CLAIRE' },
      { name: 'CHARLES ERIC' },
      { name: 'LENAIC' },
      { name: 'ANTHONY' },
      { name: 'BENOIT' },
      { name: 'DENIZ' },
      { name: 'SALEM' },
      { name: 'FABIENNE' },
      { name: 'EZECHIEL' },
      { name: 'THIBAULT' },
      { name: 'AYOUB' },
      { name: 'ANGELO' },
      { name: 'GERALD' },
      { name: 'ANTOINE' },
      { name: 'LILIAN' },
      { name: 'LOUISON' },
      { name: 'ERIC' },
      { name: 'MANAR' },
      { name: 'ALIENOR' },
      { name: 'MARIETOU' },
      { name: 'HANOI' },
      { name: 'AYA' },
      { name: 'ALEXIA' },
      { name: 'ALBINA' },
      { name: 'ARNAUD' },
      { name: 'JEREMIE' },
      { name: 'LOUIS' },
      { name: 'JANELLE' },
      { name: 'LEX' },
      { name: 'AMINE' },
      { name: 'JULES' },
      { name: 'DJAFAR' },
      { name: 'DORKAS' },
      { name: 'LILA' },
      { name: 'LEA' },
      { name: 'DIOUARE' },
      { name: 'PIERRE' },
      { name: 'CHAYMA' },
      { name: 'MARION' },
      { name: 'FEDERICO' },
      { name: 'JOFFREY' },
      { name: 'IKE' },
      { name: 'JEFF' },
      { name: 'ELLISON' },
      { name: 'JADA' },
      { name: 'DAVY' },
      { name: 'ASTRID' },
      { name: 'JEAN BAPTISTE' },
      { name: 'INES' },
      { name: 'FAYCAL' },
      { name: 'GUYFREED' },
      { name: 'GONZALO' },
      { name: 'HONORINE' },
      { name: 'FRANCK' },
      { name: 'MATHIEU' },
      { name: 'KATIA' },
      { name: 'LONA' },
      { name: 'HASSAN' },
      { name: 'MARIE' },
      { name: 'FABRICE' },
      { name: 'ANTONELLA' },
      { name: 'GABRIEL' },
      { name: 'ENZO' },
      { name: 'HANI' },
      { name: 'EMILIE' },
      { name: 'CANDYS' },
      { name: 'AURORE' },
      { name: 'MAREME' },
      { name: 'LAURIANNE' },
      { name: 'LOU' },
      { name: 'EVA' },
      { name: 'BAPTISE' },
      { name: 'ETIENNE' },
      { name: 'ALEXIS' },
      { name: 'CHRISTOPHE' },
      { name: 'ASSANE' },
      { name: 'JEAN PIERRE' },
      { name: 'MANEL' },
      { name: 'ADAMA' },
      { name: 'LEE' },
      { name: 'FLORIAN' },
      { name: 'MARGAUX' },
      { name: 'ARTHUR' },
      { name: 'JEAN LAURENT' },
      { name: 'MATHILDE' },
      { name: 'LILIA' },
      { name: 'HENRI' },
      { name: 'COME' },
      { name: 'MONA' },
      { name: 'DJAMEL' },
      { name: 'ULYSSE' },
      { name: 'JEAN ETIENNE' },
      { name: 'ELISE' },
      { name: 'LENA' },
      { name: 'ALIX' },
      { name: 'MATTHIEU' },
      { name: 'BIXENTE' },
      { name: 'GUY' },
      { name: 'FELIX' },
      { name: 'AMIRA' },
      { name: 'MAEVA' },
      { name: 'ALEX' },
      { name: 'ISABEL' },
      { name: 'HAROLD' },
      { name: 'CAMILLE' },
      { name: 'EBENEZER' },
      { name: 'HELENE' },
      { name: 'LABICHE' },
      { name: 'JONATHAN' },
      { name: 'ETHAN' },
      { name: 'SONJA' },
      { name: 'INTISSAR' },
      { name: 'ESMA' },
      { name: 'LAURA' },
      { name: 'LOUISA' },
      { name: 'CHEICK' },
      { name: 'BRIAN' },
      { name: 'HERLE' },
      { name: 'JILL' },
      { name: 'BEYZAGUL' },
      { name: 'MARIANNE' },
      { name: 'CHARLOTTE' },
      { name: 'GAELLE' },
      { name: 'BRIANA' },
      { name: 'KILIAN' },
      { name: 'FANNY' },
      { name: 'KENOL' },
      { name: 'KILLIAN' },
      { name: 'EXCLAIMERUSER' },
      { name: 'ADAM' },
      { name: 'JOELLE' },
      { name: 'MALLAURIE' },
      { name: 'DANIEL' },
      { name: 'MAXENCE' },
      { name: 'MARC' },
      { name: 'DAMIEN' },
      { name: 'CHRISTOPHER' },
      { name: 'LOUJANE' },
      { name: 'DONOVAN' },
      { name: 'LEIA' },
      { name: 'CYRIL' },
      { name: 'JADE' },
      { name: 'JASON' },
      { name: 'HAFSA' },
      { name: 'ADRIEN' },
      { name: 'LUNA' },
      { name: 'GUL' },
      { name: 'AIDA' },
      { name: 'ASSANATA' },
      { name: 'KAMAL' },
      { name: 'IVAN' },
      { name: 'IOANNA' },
      { name: 'BRUNO' },
      { name: 'CLEMENT' },
      { name: 'SAMUEL' },
      { name: 'CAFE' },
      { name: 'HELSLY' },
      { name: 'DJAHID' },
      { name: 'MANON' },
      { name: 'HUBERT' },
      { name: 'MARIN' },
      { name: 'JULIEN' },
      { name: 'BENJAMIN' },
      { name: 'AURELIE' },
      { name: 'IMAN' },
      { name: 'KYLIANN' },
      { name: 'HAKIM' },
      { name: 'AGATHE' },
      { name: 'MADYANA' },
      { name: 'CHLOE' },
      { name: 'FAUSTINE' },
      { name: 'BICHAR' },
      { name: 'FRANCOIS' },
      { name: 'CHRISTIAN' },
      { name: 'ALICE' },
      { name: 'ALEXANDRE' },
      { name: 'MARINE' },
      { name: 'MARTA' },
      { name: 'FATOU' },
      { name: 'ADAME' },
      { name: 'MADEN' },
      { name: 'BEN' },
      { name: 'CAROLE' },
      { name: 'KEVIN' },
      { name: 'LAETITIA' },
      { name: 'BAPTISTE' },
      { name: 'ALBERTO' },
      { name: 'LEO' },
      { name: 'LUDIVINE' },
      { name: 'HOSSAM' },
      { name: 'LOUISE' },
      { name: 'GUIDO' },
      { name: 'ABDERRAHMANE' },
      { name: 'MARIAM' },
      { name: 'LAURIANE' },
      { name: 'VERONIQUE' },
      { name: 'CHRISSY' },
      { name: 'BERNARD' },
      { name: 'FABRY' },
      { name: 'LUCIE' },
      { name: 'MARIA' },
      { name: 'HERVE' },
      { name: 'GERMAIN' },
      { name: 'QUINCY' },
      { name: 'LOLITA' },
      { name: 'EMMANUEL' },
      { name: 'CECILE' },
      { name: 'JORDAN' },
      { name: 'ALBAN' },
      { name: 'GWENDAL' },
      { name: 'MATHIAS' },
      { name: 'CLEMENTINE' },
      { name: 'MAE' },
      { name: 'FERIEL' },
      { name: 'GREGORY' },
      { name: 'ISSA' },
      { name: 'HEVAL' },
      { name: 'YANIS' },
      { name: 'LOUNA' },
      { name: 'CEDRIC' },
      { name: 'LAURENCE' },
      { name: 'LUCAS' },
      { name: 'LARBI' },
      { name: 'ANTON' },
      { name: 'ANNE' },
      { name: 'JIHAD' },
      { name: 'KEYCI' },
      { name: 'KOLI' },
      { name: 'FRANCOI' },
      { name: 'MARINA' },
      { name: 'AXEL' },
      { name: 'JEAN FRANCOIS' },
      { name: 'ELISABETH' },
      { name: 'LAUREEN' },
      { name: 'MANAUD' },
      { name: 'ANNABELLE' },
      { name: 'FARID' },
      { name: 'LENNY' },
      { name: 'LAURE' },
      { name: 'DELPHINE' },
      { name: 'MARGOT' },
      { name: 'IVO' },
      { name: 'ANICET' },
      { name: 'BASTIEN' },
      { name: 'HUGO' },
      { name: 'CYRILLE' },
      { name: 'THIBAUT' },
      { name: 'JEANNE' },
      { name: 'DJIMY' },
      { name: 'DOMINIQUE' },
      { name: 'KAYSHA' },
      { name: 'AUDREY' },
      { name: 'ANGELINE' },
      { name: 'DAVID' },
      { name: 'FABIO' },
      { name: 'MATHIS' },
      { name: 'ELIOTT' },
      { name: 'LEILA' },
      { name: 'ELSA' },
      { name: 'JEAN DAVID' },
      { name: 'JUVILLE' },
      { name: 'AMELIE' },
      { name: 'JULIE' },
      { name: 'JOSHUA' },
      { name: 'ISABELLE' },
      { name: 'ADRIAN' },
      { name: 'ASSIA' },
      { name: 'MAELYS' },
      { name: 'KOLYA' },
      { name: 'GAUTHIER' },
      { name: 'ELHAM' },
      { name: 'ANGE' },
      { name: 'MARTIN' },
      { name: 'CELINE' },
      { name: 'KADIZA' },
      { name: 'FLORENCE' },
      { name: 'KAMEL' },
      { name: 'JEAN HENRY' },
      { name: 'APPOLINE' },
      { name: 'MARCO' },
      { name: 'LUDOVIC' },
      { name: 'AICHA' },
      { name: 'EMILE LOUIS' },
      { name: 'KHADIJA' },
      { name: 'IKRAM' },
      { name: 'ROBERT' },
      { name: 'LIONEL' },
      { name: 'DOROTHEE' },
      { name: 'GODEFROY' },
      { name: 'CLAUS PETER' },
      { name: 'CAROLINE' },
      { name: 'JASMINE' },
      { name: 'CHARLES' },
      { name: 'MARLON' },
      { name: 'CASTA' },
      { name: 'LYSANDRE' },
      { name: 'CHRISTINA' },
      { name: 'BAUDOIN' },
      { name: 'KADIDIATOU' },
      { name: 'JEREMY' },
      { name: 'JORDAN(1)' },
      { name: 'RACHID' },
      { name: 'FREDERIC' },
      { name: 'GUILLAUME' },
      { name: 'KHEURVY' },
      { name: 'CESAR' },
      { name: 'JULIA' },
      { name: 'AMINA' },
      { name: 'ELIE' },
    ]

    commit('setConcoursDatas', _concoursDatas)
  },
}
