import sinon from "sinon";
import { assert } from "chai";

import LanguageModelController from "../../src/controllers/LanguageModel.controller.js";
import { newModels } from "../data/testModels.js";

describe("Language Model Controller", () => {
    let stubbedModelService;
    let stubbedAccountService;
    let stubbedResponse;
    let testController;
    let testRequest;
    
    describe("getList", () => {
        let responseModels;
        
        beforeEach(() => {
            responseModels = [{}, {}];
            
            stubbedModelService = {
                getList: sinon.stub(),
            };
            stubbedAccountService = {};
            stubbedResponse = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            };
            
            testController = new LanguageModelController(stubbedModelService, stubbedAccountService);
            
            stubbedModelService.getList.resolves({ models: responseModels });
        });
        
        afterEach(() => {
            responseModels = undefined;
            stubbedModelService = undefined;
            stubbedAccountService = undefined;
            stubbedResponse = undefined;
            testController = undefined;
        });
        
        it("should respond with 200 in normal circumstances", async () => {
            //Act
            await testController.getList(testRequest, stubbedResponse);
            
            //Assert
            sinon.assert.called(stubbedModelService.getList);
            sinon.assert.calledWith(stubbedResponse.status, 200);
        });
        
        it("should respond with 404 if getList resolves to empty array", async () => {
            //Arrange
            stubbedModelService.getList.resolves([]);
            
            //Act
            await testController.getList(testRequest, stubbedResponse);
            
            //Assert
            sinon.assert.calledWith(stubbedResponse.status, 404);
        })
    });
    
    describe("getModel", () => {
        let responseModel;
        
        beforeEach(() => {
            responseModel = {};
            
            stubbedModelService = {
                getModelById: sinon.stub(),
            };
            stubbedAccountService = {};
            stubbedResponse = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            };
            
            testController = new LanguageModelController(stubbedModelService, stubbedAccountService);
            testRequest = { params: { id: 1234 } }
            
            stubbedModelService.getModelById.resolves({ models: responseModel });
        });
        
        afterEach(() => {
            responseModel = undefined;
            stubbedModelService = undefined;
            stubbedAccountService = undefined;
            stubbedResponse = undefined;
            testController = undefined;
        });
        
        it("should respond with 200 in normal circumstances", async () => {
            //Act
            await testController.getModel(testRequest, stubbedResponse);
            
            //Assert
            sinon.assert.calledWith(stubbedModelService.getModelById, testRequest.params.id);
            sinon.assert.calledWith(stubbedResponse.status, 200);
        });
        
        it("should respond with 404 if getList resolves to empty array", async () => {
            //Arrange
            stubbedModelService.getModelById.resolves(null);
            
            //Act
            await testController.getModel(testRequest, stubbedResponse);
            
            //Assert
            sinon.assert.calledWith(stubbedResponse.status, 404);
        });
    });
    
    describe("deleteModel", () => {
        let responseModel;
        
        beforeEach(() => {
            responseModel = {};
            
            stubbedModelService = {
                deleteModelById: sinon.stub(),
            };
            stubbedAccountService = {
                getAccountRoleById: sinon.stub(),
            }
            stubbedResponse = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            };
            
            testController = new LanguageModelController(stubbedModelService, stubbedAccountService);
            testRequest = { params: { id: 1234 }, body: { id: 5678 } };
            
            stubbedModelService.deleteModelById.resolves({ models: responseModel });
            stubbedAccountService.getAccountRoleById.resolves({ role: { admin_permissions: true } });
        });
        
        afterEach(() => {
            responseModel = undefined;
            stubbedModelService = undefined;
            stubbedAccountService = undefined;
            stubbedResponse = undefined;
            testController = undefined;
        });
        
        it("should respond 204 in normal circumstances", async () => {
            //Act
            await testController.deleteModel(testRequest, stubbedResponse);

            //Assert
            sinon.assert.calledWith(stubbedModelService.deleteModelById, testRequest.params.id);
            sinon.assert.calledWith(stubbedResponse.status, 204);
        });
        
        it("should respond 403 if account service call resolves with false admin_permissions", async () => {
            //Arrange
            stubbedAccountService.getAccountRoleById.resolves({ role: { admin_permissions: false } });
            
            //Act
            await testController.deleteModel(testRequest, stubbedResponse);

            //Assert
            sinon.assert.calledWith(stubbedResponse.status, 403);
        });
        
        it("should respond 403 if account service call resolves with undefined admin_permissions", async () => {
            //Arrange
            stubbedAccountService.getAccountRoleById.resolves({ role: {} });
            
            //Act
            await testController.deleteModel(testRequest, stubbedResponse);

            //Assert
            sinon.assert.calledWith(stubbedResponse.status, 403);
        });
        
        it("should respond 404 if service call resolves null", async () => {
            //Arrange
            stubbedModelService.deleteModelById.resolves(null);
            
            //Act
            await testController.deleteModel(testRequest, stubbedResponse);

            //Assert
            sinon.assert.calledWith(stubbedResponse.status, 404);
        });
    });
    
    describe("createModel", () => {
        let responseModel;
        
        beforeEach(() => {
            responseModel = {};
            
            stubbedModelService = {
                createModel: sinon.stub(),
            };
            stubbedAccountService = {
                getAccountRoleById: sinon.stub(),
            };
            stubbedResponse = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            };
            
            testController = new LanguageModelController(stubbedModelService, stubbedAccountService);
            testRequest = {
                params: { id: 1234 }, body: {
                    name: newModels.normalModel.name,
                    organization: newModels.normalModel.organization,
                    description: newModels.normalModel.description,
                    date_created: newModels.normalModel.date_created,
                    url: newModels.normalModel.url,
                    datasheet_url: newModels.normalModel.datasheet_url,
                    modality: newModels.normalModel.modality,
                    model_analysis: newModels.normalModel.model_analysis,
                    size: newModels.normalModel.size,
                    dependencies: newModels.normalModel.dependencies,
                    quality_control: newModels.normalModel.quality_control,
                    access: newModels.normalModel.access,
                    license: newModels.normalModel.license,
                    intended_uses: newModels.normalModel.intended_uses,
                    prohibited_uses: newModels.normalModel.prohibited_uses,
                    monitoring: newModels.normalModel.monitoring,
                    feedback: newModels.normalModel.feedback,
                }
            };
            
            stubbedModelService.createModel.resolves({ models: responseModel });
            stubbedAccountService.getAccountRoleById.resolves({ role: { admin_permissions: true } });
        });
        
        afterEach(() => {
            responseModel = undefined;
            stubbedModelService = undefined;
            stubbedAccountService = undefined;
            stubbedResponse = undefined;
            testController = undefined;
        });
        
        it("should respond 201 in normal circumstances", async () => {
            //Act
            await testController.createModel(testRequest, stubbedResponse);

            //Assert
            sinon.assert.calledWith(stubbedAccountService.getAccountRoleById, testRequest.body.id);
            sinon.assert.calledWith(stubbedModelService.createModel,
                testRequest.body.name,
                testRequest.body.organization,
                testRequest.body.description,
                testRequest.body.date_created,
                testRequest.body.url,
                testRequest.body.datasheet_url,
                testRequest.body.modality,
                testRequest.body.model_analysis,
                testRequest.body.size,
                testRequest.body.dependencies,
                testRequest.body.quality_control,
                testRequest.body.access,
                testRequest.body.license,
                testRequest.body.intended_uses,
                testRequest.body.prohibited_uses,
                testRequest.body.monitoring,
                testRequest.body.feedback,
            );
            sinon.assert.calledWith(stubbedResponse.status, 201);
        });
        
        it("should respond 403 if account service call resolves with undefined admin_permissions", async () => {
            //Arrange
            stubbedAccountService.getAccountRoleById.resolves({ role: {} });
            
            //Act
            await testController.createModel(testRequest, stubbedResponse);

            //Assert
            sinon.assert.calledWith(stubbedResponse.status, 403);
        });
        
        it("should respond 400 if model service call resolves null", async () => {
            //Arrange
            stubbedModelService.createModel.resolves(null);
            
            //Act
            await testController.createModel(testRequest, stubbedResponse);

            //Assert
            sinon.assert.calledWith(stubbedResponse.status, 400);
        });
    });
});