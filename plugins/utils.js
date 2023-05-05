export default ({ app }, inject) => {
  inject('convertToKebabCase', (string) => {
    return string
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/[\s_]+/g, '-')
      .toLowerCase()
  })

  inject('formatDate', (dates, displayTime = false) => {
    if (!Array.isArray(dates)) {
      dates = [dates]
    }

    const dateObjects = dates
      .map((obj) => new Date(typeof obj === 'object' ? obj.date : obj))
      .sort((a, b) => a - b)
    const formattedDates = []
    let index = 0

    while (index < dateObjects.length) {
      const currentDate = dateObjects[index]
      const startDay = currentDate.getDate()

      while (
        index < dateObjects.length - 1 &&
        (dateObjects[index + 1] - dateObjects[index]) /
          (1000 * 60 * 60 * 24) ===
          1
      ) {
        index++
      }

      const endDay = dateObjects[index].getDate()

      if (startDay === endDay) {
        formattedDates.push(`${startDay}`)
      } else if (endDay - startDay === 1) {
        formattedDates.push(`${startDay} & ${endDay}`)
      } else {
        formattedDates.push(`${startDay} au ${endDay}`)
      }

      index++
    }

    const lastDate = dateObjects[dateObjects.length - 1]
    const month = lastDate
      .toLocaleString('fr-FR', { month: 'long' })
      .toUpperCase()
    const year = lastDate.getFullYear()

    let time = ''
    if (displayTime && dateObjects.length === 1) {
      const hours = lastDate.getHours()
      const minutes = lastDate.getMinutes()
      time = ` à ${hours < 10 ? '0' + hours : hours}h${
        minutes < 10 ? '0' + minutes : minutes
      }`
    }

    return `${formattedDates.join(' & ')} ${month} ${year}${time}`
  })
}
