const { minPrice, getCards } = require('./cards')
const { loadList, cleanEntries } = require('./list')
const fs = require('fs')

const listFile = process.argv[2]

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
  .then(data => cleanEntries(data))
  .then(data => Promise.all(data.map(async cardName => {
    let price = await minPrice(cardName)
    console.log(`${cardName} - ${price.toFixed(2)}€`)
    return price
  })))
  .then(data => data.reduce((total, currentValue) => total + currentValue))
  .then(completePrice => console.log(`${'*'.repeat(30)}\nCost of the deck: ${completePrice.toFixed(2)}€\n${'*'.repeat(30)}`))

