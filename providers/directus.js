import { joinURL } from 'ufo'
import { createOperationsGenerator } from '~image'

const operationsGenerator = createOperationsGenerator({
  keyMap: {
    quality: 'quality',
    format: 'format',
  },
  valueMap: {},
  joinWith: '&',
  formatter: (key, value) => `${key}=${value}`,
})

export function getImage(
  src,
  { modifiers, baseURL } = {},
  { options, nuxtContext, $img }
) {
  //   const { width, height, format, fit, ...providerModifiers } = modifiers
  const operations = operationsGenerator(modifiers)

  const finalBaseURL = `${baseURL}assets/`

  const url = joinURL(finalBaseURL, src + (operations ? '?' + operations : ''))
  console.log(url, operations)

  return {
    url,
  }
}
