import jwt from "jsonwebtoken";
import sinon from "sinon";
import { assert } from "chai";
import AccountMiddleware from "../../src/middleware/Account.middleware.js";

describe("Account Middleware", () => {
    let stubbedResponse;
    let stubbedNext;
    let testRequest;
    
    describe("authenticateToken", () => {
        let testId = 123;
        
        beforeEach(() => {           
            process.env.SECRET = "testSecret";
            stubbedResponse = {
                status: sinon.stub().returnsThis(),
                send: sinon.stub()
            };      
            stubbedNext = sinon.stub();
            testRequest = { headers: { authentication: jwt.sign({ id: testId }, process.env.SECRET) }, body: {} }
        });
        
        afterEach(() => {
            stubbedResponse = undefined;
            stubbedNext = undefined;
            testRequest = undefined;
            process.env.SECRET = undefined;
        });
        
        it("should call next in normal circumstances", () => {
            //Act
            AccountMiddleware.authenticateToken(testRequest, stubbedResponse, stubbedNext);
            
            //Assert
            assert.equal(testRequest.body.id, testId);
            sinon.assert.called(stubbedNext);
        });
        
        it("should respond 401 if no token provided", () => {
            //Arrange
            testRequest.headers = {};
            
            //Act
            AccountMiddleware.authenticateToken(testRequest, stubbedResponse, stubbedNext);
            
            //Assert
            sinon.assert.calledWith(stubbedResponse.status, 401);
        });
        
        it("should respond 401 if token invalid", () => {
            //Arrange
            testRequest.headers.authentication = "badToken";
            
            //Act
            AccountMiddleware.authenticateToken(testRequest, stubbedResponse, stubbedNext);
            
            //Assert
            sinon.assert.calledWith(stubbedResponse.status, 401);
        });
    });
});