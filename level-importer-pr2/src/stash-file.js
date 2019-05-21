const AWS = require('aws-sdk') // eslint-disable-line import/no-extraneous-dependencies
const s3 = new AWS.S3()
const bucket = process.env.BUCKET || 'test-bucket'

const stashFile = (key, buffer) => {
  return s3.putObject({
    Bucket: bucket,
    Key: key,
    Body: buffer
  }).promise()
}

module.exports = stashFile
