var webshot = require('webshot')
var fs = require('fs')

var aws = require('aws-sdk')
var s3 = new aws.S3()
var UploadStream = require('s3-stream-upload')

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
  Key: '538_forecast_' + new Date().toISOString() + '.png',
  ContentType: 'image/png',
  Expires: 60,
  ACL: 'public-read'
}

class fivethirtyeight {

  getForecast () {
    return new Promise((resolve, reject) => {

      var renderStream = webshot('http://projects.fivethirtyeight.com/2016-election-forecast/', options)

      renderStream.pipe(UploadStream(s3, params))
        .on('error', function (err) {
          reject(err)
        })
        .on('finish', function () {
          var url = `https://${params.Bucket}.s3.amazonaws.com/${params.Key}`
          resolve(url)
        })
    })
  }
}

module.exports = new fivethirtyeight()
