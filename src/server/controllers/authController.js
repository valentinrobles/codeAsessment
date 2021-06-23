const assert = require('assert')
const createError = require('http-errors')
const _ = require('lodash');

const {getUserToken} = require('../../services/tokenService')

const getToken = async (req,res,next) =>{
    try{
        assert(_.isString(req.body.username), createError(400,'Invalid username'))
        assert(_.isString(req.body.password),createError(400,'Invalid password'))

        const response = await getUserToken();
        res.status(200).json(response)

    }catch(error){
        next(error)
    }
}

module.exports ={
    getToken
}