'use strict'

var fivethirtyeight = require('./fivethirtyeight')

fivethirtyeight.getForecast().then(forecastImageUrl => {
  console.log('worker.getForecast.success', forecastImageUrl)
  process.exit()
}).catch(err => {
  console.error('worker.getForecast.failed', err)
  process.exit()
})
