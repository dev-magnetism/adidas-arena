import Vue from 'vue'
import SmartLink from '@lihbr/utils-nuxt.smart-link'

// export const isValidHttpUrl = (string) => {
//   let url

//   try {
//     url = new URL(string)
//   } catch (_) {
//     return false
//   }

//   return url.protocol === 'http:' || url.protocol === 'https:'
// }

// Vue.prototype.$utils = { isValidHttpUrl }

Vue.component('SmartLink', SmartLink)
