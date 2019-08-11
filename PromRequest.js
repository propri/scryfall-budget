const request = require('request')

const PromRequest = (url) => new Promise((resolve, reject) => {
  setTimeout(() => {
    request(url, (err, response, body) => {
      if (err) {
        reject(err)
      }
      resolve({ response, body })
    })
  }, 100)
})

module.exports = PromRequest

