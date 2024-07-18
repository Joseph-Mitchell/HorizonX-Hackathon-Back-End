import sinon from "sinon";
import { assert } from "chai";
import LanguageModelController from "../../src/controllers/LanguageModel.controller.js";

describe("Account Controller", () => {
    let stubbedService;
    let stubbedResponse;
    let testController;
    let testRequest;
    
    describe("getList", () => {
        let responseModels;
        
        beforeEach(() => {
            responseModels = [{}, {}];
            
            stubbedService = {
                getList: sinon.stub(),
            };
            stubbedResponse = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            };
            
            testController = new LanguageModelController(stubbedService);
            
            stubbedService.getList.resolves({ models: responseModels });
        });
        
        afterEach(() => {
            responseModels = undefined;
            stubbedService = undefined;
            stubbedResponse = undefined;
            testController = undefined;
        });
        
        it("should respond with 200 in normal circumstances", async () => {
            //Act
            await testController.getList(testRequest, stubbedResponse);
            
            //Assert
            sinon.assert.called(stubbedService.getList);
            sinon.assert.calledWith(stubbedResponse.status, 200);
        });
        
        it("should respond with 404 if getList resolves to empty array", async () => {
            //Arrange
            stubbedService.getList.resolves([]);
            
            //Act
            await testController.getList(testRequest, stubbedResponse);
            
            //Assert
            sinon.assert.calledWith(stubbedResponse.status, 404);
        })
    });
});