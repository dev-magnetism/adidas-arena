export default function (to, from, savedPosition) {
  const hasMoisParam = to.name === 'programmation' && to.query?.mois
  const hasRestoreFromEvent =
    to.name === 'programmation' &&
    from?.name === 'programmation-id' &&
    typeof sessionStorage !== 'undefined' &&
    sessionStorage.getItem('programmationListRestore')

  if (hasMoisParam || hasRestoreFromEvent) {
    return false
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ x: 0, y: 0 })
    }, 1250)
  })
}
