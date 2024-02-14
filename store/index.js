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

    result.unshift({ category: 'Tout', count: state.programmes.length })

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
      fields: ['*'],
    })

    commit('setProgrammationsContent', programmations.data)

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

    // https://www.accorarena-onepointpprod.com/api-svc/partners/adidas-arena/events?limit=1&page=1

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
      // https://www.accorarena-onepointpprod.com/api-svc/partners/adidas-arena/events?limit=${limit}&page=${index}

      // 2 / Récupération des données Programmations via Directus (réutilisation de la variable programmations plus haut)
      const contents = payload.data
      const progDirectContents = programmations.data

      // 3 / Récupération des données complètes par Event
      for (let i = 0; i < contents.length; i++) {
        // Récupération du flux par event pour la clé 'instruction_id' qui n'est pas complète dans le flux global
        const payloadEvent = await this.$axios.$get(
          `https://www.accorarena.com/api-svc/partners/adidas-arena/event/${contents[i].id}`
        )

        // https://www.accorarena-onepointpprod.com/api-svc/partners/adidas-arena/event/${contents[i].id}

        // Complétion des données 1 avec données 2 et 3

        const contentEvent = payloadEvent

        const progDirectContent = progDirectContents.find(
          (cont) => parseInt(cont.id_event) === contents[i].id
        )

        contents[i].is_draft = progDirectContent.is_draft
        contents[i].main_event = progDirectContent.main_event
        contents[i].inside_slider = progDirectContent.inside_slider
        contents[i].instruction_id = contentEvent.instruction_id
          ? contentEvent.instruction_id
          : []

        contents[i].spotify_link = progDirectContent.spotify_link;
        contents[i].cover_video = progDirectContent.cover_video;
        
        contents[i].content = contents[i].translations.find(
          (translation) => translation.language === 'fr'
        )

        contents[i].content.category = contents[i].content.category
          ? contents[i].content.category.toLowerCase()
          : 'no cat'

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

      // Ajout de tous les éléments de "test" à "programmes".
      programmes.push(...finalContents)
    }

    commit('setProgrammes', programmes)


    const _concoursDatas = [
      { id: 1, name: "Laurent", numPics: "3" },
      { id: 2, name: "Simon", numPics: "2" },
      { id: 3, name: "Rémi", numPics: "1" },
      { id: 4, name: "Aragorn", numPics: "1" }
    ]

    commit('setConcoursDatas', _concoursDatas);

  },
}
