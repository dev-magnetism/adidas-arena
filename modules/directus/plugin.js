/* eslint-disable */
import { Directus } from '@directus/sdk'

const directusPlugin = async (context, inject) => {
  const { url, auth } = <%= JSON.stringify(options, null, 2) %>

  const directus = new Directus(url)

  inject('directus', directus)
}

export default directusPlugin
