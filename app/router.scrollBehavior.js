export default function (to, from, savedPosition) {
  //   return { x: 0, y: 0 }
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ x: 0, y: 0 })
    }, 1250)
  })
}
