const chai = require("chai");
const sinon = require("sinon");
const chaiAsPromised = require("chai-as-promised");
const proxyquire = require("proxyquire");
chai.use(chaiAsPromised);

const getPoliciesWithLimitMock = sinon.stub();
const getPoliciesForOneClientMock = sinon.stub();
const next = sinon.stub();

const clientsPoliciesMock = [
    {
        "id": "id",
        "amountInsured": "amountInsured",
        "email": "email",
        "inceptionDate": "inceptionDate",
        "installmentPayment": true
    },
    {
        "id": "id2",
        "amountInsured": "amountInsured",
        "email": "email",
        "inceptionDate": "inceptionDate",
        "installmentPayment": true
      }
]

const {
    getOneClientPolicies,
    getPolicies} = proxyquire('../../src/server/controllers/policiesController', {
        '../../services/policiesService':{
            getPoliciesWithLimit: getPoliciesWithLimitMock,
            getPoliciesForOneClient: getPoliciesForOneClientMock
        }
})

describe('Test policiesController: getOneClientPolicies', () =>{
    beforeEach(() => {
        next.resetHistory();
    });
    
    it('Next is called when policiesService throws Unauthorized Error', async () =>{
        const req = {
            params: {
                id: 'id1'
            }
        }
        const res = {};

        getPoliciesForOneClientMock.withArgs('id1').throws({
            code: 401,
            status: 'Unauthorized Error'
        })
        await getOneClientPolicies(req,res,next);
        chai.expect(next.firstCall.args[0].code).to.be.equal(401);
        chai
        .expect(next.firstCall.args[0].status)
        .to.be.equal("Unauthorized Error");
    })

    it('Next is called when policiesService not found Client and throws Not Found Error', async ()=>{
        const req = {
            params: {
                id: 'id2'
            }
        }
        const res = {};

        getPoliciesForOneClientMock.withArgs('id2').resolves([])
        await getOneClientPolicies(req,res,next);
        chai
        .expect(next.firstCall.args[0].status)
        .to.be.equal(404);
    })

    it(`Returns Client's Policies successfully`, async () =>{
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

        getPoliciesForOneClientMock.withArgs('id3').resolves(clientsPoliciesMock)
        await getOneClientPolicies(req,res,next);
        chai.expect(res.status.callCount).to.be.eql(1);
        chai.expect(res.status.firstCall.args[0]).to.be.eql(200);
        chai.expect(resJsonMock.firstCall.args[0]).to.be.eql(clientsPoliciesMock);
    })
})