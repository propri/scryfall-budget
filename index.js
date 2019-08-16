/* Imports */
const fs = require('fs')
const cla = require('command-line-args')
const clc = require('cli-color')
const _ = require('lodash')

const { minPrice, getCards } = require('./cards')
const { loadList, cleanEntries } = require('./list')
/* Imports */

const showHelp = () => {
  console.log('Copmute prices of decklist\n')
  console.log('\t--card, -c "Cardname":\tCheck price for a single card')
  console.log('\t--max, -m:\t\t(optional) Maximum value of the deck')
  console.log('\t--verbose, -v:\t\tShow individual card prices')
  console.log('\t--sort, -s\tshow cards sorted by price')
  console.log('\t--list, -l "filename":\tPath to decklist file.')
  console.log('\t\tFile format:\n\t\t\t1x Opt\n\t\t\t10x Island\n')
  console.log('Example command:\n\tnode index.js -v --max 30 list.txt\nCheck price for decklist in list.txt including detailed prices and checking against maximum of 30€\n')
  console.log('card info is cached for 24 hours (in cards.cache file)')
}

const main = () => {
  const optionDefinitions = [
    { name: 'card', alias: 'c', type: String },
    { name: 'max', alias: 'm', type: Number },
    { name: 'verbose', alias: 'v', type: Boolean },
    { name: 'list', type: String, defaultOption: true },
    { name: 'sort', alias: 's', type: Boolean },
  ]

  const options = cla(optionDefinitions)

  if (!options.list && !options.card) {
    showHelp()
    process.exit()
  }

  if (options.card) {
    minPrice(options.card)
      .then(price => console.log(`${options.card} - ${price.toFixed(2)}€`))
      .then(() => process.exit())
  } else {
    const listFile = options.list

    new Promise((resolve, reject) => {
      fs.access(listFile, (err) => {
        if (err) {
          reject(err)
        }
        resolve()
      })
    })
      .catch(err => {
        console.error(err.message)
        console.log('aborting ...')
        process.exit()
      })
      .then(() => loadList(listFile))
      .then(data => cleanEntries(data, options.verbose))
      .then(async data => {
        results = []
        /* respect grace period -> only one request at a time */
        for (let i = 0; i < data.length; i += 1) {
          let cardName = data[i]
          let price = await minPrice(cardName)
          if (options.verbose) {
            console.log(`${cardName} - ${price.toFixed(2)}€`)
          }
          results.push({cardName, price})
        }
        if (options.sort) {
          _.sortBy(results, ['price', 'cardName'], ['asc', 'asc']).forEach(x => {
            console.log(`${x.cardName} - ${x.price.toFixed(2)}€`)
          })
        }
        return results
      })
      .then(data => data.reduce((total, currentValue) => total + currentValue.price, 0))
      .then(completePrice => {
        console.log('*'.repeat(30))
        if (options.max) {
          if (completePrice > options.max) {
            console.log(clc.red(`Cost of the deck above ${options.max}€ limit: ${completePrice.toFixed(2)}€`))
          } else {
            console.log(clc.green(`Cost of the deck below ${options.max}€ limit: ${completePrice.toFixed(2)}€`))
          }
        } else {
          console.log(`Cost of the deck: ${completePrice.toFixed(2)}€`)
        }
        console.log('*'.repeat(30))
      })
  }
}

main()
