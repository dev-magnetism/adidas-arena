import webpack from 'webpack'

export default {
  target: 'static',
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'adidas-arena',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['~assets/scss/global.scss', '~assets/scss/main.scss'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/gsap.js', mode: 'client' },
    { src: '~/plugins/utils.js', mode: 'client' },
    { src: '~/plugins/raf.js', mode: 'client' },
    { src: '~/plugins/viewport.js', mode: 'client' },
  ],

  pageTransition: {
    name: 'page',
    mode: 'out-in', // when blank: out and in are simultaneous. default: 'out-in'
    // not that when using 'out-in', the outro can be finished before the data has been loaded
    // meaning an empty page will be shown
    duration: 500,
    beforeEnter(el) {
      this.$nuxt.$emit('app:beforeEnter')
      // console.log("beforeEnter");
    },
    afterEnter(el) {
      // this.$nuxt.$emit('scroll:refresh')
    },
    beforeLeave(el) {
      // scroll:kill basically here
    },
    afterLeave(el) {
      // // scroll:reset basically here
      // // this.$nuxt.$emit('scroll:kill')
      // this.$nuxt.$emit('cart:close')
      // this.$nuxt.$emit('scroll:reset')
    },
  },

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: [
    {
      path: '@/components',
      extensions: ['vue'],
    },
    {
      path: '@/components/elements',
      prefix: 'e',
      extensions: ['vue'],
    },
    {
      path: '@/components/svg',
      prefix: 'svg',
      extensions: ['vue'],
    },
    {
      path: '@/components/texts',
      prefix: 't',
      extensions: ['vue'],
    },
    {
      path: '@/components/atoms',
      prefix: 'atoms',
      extensions: ['vue'],
    },
    {
      path: '@/components/app',
      prefix: 'app',
      extensions: ['vue'],
    },
  ],

  generate: {
    fallback: true,
  },

  static: {
    prefix: false,
  },

  // router: {
  //   scrollBehavior: (to, from, savedPosition) => {
  //     return { x: 0, y: 0 }
  //   },
  // },

  styleResources: {
    scss: ['~assets/scss/main.scss'],
  },

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    '@nuxtjs/style-resources',
    '@nuxt/image',
    '@nuxtjs/device',
    // 'nuxt-font-loader',
  ],

  device: {
    refreshOnResize: true,
  },

  // fontLoader: {
  //   url: 'fonts/fonts.css',
  // },

  image: {
    // The screen sizes predefined by `@nuxt/image`:
    screens: {
      sm: 800,
      lg: 1440,
      xl: 1920,
      xxl: 2560,
    },
  },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    'nuxt-mq',
    // 'nuxt-runtime-compiler',
    [
      '~/modules/directus',
      {
        url: 'https://nws6fqcy.directus.app/',
        auth: {
          email: 'email',
          password: 'mdp',
          // token: process.env.DIRECTUS_STATIC_TOKEN,
        },
      },
    ],
  ],

  mq: {
    defaultBreakpoint: 'sm',
    breakpoints: {
      sm: 800,
      lg: Infinity,
    },
  },

  // directus: {
  //   url: 'https://nws6fqcy.directus.app/',
  //   auth: {
  //      email: 'email',
  //      password: 'mot de passe',
  //     // token: process.env.DIRECTUS_STATIC_TOKEN,
  //   },
  // },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  render: {
    bundleRenderer: {
      shouldPreload: (file, type) => {
        return ['script', 'style', 'font'].includes(type)
      },
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extractCSS: {
      ignoreOrder: false,
    },
    transpile: ['three', 'gsap'],
    extend(config, ctx) {
      config.resolve.alias.vue = 'vue/dist/vue.common'
      config.plugins.push(new webpack.ProvidePlugin({ THREE: 'three' }))
      config.module.rules.push({
        test: /\.(glsl|vs|fs)$/,
        use: [{ loader: 'raw-loader' }, { loader: 'glslify-loader' }],
      })
    },
  },
}
