'use strict'

const { renderLicenseBadge } = require('../../lib/licenses')
const { BasePackagistService } = require('./packagist-base')

module.exports = class PackagistLicense extends BasePackagistService {
  static get route() {
    return {
      base: 'packagist/l',
      pattern: ':user/:repo',
    }
  }

  static get defaultBadgeData() {
    return {
      label: 'license',
    }
  }

  async handle({ user, repo }) {
    const {
      package: {
        versions: {
          'dev-master': { license },
        },
      },
    } = await this.fetch({ user, repo })
    PackagistLicense.log(`license: ${license}`)
    return renderLicenseBadge({ license })
  }

  static get category() {
    return 'license'
  }
  static get examples() {
    return [
      {
        title: 'Packagist',
        namedParams: { user: 'doctrine', repo: 'orm' },
        staticPreview: renderLicenseBadge({ license: 'MIT' }),
        keywords: ['PHP'],
      },
    ]
  }
}
