export const strict = false

export const state = () => ({
  fontsLoaded: false,
})

export const getters = {
  //   allLoaded: (state) => {
  //     return state.coverVideoLoaded && state.interactiveSliderLoaded
  //   },
}

export const mutations = {
  setFontsLoaded: (state, value) => {
    state.fontsLoaded = value
  },
}
