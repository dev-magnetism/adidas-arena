export default function ({ app }, inject) {
  // Détection du support WebGL
  const isWebGLSupported = () => {
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      return !!(gl && gl.getParameter(gl.VERSION))
    } catch (e) {
      return false
    }
  }

  // Détection des performances de l'appareil
  const getDevicePerformance = () => {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    
    if (!gl) return 'low'
    
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
    if (debugInfo) {
      const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
      // Détecter les GPU intégrés (moins performants)
      if (renderer.includes('Intel') || renderer.includes('Mali') || renderer.includes('Adreno')) {
        return 'medium'
      }
    }
    
    // Détecter la mémoire GPU
    const memoryInfo = gl.getExtension('WEBGL_lose_context')
    if (memoryInfo) {
      return 'high'
    }
    
    return 'medium'
  }

  // Optimisations WebGL
  const webglOptimizations = {
    isSupported: isWebGLSupported(),
    performance: getDevicePerformance(),
    shouldDisableOnMobile: true,
    shouldDisableOnLowPerformance: true,
    
    // Configuration basée sur les performances
    getConfig() {
      const config = {
        antialias: false,
        powerPreference: 'default',
        precision: 'mediump',
        maxSamples: 0
      }
      
      if (this.performance === 'high') {
        config.antialias = true
        config.powerPreference = 'high-performance'
        config.precision = 'highp'
        config.maxSamples = 4
      } else if (this.performance === 'medium') {
        config.antialias = false
        config.powerPreference = 'default'
        config.precision = 'mediump'
        config.maxSamples = 0
      } else {
        config.antialias = false
        config.powerPreference = 'low-power'
        config.precision = 'lowp'
        config.maxSamples = 0
      }
      
      return config
    },
    
    // Vérifier si WebGL doit être désactivé
    shouldDisable() {
      if (!this.isSupported) return true
      if (this.shouldDisableOnMobile && window.innerWidth < 768) return true
      if (this.shouldDisableOnLowPerformance && this.performance === 'low') return true
      return false
    }
  }

  // Injecter dans le contexte Vue
  inject('webglOptimizations', webglOptimizations)
}
