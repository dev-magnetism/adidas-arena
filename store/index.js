// export const strict = false
import slugify from 'slugify'
import getInitialData from '~/getInitialData'

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

        acc[key] = acc[key] || { category: key, slug: slugify(key, { strict: true }), count: 0 }
        acc[key].count++
        return acc
      }, {})
    )

    const _reported = state.programmes.filter(_v => _v.reported);

    //  console.log('programmesCategories / _reported', _reported);

    result.unshift({ category: 'tout', slug: slugify('tout', { strict: true }), count: state.programmes.length })

    result.push({ category: 'reports', slug: slugify('reports', { strict: true }), count: _reported.length })


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
    { commit },
    { $config }
  ) {
    const initialData = $config.initialData || await getInitialData()
    commit('setPartnersContent', initialData.partners)
    commit('setAppContent', initialData.app)
    commit('setMenuContent', initialData.menu)
    commit('setInteriorContent', initialData.interiorFloors.data)
    commit('setActualites', initialData.actualites.data)
    commit('setProgrammationsContent', initialData.programmations.data)
    commit('setProgrammationOfferContent', initialData.programmationOffers.data)
    commit('setProgrammationsEventContent', initialData.programmationsEvent.data)
    commit('setActualitesArticleContent', initialData.actualitesArticle.data)
    commit('setProgrammes', initialData.programmes)
    commit('setConcoursDatas', initialData.concoursDatas)
  },
}
