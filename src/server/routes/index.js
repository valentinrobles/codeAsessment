const {healthController} = require('../controllers/healthController')
const {getToken} = require('../controllers/authController')
const {getClients,getOneClient,getPoliciesForClientId} = require('../controllers/clientsController')
const {getOneClientPolicies,getPolicies} = require('../controllers/policiesController')

const bind = (app) =>{
    app.get('/health',healthController)
    app.post('/login',getToken);
    app.get('/policies',getPolicies)
    app.get('/policies/:id',getOneClientPolicies)
    app.get('/clients',getClients)
    app.get('/clients/:id',getOneClient)
    app.get('/clients/:id/policies',getPoliciesForClientId)
}

module.exports = {bind}