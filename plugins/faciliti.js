/**
 * Plugin Facil'iti Smart - Accessibilité web
 * Charge le script FACIL'iti et détecte si un adblock l'a bloqué.
 * Le bouton ne doit pas s'afficher si le script externe est bloqué.
 * @see https://facil-iti.atlassian.net/wiki/spaces/FTF/pages/1630863362
 */
const FACILITI_APPLICATION_ID = '019a9c9e-5b1f-7ffa-9d03-1575c753d4ae'
const FACILITI_SCRIPT_URL = 'https://cdn.facil-iti.app/tags/faciliti-tag.min.js'

export default function ({ store }, inject) {
  const faciliti = {
    init() {
      if (typeof document === 'undefined' || typeof window === 'undefined') return

      const script = document.createElement('script')
      script.setAttribute('src', FACILITI_SCRIPT_URL)
      script.dataset.applicationIdentifier = FACILITI_APPLICATION_ID

      let checkAttempts = 0
      const maxAttempts = 20 // 2 secondes max

      script.onload = () => {
        const checkFaciliti = () => {
          if (typeof window.FACIL_ITI !== 'undefined') {
            store.commit('setFacilitiAvailable', true)
          } else if (checkAttempts < maxAttempts) {
            checkAttempts++
            setTimeout(checkFaciliti, 100)
          }
        }
        setTimeout(checkFaciliti, 50)
      }

      script.onerror = () => {
        // Script bloqué par adblock ou autre - ne pas afficher le bouton
        store.commit('setFacilitiAvailable', false)
      }

      document.head.appendChild(script)
    },
  }

  inject('faciliti', faciliti)

  if (process.client) {
    faciliti.init()
  }
}
