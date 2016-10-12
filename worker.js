'use strict'

var fivethirtyeight = require('./fivethirtyeight')

fivethirtyeight.getForecast().then(forecastImageUrl => {
  console.log('worker.getForecast.success', forecastImageUrl)
}).catch(err => {
  console.error('worker.getForecast.success', err)
})

