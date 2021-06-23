const fetch = require('node-fetch')
const config  = require('config');

const getToken = async () => {
    const {loginUrl,client_id,client_secret} = config.get('insuranceApiRest')
  
    const headers = {
      'Content-Type': 'application/json',
    }

    const data = {
        client_id,
        client_secret
    }
  
    return fetch(`${loginUrl}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
      timeout: 5000,
    })
}

module.exports = {
    getToken
}