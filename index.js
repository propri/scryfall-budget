const { minPrice, getCards } = require('./cards')
const { loadList, cleanEntries } = require('./list')

//getCards('foobar')
  //.then(data => console.log(data))
//minPrice('Enlightened Tutor')
  //.then(data => console.log(data))

loadList('list.txt')
  .then(data => cleanEntries(data))
  .then(data => Promise.all(data.map(cardName => minPrice(cardName))))
  .then(data => data.reduce((total, currentValue) => total + currentValue))
  .then(data => console.log(data))

