const chai = require('chai');
const nock = require('nock')
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const app = require('../../src/server/app');

const config = require('config');
const {client_id,client_secret} = config.get('insuranceApiRest');
const {responseTokenMock,tokenMock,typeMock} = require('./configStubs/login')

describe('Integration test: /login route', () =>{
    beforeEach(()=>{
        nock.cleanAll();
    });

    const usernameMock = 'username';
    const passwordMock = 'password'

    it('POST /login returns HTTP 200 with correct params',(done)=>{

        nock('https://dare-nodejs-assessment.herokuapp.com')
        .matchHeader('Content-type', 'application/json')
        .post('/api/login',JSON.stringify({client_id,client_secret}))
        .reply(200, JSON.stringify(responseTokenMock))

        chai
        .request(app)
        .post(`/login`)
        .send({
            username: usernameMock,
            password: passwordMock
        })
        .end((err, res) => {
            chai.expect(res).to.have.status(200);
            chai.expect(res.body).to.eql({token: tokenMock, type: typeMock});
            done();
        });
    })


})