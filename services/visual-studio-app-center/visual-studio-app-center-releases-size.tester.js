'use strict'

const t = (module.exports = require('../tester').createServiceTester())
const { isFileSize } = require('../test-validators')

t.create('8368844 bytes to 7.98 mebibytes')
  .get('/nock/nock/nock.json')
  .intercept(nock =>
    nock('https://api.appcenter.ms/v0.1/apps/')
      .get('/nock/nock/releases/latest')
      .reply(200, {
        size: 8368844,
      })
  )
  .expectBadge({
    label: 'size',
    message: '7.98 MB',
  })

t.create('Valid Release')
  .get(
    '/jct/test-fixed-android-react/8c9b519a0750095b9fea3d40b2645d8a0c24a2f3.json'
  )
  .expectBadge({
    label: 'size',
    message: isFileSize,
  })

t.create('Valid user, invalid project, valid API token')
  .get('/jcx/invalid/8c9b519a0750095b9fea3d40b2645d8a0c24a2f3.json')
  .expectBadge({
    label: 'size',
    message: 'project not found',
  })

t.create('Invalid user, invalid project, valid API token')
  .get('/invalid/invalid/8c9b519a0750095b9fea3d40b2645d8a0c24a2f3.json')
  .expectBadge({
    label: 'size',
    message: 'project not found',
  })

t.create('Invalid API Token')
  .get('/invalid/invalid/invalid.json')
  .expectBadge({
    label: 'size',
    message: 'invalid token',
  })
