const {adapt} = require('../accessors/token/adapt')
const {getToken} = require('../accessors/token/build')
const {check} = require('../accessors/token/check')
const dayjs = require('dayjs')
const jwtDecode = require('jwt-decode')

let token = null
let date = null

const setTokenNotification = (newToken, expirationDate) => {
  token = newToken
  date = dayjs().add(expirationDate, 'second')
  return token
}

const getUserToken = async () =>{
    if (token && date && dayjs().isBefore(date)) {
        return {token, type: 'Bearer'}
    }

    const response = await adapt(check(await getToken()))
    const decoded = jwtDecode(response.token)
    setTokenNotification(response.token, decoded.exp)
    return response;
}



module.exports = {getUserToken}