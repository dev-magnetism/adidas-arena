import { joinURL } from 'ufo'
import { createOperationsGenerator } from '~image'

const operationsGenerator = createOperationsGenerator({
  keyMap: {
    width: 'width',
    height: 'height',
    quality: 'quality',
    format: 'format',
  },
  valueMap: {
    format: {
      jpeg: 'jpg',
    },
  },
  joinWith: '&',
  formatter: (key, value) => `${key}=${value}`,
})

export function getImage(
  src,
  { modifiers = {}, baseURL = {} },
  { options, nuxtContext, $img }
) {
  const operations = operationsGenerator(modifiers)

  const url = `${baseURL}assets/`

  return {
    url: joinURL(url, src + (operations ? '?' + operations : '')),
  }
}
