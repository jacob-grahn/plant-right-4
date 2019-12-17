const AWS = require('aws-sdk') // eslint-disable-line import/no-extraneous-dependencies
const fs = require('fs')
const s3 = new AWS.S3()
const bucket = process.env.BUCKET || 'test-bucket'
const saveTarget = process.env.SAVE_TARGET || 's3'

const stashFile = (key, buffer) => {
  console.log('stashFile', key)
  if (saveTarget === 's3') {
    return s3.putObject({
      Bucket: bucket,
      Key: key,
      Body: buffer
    }).promise()
  } else if (saveTarget === 'local') {
    const paths = key.split('/')
    paths.pop()
    fs.mkdirSync(`./stashed/${paths.join('/')}`, { recursive: true })
    fs.writeFileSync(`./stashed/${key}`, buffer)
  }
}

module.exports = stashFile
