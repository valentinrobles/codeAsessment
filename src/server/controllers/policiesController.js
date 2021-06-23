const assert = require('assert')
const createError = require('http-errors')
const {getPoliciesWithLimit,getPoliciesForOneClient} = require('../../services/policiesService');

const getPolicies = async (req,res,next) =>{
    try{
        const limit = req.query.limit;
        const policies = await getPoliciesWithLimit(limit);
        res.status(200).json(policies)
    }catch(error){
        next(error)
    }
}

const getOneClientPolicies = async (req,res,next) =>{
    try{
        const id = req.params.id;
        const policies = await getPoliciesForOneClient(id);
        if(policies.length === 0){
            throw createError(404,'Not Found Error')
        }
        res.status(200).json(policies);
    }catch(error){
        next(error)
    }
}

module.exports = {
    getOneClientPolicies,
    getPolicies
}