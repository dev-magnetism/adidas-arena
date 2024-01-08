export default ({ app }, inject) => {
  inject('convertToKebabCase', (string) => {
    return string
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/[\s_]+/g, '-')
      .toLowerCase()
  })

  inject('removeSpecialChar', (string) => {
    return  string.toLowerCase()
                  .normalize('NFD')
                  .replace(/[\u0300-\u036F]/g, '')
                  .replace(/[^\w\s]/gi, '-');
  })

  inject('formatDate', (dates, displayTime = false) => {
    // let dates;
    // console.log('formatDate / _dates', _dates);

    if (!Array.isArray(dates)) {
      dates = [dates]
    }

    // if (!Array.isArray(_dates)) {
    //   dates = [_dates]
    // } else if(_dates.length > 1){
    //   dates = _dates
    //   dates.splice(1, _dates.length - 2)

    // } else {
    //   dates = _dates
    // }

    //  console.log('formatDate / dates', dates);


    /*
      This insures that date's format can be read by all browsers.
    */
    const _formatDates = dates.map((obj)=>{
      const _date = (typeof obj === 'object')? obj.date : obj;
      return _date.replaceAll('-', '/');
    })


    const dateObjects = [];

    /*
      We need to exclude already existing dates with an id, 
      create a date set to midnight (for later comparison)
    */
    for(let i = 0; i < _formatDates.length; i++){
      const _date = new Date(_formatDates[i]);
      const _compDate = new Date(_formatDates[i]);
      const _id = `${_date.getDate()}${_date.getMonth() + 1}${_date.getFullYear()}`

      const _obj = {
        id: _id,
        compdate: new Date(_compDate.setHours(2,0,0)),
        date: _date
      }

      if(dateObjects.findIndex(dateobj => dateobj.id === _obj.id) < 0){
          dateObjects.push(_obj)
      }
    }

    //  console.log('dateObjects', dateObjects);

    const formattedDates = []
    let index = 0

    while (index < dateObjects.length) {
      const currentDate = dateObjects[index].date
      const startDay = currentDate.getDate()
      //  console.log('startDay', startDay);

      /* 
        Carefull : this compares 2 dates with a 24 hours difference,
        but a date object contains hours/minutes/seconds, so its tricky.
        That's why I use 'compdate', event if it doesn't contain the correct
        time.
      */
      // while (
      //   index < dateObjects.length - 1 &&
      //   (dateObjects[index + 1].compdate - dateObjects[index].compdate) /
      //     (1000 * 60 * 60 * 24) ===
      //     1
      // ) {
      //   index++
      // }
      while (
        index < dateObjects.length - 1
      ) {
        index++
      }

      const endDay = dateObjects[index].date.getDate()
      //  console.log('endDay', endDay);

      let _formattedDate;

      if (startDay === endDay) {
        _formattedDate = `${startDay}`
      } else if (endDay - startDay === 1) {
        _formattedDate = `${startDay} & ${endDay}`
      } else {
        _formattedDate = `${startDay} au ${endDay}`
      }
      //  console.log('_formattedDate', _formattedDate);

      formattedDates.push(_formattedDate)

      index++
    }

    const lastDate = dateObjects[dateObjects.length - 1].date
      //  console.log('lastDate', lastDate);
    const month = lastDate
      .toLocaleString('fr-FR', { month: 'long' })
      .toUpperCase()
      //  console.log('month', month);
    const year = lastDate.getFullYear()
      //  console.log('year', year);

    let time = ''
    if (displayTime && dateObjects.length === 1) {
      const hours = lastDate.getHours()
      const minutes = lastDate.getMinutes()
      time = ` à ${hours < 10 ? '0' + hours : hours}h${
        minutes < 10 ? '0' + minutes : minutes
      }`
    }

    const _stringDate = `${formattedDates.join(' & ')} ${month} ${year}${time}`;
    //  console.log('_stringDate:', _stringDate)

    return _stringDate
  })
}
