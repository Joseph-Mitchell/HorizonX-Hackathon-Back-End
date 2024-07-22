import bcrypt from "bcrypt";
import sinon from "sinon";
import { existingAccounts } from "../data/testAccounts.js";
import AccountController from "../../src/controllers/Account.controller.js";

describe("Account Controller", () => {
    let stubbedService;
    let stubbedResponse;
    let testController;
    let testRequest;
    
    describe("login", () => {
        beforeEach(() => {    
            process.env.SECRET = "testSecret";
            
            stubbedService = {
                getAccountByUsername: sinon.stub(),
            };
            stubbedResponse = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            };
            
            testController = new AccountController(stubbedService);
            testRequest = {
                body: {
                    username: existingAccounts[0].username,
                    password: existingAccounts[0].password,
                }
            };
            
            const responseAccount = {
                _id: "testId",
                username: existingAccounts[0].username,
                password: bcrypt.hashSync(existingAccounts[0].password, 8),
                role: existingAccounts[0].role,
            };
            stubbedService.getAccountByUsername.resolves(responseAccount);
        });
        
        afterEach(() => {
            stubbedService = undefined;
            stubbedResponse = undefined;
            testController = undefined;
            testRequest = undefined;
        });
        
        it("should respond 200 in normal circumstances", async () => {
            //Act
            await testController.login(testRequest, stubbedResponse);
            
            //Assert
            sinon.assert.calledWith(stubbedService.getAccountByUsername, testRequest.body.username);
            sinon.assert.calledWith(stubbedResponse.status, 200);
        });
        
        it("should respond 404 if service response is null", async () => {
            //Arrange
            stubbedService.getAccountByUsername.resolves(null);
            
            //Act
            await testController.login(testRequest, stubbedResponse);
            
            //Assert
            sinon.assert.calledWith(stubbedResponse.status, 404);
        });
        
        it("should respond 404 if passwords do not match", async () => {
            //Arrange
            testRequest.body.password = "wrongPass";
            
            //Act
            await testController.login(testRequest, stubbedResponse);
            
            //Assert
            sinon.assert.calledWith(stubbedResponse.status, 404);
        });
    });
});