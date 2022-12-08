// export const strict = false

export const state = () => ({
  // Loader
  fontsLoaded: false,
  allLoaded: false,
  allLoadedTimeline: false,
  modelExteriorLoaded: false,
  modelCloudLoaded: false,

  // Content
  partnersContent: null,
  appContent: null,

  // UI
  menuOpen: false,
  menuActive: false,
})

export const getters = {
  // allLoaded: (state) => {
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
  setAllLoaded: (state, value) => {
    state.allLoaded = value
  },
  setAllLoadedTimeline: (state, value) => {
    state.allLoadedTimeline = value
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
