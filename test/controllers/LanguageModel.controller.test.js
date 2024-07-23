import sinon from "sinon";
import { assert } from "chai";
import LanguageModelController from "../../src/controllers/LanguageModel.controller.js";

describe("Language Model Controller", () => {
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
    
    describe("getList", () => {
        let responseModel;
        
        beforeEach(() => {
            responseModel = {};
            
            stubbedService = {
                getModelById: sinon.stub(),
            };
            stubbedResponse = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            };
            
            testController = new LanguageModelController(stubbedService);
            testRequest = { params: { id: 1234 } }
            
            stubbedService.getModelById.resolves({ models: responseModel });
        });
        
        afterEach(() => {
            responseModel = undefined;
            stubbedService = undefined;
            stubbedResponse = undefined;
            testController = undefined;
        });
        
        it("should respond with 200 in normal circumstances", async () => {
            //Act
            await testController.getModel(testRequest, stubbedResponse);
            
            //Assert
            sinon.assert.calledWith(stubbedService.getModelById, testRequest.params.id);
            sinon.assert.calledWith(stubbedResponse.status, 200);
        });
        
        it("should respond with 404 if getList resolves to empty array", async () => {
            //Arrange
            stubbedService.getModelById.resolves(null);
            
            //Act
            await testController.getModel(testRequest, stubbedResponse);
            
            //Assert
            sinon.assert.calledWith(stubbedResponse.status, 404);
        });
    });
    
    describe("getList", () => {
        let responseModel;
        
        beforeEach(() => {
            responseModel = {};
            
            stubbedService = {
                deleteModelById: sinon.stub(),
            };
            stubbedResponse = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            };
            
            testController = new LanguageModelController(stubbedService);
            testRequest = { params: { id: 1234 } };
            
            stubbedService.deleteModelById.resolves({ models: responseModel });
        });
        
        afterEach(() => {
            responseModel = undefined;
            stubbedService = undefined;
            stubbedResponse = undefined;
            testController = undefined;
        });
        
        it("should respond 204 in normal circumstances", async () => {
            //Act
            await testController.deleteModel(testRequest, stubbedResponse);

            //Assert
            sinon.assert.calledWith(stubbedService.deleteModelById, testRequest.params.id);
            sinon.assert.calledWith(stubbedResponse.status, 204);
        });
        
        it("should respond 404 if service call resolves null", async () => {
            //Arrange
            stubbedService.deleteModelById.resolves(null);
            
            //Act
            await testController.deleteModel(testRequest, stubbedResponse);

            //Assert
            sinon.assert.calledWith(stubbedResponse.status, 404);
        });
    });
});