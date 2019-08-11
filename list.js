const fs = require('fs')
const clc = require('cli-color')

const loadList = (filename) => new Promise((resolve, reject) => {
  fs.readFile(filename, 'utf8', (err, data) => {
    if (err) {
      reject(err)
    } else {
      resolve(data)
    }
  })
})

const cleanEntries = (lines, verbose = false) => {
  let cardNum = 0
  let cardNames = []
  lines.split('\n').forEach(line => {
    if (verbose) {
      console.log(line)
    }
    if (line.trim()) {
      const match = line.match(/^(\d+)\s?[xX*]?\s([^#]*)/)
      if (match) {
        cardNum += parseInt(match[1], 10)
        cardNames.push(match[2].trim())
      } else {
        console.log(`unexpected line format found:  -> ${line} <-`)
      }
    }
  })
  if (cardNum !== 100) {
    console.log(clc.red(`>>> Warning, valid commander deck needs 100 cards. Cards in decklist: ${cardNum} <<<`))
  } else {
    console.log(clc.green(`Deck list complete - 100 cards`))
  }
  return cardNames
}

module.exports = {
  loadList,
  cleanEntries,
}
