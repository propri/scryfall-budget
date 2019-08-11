const PromRequest = require('./PromRequest')
const _ = require('lodash')

const getList = (cardName, i = 1) => {
  return PromRequest(`https://api.scryfall.com/cards/search?q=!"${cardName}"&unique=prints&page=${i}`)
    .then(({ body }) => JSON.parse(body))
}

//const resetBasics = (cards) => cards.map(card => {
  //if (['forest', 'plains', 'island', 'swamp', 'mountain'].includes(card.name.toLowerCase())) {
    //card.prices.eur = 0
  //}
  //return card
//})

const removeGold = (cards) => cards.filter(card => card.border !== 'gold')

const getCards = async (cardName) => {
  const results = []
  let i = 1
  let cards = await getList(cardName, i)

  /* no card found */
  if (cards.object === 'error') {
    //console.log(`WARNING: Cardname not found: ${cardName}`)
    throw new Error(`Cardname ${cardName} not found`)
  }

  results.push(cards.data)
  while (cards.has_more) {
    i += 1
    cards = await getList(cardName, i)
    results.push(cards.data)
  }

  //return removeGold(resetBasics(_.flatten(results)))
  return removeGold(_.flatten(results))
}

const minPrice = (cardName) => {
  if (['forest', 'plains', 'island', 'swamp', 'mountain'].includes(cardName.toLowerCase())) {
    return 0
  }
  return getCards(cardName)
    .then(cards => cards.reduce((currentMin, card) => {
      const price = parseFloat(card.prices.eur)
      if (price && price < currentMin) {
        return price
      }
      return currentMin
    }, Infinity))
    .catch(e => {
      console.warn(e)
      return 0
    })
}

module.exports = {
  getCards,
  minPrice,
}
