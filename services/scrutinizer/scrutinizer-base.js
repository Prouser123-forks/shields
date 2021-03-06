'use strict'

const { BaseJsonService, NotFound } = require('..')

module.exports = class ScrutinizerBase extends BaseJsonService {
  // https://scrutinizer-ci.com/docs/api/#repository-details
  async fetch({ schema, vcs, slug }) {
    return this._requestJson({
      schema,
      url: `https://scrutinizer-ci.com/api/repositories/${vcs}/${slug}`,
      errorMessages: {
        401: 'not authorized to access project',
        404: 'project not found',
      },
    })
  }

  transformBranchInfo({ json, wantedBranch }) {
    const branch = wantedBranch || json.default_branch
    const noBranchInfoMessage = wantedBranch
      ? 'branch not found'
      : 'unavailable for default branch'

    const branchInfo = json.applications[branch]
    if (!branchInfo) {
      throw new NotFound({ prettyMessage: noBranchInfoMessage })
    }

    return branchInfo
  }

  transformBranchInfoMetricValue({ json, branch, metric }) {
    const {
      index: {
        _embedded: {
          project: { metric_values: metricValues },
        },
      },
    } = this.transformBranchInfo({ json, wantedBranch: branch })

    return { value: metricValues[metric] }
  }
}
