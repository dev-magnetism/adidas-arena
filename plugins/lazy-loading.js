export default function ({ app }, inject) {
  // Configuration du lazy loading
  const lazyLoadingConfig = {
    // Intersection Observer options
    rootMargin: '50px 0px',
    threshold: 0.1,
    
    // Délai pour le chargement des composants non critiques
    componentDelay: 100,
    
    // Délai pour les images
    imageDelay: 50,
    
    // Composants à charger en lazy
    lazyComponents: [
      'AppGallery',
      'WebglScene',
      'AppMenu',
      'AppFooter'
    ]
  }

  // Lazy loading des composants
  const lazyLoadComponent = (componentName, delay = 0) => {
    return () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          import(`~/components/${componentName}.vue`).then(resolve)
        }, delay)
      })
    }
  }

  // Lazy loading des images avec Intersection Observer
  const lazyLoadImages = () => {
    if (!process.client) return

    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target
          const src = img.dataset.src
          
          if (src) {
            img.src = src
            img.classList.remove('lazy')
            img.classList.add('loaded')
            imageObserver.unobserve(img)
          }
        }
      })
    }, {
      rootMargin: lazyLoadingConfig.rootMargin,
      threshold: lazyLoadingConfig.threshold
    })

    // Observer toutes les images avec la classe 'lazy'
    document.querySelectorAll('img[data-src]').forEach((img) => {
      imageObserver.observe(img)
    })

    return imageObserver
  }

  // Lazy loading des composants Vue
  const lazyLoadVueComponents = () => {
    if (!process.client) return

    const componentObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const element = entry.target
          const componentName = element.dataset.component
          
          if (componentName && lazyLoadingConfig.lazyComponents.includes(componentName)) {
            // Charger le composant de manière asynchrone
            import(`~/components/${componentName}.vue`).then((module) => {
              // Le composant sera chargé par Vue automatiquement
              console.log(`Component ${componentName} loaded`)
            })
            
            componentObserver.unobserve(element)
          }
        }
      })
    }, {
      rootMargin: '100px 0px',
      threshold: 0.1
    })

    // Observer tous les éléments avec data-component
    document.querySelectorAll('[data-component]').forEach((element) => {
      componentObserver.observe(element)
    })

    return componentObserver
  }

  // Initialiser le lazy loading
  const initLazyLoading = () => {
    if (!process.client) return

    // Lazy loading des images
    const imageObserver = lazyLoadImages()
    
    // Lazy loading des composants
    const componentObserver = lazyLoadVueComponents()

    // Cleanup function
    return () => {
      if (imageObserver) imageObserver.disconnect()
      if (componentObserver) componentObserver.disconnect()
    }
  }

  // API publique
  const lazyLoading = {
    config: lazyLoadingConfig,
    lazyLoadComponent,
    lazyLoadImages,
    lazyLoadVueComponents,
    initLazyLoading
  }

  // Injecter dans le contexte Vue
  inject('lazyLoading', lazyLoading)
}
