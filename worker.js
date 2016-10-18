'use strict'

var fivethirtyeight = require('./fivethirtyeight')
var schedule = require('node-schedule')

var fetch = () => {
  console.log('worker.fetch', Date.now(), dateFormat(Date.now(), 'dd_mm_yyyy_HH'))

  fivethirtyeight.getForecast().then(forecastImageUrl => {
    console.log('worker.getForecast.success', forecastImageUrl)
    process.exit()
  }).catch(err => {
    console.error('worker.getForecast.failed', err)
    process.exit()
  })
}

console.log('worker.started')

schedule.scheduleJob('*/15 * * * *', () => {
  console.log('worker.run')
  fetch()
})
