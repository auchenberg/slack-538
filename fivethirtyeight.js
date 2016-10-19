'use strict'

var webshot = require('webshot')
var fs = require('fs')
var aws = require('aws-sdk')
var UploadStream = require('s3-stream-upload')
var dateFormat = require('dateformat')

var s3 = new aws.S3()

var options = {
  shotOffset: {
    top: 340,
    left: 250,
    right: 250,
    bottom: 545
  },
  shotSize: {
    width: 'window',
    height: 'window'
  }
}

class fivethirtyeight {

  getLastForecastKey() {
    return '538_forecast_' + dateFormat(Date.now(), 'dd_mm_yyyy_HH') + '.png'
  }
  
  getLastForecastUrl () { 
    console.log('fivethirtyeight.getLastForecastUrl', dateFormat(Date.now(), 'dd_mm_yyyy_HH'))
    var key = this.getLastForecastKey()
    return `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${key}` 
  }

  getForecast () {
    console.log('fivethirtyeight.getForecast', dateFormat(Date.now(), 'dd_mm_yyyy_HH'))

    var headParams = {
     Bucket: process.env.S3_BUCKET_NAME,
     Key: this.getLastForecastKey()
    }

    return new Promise((resolve, reject) => {
      s3.headObject(headParams, (err, data) => {
        if (err) { // Not found, time to generate
          console.log('fivethirtyeight.getForecast.not.found', dateFormat(Date.now(), 'dd_mm_yyyy_HH'))
          var renderStream = webshot('http://projects.fivethirtyeight.com/2016-election-forecast/', options)
          
          var params = {
            Bucket: process.env.S3_BUCKET_NAME,
            ContentType: 'image/png',
            Expires: 60,
            ACL: 'public-read',
            Key: headParams.Key
          }

          renderStream.pipe(UploadStream(s3, params))
            .on('error', reject)
            .on('finish', () => {
              console.log('fivethirtyeight.getForecast.generated', dateFormat(Date.now(), 'dd_mm_yyyy_HH'))
              resolve(this.getLastForecastUrl())
            })
        } else {
          console.log('fivethirtyeight.getForecast.found', dateFormat(Date.now(), 'dd_mm_yyyy_HH'))
          resolve(this.getLastForecastUrl())
        }
      })
    })
  }
}

module.exports = new fivethirtyeight()
