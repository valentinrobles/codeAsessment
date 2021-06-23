const {check} = require('../accessors/clients/check');
const {getAllClients} = require('../accessors/clients/build')
const {getPoliciesForOneClient} = require('../services/policiesService')
const {getUserToken} = require('../services/tokenService')
const dayjs = require('dayjs')
const createError = require('http-errors')

let clients = null;
let date = null;

const setClientsNotification = (newClients, expirationDate) => {
    clients = newClients
    date = dayjs(expirationDate).toDate();
    return clients;
}

const getClients = async () =>{
    if (clients && date && dayjs().isBefore(date)) {
        return clients;
    }
    const {token} = await getUserToken();
    const clientsResponse = check(await getAllClients(token));
    const expirationDate = clientsResponse.headers.get('expires');
    clients = await clientsResponse.json();
    setClientsNotification(clients, expirationDate);
    return clients;
}

const getClientsList = async (limit,name) =>{
    const allClients = await getClients();
    const result = limit? await adaptLength(allClients,name,limit) : await adaptLength(allClients,name,10);
    return result;
}

const getClient = async (clientId) =>{
    const allClients = await getClients();
    const policies = await getPoliciesForOneClient(clientId);
    const result = adaptResult(allClients,clientId,policies);
    return result;
}

const getClientPolicies = async (clientId) =>{
    const policies = await getPoliciesForOneClient(clientId);
    return policies;
}

const adaptLength = async (clientsArray, name, limit) =>{
    let i = 0;
    let client = {};
    let policies = []
    let arrayOfClients = [];
    if(name){
        for(i;i<limit;i++){
            if(clientsArray[i].name === name){
                client = clientsArray[i];
                policies.push(await getPoliciesForOneClient(clientsArray[i].clientId));
                client.policies = policies;
                arrayOfClients.push(client);
                policies = [];
            }
        }  
    }else{
        for(i;i<limit;i++){
            client = clientsArray[i];
            policies.push(await getPoliciesForOneClient(client.clientId));
            client.policies = policies;
            arrayOfClients.push(client);
            policies = [];
        }
    }
    return arrayOfClients;
}

const adaptResult = (clients, clientId, policies) =>{
    let result = [];
    let clientInfo = {};
    let clientExistence = false;
    clients.map(element => {
        if (element.id === clientId){
            clientExistence = true;
            clientInfo = element;
            clientInfo.policies = policies;
            return;
        }
    });
    if(!clientExistence){
        throw createError(404,'Client Not Found')
    }
    result.push(clientInfo)
    return result;
}

module.exports = {
    getClientsList,
    getClient,
    getClientPolicies
}