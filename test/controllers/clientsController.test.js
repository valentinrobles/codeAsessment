const chai = require("chai");
const sinon = require("sinon");
const chaiAsPromised = require("chai-as-promised");
const proxyquire = require("proxyquire");
chai.use(chaiAsPromised);

const getClientsListMock = sinon.stub();
const getClientMock = sinon.stub();
const getClientPoliciesMock = sinon.stub();
const next = sinon.stub();

const clientListMock = [
    {
        id: 'id',
        name: 'name',
        email: 'email',
        role: 'role',
        policies: [
            {
                id: 'id',
                amountInsured: 'amountInsured',
                inceptionDate: 'inceptionDate'
            }
        ]
    },
    {
        id: 'id2',
        name: 'name2',
        email: 'email2',
        role: 'role2',
        policies: []
    }
]

const clientDetailsMock = [
    {
        id: 'id3',
        name: 'name',
        email: 'email',
        role: 'role',
        policies: [
            {
                id: 'id',
                amountInsured: 'amountInsured',
                inceptionDate: 'inceptionDate'
            }
        ]
    }
]

const clientPoliciesMock = [
    {
        "id": "id3",
        "amountInsured": "amountInsured",
        "email": "email",
        "inceptionDate": "inceptionDate",
        "installmentPayment": true
      }
]

const {
    getClients,
    getOneClient,
    getPoliciesForClientId
} = proxyquire('../../src/server/controllers/clientsController', {
    '../../services/clientsService':{
        getClientsList: getClientsListMock,
        getClient: getClientMock,
        getClientPolicies: getClientPoliciesMock
    }
})

describe('Test clientsController: getCLients', () =>{
    beforeEach(() => {
        next.resetHistory();
    });

    it('Next is called when clientsService throws Unauthorized Error', async () =>{
        const req = {
            query: {
                limit: 12,
                name: 'name'
            }
        }
        const res = {};

        getClientsListMock.withArgs(12,'name').throws({
            code: 401,
            status: 'Unauthorized Error'
        })
        await getClients(req,res,next);
        chai.expect(next.firstCall.args[0].code).to.be.equal(401);
        chai
        .expect(next.firstCall.args[0].status)
        .to.be.equal("Unauthorized Error");
    })

    it('Returns clients successfuly', async () =>{
        const req = {
            query: {
                limit: 2,
                name: 'nameMock'
            }
        };
        const resJsonMock = sinon.fake.returns("");
        const resStatusMock = sinon.fake.returns({
            json: resJsonMock,
        });
        const res = { status: resStatusMock };

        getClientsListMock.withArgs(2,'nameMock').resolves(clientListMock)

        await getClients(req,res,next)
        chai.expect(res.status.callCount).to.be.eql(1);
        chai.expect(res.status.firstCall.args[0]).to.be.eql(200);
        chai.expect(resJsonMock.firstCall.args[0]).to.be.eql(clientListMock);
    })
})

describe('Test clientsController: getClient', () =>{
    beforeEach(() => {
        next.resetHistory();
    });

    it('Next is called when clientsService throws Unauthorized Error', async () =>{
        const req = {
            params: {
                id: 'id1'
            }
        }
        const res = {};

        getClientMock.withArgs('id1').throws({
            code: 401,
            status: 'Unauthorized Error'
        })
        await getOneClient(req,res,next);
        chai.expect(next.firstCall.args[0].code).to.be.equal(401);
        chai
        .expect(next.firstCall.args[0].status)
        .to.be.equal("Unauthorized Error");
    })

    it('Next is called when clientsService throws not found error', async () =>{
        const req = {
            params: {
                id: 'id2'
            }
        }
        const res = {};

        getClientMock.withArgs('id2').throws({
            code: 404,
            status: 'Client Not Found'
        })

        await getOneClient(req,res,next);
        chai.expect(next.firstCall.args[0].code).to.be.equal(404);
        chai
        .expect(next.firstCall.args[0].status)
        .to.be.equal("Client Not Found");
    })

    it('Returns client details successfuly', async ()=>{
        const req = {
            params: {
                id: 'id3'
            }
        };
        const resJsonMock = sinon.fake.returns("");
        const resStatusMock = sinon.fake.returns({
            json: resJsonMock,
        });
        const res = { status: resStatusMock };

        getClientMock.withArgs('id3').resolves(clientDetailsMock);
        await getOneClient(req,res,next);
        chai.expect(res.status.callCount).to.be.eql(1);
        chai.expect(res.status.firstCall.args[0]).to.be.eql(200);
        chai.expect(resJsonMock.firstCall.args[0]).to.be.eql(clientDetailsMock);
    })
})

describe('Test clientsController: getPoliciesForClientId', () =>{
    beforeEach(() => {
        next.resetHistory();
    });
    
    it('Next is called when clientsService throws Unauthorized Error', async () =>{
        const req = {
            params: {
                id: 'id1'
            }
        }
        const res = {};

        getClientPoliciesMock.withArgs('id1').throws({
            code: 401,
            status: 'Unauthorized Error'
        })
        await getPoliciesForClientId(req,res,next);
        chai.expect(next.firstCall.args[0].code).to.be.equal(401);
        chai
        .expect(next.firstCall.args[0].status)
        .to.be.equal("Unauthorized Error");
    })

    it('Next is called when clientService Not Found Client', async () =>{
        const req = {
            params: {
                id: 'id2'
            }
        }
        const res = {};
        getClientPoliciesMock.withArgs('id2').resolves([]);
        await getPoliciesForClientId(req,res,next);
        chai
        .expect(next.firstCall.args[0].status)
        .to.be.equal(404);    
    })

    it(`It returns client's policies successfully`, async()=>{
        const req = {
            params: {
                id: 'id3'
            }
        };
        const resJsonMock = sinon.fake.returns("");
        const resStatusMock = sinon.fake.returns({
            json: resJsonMock,
        });
        const res = { status: resStatusMock };
        getClientPoliciesMock.withArgs('id3').resolves(clientPoliciesMock)
        await getPoliciesForClientId(req,res,next);
        chai.expect(res.status.callCount).to.be.eql(1);
        chai.expect(res.status.firstCall.args[0]).to.be.eql(200);
        chai.expect(resJsonMock.firstCall.args[0]).to.be.eql(clientPoliciesMock);
    })
})