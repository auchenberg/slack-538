var fivethirtyeight = require('./fivethirtyeight')

fivethirtyeight.getForecast().then(url => {
  console.log('url', url)
}).catch(err => { 
  console.log('err', err)
})