const TypeDetect = require('type-detect')
const EnumsTypeDetect = require('./enums-type-detect')

module.exports.convertJDEDateToJSDate = (jdeDate) => {
  let result = ''
  let jdeMonth = ''
  let tmpDate = null

  if (TypeDetect(jdeDate) !== EnumsTypeDetect.NUMBER) {
    jdeDate = parseInt(jdeDate)
    if (isNaN(jdeDate)) {
      return 'JDE Date parameter needs to be of type \'Number\' with max 6 characters'
    }
  }

  if (!jdeDate || TypeDetect(jdeDate) !== EnumsTypeDetect.NUMBER || jdeDate.toString().length > 6 || jdeDate.toString().length < 4) {
    result = 'JDE Date parameter needs to be of type \'Number\' with max 6 characters'
  } else {
    switch (jdeDate.toString().length) {
      case 4:
        jdeDate = jdeDate.toString().substr(0, 3) + '00' + jdeDate.toString().substr(3, 1)
        break
      case 5:
        jdeDate = jdeDate.toString().substr(0, 3) + '0' + jdeDate.toString().substr(3, 2)
        break
    }

    jdeMonth = parseInt(jdeDate.toString().substr(3, 3))
    tmpDate = new Date(1900 + (jdeDate / 1000), 0, jdeMonth)
    result = tmpDate.toDateString()
  }

  return result
}

module.exports.convertJDETimeToJSTime = (time) => {
  let result = ''

  if (TypeDetect(time) !== EnumsTypeDetect.NUMBER) {
    time = parseInt(time)
    if (isNaN(time)) {
      return 'JDE Time parameter needs to be of type \'Number\' with max 6 characters'
    }
  }

  if (!time || TypeDetect(time) !== EnumsTypeDetect.NUMBER || time.length > 6) {
    return 'JDE Time parameter needs to be of type \'Number\' with max 6 characters'
  } else {
    let date = new Date()

    time = time.toString()

    time = time.replace(/^(?:(?:(\d)?(\d))?(\d\d))?(\d\d)$/,
      function (all, hr1, hr2, min, sec) {
        return (hr1 || '0') + (hr2 || '0') + ':' + (min || '00') + '.' + sec
      }
    )

    const hr = time.substr(0, 2)
    const min = time.substr(3, 2)
    const sec = time.substr(6, 2)

    date.setHours(hr, min, sec)
    date = date.toTimeString().split(' ')[0]
    result = date
  }

  return result
}

module.exports.convertJSTimeToJDETime = (time) => {
  let result = ''

  if (!time || TypeDetect(time) !== EnumsTypeDetect.STRING || time.length > 8) {
    return 'JS Time parameter needs to be of type \'String\' with max 8 characters, including 2 colons'
  } else {
    if (typeof time === 'string') {
      time = time.replace(/:/g, '')
      result = time
    }
  }

  return result
}

module.exports.convertJSDateToJDEDate = (date) => {
  let result = ''

  if (!date || TypeDetect(date) !== EnumsTypeDetect.STRING || date.length > 10) {
    return 'JS Date parameter needs to be of type \'String\' with max 10 characters, including dashes or slashes'
  } else {
    const jsDate = new Date(date)
    const start = new Date(jsDate.getFullYear(), 0, 0)
    const diff = jsDate - start
    const oneDay = 24 * 60 * 60 * 1000
    const c = 1
    let day = Math.floor(diff / oneDay)
    let yy = date.substr(0, 4)

    yy = yy % 100

    if (day.toString().length === 1) {
      day = '00' + day.toString()
    } else if (day.toString().length === 2) {
      day = '0' + day.toString()
    }

    result = c.toString() + yy.toString() + day
  }

  return result
}
