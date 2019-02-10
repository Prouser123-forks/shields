'use strict'

const Joi = require('joi')
const { withRegex } = require('../test-validators')

const t = (module.exports = require('../tester').createServiceTester())

// Note that Spigot versions can be anything (including just a string), so we'll make sure it's not returning 'not found'

t.create('jquery')
  .get('/jquery.json')
  .expectJSONTypes(
    Joi.object().keys({
      name: 'version',
      value: withRegex(/^(?!not found$)/),
    })
  )

t.create('fake package')
  .get('/somefakepackage.json')
  .expectJSON({
    name: 'version',
    value: 'not found',
  })
