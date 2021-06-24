const chai  = require('chai');
const sinon = require('sinon');
const  {healthController}=require('../../src/server/controllers/healthController')
 

describe('Test health controller', () => {


    it('it returns 200',() =>{

        const req = {};

        const next = {}

        const resJsonMock=sinon.fake.returns("OK")
        const resStatusMock =sinon.fake.returns({
           json:resJsonMock
         })
  
        const res = {
            status:resStatusMock
        }; 
   
         healthController(req,res, next)

        chai.expect(res.status.callCount).to.be.eql(1);
        chai.expect(res.status.firstCall.args).to.be.eql([200]);
        chai.expect(resJsonMock.firstCall.args).to.be.eql([{status:'OK'}]);
    
        })

})