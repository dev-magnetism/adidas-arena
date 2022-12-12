// export const strict = false

export const state = () => ({
  // Preloader
  fontsLoaded: false,
  allLoadedActual: false,
  allLoadedFake: false,
  preloaderHidden: false,
  preloaderLeaving: false,
  modelExteriorLoaded: false,
  modelCloudLoaded: false,

  // Content
  partnersContent: null,
  appContent: null,

  // Exterior scene
  exteriorVisible: true,

  // UI
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
  setModelExteriorLoaded: (state, value) => {
    state.modelExteriorLoaded = value
  },
  setModelCloudLoaded: (state, value) => {
    state.modelCloudLoaded = value
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
  },
}
