'use strict'

var fivethirtyeight = require('./fivethirtyeight')
var schedule = require('node-schedule')

var fetch = function() {

  fivethirtyeight.getForecast().then(forecastImageUrl => {
    console.log('worker.getForecast.success', forecastImageUrl)
    process.exit()
  }).catch(err => {
    console.error('worker.getForecast.failed', err)
    process.exit()
  })

}

schedule.scheduleJob('* /30 * * *', function(){
  fetch()
})
