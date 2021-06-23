const fetch = require('node-fetch')
const config  = require('config');

const getPolicies = async (token) => {
    const {policiesUrl} = config.get('insuranceApiRest')
  
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }

    return fetch(`${policiesUrl}`, {
      method: 'GET',
      headers,
      timeout: 5000,
    })
}


module.exports = {
    getPolicies
}