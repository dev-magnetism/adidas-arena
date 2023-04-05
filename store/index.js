// export const strict = false

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

  // Exterior scene
  exteriorVisible: true,
  exteriorArenaHovered: false,
  exteriorFullwidth: false,

  // Interior scene
  interiorVisible: true,
  interiorIndexFloor: { id: 0, focus: null, immediate: true },
  interiorMusicScene: true,
  interiorCurrentZoneName: null,
  interiorCurrentZoneHovered: null,
  interiorTimelineFloorsInProgress: false,

  // UI
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
})

export const getters = {
  // allLoadedActual: (state) => {
  //   return state.coverVideoLoaded && state.interactiveSliderLoaded
  // },
}

export const mutations = {
  setFontsLoaded: (state, value) => {
    state.fontsLoaded = value
  },
  setAppCursor: (state, value) => {
    state.appCursor = value
  },
  setWebglInFront: (state, value) => {
    state.webglInFront = value
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
  setExteriorFullwidth: (state, value) => {
    state.exteriorFullwidth = value
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
    })

    commit('setProgrammationsContent', programmations.data)
  },
}
