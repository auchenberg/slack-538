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

var headPrams = {
  Bucket: process.env.S3_BUCKET_NAME,
  Key: '538_forecast_' + dateFormat(Date.now(), 'dd_mm_yyyy_hh') + '.png'
}

var params = {
  Bucket: headPrams.Bucket,
  Key: headPrams.Key,
  ContentType: 'image/png',
  Expires: 60,
  ACL: 'public-read'
}

class fivethirtyeight {

  getForecast () {
    var url = `https://${params.Bucket}.s3.amazonaws.com/${params.Key}`

    return new Promise((resolve, reject) => {
      s3.headObject(headPrams, (err, data) => {
        if (err) { // Not found, time to generate
          var renderStream = webshot('http://projects.fivethirtyeight.com/2016-election-forecast/', options)
          renderStream.pipe(UploadStream(s3, params))
            .on('error', reject)
            .on('finish', () => resolve(url))
        } else {
          resolve(url)
        }
      })
    })
  }
}

module.exports = new fivethirtyeight()
