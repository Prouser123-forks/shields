'use strict'

const BaseJsonService = require('../base-json')

module.exports = class BaseTrelloService extends BaseJsonService {
  static get defaultBadgeData() {
    return {
      label: 'trello',
      color: 'yellow',
    }
  }

  static get category() {
    return 'other'
  }

  static getOccurences(id, array) {
    const arrayString = JSON.stringify(array)
    return arrayString.split(id).length - 1
  }
}
