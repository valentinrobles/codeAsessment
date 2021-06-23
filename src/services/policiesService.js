const {adapt} = require('../accessors/policies/adapt')
const {check} = require('../accessors/policies/check')
const {getPolicies} = require('../accessors/policies/build')
const {getUserToken} = require('../services/tokenService')
const dayjs = require('dayjs')

let policies = null
let date = null

const setPoliciesNotification = (newPolicies, expirationDate) => {
  policies = newPolicies
  date = dayjs(expirationDate).toDate();
  return policies;
}

const getAllPolicies = async () =>{
    if (policies && date && dayjs().isBefore(date)) {
        return policies;
    }
    const {token} = await getUserToken();
    const policiesResponse = check(await getPolicies(token));
    const expirationDate = policiesResponse.headers.get('expires');
    policies = await policiesResponse.json();
    setPoliciesNotification(policies, expirationDate);
    return policies;
}

const getPoliciesWithLimit = async(limit) =>{
    const allPolicies = await getAllPolicies()
    const result = limit? adaptLength(allPolicies,limit) : adaptLength(allPolicies,10);
    return result
}

const getPoliciesForOneClient = async (clientId) =>{
    const allPolicies = await getAllPolicies()
    const clientPolicies = searchPolicies(allPolicies,clientId);
    return clientPolicies
}

const adaptLength = (policies, limit) =>{
    let i = 0;
    let arrayOfPolicies = [];
    for(i;i<limit;i++){
        arrayOfPolicies.push(policies[i])
    }
    return arrayOfPolicies;
}

const searchPolicies = (policies, clientId) =>{
    let clientPolicies = []
    policies.forEach(element => {
        if (element.clientId === clientId){
            clientPolicies.push(element);
        }
    });
    return clientPolicies;
}

module.exports ={
    getAllPolicies,
    getPoliciesWithLimit,
    getPoliciesForOneClient
}