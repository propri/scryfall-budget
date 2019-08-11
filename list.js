const fs = require('fs')

const loadList = (filename) => new Promise((resolve, reject) => {
  fs.readFile(filename, 'utf8', (err, data) => {
    if (err) {
      reject(err)
    } else {
      resolve(data)
    }
  })
})

const cleanEntries = (lines) => {
  let cardNum = 0
  let cardNames = []
  lines.split('\n').forEach(line => {
    console.log(line)
    if (line.trim()) {
      const match = line.match(/(\d+)\w?[xX*]?\w(.*)/)
      if (match) {
        cardNum += parseInt(match[1], 10)
        cardNames.push(match[2].trim())
      } else {
        console.log(`unexpected line format found:  -> ${line} <-`)
      }
    }
  })
  if (cardNum !== 100) {
    console.log(`Warning, valid commander deck needs 100 cards. Cards in decklist: ${cardNum}`)
  }
  return cardNames
}

module.exports = {
  loadList,
  cleanEntries,
}
