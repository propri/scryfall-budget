const fs = require('fs')

class CardCache {
  constructor(filename = './cards.cache') {
    this.filename = filename
    this.dataReady = false
    this.data = {}
    this._readData()
  }

  async getCardInfo(cardName) {
    await this._awaitData()
    const normalizedName = cardName.toLowerCase()
    if (!this.data[normalizedName] || this._tooOld(this.data[normalizedName].time)) {
      return null
    }
    return this.data[normalizedName].data
  }

  async setCardInfo(cardName, cardInfo) {
    await this._awaitData()
    const normalizedName = cardName.toLowerCase()
    this.data[normalizedName] = {
      time: new Date().getTime(),
      data: cardInfo,
    }
    await this._writeData()
  }

  async _writeData() {
    await new Promise((resolve, reject) => fs.writeFile(this.filename, JSON.stringify(this.data), err => {
      if (err) {
        console.log(`Problem writing card cache file ${this.filename}: ${err.message}`)
        reject(err)
      }
      resolve()
    }))
  }

  _readData() {
    new Promise((resolve, reject) => {
      fs.access(this.filename, (err) => {
        if (err) {
          reject(err)
        }
        fs.readFile(this.filename, (err, data) => {
          if (err) {
            reject(err)
          }
          resolve(data)
        })
      })
    })
      .then(data => {
        this.dataReady = true
        this.data = JSON.parse(data)
      })
      .catch((err) => {
        this.dataReady = true
        console.log(`Could not read cache file ${this.filename}. Starting with empty cache`)
      })
  }

  async _awaitData() {
    if (this.dataReady) {
      return
    }
    await new Promise((resolve, reject) => {
      const iv = setInterval(() => {
        if (this.dataReady) {
          clearInterval(iv)
          resolve()
        }
      }, 10)
    })
  }

  _tooOld(time) {
    //return (new Date().getTime() + 24 * 3600 * 1000) < time
    return time + 24 * 3600 * 1000 < new Date().getTime()
  }
}

module.exports = CardCache
