const {getClientsList,getClient,getClientPolicies} = require('../../services/clientsService');
const createError = require('http-errors')

const getClients = async (req,res,next) =>{
    try{
        const limit = req.query.limit;
        const name = req.query.name;
        const clients = await getClientsList(limit,name);
        res.status(200).json(clients);
    }catch(error){
        next(error)
    }
}

const getOneClient = async (req,res,next) =>{
    try{
        const id = req.params.id;
        const clientDetails = await getClient(id);
        res.status(200).json(clientDetails);
    }catch(error){
        next(error)
    }
}

const getPoliciesForClientId = async (req,res,next) =>{
    try{
        const id = req.params.id;
        const clientPolicies = await getClientPolicies(id);
        if (clientPolicies.length === 0){
            throw createError(404,'Not Found Error')
        }
        res.status(200).json(clientPolicies);
    }catch(error){
        next(error)
    }
}

module.exports = {
    getClients,
    getOneClient,
    getPoliciesForClientId
}