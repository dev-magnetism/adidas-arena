/* eslint-disable */
import { Directus } from '@directus/sdk'

const directusPlugin = async (context, inject) => {
  const { url, auth } = <%= JSON.stringify(options, null, 2) %>

  const directus = new Directus(url)

  // https://nws6fqcy.directus.app/assets/5c826197-b302-429a-9ab5-a3dbf6862b72

  // if (auth.email && auth.password) {
  //   await directus.auth.login({ email: auth.email, password: auth.password })
  // } else if (auth.token) {
  //   await directus.auth.static(auth.token)
  // }

  inject('directus', directus)
}

export default directusPlugin
