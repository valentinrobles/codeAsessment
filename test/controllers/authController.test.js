const chai = require("chai");
const sinon = require("sinon");
const chaiAsPromised = require("chai-as-promised");
const proxyquire = require("proxyquire");
chai.use(chaiAsPromised);

const getUserTokenMock = sinon.stub();
const next = sinon.stub();

const tokenObjectMock = {
    token: 'tokenMock',
    type: 'Bearer'
}

const {getToken} = proxyquire('../../src/server/controllers/authController', {
    '../../services/tokenService': {
        getUserToken: getUserTokenMock
    }
})

describe('Test authController', () =>{
    beforeEach(() => {
        next.resetHistory();
    });

    it('Missing username on body throws Bad Request', async () =>{
        const req = {
            body: {},
        };
        chai.expect(
            async () => await getToken(req, res, next).to.throw("Invalid username")
        );
    })

    it('Missing password on body throws Bad Request', async () =>{
        const req = {
            body: {
                username: 'username'
            },
        };
        chai.expect(
            async () => await getToken(req, res, next).to.throw("Invalid password")
        );
    })

    it('Next is called when TokenService throws Unauthorized Error', async () =>{
        const req = {
            body: {
                username: 'username',
                password: 'password'
            }
        };
        const res = {};
        getUserTokenMock.throws({
            code: 401,
            status: 'Unauthorized Error'
        });

        await getToken(req,res,next);
        chai.expect(next.firstCall.args[0].code).to.be.equal(401);
        chai
        .expect(next.firstCall.args[0].status)
        .to.be.equal("Unauthorized Error");
    })

    it('Returns user token successfully', async () =>{
        const req = {
            body: {
                username: 'username',
                password: 'password'
            }
        };
        const resJsonMock = sinon.fake.returns("");
        const resStatusMock = sinon.fake.returns({
            json: resJsonMock,
        });
        const res = { status: resStatusMock };
        
        getUserTokenMock.resolves(tokenObjectMock)

        await getToken(req,res,next);
        chai.expect(res.status.callCount).to.be.eql(1);
        chai.expect(res.status.firstCall.args[0]).to.be.eql(200);
        chai.expect(resJsonMock.firstCall.args[0]).to.be.eql(tokenObjectMock);
    })
})