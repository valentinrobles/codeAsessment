const assert = require('assert')

const adapt = (response) => {
  assert(response && response.json, 'Bad response format')

  return response.json()
}

module.exports = {adapt}