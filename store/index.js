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
  menuContent: null,

  // Exterior scene
  exteriorVisible: true,
  exteriorArenaHovered: false,

  // Exterior scene
  interiorVisible: true,

  // UI
  displayAppearance: false,
  menuOpen: false,
  menuActive: false,
  cursoState: 'default',
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
  setDisplayAppearance: (state, value) => {
    state.displayAppearance = value
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
  setMenuContent: (state, value) => {
    state.menuContent = value
  },
  setMenuOpen: (state, value) => {
    state.menuOpen = value
  },
  setMenuActive: (state, value) => {
    state.menuActive = value
  },
  setCursoState: (state, value) => {
    state.cursoState = value
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
  },
}
