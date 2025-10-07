const axios = require('axios')

/**
 * Helper pour décoder les entités HTML
 */
const decodeHTMLEntities = (text) => {
  if (!text) return text
  return text
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec))
}

/**
 * ServerMiddleware Nuxt - API pour le classement de basket
 */
module.exports = async function (req, res, next) {
  const url = req.url

  // Route pour récupérer le classement Betclic ÉLITE
  if (url.startsWith('/paris-basketball/standings/betclic-elite') && req.method === 'GET') {
    try {
      const API_KEY = process.env.ALTRSTAT_API_KEY
      const COMPETITION_ID = process.env.ALTRSTAT_COMPETITION_ID || '287'
      const SEASON = process.env.ALTRSTAT_SEASON || '2025'

      if (!API_KEY) {
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({
          success: false,
          error: 'Configuration manquante: ALTRSTAT_API_KEY'
        }))
        return
      }

      const response = await axios.get(
        `https://apim.altrstat.xyz/lnb/v2/standings/${SEASON}/g`,
        {
          headers: {
            'apiKey': API_KEY,
          },
          timeout: 10000,
        }
      )

      // Filtrer pour ne garder que le classement avec competition.id = COMPETITION_ID
      const filteredData = response.data.find(
        standing => standing.competition?.id === parseInt(COMPETITION_ID)
      )

      if (!filteredData) {
        res.writeHead(404, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({
          success: false,
          error: `Aucun classement trouvé pour competition.id = ${COMPETITION_ID}`
        }))
        return
      }

      // Transformer les données au format attendu par le composant
      const formattedData = {
        id: 'betclic',
        name: filteredData.competition?.long_name || 'Betclic Elite',
        headers: {
          games: {
            lose: 'Défaites',
            percent: '%',
            played: 'MJ',
            win: 'Victoires'
          },
          pos: {
            label: 'Pos.'
          },
          stats: {
            goal_average: 'Goal average',
            neg: '-',
            pos: '+'
          },
          team: {
            label: 'Équipe',
          }
        },
        datas: Object.values(filteredData.standings || {}).map(team => ({
          team: {
            logo: team.logoWhite?.md || team.logoBlack?.md || '',
            name: team.name === 'Paris' ? 'Paris Basketball' : decodeHTMLEntities(team.name || ''),
          },
          pos: {
            value: String(team.rank || ''),
            status: '' // 'inc', 'dec', ou '' - peut être calculé si nécessaire
          },
          games: {
            lose: String(team.game?.loss || '0'),
            percent: team.game?.winPercent ? parseFloat(team.game.winPercent).toFixed(1) : '0.0',
            played: String(team.game?.played || '0'),
            win: String(team.game?.win || '0'),
          },
          stats: {
            goal_average: String(team.point?.goalAverage || '0'),
            neg: String(team.point?.allowed || '0'),
            pos: String(team.point?.scored || '0')
          }
        }))
      }

      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({
        success: true,
        data: formattedData
      }))

    } catch (error) {
      console.error('Erreur API Altrstat:', error.message)

      res.writeHead(error.response?.status || 500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({
        success: false,
        error: error.message,
        details: error.response?.data || null
      }))
    }
    return
  }

  // Route pour récupérer le classement Euroleague
  if (url.startsWith('/paris-basketball/standings/euroleague') && req.method === 'GET') {
    try {
      const EUROLEAGUE_CODE_COMPETITION = process.env.EUROLEAGUE_CODE_COMPETITION || 'E'
      const EUROLEAGUE_CODE_SAISON = process.env.EUROLEAGUE_CODE_SAISON || 'E2025'

      // Étape 1 : Récupérer les rounds de la saison régulière
      const roundsResponse = await axios.get(
        `https://api-live.euroleague.net/v2/competitions/${EUROLEAGUE_CODE_COMPETITION}/seasons/${EUROLEAGUE_CODE_SAISON}/rounds`,
        {
          timeout: 10000,
        }
      )

      // Filtrer pour ne garder que la saison régulière (RS)
      const regularSeasonRounds = roundsResponse.data.data.filter(
        round => round.phaseTypeCode === 'RS'
      )

      if (!regularSeasonRounds || regularSeasonRounds.length === 0) {
        res.writeHead(404, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({
          success: false,
          error: 'Aucun round de saison régulière trouvé'
        }))
        return
      }

      // Trouver le dernier round dont la date de fin (maxGameStartDate) est passée
      const now = new Date()
      let validRounds = regularSeasonRounds.filter(round => {
        const endDate = new Date(round.maxGameStartDate)
        return endDate <= now
      })

      // Si aucun round n'est terminé, prendre tous les rounds
      if (!validRounds || validRounds.length === 0) {
        validRounds = regularSeasonRounds
      }

      // Trier par date de fin décroissante et prendre le premier (le plus récent)
      validRounds.sort((a, b) => {
        const dateA = new Date(a.maxGameStartDate)
        const dateB = new Date(b.maxGameStartDate)
        return dateB - dateA
      })

      const latestRound = validRounds[0].round

      // Étape 2 : Récupérer le classement pour ce round
      const standingsResponse = await axios.get(
        `https://api-live.euroleague.net/v2/competitions/${EUROLEAGUE_CODE_COMPETITION}/seasons/${EUROLEAGUE_CODE_SAISON}/rounds/${latestRound}/standings`,
        {
          timeout: 10000,
        }
      )

      // Extraire les standings (premier groupe = saison régulière)
      const standings = standingsResponse.data[0]?.standings || []

      // Transformer les données au format attendu par le composant
      const formattedData = {
        id: 'euroleague',
        name: 'Euroleague',
        headers: {
          games: {
            lose: 'Défaites',
            percent: '%',
            played: 'MJ',
            win: 'Victoires'
          },
          pos: {
            label: 'Pos.'
          },
          stats: {
            goal_average: 'Goal average',
            neg: '-',
            pos: '+'
          },
          team: {
            label: 'Équipe',
          }
        },
        datas: standings.map(team => ({
          team: {
            logo: team.club?.images?.crest || '',
            name: decodeHTMLEntities(team.club?.name || ''),
          },
          pos: {
            value: String(team.data?.position || ''),
            status: '' // 'inc', 'dec', ou ''
          },
          games: {
            lose: String(team.data?.gamesLost || '0'),
            percent: team.data?.gamesPlayed > 0 ? String(((team.data.gamesWon / team.data.gamesPlayed) * 100).toFixed(1)) : '0',
            played: String(team.data?.gamesPlayed || '0'),
            win: String(team.data?.gamesWon || '0'),
          },
          stats: {
            goal_average: String((team.data?.pointsFavour || 0) - (team.data?.pointsAgainst || 0)),
            neg: String(team.data?.pointsAgainst || '0'),
            pos: String(team.data?.pointsFavour || '0')
          }
        }))
      }

      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({
        success: true,
        data: formattedData
      }))

    } catch (error) {
      console.error('Erreur API Euroleague:', error.message)

      res.writeHead(error.response?.status || 500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({
        success: false,
        error: error.message,
        details: error.response?.data || null
      }))
    }
    return
  }

  // Route pour récupérer l'effectif Paris Basketball
  if (url.startsWith('/paris-basketball/effectif') && req.method === 'GET') {
    try {
      const response = await axios.get(
        'https://parisbasketball.com/arena-effectif.json',
        {
          timeout: 10000,
        }
      )

      // Extraire les joueurs (l'API retourne un objet avec l'ID de l'équipe)
      const teamData = Object.values(response.data)[0]
      const playersData = teamData?.players || {}

      // Mapping des postes
      const positionMap = {
        '1': 'Meneur',
        '2': 'Arrière',
        '3': 'Ailier',
        '4': 'Ailier Fort',
        '5': 'Pivot'
      }

      // Transformer et trier les joueurs par numéro croissant
      const players = Object.entries(playersData).map(([id, player]) => {
        // Générer le slug pour l'URL : "Amath M'Baye" → "amath-mbaye"
        const slug = player.full_name
          ? player.full_name
              .toLowerCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036F]/g, '') // Retirer les accents
              .replace(/['\s]+/g, '-') // Remplacer apostrophes et espaces par des tirets
              .replace(/[^a-z0-9-]/g, '') // Retirer tous les caractères spéciaux sauf tirets
          : ''

        return {
          id,
          name: decodeHTMLEntities(player.full_name || ''),
          position: positionMap[player.position] || player.position,
          number: player.number || '',
          picture: player.portrait || '',
          url: `https://parisbasketball.com/player/${slug}/`
        }
      })

      const sortedPlayers = players.sort((a, b) => {
        const numA = parseInt(a.number) || 0
        const numB = parseInt(b.number) || 0
        return numA - numB
      })

      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({
        success: true,
        data: sortedPlayers
      }))

    } catch (error) {
      console.error('Erreur API Effectif:', error.message)

      res.writeHead(error.response?.status || 500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({
        success: false,
        error: error.message,
        details: error.response?.data || null
      }))
    }
    return
  }

  // Si aucune route ne correspond, passer au middleware suivant
  next()
}

