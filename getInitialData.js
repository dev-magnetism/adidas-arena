import { Directus } from '@directus/sdk'

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

export const getInitialData = async () => {
  const axios = require('axios')
  const $directus = new Directus('https://adidasarena.directus.app'); // Remplacez par votre URL Directus
  const cachedData = {}

  const fetchWithLogs = async (name, fetchFunction) => {
    console.log(`Fetching ${name}...`)
    try {
      const result = await fetchFunction()
      console.log(`Fetching ${name} OK`)
      return result
    } catch (error) {
      console.error(`Error fetching ${name}:`, error)
    }
  }

  cachedData.partners = await fetchWithLogs('Partners', () =>
    $directus.items('Partners').readByQuery({ limit: -1 })
  )

  cachedData.app = await fetchWithLogs('App', () =>
    $directus.items('App').readByQuery({ limit: -1 })
  );

  cachedData.menu = await fetchWithLogs('Menu', () =>
    $directus.items('Menu').readByQuery({ limit: -1 })
  );

  cachedData.interiorFloors = await fetchWithLogs('Interior_Floors', () =>
    $directus.items('Interior_Floors').readByQuery({ limit: -1 })
  );

  cachedData.programmations = await fetchWithLogs('Programmations', () =>
    $directus.items('Programmations').readByQuery({
      limit: -1,
      fields: ['*', 'offer.*'],
    })
  );

  cachedData.programmationOffers = await fetchWithLogs('Programmation_Offer', () =>
    $directus.items('Programmation_Offer').readByQuery({
      limit: -1,
      fields: ['*'],
    })
  );

  cachedData.actualites = await fetchWithLogs('Actualites', () =>
    $directus.items('Actualites').readByQuery({
      limit: -1,
      fields: [
        '*',
        'cover.*',
        'body.*',
        'items.*',
        'body.item.*',
        'body.item.picture.*',
        'body.item.items.*',
        'body.item.items.item.*',
        'body.item.items.item.picture.*',
      ],
    })
  );

  // SORT ACTUALITES BY DATE DESC
  cachedData.actualites.data = cachedData.actualites.data.sort(function (a, b) {
    return new Date(b.date) - new Date(a.date)
  })

  cachedData.actualites.data.forEach((actu) => {
    const _slug = removeSpecialChar(actu.title)
    //  console.log('actualites slug ', convertToKebabCase(_slug));
    actu.slug = convertToKebabCase(_slug)
  })

  cachedData.business = await fetchWithLogs('Business_Page', () =>
    $directus.items('Business_Page').readByQuery({
      limit: -1,
      fields: ['*'],
    })
  );

  cachedData.businessCat = await fetchWithLogs('BusinessCat', () =>
    $directus.items('BusinessCat').readByQuery({
      limit: -1,
      fields: ['*'],
    })
  );

  cachedData.businessOpt = await fetchWithLogs('BusinessOptions', () =>
    $directus.items('BusinessOptions').readByQuery({
      limit: -1,
      fields: ['*'],
    })
  );

  cachedData.businessArt = await fetchWithLogs('BusinessArt', () =>
    $directus.items('BusinessArt').readByQuery({
      limit: -1,
      fields: ['*'],
    })
  );


  cachedData.businessArtOptions = await fetchWithLogs('BusinessArt_BusinessOptions_1', () =>
    $directus.items('BusinessArt_BusinessOptions_1').readByQuery({
      limit: -1,
      fields: ['*'],
    })
  );

  cachedData.businessCat.data = cachedData.businessCat.data.map((_cat)=>{
    const _articles = cachedData.businessArt.data.filter(_art=>_art.Category === _cat.id);
    _cat.numArt = _articles.length;
    return _cat
  })


  cachedData.businessArt.data = cachedData.businessArt.data.map((_art)=>{
    _art.Options = _art.Options.map((_opt)=>{
      return cachedData.businessArtOptions.data.find(_artopt=>_artopt.id === _opt).BusinessOptions_id;
    })

    return _art
  })

  cachedData.chapelle = await fetchWithLogs('CentralChapelle_Page', () =>
    $directus.items('CentralChapelle_Page').readByQuery({
      limit: -1,
      fields: ['*'],
    })
  );

  cachedData.chapellefood = await fetchWithLogs('CentralChapelle_Food', () =>
    $directus.items('CentralChapelle_Food').readByQuery({
      limit: -1,
      fields: ['*'],
    })
  );

  const CENTRALCHAPELLE_SHOTGUN_ORGANIZER_ID =
    process.env.CENTRALCHAPELLE_SHOTGUN_ORGANIZER_ID
  const CENTRALCHAPELLE_SHOTGUN_TOKEN =
    process.env.CENTRALCHAPELLE_SHOTGUN_TOKEN
  cachedData.chapelleEvents = []

  if (
    CENTRALCHAPELLE_SHOTGUN_ORGANIZER_ID &&
    CENTRALCHAPELLE_SHOTGUN_TOKEN
  ) {
    const shotgunUrl = `https://smartboard-api.shotgun.live/api/shotgun/organizers/${CENTRALCHAPELLE_SHOTGUN_ORGANIZER_ID}/events?key=${encodeURIComponent(
      CENTRALCHAPELLE_SHOTGUN_TOKEN
    )}`

    const shotgunEvents = await fetchWithLogs('Shotgun Events', () =>
      axios.get(shotgunUrl, {
        timeout: 10000,
      })
    )

    cachedData.chapelleEvents = shotgunEvents?.data?.data || []
  } else {
    console.log(
      'CENTRALCHAPELLE_SHOTGUN_ORGANIZER_ID/CENTRALCHAPELLE_SHOTGUN_TOKEN not configured, skipping Shotgun events'
    )
  }

  cachedData.pbbPage = await fetchWithLogs('Parisbasketball_page', () =>
    $directus.items('Parisbasketball_page').readByQuery({
      limit: -1,
      fields: ['*'],
    })
  );

  cachedData.pbbEntertainment = await fetchWithLogs('Parisbasketball_entertainment', () =>
    $directus.items('Parisbasketball_entertainment').readByQuery({
      limit: -1,
      fields: ['*'],
    })
  );

  cachedData.pbbGallery = await fetchWithLogs('Parisbasketball_gallery', () =>
    $directus.items('Parisbasketball_gallery').readByQuery({
      limit: -1,
      fields: ['*'],
    })
  );

  cachedData.pbbMcs = await fetchWithLogs('Parisbasketball_mcs', () =>
    $directus.items('Parisbasketball_mcs').readByQuery({
      limit: -1,
      fields: ['*'],
    })
  );

  cachedData.programmationsEvent = await fetchWithLogs('Programmation_Event', () =>
    $directus.items('Programmation_Event').readByQuery({ limit: -1 })
  );

  cachedData.actualitesArticle = await fetchWithLogs('Actualites_article', () =>
    $directus.items('Actualites_article').readByQuery({ limit: -1 })
  );




  console.log('Building events data with SVC API...')
  const resp = await axios.get(
    `https://www.accorarena.com/api-svc/partners/adidas-arena/events?limit=1&page=1`
  )

  // PROD     : `https://www.accorarena.com/api-svc/partners/adidas-arena/events?limit=1&page=1`
  // PREPROD  : `https://www.accorarena-onepointpprod.com/api-svc/partners/adidas-arena/events?limit=1&page=1`

  const limit = 50

  const lengthPages = Math.ceil(resp.data.meta.total_count / limit)

  const programmes = []

  const pages = Array(lengthPages)
    .fill(0)
    .map((_, index) => index + 1)

  for (const index of pages) {
    // 1 / Récupération de la liste complète des Events via accorarena

    const payload = await axios.get(
      `https://www.accorarena.com/api-svc/partners/adidas-arena/events?limit=${limit}&page=${index}`
    )

    // PROD     : `https://www.accorarena.com/api-svc/partners/adidas-arena/events?limit=${limit}&page=${index}`
    // PREPROD  : `https://www.accorarena-onepointpprod.com/api-svc/partners/adidas-arena/events?limit=${limit}&page=${index}`

    // 2 / Récupération des données Programmations via Directus (réutilisation de la variable programmations plus haut)
    const initialContents = payload.data.data



    const progDirectContents = cachedData.programmations.data

    const progOffersDirectContents = cachedData.programmationOffers.data

    const contents = initialContents.filter((el) => {
      const res = progDirectContents.find((el2) => parseInt(el2.id_event) === parseInt(el.id))
      return res
    })

    // 3 / Récupération des données complètes par Event
    for (let i = 0; i < contents.length; i++) {
      // Récupération du flux par event pour la clé 'instruction_id' qui n'est pas complète dans le flux global
      const payloadEvent = await axios.get(
        `https://www.accorarena.com/api-svc/partners/adidas-arena/event/${contents[i].id}`
      )

      // PROD     : `https://www.accorarena.com/api-svc/partners/adidas-arena/event/${contents[i].id}`
      // PREPROD  : `https://www.accorarena-onepointpprod.com/api-svc/partners/adidas-arena/event/${contents[i].id}`


      // Complétion des données 1 avec données 2 et 3

      const contentEvent = payloadEvent.data

      const progDirectContent = progDirectContents.find(
        (cont) => parseInt(cont.id_event) === parseInt(contents[i].id)
      )

      if (!progDirectContent) {
        console.log(`WARNING: Event ${contents[i].id} does not exist.`)
      }

      // Make sure dates are sorted properly
      contents[i].sessions.sort((a, b) => new Date(a.date) - new Date(b.date))

      //  console.log('progDirectContent offers', progDirectContent.offers)

      contents[i].is_draft = progDirectContent?.is_draft
      contents[i].date_tbc = progDirectContent?.date_tbc
      contents[i].main_event = progDirectContent?.main_event
      contents[i].inside_slider = progDirectContent?.inside_slider

      contents[i].instruction_id = contentEvent.instruction_id
        ? contentEvent.instruction_id
        : []

      contents[i].spotify_link = progDirectContent?.spotify_link
      contents[i].cover_video = progDirectContent?.cover_video

      contents[i].vertical_video = progDirectContent?.vertical_video

      contents[i].ticketing_main_url = progDirectContent?.ticketing_main_url

      if (progDirectContent?.custom_status) {
        contents[i].status_code = progDirectContent?.custom_status
      }

      if (progDirectContent?.custom_ticketing_opening_date) {
        const dt = new Date(progDirectContent?.custom_ticketing_opening_date);
        const formatted = dt.toISOString().slice(0,19).replace("T", " ");
        contents[i].opening = formatted
      }

      // REPORTED USE CASE TEST
      // if(i % 2 !== 0) {
      //   contents[i].reported = true;
      //   let _count = 8;
      //   contents[i].sessions.map((_sess, _sessI)=>{

      //     _sess.reported = true; // (_sessI % 2 !== 0)
      //     //  _sess.initial_date = "2024-06-08 20:00:00";

      //     if(_sessI % 2 === 0) {
      //       _sess.report_date_announcement = `2025-11-0${_count} 20:00:00`;
      //       _sess.waiting_new_date = false;
      //       _count = _count + 1;
      //     } else {
      //       _sess.waiting_new_date = true;
      //     }

      //     return _sess;
      //   })

      //   _testInd = _testInd +1;
      // }

      contents[i].timetable_title = (progDirectContent.timetable_title)?progDirectContent.timetable_title:cachedData.programmationsEvent.data.timetable_title;
      contents[i].timetable_list = (progDirectContent.timetable_list)?progDirectContent.timetable_list:[];
      contents[i].additional_informations_list = (progDirectContent.additional_informations_list)?progDirectContent.additional_informations_list:[];

      contents[i].ticketing_std_title = (progDirectContent?.ticketing_std_title)?progDirectContent.ticketing_std_title:cachedData.programmationsEvent.data.ticketing_std_title
      contents[i].ticketing_std_description = (progDirectContent?.ticketing_std_description)?progDirectContent.ticketing_std_description:cachedData.programmationsEvent.data.ticketing_std_description
      contents[i].ticketing_prem_title = (progDirectContent?.ticketing_prem_title)?progDirectContent.ticketing_prem_title:cachedData.programmationsEvent.data.ticketing_prem_title
      contents[i].ticketing_prem_description = (progDirectContent?.ticketing_prem_description)?progDirectContent.ticketing_prem_description:cachedData.programmationsEvent.data.ticketing_prem_description
      contents[i].ticketing_date_unknown = progDirectContent?.ticketing_date_unknown

      const progOffers = progDirectContent?.offer.map((_item)=>{
        return progOffersDirectContents.find(_offer => _offer.id === _item.Programmation_Offer_id)
      });

      const defaultOffers = progOffersDirectContents.filter((offer) => offer.isDefault)
      contents[i].offers = [...new Set([...defaultOffers, ...progOffers])]

      contents[i].content = contents[i].translations.find(
        (translation) => translation.language === 'fr'
      )

      contents[i].content.category = contents[i].content.category
        ? contents[i].content.category.toLowerCase()
        : 'no cat'

      contents[i].sessions.forEach((session) => {
        session.content = session.translations.find(
          (translation) => translation.language === 'fr'
        )
      })

      contents[i].instruction_id.forEach((instruction) => {
        instruction.content = instruction.translations.find(
          (translation) => translation.language === 'fr'
        )
      })

    }

    // Copie de l'array "contents" dans la variable "test".
    let finalContents = contents

    // Si l'environnement est en mode "production", filtrer les éléments non brouillons.
    if (process.env.SITE_ENV === 'production') {
      finalContents = contents.filter((content) => !content.is_draft)
    }

    //  console.log('EVENTS length ', contents.length);

    // Ajout de tous les éléments de "test" à "programmes".
    programmes.push(...finalContents)
  }

  cachedData.programmes = programmes
  console.log('Building events data with SVC API OK')

  // Récupération des données Paris Basketball
  console.log('Fetching Paris Basketball data...')

  // Helper pour décoder les entités HTML
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

  // Classement Betclic ÉLITE
  cachedData.classementBetclic = null
  try {
    const API_KEY = process.env.ALTRSTAT_API_KEY
    const COMPETITION_ID = process.env.ALTRSTAT_COMPETITION_ID || '287'
    const SEASON = process.env.ALTRSTAT_SEASON || '2025'

    if (API_KEY) {
      const response = await axios.get(
        `https://apim.altrstat.xyz/lnb/v2/standings/${SEASON}/g`,
        {
          headers: {
            'apiKey': API_KEY,
          },
          timeout: 10000,
        }
      )

      const filteredData = response.data.find(
        standing => standing.competition?.id === parseInt(COMPETITION_ID)
      )

      if (filteredData) {
        cachedData.classementBetclic = {
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
              status: ''
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
        console.log('Fetching Paris Basketball Betclic standings OK')
      }
    } else {
      console.log('ALTRSTAT_API_KEY not configured, skipping Betclic standings')
    }
  } catch (error) {
    console.error('Error fetching Paris Basketball Betclic standings:', error.message)
  }

  // Classement Euroleague
  cachedData.classementEuroleague = null
  try {
    const EUROLEAGUE_CODE_COMPETITION = process.env.EUROLEAGUE_CODE_COMPETITION || 'E'
    const EUROLEAGUE_CODE_SAISON = process.env.EUROLEAGUE_CODE_SAISON || 'E2025'

    const roundsResponse = await axios.get(
      `https://api-live.euroleague.net/v2/competitions/${EUROLEAGUE_CODE_COMPETITION}/seasons/${EUROLEAGUE_CODE_SAISON}/rounds`,
      {
        timeout: 10000,
      }
    )

    const regularSeasonRounds = roundsResponse.data.data.filter(
      round => round.phaseTypeCode === 'RS'
    )

    if (regularSeasonRounds && regularSeasonRounds.length > 0) {
      const now = new Date()
      let validRounds = regularSeasonRounds.filter(round => {
        const endDate = new Date(round.maxGameStartDate)
        return endDate <= now
      })

      if (!validRounds || validRounds.length === 0) {
        validRounds = regularSeasonRounds
      }

      validRounds.sort((a, b) => {
        const dateA = new Date(a.maxGameStartDate)
        const dateB = new Date(b.maxGameStartDate)
        return dateB - dateA
      })

      const latestRound = validRounds[0].round

      const standingsResponse = await axios.get(
        `https://api-live.euroleague.net/v2/competitions/${EUROLEAGUE_CODE_COMPETITION}/seasons/${EUROLEAGUE_CODE_SAISON}/rounds/${latestRound}/standings`,
        {
          timeout: 10000,
        }
      )

      const standings = standingsResponse.data[0]?.standings || []

      cachedData.classementEuroleague = {
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
            status: ''
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
      console.log('Fetching Paris Basketball Euroleague standings OK')
    }
  } catch (error) {
    console.error('Error fetching Paris Basketball Euroleague standings:', error.message)
  }

  // Effectif Paris Basketball
  cachedData.effectifParis = null
  try {
    const response = await axios.get(
      'https://parisbasketball.com/arena-effectif.json',
      {
        timeout: 10000,
      }
    )

    const teamData = Object.values(response.data)[0]
    const playersData = teamData?.players || {}

    const positionMap = {
      '1': 'Meneur',
      '2': 'Arrière',
      '3': 'Ailier',
      '4': 'Ailier Fort',
      '5': 'Pivot'
    }

    const players = Object.entries(playersData).map(([id, player]) => {
      const slug = player.full_name
        ? player.full_name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036F]/g, '')
            .replace(/['\s]+/g, '-')
            .replace(/[^a-z0-9-]/g, '')
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

    cachedData.effectifParis = players.sort((a, b) => {
      const numA = parseInt(a.number) || 0
      const numB = parseInt(b.number) || 0
      return numA - numB
    })

    console.log('Fetching Paris Basketball effectif OK')
  } catch (error) {
    console.error('Error fetching Paris Basketball effectif:', error.message)
  }

  cachedData.concoursDatas = [
    { name: 'REMY' },
    { name: 'RICHARD' },
    { name: 'VICTOR' },
    { name: 'MINIER' },
    { name: 'MOHAMED' },
    { name: 'XAVIER' },
    { name: 'NAOMI' },
    { name: 'MAUD' },
    { name: 'NAJMA' },
    { name: 'SARAH' },
    { name: 'UGO' },
    { name: 'MELODY' },
    { name: 'MOUADH' },
    { name: 'YASSINE' },
    { name: 'VICTORINE' },
    { name: 'RENZO' },
    { name: 'NICOLAS' },
    { name: 'MAX' },
    { name: 'STEPHANIE' },
    { name: 'NOAH' },
    { name: 'VICTORIA' },
    { name: 'REJENA' },
    { name: 'SIRINE' },
    { name: 'MERLIN' },
    { name: 'MOUNIA' },
    { name: 'STEPHAN' },
    { name: 'NITAN' },
    { name: 'MAXIME' },
    { name: 'REMI' },
    { name: 'URIEL' },
    { name: 'TANYA' },
    { name: 'SADIO' },
    { name: 'VINCENT' },
    { name: 'VALERIE' },
    { name: 'STEPHANE' },
    { name: 'MURIEL' },
    { name: 'SANTIAGO' },
    { name: 'MYRIEM' },
    { name: 'ROMEO' },
    { name: 'MYLAN' },
    { name: 'OUMOU' },
    { name: 'PATRICK' },
    { name: 'YVAN' },
    { name: 'ROBIN' },
    { name: 'MAYA' },
    { name: 'PIERRELOUIS' },
    { name: 'NADIA' },
    { name: 'RAKIB' },
    { name: 'VLADIMIR' },
    { name: 'SIMON' },
    { name: 'OMAR' },
    { name: 'MICHELLE' },
    { name: 'RACHEL' },
    { name: 'OUARDI' },
    { name: 'THOMAS' },
    { name: 'RENE' },
    { name: 'PRISCA' },
    { name: 'VALENTIN' },
    { name: 'THEO' },
    { name: 'SALE' },
    { name: 'SYLVER' },
    { name: 'THAO' },
    { name: 'PAPE' },
    { name: 'NOE' },
    { name: 'YVES' },
    { name: 'NESRINE' },
    { name: 'TAO' },
    { name: 'THIERRY' },
    { name: 'SALIM' },
    { name: 'YOUNESSE' },
    { name: 'NICKO' },
    { name: 'RADE' },
    { name: 'QUENTIN' },
    { name: 'NAYA' },
    { name: 'YANN' },
    { name: 'TRISTAN' },
    { name: 'SYLVAIN' },
    { name: 'SARATA' },
    { name: 'TATIANA' },
    { name: 'RAJAA' },
    { name: 'ROMAIN' },
    { name: 'RAHIM' },
    { name: 'PASCAL' },
    { name: 'REGIS' },
    { name: 'NINON' },
    { name: 'STACY' },
    { name: 'SOFIA' },
    { name: 'TOM' },
    { name: 'MIEL' },
    { name: 'SAINI' },
    { name: 'SIEMOUSTAPHA' },
    { name: 'NATHAN' },
    { name: 'ROSYMAE' },
    { name: 'NOURDINE' },
    { name: 'VANESSA' },
    { name: 'PAUL' },
    { name: 'SALAH' },
    { name: 'MERYAM' },
    { name: 'MOUSSA' },
    { name: 'MICKAEL' },
    { name: 'WILLIAM' },
    { name: 'NOUREDDINE' },
    { name: 'YOGASHA' },
    { name: 'OCEANE' },
    { name: 'PAPESAN' },
    { name: 'NASSIM' },
    { name: 'PAULINE' },
    { name: 'SAMIRA' },
    { name: 'NAJOUA' },
    { name: 'REDHA' },
    { name: 'SAID' },
    { name: 'NATHALIE' },
    { name: 'YACINE' },
    { name: 'PAULIN' },
    { name: 'POL ELIOTT' },
    { name: 'STEFAN' },
    { name: 'WENDY' },
    { name: 'REBEKKA' },
    { name: 'POLYXENI' },
    { name: 'ROUDAYNA' },
    { name: 'SOFIANE' },
    { name: 'NINE' },
    { name: 'TIMOTE ALOYS' },
    { name: 'MICHEL' },
    { name: 'SEBASTIEN' },
    { name: 'SAIDYASSER' },
    { name: 'ROMANE' },
    { name: 'TONY' },
    { name: 'OLIVIER' },
    { name: 'MELANIE' },
    { name: 'YOANN' },
    { name: 'MEHDI' },
    { name: 'SOPHIE' },
    { name: 'PHILIPPINE' },
    { name: 'SOULEYMANE' },
    { name: 'THEOTIME' },
    { name: 'MATTHIAS' },
    { name: 'SANDRA' },
    { name: 'OSMAN' },
    { name: 'RITA' },
    { name: 'MOHAND' },
    { name: 'MAXIMILIEN' },
    { name: 'NORA' },
    { name: 'NOLAN' },
    { name: 'ZAKARYE' },
    { name: 'MELISSANDRE' },
    { name: 'MICHAEL' },
    { name: 'RAPH' },
    { name: 'SONIA' },
    { name: 'MATTEO' },
    { name: 'TESS' },
    { name: 'YANNICK' },
    { name: 'SCHERRER' },
    { name: 'NINO' },
    { name: 'SABRINA' },
    { name: 'MAGUI' },
    { name: 'ESTELLE' },
    { name: 'IDRISS' },
    { name: 'FLORENT' },
    { name: 'ELODIE' },
    { name: 'ELIZABETH' },
    { name: 'MAMADOU' },
    { name: 'JULIAN' },
    { name: 'JOSEPHINE' },
    { name: 'BELMO' },
    { name: 'CLAIRE' },
    { name: 'CHARLES ERIC' },
    { name: 'LENAIC' },
    { name: 'ANTHONY' },
    { name: 'BENOIT' },
    { name: 'DENIZ' },
    { name: 'SALEM' },
    { name: 'FABIENNE' },
    { name: 'EZECHIEL' },
    { name: 'THIBAULT' },
    { name: 'AYOUB' },
    { name: 'ANGELO' },
    { name: 'GERALD' },
    { name: 'ANTOINE' },
    { name: 'LILIAN' },
    { name: 'LOUISON' },
    { name: 'ERIC' },
    { name: 'MANAR' },
    { name: 'ALIENOR' },
    { name: 'MARIETOU' },
    { name: 'HANOI' },
    { name: 'AYA' },
    { name: 'ALEXIA' },
    { name: 'ALBINA' },
    { name: 'ARNAUD' },
    { name: 'JEREMIE' },
    { name: 'LOUIS' },
    { name: 'JANELLE' },
    { name: 'LEX' },
    { name: 'AMINE' },
    { name: 'JULES' },
    { name: 'DJAFAR' },
    { name: 'DORKAS' },
    { name: 'LILA' },
    { name: 'LEA' },
    { name: 'DIOUARE' },
    { name: 'PIERRE' },
    { name: 'CHAYMA' },
    { name: 'MARION' },
    { name: 'FEDERICO' },
    { name: 'JOFFREY' },
    { name: 'IKE' },
    { name: 'JEFF' },
    { name: 'ELLISON' },
    { name: 'JADA' },
    { name: 'DAVY' },
    { name: 'ASTRID' },
    { name: 'JEAN BAPTISTE' },
    { name: 'INES' },
    { name: 'FAYCAL' },
    { name: 'GUYFREED' },
    { name: 'GONZALO' },
    { name: 'HONORINE' },
    { name: 'FRANCK' },
    { name: 'MATHIEU' },
    { name: 'KATIA' },
    { name: 'LONA' },
    { name: 'HASSAN' },
    { name: 'MARIE' },
    { name: 'FABRICE' },
    { name: 'ANTONELLA' },
    { name: 'GABRIEL' },
    { name: 'ENZO' },
    { name: 'HANI' },
    { name: 'EMILIE' },
    { name: 'CANDYS' },
    { name: 'AURORE' },
    { name: 'MAREME' },
    { name: 'LAURIANNE' },
    { name: 'LOU' },
    { name: 'EVA' },
    { name: 'BAPTISE' },
    { name: 'ETIENNE' },
    { name: 'ALEXIS' },
    { name: 'CHRISTOPHE' },
    { name: 'ASSANE' },
    { name: 'JEAN PIERRE' },
    { name: 'MANEL' },
    { name: 'ADAMA' },
    { name: 'LEE' },
    { name: 'FLORIAN' },
    { name: 'MARGAUX' },
    { name: 'ARTHUR' },
    { name: 'JEAN LAURENT' },
    { name: 'MATHILDE' },
    { name: 'LILIA' },
    { name: 'HENRI' },
    { name: 'COME' },
    { name: 'MONA' },
    { name: 'DJAMEL' },
    { name: 'ULYSSE' },
    { name: 'JEAN ETIENNE' },
    { name: 'ELISE' },
    { name: 'LENA' },
    { name: 'ALIX' },
    { name: 'MATTHIEU' },
    { name: 'BIXENTE' },
    { name: 'GUY' },
    { name: 'FELIX' },
    { name: 'AMIRA' },
    { name: 'MAEVA' },
    { name: 'ALEX' },
    { name: 'ISABEL' },
    { name: 'HAROLD' },
    { name: 'CAMILLE' },
    { name: 'EBENEZER' },
    { name: 'HELENE' },
    { name: 'LABICHE' },
    { name: 'JONATHAN' },
    { name: 'ETHAN' },
    { name: 'SONJA' },
    { name: 'INTISSAR' },
    { name: 'ESMA' },
    { name: 'LAURA' },
    { name: 'LOUISA' },
    { name: 'CHEICK' },
    { name: 'BRIAN' },
    { name: 'HERLE' },
    { name: 'JILL' },
    { name: 'BEYZAGUL' },
    { name: 'MARIANNE' },
    { name: 'CHARLOTTE' },
    { name: 'GAELLE' },
    { name: 'BRIANA' },
    { name: 'KILIAN' },
    { name: 'FANNY' },
    { name: 'KENOL' },
    { name: 'KILLIAN' },
    { name: 'EXCLAIMERUSER' },
    { name: 'ADAM' },
    { name: 'JOELLE' },
    { name: 'MALLAURIE' },
    { name: 'DANIEL' },
    { name: 'MAXENCE' },
    { name: 'MARC' },
    { name: 'DAMIEN' },
    { name: 'CHRISTOPHER' },
    { name: 'LOUJANE' },
    { name: 'DONOVAN' },
    { name: 'LEIA' },
    { name: 'CYRIL' },
    { name: 'JADE' },
    { name: 'JASON' },
    { name: 'HAFSA' },
    { name: 'ADRIEN' },
    { name: 'LUNA' },
    { name: 'GUL' },
    { name: 'AIDA' },
    { name: 'ASSANATA' },
    { name: 'KAMAL' },
    { name: 'IVAN' },
    { name: 'IOANNA' },
    { name: 'BRUNO' },
    { name: 'CLEMENT' },
    { name: 'SAMUEL' },
    { name: 'CAFE' },
    { name: 'HELSLY' },
    { name: 'DJAHID' },
    { name: 'MANON' },
    { name: 'HUBERT' },
    { name: 'MARIN' },
    { name: 'JULIEN' },
    { name: 'BENJAMIN' },
    { name: 'AURELIE' },
    { name: 'IMAN' },
    { name: 'KYLIANN' },
    { name: 'HAKIM' },
    { name: 'AGATHE' },
    { name: 'MADYANA' },
    { name: 'CHLOE' },
    { name: 'FAUSTINE' },
    { name: 'BICHAR' },
    { name: 'FRANCOIS' },
    { name: 'CHRISTIAN' },
    { name: 'ALICE' },
    { name: 'ALEXANDRE' },
    { name: 'MARINE' },
    { name: 'MARTA' },
    { name: 'FATOU' },
    { name: 'ADAME' },
    { name: 'MADEN' },
    { name: 'BEN' },
    { name: 'CAROLE' },
    { name: 'KEVIN' },
    { name: 'LAETITIA' },
    { name: 'BAPTISTE' },
    { name: 'ALBERTO' },
    { name: 'LEO' },
    { name: 'LUDIVINE' },
    { name: 'HOSSAM' },
    { name: 'LOUISE' },
    { name: 'GUIDO' },
    { name: 'ABDERRAHMANE' },
    { name: 'MARIAM' },
    { name: 'LAURIANE' },
    { name: 'VERONIQUE' },
    { name: 'CHRISSY' },
    { name: 'BERNARD' },
    { name: 'FABRY' },
    { name: 'LUCIE' },
    { name: 'MARIA' },
    { name: 'HERVE' },
    { name: 'GERMAIN' },
    { name: 'QUINCY' },
    { name: 'LOLITA' },
    { name: 'EMMANUEL' },
    { name: 'CECILE' },
    { name: 'JORDAN' },
    { name: 'ALBAN' },
    { name: 'GWENDAL' },
    { name: 'MATHIAS' },
    { name: 'CLEMENTINE' },
    { name: 'MAE' },
    { name: 'FERIEL' },
    { name: 'GREGORY' },
    { name: 'ISSA' },
    { name: 'HEVAL' },
    { name: 'YANIS' },
    { name: 'LOUNA' },
    { name: 'CEDRIC' },
    { name: 'LAURENCE' },
    { name: 'LUCAS' },
    { name: 'LARBI' },
    { name: 'ANTON' },
    { name: 'ANNE' },
    { name: 'JIHAD' },
    { name: 'KEYCI' },
    { name: 'KOLI' },
    { name: 'FRANCOI' },
    { name: 'MARINA' },
    { name: 'AXEL' },
    { name: 'JEAN FRANCOIS' },
    { name: 'ELISABETH' },
    { name: 'LAUREEN' },
    { name: 'MANAUD' },
    { name: 'ANNABELLE' },
    { name: 'FARID' },
    { name: 'LENNY' },
    { name: 'LAURE' },
    { name: 'DELPHINE' },
    { name: 'MARGOT' },
    { name: 'IVO' },
    { name: 'ANICET' },
    { name: 'BASTIEN' },
    { name: 'HUGO' },
    { name: 'CYRILLE' },
    { name: 'THIBAUT' },
    { name: 'JEANNE' },
    { name: 'DJIMY' },
    { name: 'DOMINIQUE' },
    { name: 'KAYSHA' },
    { name: 'AUDREY' },
    { name: 'ANGELINE' },
    { name: 'DAVID' },
    { name: 'FABIO' },
    { name: 'MATHIS' },
    { name: 'ELIOTT' },
    { name: 'LEILA' },
    { name: 'ELSA' },
    { name: 'JEAN DAVID' },
    { name: 'JUVILLE' },
    { name: 'AMELIE' },
    { name: 'JULIE' },
    { name: 'JOSHUA' },
    { name: 'ISABELLE' },
    { name: 'ADRIAN' },
    { name: 'ASSIA' },
    { name: 'MAELYS' },
    { name: 'KOLYA' },
    { name: 'GAUTHIER' },
    { name: 'ELHAM' },
    { name: 'ANGE' },
    { name: 'MARTIN' },
    { name: 'CELINE' },
    { name: 'KADIZA' },
    { name: 'FLORENCE' },
    { name: 'KAMEL' },
    { name: 'JEAN HENRY' },
    { name: 'APPOLINE' },
    { name: 'MARCO' },
    { name: 'LUDOVIC' },
    { name: 'AICHA' },
    { name: 'EMILE LOUIS' },
    { name: 'KHADIJA' },
    { name: 'IKRAM' },
    { name: 'ROBERT' },
    { name: 'LIONEL' },
    { name: 'DOROTHEE' },
    { name: 'GODEFROY' },
    { name: 'CLAUS PETER' },
    { name: 'CAROLINE' },
    { name: 'JASMINE' },
    { name: 'CHARLES' },
    { name: 'MARLON' },
    { name: 'CASTA' },
    { name: 'LYSANDRE' },
    { name: 'CHRISTINA' },
    { name: 'BAUDOIN' },
    { name: 'KADIDIATOU' },
    { name: 'JEREMY' },
    { name: 'JORDAN(1)' },
    { name: 'RACHID' },
    { name: 'FREDERIC' },
    { name: 'GUILLAUME' },
    { name: 'KHEURVY' },
    { name: 'CESAR' },
    { name: 'JULIA' },
    { name: 'AMINA' },
    { name: 'ELIE' },
  ]

  return cachedData
}

export default getInitialData
