const createError = require('http-errors')

const check = (res) => {
  if (res.status >= 500) throw createError.BadGateway()
  if(res.status === 401) throw createError(401,'Unauthorized')
  return res
}

module.exports = {check}
