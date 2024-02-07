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

export default {
  target: 'static',

  head: {
    htmlAttrs: {
      lang: 'fr',
    },
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content:
          'width=device-width, initial-scale=1, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no',
      },
      { name: 'format-detection', content: 'telephone=no' },
      {
        name: 'google-site-verification',
        content: 'sCUfvG-_I5Fmsll2gdkBf35SJrj3BEnNWilC4NsuG1Q',
      },
      {
        name: 'smartbanner:api',
        content: 'true'
      },
      {
        name: 'smartbanner:title',
        content: 'adidas arena'
      },
      {
        name: 'smartbanner:author',
        content: 'Vivez l\'adidas arena avec notre application'
      },
      {
        name: 'smartbanner:price',
        content: ''
      },
      {
        name: 'smartbanner:price-suffix-apple',
        content: ''
      },
      {
        name: 'smartbanner:price-suffix-google',
        content: ''
      },
      {
        name: 'smartbanner:icon-apple',
        content: '/logo_app_adidasarena.png'
      },
      {
        name: 'smartbanner:icon-google',
        content: '/logo_app_adidasarena.png'
      },
      {
        name: 'smartbanner:button',
        content: 'OUVRIR'
      },
      {
        name: 'smartbanner:button-url-apple',
        content: 'https://apps.apple.com/us/app/adidas-arena/id6475820994'
      },
      {
        name: 'smartbanner:button-url-google',
        content: 'https://play.google.com/store/apps/details?id=com.parisentertainmentcompany.adidasarena'
      },
      {
        name: 'smartbanner:enabled-platforms',
        content: 'android,ios'
      },
      {
        name: 'smartbanner:close-label',
        content: 'Fermer'
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  publicRuntimeConfig: {
    baseURL: process.env.BASE_URL || 'https://www.adidasarena.com/',
    apiKeyAppstore: process.env.API_KEY_APPSTORE || '',
    apiKeyDelight: process.env.API_KEY_DELIGHT || 'EBu7rZdGJLInGv',
    apiKeyDelightContest1: process.env.API_KEY_DELIGHT_CONTEST1 || 'NsURo5eO8i4IGA',
    apiKeyDelightContest2: process.env.API_KEY_DELIGHT_CONTEST2 || 'qHpk02SuYn-Myg',
    siteEnv: process.env.SITE_ENV || 'production',
  },

  telemetry: false,
  css: ['~assets/scss/global.scss'],

  plugins: [
    { src: '~/plugins/gsap.js', mode: 'client' },
    { src: '~/plugins/utils.js' },
    { src: '~/plugins/raf.js', mode: 'client' },
    { src: '~/plugins/viewport.js', mode: 'client' },
    { src: '~/plugins/smartbanner.min.js', mode: 'client' },
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
    subFolders: false,
    async routes() {
      const axios = require('axios')

      const limit = 50
      const routes = []

      const response = await axios.get(
        `https://www.accorarena.com/api-svc/partners/adidas-arena/events?limit=1&page=1`
      )

      // https://www.accorarena-onepointpprod.com/api-svc/partners/adidas-arena/events?limit=1&page=1

      const lengthPages = Math.ceil(response.data.meta.total_count / limit)

      const pages = Array(lengthPages)
        .fill(0)
        .map((_, index) => index + 1)

      for (const index of pages) {
        const payload = await axios.get(
          `https://www.accorarena.com/api-svc/partners/adidas-arena/events?limit=${limit}&page=${index}`
        )

        // https://www.accorarena-onepointpprod.com/api-svc/partners/adidas-arena/events?limit=${limit}&page=${index}

        const events = payload.data.data

        events.forEach((event) => {
          const id = event.id

          const { url } = event.translations.find(
            (translation) => translation.language === 'fr'
          )

          // TO DO : corriger convertToKebabCase(url) par convertToKebabCase(removeSpecialChar(url))

          if (process.env.SITE_ENV !== 'production' && !event.is_draft) {
            // Si l'environnement n'est pas en production et que l'élément n'est pas en mode brouillon
            routes.push(
              `/programmation/${convertToKebabCase(
                removeSpecialChar(url)
              )}--${id}`
            )
          }
        })
      }

      const actualites = await axios.get(
        `https://adidasarena.directus.app/items/Actualites?limit=-1`
      )

      actualites.data.data.forEach((actu) => {
        const _slug = removeSpecialChar(actu.title)
        // console.log('actualites slug ', convertToKebabCase(_slug));
        routes.push(`/nos-actualites/${convertToKebabCase(_slug)}`)
      })

      return routes
    },
    interval: 250,
  },

  static: {
    prefix: false,
  },

  pageTransition: false,

  router: {
    trailingSlash: false,
    // scrollBehavior: (to, from, savedPosition) => {
    //   return new Promise((resolve) => {
    //     setTimeout(() => {
    //       resolve({ x: 0, y: 0 })
    //     }, 1250)
    //   })
    // },
  },

  styleResources: {
    scss: ['~assets/scss/main.scss'],
  },

  buildModules: ['@nuxtjs/style-resources', '@nuxt/image'],

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
            quality: 90,
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
      // 'nuxt-smart-app-banner',
    ],
    'cookie-universal-nuxt',
    '@nuxtjs/eslint-module',
    '@nuxtjs/robots',
    'nuxt-seo',
    '@nuxtjs/gtm',
    'nuxt-compress',
    '@nuxtjs/sitemap',
    '@nuxtjs/axios',
    'vue-social-sharing/nuxt',
  ],

  // 'nuxt-smart-app-banner': {
  //   bannerOptions: {
  //     title: "Title",
  //     androidAppId: process.env.ANDROID_APP_ID || 'com.parisentertainmentcompany.adidasarena',
  //     icon: "https://icon-library.com/images/play-store-icon/play-store-icon-9.jpg",
  //     iosAppId: process.env.IOS_APP_ID || '6475820994',
  //     appStoreLanguage: "fr",
  //   }
  // },

  robots: {
    Sitemap: process.env.BASE_URL
      ? `${process.env.BASE_URL}sitemap.xml`
      : `https://www.adidasarena.com/sitemap.xml`,
  },

  sitemap: {
    hostname: process.env.BASE_URL || 'https://www.adidasarena.com/',
    path: '/sitemap.xml',
    exclude: [
      '/tonnomsurlarena1',
      '/tonnomsurlarena2'
    ],
    defaults: {
      changefreq: 'daily',
      priority: 1,
      lastmod: new Date(),
    },
  },

  'nuxt-compress': {
    gzip: {
      // threshold: 8192,
      cache: true,
    },
    brotli: {
      threshold: 10240,
    },
  },

  seo: {
    lang: 'fr',
    language: 'French',
    baseUrl: process.env.BASE_URL || 'https://www.adidasarena.com/',
    name: 'adidas arena',
    templateTitle: '%name% — %title%',
    keywords: 'adidas, arena, sports, concerts',
    image: `${process.env.BASE_URL || 'https://www.adidasarena.com/'}seo.jpg`,
    openGraph: {
      type: 'website',
      name: 'adidas arena',
      image: {
        url: `${process.env.BASE_URL || 'https://www.adidasarena.com/'}seo.jpg`,
      },
    },
    twitter: {
      card: 'summary_large_image',
      title: 'adidas arena',
      image: `${process.env.BASE_URL || 'https://www.adidasarena.com/'}seo.jpg`,
    },
    meta: [
      {
        name: 'apple-itunes-app',
        content: `app-id='6475820994'}`
      },
    ],
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
    extractCSS: true,
    transpile: ['three', 'gsap', '@studio-freight/lenis'],
    extend(config, ctx) {
      config.resolve.alias.vue = 'vue/dist/vue.common'
      config.module.rules.push({
        test: /\.(glsl|vs|fs)$/,
        use: [{ loader: 'raw-loader' }, { loader: 'glslify-loader' }],
      })
    },
  },
}
