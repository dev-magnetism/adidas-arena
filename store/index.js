// export const strict = false

export const state = () => ({
  fontsLoaded: false,
  partnersContent: null,
  appContent: null,
  allLoaded: false,
  allLoadedTimeline: false,
  modelExteriorLoaded: false,
  modelCloudLoaded: false,
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
