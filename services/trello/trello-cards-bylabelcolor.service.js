'use strict'

const BaseJsonService = require('../base-json')
const { metric } = require('../../lib/text-formatters')

const Joi = require('joi')
const schema = Joi.array().required()

const apiKey = '52a2439b8166344774e52720d3229076'

module.exports = class TrelloCardsByLabelColor extends BaseJsonService {
  static log(message) {
    console.log(message)
  }
  static get route() {
    return {
      base: 'trello/cards/bylabelcolor',
      pattern: ':boardid/:labelColor',
    }
  }

  static get defaultBadgeData() {
    return {
      label: 'trello',
      color: 'yellow',
    }
  }

  static getFirstLabelObjectByColor(labelColor, array) {
    for (let i = 0; i < array.length; i++) {
      if (array[i].color === labelColor) {
        //found = true;
        //break;
        return array[i]
      }
    }
  }

  static getOccurences(id, array) {
    const arrayString = JSON.stringify(array)
    //this.log('-----getOccurences arrayString-----')
    //this.log(arrayString)
    //this.log('-----getOccurences arrayString-----')
    return arrayString.split(id).length - 1
  }

  async handle({ boardid, labelColor }) {
    this.constructor.log('------------------------------------------')

    this.constructor.log(`Board ID: ${boardid} - Label (Color): ${labelColor}`)
    // Fetch list of labels and label ID's
    const json = await this.fetchLabels({ boardid })

    this.constructor.log(`Detected Board Labels: ${json.length}`)

    // Get the ID of the first label matching the specified color
    const selectedLabel = this.constructor.getFirstLabelObjectByColor(
      labelColor,
      json
    )

    this.constructor.log(
      `Searching for cards with a ${selectedLabel.color} label. ID ${
        selectedLabel.id
      }`
    )

    // Get the card IDs of call cards in the board and their label IDs if they have any
    const json2 = await this.fetchBoardCardLabels({ boardid })

    // Get the number of occurrences of the label ID
    const cards = this.constructor.getOccurences(selectedLabel.id, json2)

    this.constructor.log(`${selectedLabel.color} label cards: ${cards}`)
    this.constructor.log('------------------------------------------')
    return this.constructor.render({ cards, labelColor: selectedLabel.color })
  }

  async fetchLabels({ boardid }) {
    const url = `https://api.trello.com/1/boards/${boardid}/labels?key=${apiKey}`

    return this._requestJson({
      schema,
      options: {
        qs: {
          maxElements: 1,
        },
      },
      url,
    })
  }

  // Endpoint returns a card ID, as well as the label ID's of any labels.
  async fetchBoardCardLabels({ boardid }) {
    const url = `https://api.trello.com/1/boards/${boardid}/cards?key=${apiKey}&fields=idLabels`

    return this._requestJson({
      schema,
      options: {
        qs: {
          maxElements: 1,
        },
      },
      url,
    })
  }

  static render({ cards, labelColor }) {
    return {
      label: `${labelColor} label cards`,
      message: metric(cards),
    }
  }

  static get category() {
    return 'other'
  }

  static get examples() {
    return [
      {
        title: 'Trello cards (by label color)',
        namedParams: {
          boardid: '5a8ae9c6b95d537ef2173cd1',
          labelColor: 'orange',
        },
        staticPreview: this.render({ cards: 18, labelColor: 'orange' }),
      },
    ]
  }
}
