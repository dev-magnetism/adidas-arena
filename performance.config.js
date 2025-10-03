// Configuration des optimisations de performance
export const performanceConfig = {
  // Configuration des images
  images: {
    // Qualité par défaut pour les images
    defaultQuality: 85,
    
    // Formats supportés (par ordre de préférence)
    formats: ['webp', 'jpg', 'png'],
    
    // Tailles d'images par breakpoint
    breakpoints: {
      sm: 800,
      md: 1200,
      lg: 1440,
      xl: 1920,
      xxl: 2560
    },
    
    // Placeholder pour les images en cours de chargement
    placeholder: true,
    
    // Lazy loading par défaut
    lazy: true
  },

  // Configuration WebGL
  webgl: {
    // Désactiver sur mobile par défaut
    disableOnMobile: true,
    
    // Désactiver sur les appareils peu performants
    disableOnLowPerformance: true,
    
    // Configuration des performances
    performance: {
      low: {
        antialias: false,
        powerPreference: 'low-power',
        precision: 'lowp',
        maxSamples: 0
      },
      medium: {
        antialias: false,
        powerPreference: 'default',
        precision: 'mediump',
        maxSamples: 0
      },
      high: {
        antialias: true,
        powerPreference: 'high-performance',
        precision: 'highp',
        maxSamples: 4
      }
    }
  },

  // Configuration du cache
  cache: {
    // Durées de cache (en secondes)
    durations: {
      static: 60 * 60 * 24 * 30, // 30 jours
      images: 60 * 60 * 24 * 7,  // 7 jours
      api: 60 * 60 * 2,          // 2 heures
      fonts: 60 * 60 * 24 * 365  // 1 an
    },
    
    // Stratégies de cache
    strategies: {
      static: 'CacheFirst',
      images: 'CacheFirst',
      api: 'NetworkFirst',
      fonts: 'CacheFirst'
    }
  },

  // Configuration du lazy loading
  lazyLoading: {
    // Délai pour le chargement des composants (ms)
    componentDelay: 100,
    
    // Délai pour les images (ms)
    imageDelay: 50,
    
    // Marge pour l'Intersection Observer
    rootMargin: '50px 0px',
    
    // Seuil de visibilité
    threshold: 0.1,
    
    // Composants à charger en lazy
    lazyComponents: [
      'AppGallery',
      'WebglScene',
      'AppMenu',
      'AppFooter'
    ]
  },

  // Configuration des fonts
  fonts: {
    // Précharger les fonts critiques
    preload: [
      'ITCFranklinGothicLT-DmCp',
      'ITCFranklinGothicLT-BkCp',
      'ITCFranklinGothicStd-DmCp'
    ],
    
    // Subset des caractères pour optimiser la taille
    unicodeRange: 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD',
    
    // Font-display
    display: 'swap'
  },

  // Configuration SEO
  seo: {
    // Meta description par défaut
    defaultDescription: 'Adidas Arena - La nouvelle arène parisienne pour le sport et les spectacles. Découvrez notre programmation, nos événements et notre expérience unique.',
    
    // Mots-clés par défaut
    defaultKeywords: 'adidas, arena, paris, sport, spectacles, événements, programmation',
    
    // Configuration Open Graph
    openGraph: {
      type: 'website',
      locale: 'fr_FR',
      siteName: 'Adidas Arena'
    },
    
    // Configuration Twitter
    twitter: {
      card: 'summary_large_image',
      site: '@adidasarena'
    }
  },

  // Configuration du build
  build: {
    // Optimisations Terser
    terser: {
      dropConsole: true,
      dropDebugger: true,
      mangle: true
    },
    
    // Configuration des chunks
    chunks: {
      vendor: {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendors',
        priority: 10
      },
      webgl: {
        test: /[\\/]node_modules[\\/](three|gsap)[\\/]/,
        name: 'webgl',
        priority: 20
      }
    }
  }
}

export default performanceConfig
