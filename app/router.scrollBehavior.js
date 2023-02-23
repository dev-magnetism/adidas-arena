export default function (to, from, savedPosition) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ x: 0, y: 0 })
    }, 1250)
  })
}
