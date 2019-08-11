const _ = require('lodash')

const CardCache = require('./CardCache')
const PromRequest = require('./PromRequest')

const cache = new CardCache()

const getList = (cardName, i = 1) => {
  return PromRequest(`https://api.scryfall.com/cards/search?q=!"${cardName}"&unique=prints&page=${i}`)
    .then(({ body }) => JSON.parse(body))
}

const removeGold = (cards) => cards.filter(card => card.border !== 'gold')

const getCards = async (cardName) => {
  /* check if data is already in cache */
  const cachedInfo = await cache.getCardInfo(cardName)
  if (cachedInfo) {
    return cachedInfo
  }

  const results = []
  let i = 1
  let cards = await getList(cardName, i)

  /* no card found */
  if (cards.object === 'error') {
    throw new Error(`Cardname ${cardName} not found`)
  }

  results.push(cards.data)
  while (cards.has_more) {
    i += 1
    cards = await getList(cardName, i)
    results.push(cards.data)
  }
  const completeData = removeGold(_.flatten(results))
  /* save new info in cache */
  await cache.setCardInfo(cardName, completeData)
  return completeData
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
