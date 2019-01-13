'use strict'

const Joi = require('joi')
const { isMetric } = require('../test-validators')

const t = (module.exports = require('../create-service-tester')())

t.create('Public Board - orange label cards')
  .get('/Bs7hgkma/orange.json')
  .expectJSONTypes(
    Joi.object().keys({
      name: 'orange label cards',
      value: isMetric,
    })
  )

t.create('Public Board - yellow label cards')
  .get('/Bs7hgkma/yellow.json')
  .expectJSONTypes(
    Joi.object().keys({
      name: 'yellow label cards',
      value: isMetric,
    })
  )

t.create('Test Board - green label cards (one card)')
  .get('/JrO2cuNb/green.json')
  .expectJSONTypes(
    Joi.object().keys({
      name: 'green label cards',
      value: 1,
    })
  )

t.create('Test Board - yellow label cards (two cards)')
  .get('/JrO2cuNb/yellow.json')
  .expectJSONTypes(
    Joi.object().keys({
      name: 'yellow label cards',
      value: 2,
    })
  )
