export default function ({ app }, inject) {
  // Configuration du cache
  const cacheConfig = {
    // Durée de cache pour les ressources statiques (en secondes)
    staticAssets: 60 * 60 * 24 * 30, // 30 jours
    images: 60 * 60 * 24 * 7, // 7 jours
    api: 60 * 60 * 2, // 2 heures
    fonts: 60 * 60 * 24 * 365, // 1 an
    
    // Stratégies de cache
    strategies: {
      static: 'CacheFirst',
      images: 'CacheFirst',
      api: 'NetworkFirst',
      fonts: 'CacheFirst'
    }
  }

  // Gestionnaire de cache pour les API
  const cacheApiResponse = async (url, response, duration = cacheConfig.api) => {
    if (!process.client) return

    try {
      const cache = await caches.open('api-cache')
      const cacheResponse = response.clone()
      
      // Ajouter les headers de cache
      const headers = new Headers(cacheResponse.headers)
      headers.set('Cache-Control', `max-age=${duration}`)
      headers.set('Date', new Date().toUTCString())
      
      const cachedResponse = new Response(cacheResponse.body, {
        status: cacheResponse.status,
        statusText: cacheResponse.statusText,
        headers
      })
      
      await cache.put(url, cachedResponse)
    } catch (error) {
      console.warn('Failed to cache API response:', error)
    }
  }

  // Récupérer une réponse depuis le cache
  const getCachedResponse = async (url) => {
    if (!process.client) return null

    try {
      const cache = await caches.open('api-cache')
      const cachedResponse = await cache.match(url)
      
      if (cachedResponse) {
        const cacheDate = cachedResponse.headers.get('Date')
        const maxAge = parseInt(cachedResponse.headers.get('Cache-Control')?.split('max-age=')[1] || '0')
        
        if (cacheDate && maxAge) {
          const cacheTime = new Date(cacheDate).getTime()
          const now = new Date().getTime()
          
          if (now - cacheTime < maxAge * 1000) {
            return cachedResponse
          } else {
            // Cache expiré, le supprimer
            await cache.delete(url)
          }
        }
      }
    } catch (error) {
      console.warn('Failed to get cached response:', error)
    }
    
    return null
  }

  // Optimiser les requêtes API avec cache
  const optimizedFetch = async (url, options = {}) => {
    if (!process.client) {
      return fetch(url, options)
    }

    // Vérifier le cache d'abord
    const cachedResponse = await getCachedResponse(url)
    if (cachedResponse) {
      return cachedResponse
    }

    // Faire la requête réseau
    try {
      const response = await fetch(url, options)
      
      // Mettre en cache si c'est une requête GET réussie
      if (response.ok && options.method !== 'POST' && options.method !== 'PUT' && options.method !== 'DELETE') {
        await cacheApiResponse(url, response)
      }
      
      return response
    } catch (error) {
      console.error('Network request failed:', error)
      throw error
    }
  }

  // Précharger les ressources critiques
  const preloadCriticalResources = () => {
    if (!process.client) return

    const criticalResources = [
      '/fonts/ITCFranklinGothicLT-DmCp/ITCFranklinGothicLT-DmCp.woff2',
      '/fonts/ITCFranklinGothicLT-BkCp/ITCFranklinGothicLT-BkCp.woff2',
      '/imgs/logo.png'
    ]

    criticalResources.forEach((resource) => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = resource
      link.as = resource.includes('.woff') ? 'font' : 'image'
      if (resource.includes('.woff')) {
        link.crossOrigin = 'anonymous'
      }
      document.head.appendChild(link)
    })
  }

  // Nettoyer le cache expiré
  const cleanupExpiredCache = async () => {
    if (!process.client) return

    try {
      const cacheNames = await caches.keys()
      
      for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName)
        const requests = await cache.keys()
        
        for (const request of requests) {
          const response = await cache.match(request)
          if (response) {
            const cacheDate = response.headers.get('Date')
            const maxAge = parseInt(response.headers.get('Cache-Control')?.split('max-age=')[1] || '0')
            
            if (cacheDate && maxAge) {
              const cacheTime = new Date(cacheDate).getTime()
              const now = new Date().getTime()
              
              if (now - cacheTime >= maxAge * 1000) {
                await cache.delete(request)
              }
            }
          }
        }
      }
    } catch (error) {
      console.warn('Failed to cleanup expired cache:', error)
    }
  }

  // API publique
  const cacheOptimization = {
    config: cacheConfig,
    cacheApiResponse,
    getCachedResponse,
    optimizedFetch,
    preloadCriticalResources,
    cleanupExpiredCache
  }

  // Injecter dans le contexte Vue
  inject('cacheOptimization', cacheOptimization)
}
