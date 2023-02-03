import webpack from 'webpack'

export default {
  target: 'static',
  head: {
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  publicRuntimeConfig: {
    baseURL: process.env.BASE_URL || 'https://www.adidasarena.com/',
    apiKeyDelight: process.env.API_KEY_DELIGHT || 'MMcR9vQkDKfuug',
  },

  css: ['~assets/scss/global.scss'],

  plugins: [
    { src: '~/plugins/gsap.js', mode: 'client' },
    { src: '~/plugins/utils.js', mode: 'client' },
    { src: '~/plugins/raf.js', mode: 'client' },
    { src: '~/plugins/viewport.js', mode: 'client' },
  ],

  // vue: {
  //   config: {
  //     productionTip: true,
  //     devtools: true,
  //   },
  // },

  server: {
    host: '0.0.0.0',
    port: 3000,
  },

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

  pageTransition: false,

  router: {
    scrollBehavior: (to, from, savedPosition) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ x: 0, y: 0 })
        }, 1250)
      })
    },
  },

  styleResources: {
    scss: ['~assets/scss/main.scss'],
  },

  buildModules: [
    '@nuxtjs/eslint-module',
    '@nuxtjs/style-resources',
    '@nuxt/image',
  ],

  image: {
    screens: {
      sm: 800,
      lg: 1440,
      xl: 1920,
      xxl: 2560,
    },
    providers: {
      directus: {
        name: 'directus',
        provider: '~/providers/directus',
        options: {
          baseURL: 'https://adidasarena.directus.app/',
          modifiers: {
            format: 'webp',
            quality: 80,
          },
        },
      },
    },
  },

  modules: [
    [
      '~/modules/directus',
      {
        url: 'https://adidasarena.directus.app/',
      },
    ],
    'nuxt-seo',
  ],

  seo: {
    lang: 'fr',
    language: 'French',
    baseUrl: process.env.BASE_URL || 'https://www.adidasarena.com/',
    name: 'Adidas Arena',
    templateTitle: '%name% — %title%',
    keywords: 'adidas, arena, sports, concerts',
    image: '/seo.jpg',
    openGraph: {
      type: 'website',
      name: 'Adidas Arena',
      image: {
        url: '/seo.jpg',
      },
    },
  },

  render: {
    bundleRenderer: {
      shouldPreload: (file, type) => {
        return ['script', 'style', 'font'].includes(type)
      },
    },
  },

  loading: false,

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
      config.module.rules.push({
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      })
    },
  },
}
