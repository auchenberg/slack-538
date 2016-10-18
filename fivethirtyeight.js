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
    bottom: 550
  },
  shotSize: {
    width: 'window',
    height: 'window'
  }
}

var params = {
  Bucket: process.env.S3_BUCKET_NAME,
  ContentType: 'image/png',
  Expires: 60,
  ACL: 'public-read'
}

class fivethirtyeight {

  getLastForecastKey() {
    return '538_forecast_' + dateFormat(Date.now(), 'dd_mm_yyyy_HH') + '.png'
  }
  
  getLastForecastUrl () { 
    console.log('fivethirtyeight.getLastForecastUrl', dateFormat(Date.now(), 'dd_mm_yyyy_HH'))
    var key = this.getLastForecastKey()
    return `https://${params.Bucket}.s3.amazonaws.com/${key}` 
  }

  getForecast () {

    var headParams = {
     Bucket: params.Bucket,
     Key: this.getLastForecastKey()
    }

    return new Promise((resolve, reject) => {
      s3.headObject(headParams, (err, data) => {
        if (err) { // Not found, time to generate
          var renderStream = webshot('http://projects.fivethirtyewight.com/2016-election-forecast/', options)
          
          var reqParams = params
          var reqParamsKey = headParams.Key

          renderStream.pipe(UploadStream(s3, reqParams))
            .on('error', reject)
            .on('finish', () => resolve(this.getLastForecastUrl()))
        } else {
          resolve(this.getLastForecastUrl())
        }
      })
    })
  }
}

module.exports = new fivethirtyeight()
