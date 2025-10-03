export default function ({ app }, inject) {
  // Générer le structured data pour l'organisation
  const generateOrganizationSchema = () => {
    return {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Adidas Arena",
      "alternateName": "Adidas Arena Paris",
      "url": "https://www.adidasarena.com",
      "logo": "https://www.adidasarena.com/logo.png",
      "description": "Adidas Arena - La nouvelle arène parisienne pour le sport et les spectacles",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "8 Boulevard de Bercy",
        "addressLocality": "Paris",
        "postalCode": "75012",
        "addressCountry": "FR"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "48.8367",
        "longitude": "2.3756"
      },
      "telephone": "+33 1 40 02 60 60",
      "sameAs": [
        "https://www.facebook.com/adidasarena",
        "https://www.instagram.com/adidasarena",
        "https://twitter.com/adidasarena"
      ]
    }
  }

  // Générer le structured data pour un événement
  const generateEventSchema = (event) => {
    if (!event) return null
    
    return {
      "@context": "https://schema.org",
      "@type": "Event",
      "name": event.title || event.name,
      "description": event.description,
      "startDate": event.startDate,
      "endDate": event.endDate,
      "location": {
        "@type": "Place",
        "name": "Adidas Arena",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "8 Boulevard de Bercy",
          "addressLocality": "Paris",
          "postalCode": "75012",
          "addressCountry": "FR"
        }
      },
      "organizer": {
        "@type": "Organization",
        "name": "Adidas Arena"
      },
      "offers": event.offers ? {
        "@type": "Offer",
        "price": event.offers.price,
        "priceCurrency": "EUR",
        "availability": "https://schema.org/InStock",
        "url": event.offers.url
      } : undefined,
      "image": event.image
    }
  }

  // Générer le structured data pour le site web
  const generateWebSiteSchema = () => {
    return {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Adidas Arena",
      "url": "https://www.adidasarena.com",
      "description": "Site officiel de l'Adidas Arena - Programmation, événements et informations pratiques",
      "publisher": {
        "@type": "Organization",
        "name": "Adidas Arena"
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://www.adidasarena.com/programmation?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
  }

  // Injecter le structured data dans le head
  const injectStructuredData = (schema) => {
    if (process.client) {
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.textContent = JSON.stringify(schema)
      document.head.appendChild(script)
    }
  }

  // API publique
  const structuredData = {
    generateOrganizationSchema,
    generateEventSchema,
    generateWebSiteSchema,
    injectStructuredData
  }

  // Injecter dans le contexte Vue
  inject('structuredData', structuredData)
}
