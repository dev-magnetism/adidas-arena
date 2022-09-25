/* eslint-disable */

import { resolve } from 'path'
// const { resolve } = require('path')

function directusModule(moduleOptions) {
  const options = moduleOptions || {}

  this.addPlugin({
    src: resolve(__dirname, 'plugin.js'),
    fileName: 'directus-plugin.js',
    options,
  })
}

module.exports = directusModule
