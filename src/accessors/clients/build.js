const fetch = require('node-fetch')
const config  = require('config');

const getAllClients = async (token) => {
    const {clientsUrl} = config.get('insuranceApiRest');
  
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }

    return fetch(`${clientsUrl}`, {
      method: 'GET',
      headers,
      timeout: 5000,
    })
}

module.exports = {
  getAllClients
}