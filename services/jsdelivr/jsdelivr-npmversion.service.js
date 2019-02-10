'use strict'

const Joi = require('joi')
const { renderVersionBadge } = require('../../lib/version')
const { BaseJsonService } = require('..')

const schema = Joi.object({
  tags: Joi.object({
    latest: Joi.string().required(),
  }).required(),
}).required()

module.exports = class jsDelivrNPMVersion extends BaseJsonService {
  static get route() {
    return {
      base: 'jsdelivr/version/npm',
      pattern: ':name',
    }
  }

  static get defaultBadgeData() {
    return {
      label: 'version',
      color: 'blue',
    }
  }

  async handle({ name }) {
    const {
      tags: { latest },
    } = await this.fetch({ name })
    return renderVersionBadge({ version: latest })
  }

  async fetch({ name }) {
    const url = `https://data.jsdelivr.com/v1/package/npm/${name}`

    return this._requestJson({
      schema,
      url,
    })
  }

  static get category() {
    return 'version'
  }
  static get examples() {
    return [
      {
        title: 'jsDelivr Version (npm)',
        namedParams: {
          name: 'jquery',
        },
        staticPreview: renderVersionBadge({ version: '3.3.1' }),
      },
    ]
  }
}
