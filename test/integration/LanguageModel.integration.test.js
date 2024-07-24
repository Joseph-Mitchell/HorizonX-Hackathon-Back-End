import supertest from "supertest";

import Config from "../../src/config/Config.js";
import Server from "../../src/server/Server.js";
import Database from "../../src/database/Database.js";
import LanguageModelRouter from "../../src/routers/LanguageModel.router.js";
import LanguageModelController from "../../src/controllers/LanguageModel.controller.js";
import LanguageModelService from "../../src/services/LanguageModel.service.js";
import LanguageModel from "../../src/models/LanguageModel.model.js";

import { existingModels, newModels } from "../data/testModels.js";
import { existingAccounts } from "../data/testAccounts.js";
import { assert } from "chai";
import AccountService from "../../src/services/Account.service.js";

import jwt from "jsonwebtoken";

describe("Language Model Integration Tests", () => {
    let server;
    let database;
    let requester;
    
    before(async () => {
        Config.load();
        const { PORT, HOST, DB_URI } = process.env;

        const languageModelRouter = new LanguageModelRouter(new LanguageModelController(new LanguageModelService(), new AccountService()), "/models");

        server = new Server(PORT, HOST, [languageModelRouter]);
        database = new Database(DB_URI);

        server.start();
        await database.connect();
        
        requester = supertest(server.getApp());
    });
    
    after(async () => {
        server.close();
        await database.close();
    });
    
    beforeEach(async () => {
        try {
            await LanguageModel.deleteMany();
        } catch (e) {
            console.log(e.message);
            throw new Error();
        }
        try {
            await LanguageModel.insertMany(existingModels);
        } catch (e) {
            console.log(e.message);
            throw new Error();
        }
    });
    
    describe("Get Models List", () => {
        it("should respond with 200 in normal circumstances", async () => {
            //Act
            const actual = await requester.get("/models/all");
            
            //Assert
            assert.equal(actual.status, 200);
        });
        
        it("should respond with 404 if models collection empty", async () => {
            //Arrange
            await LanguageModel.deleteMany();
            
            //Act
            const actual = await requester.get("/models/all");
            
            //Assert
            assert.equal(actual.status, 404);
        });
        
        it("should respond with 500 if database offline", async () => {
            //Arrange
            await database.close();
            
            //Act
            const actual = await requester.get("/models/all");
            
            //Assert
            assert.equal(actual.status, 500);
            
            //Cleanup
            await database.connect();
        });
    });
    
    describe("Get Model Details", () => {
        it("should respond with 200 in normal circumstances", async () => {
            //Act
            const actual = await requester.get("/models/669e1a58266ddadc5bd715c3");

            //Assert
            assert.equal(actual.status, 200);
        });
        
        it("should respond with 404 if wrong id given", async () => {      
            //Act
            const actual = await requester.get("/models/669e1b0ad10bfdf30f6293c1");
            
            //Assert
            assert.equal(actual.status, 404);
        });
        
        it("should respond with 500 if database offline", async () => {
            //Arrange
            await database.close();
            
            //Act
            const actual = await requester.get("/models/669e1a58266ddadc5bd715c3");
            
            //Assert
            assert.equal(actual.status, 500);
            
            //Cleanup
            await database.connect();
        });
    });
    
    describe("Delete Model", () => {
        it("should respond with 204 in normal circumstances", async () => {
            //Arrange
            const token = jwt.sign({ id: existingAccounts[0]._id.toString() }, process.env.SECRET, { expiresIn: "1 week" });

            //Act
            const response = await requester
                .delete("/models/669e1a58266ddadc5bd715c3")
                .set({ "Authentication": token });

            //Assert
            assert.equal(response.status, 204);
            
            const assertResponse = await requester.get("/models/669e1a58266ddadc5bd715c3");           
            assert.equal(assertResponse.status, 404);
        });
        
        it("should respond with 403 if token user is not authorized", async () => {
            //Arrange
            const token = jwt.sign({ id: existingAccounts[1]._id.toString() }, process.env.SECRET, { expiresIn: "1 week" });

            //Act
            const response = await requester
                .delete("/models/669e1a58266ddadc5bd715c3")
                .set({ "Authentication": token });

            //Assert
            assert.equal(response.status, 403);
            
            const assertResponse = await requester.get("/models/669e1a58266ddadc5bd715c3");           
            assert.equal(assertResponse.status, 200);
        });
        
        it("should respond with 404 if given model does not exist", async () => {
            //Arrange
            const token = jwt.sign({ id: existingAccounts[0]._id.toString() }, process.env.SECRET, { expiresIn: "1 week" });

            //Act
            const response = await requester
                .delete("/models/669e1b0ad10bfdf30f6293c1")
                .set({ "Authentication": token });

            //Assert
            assert.equal(response.status, 404);
        });
    });
    
    describe("Create Model", () => {
        it("should respond with 201 in normal circumstances", async () => {
            //Arrange
            const token = jwt.sign({ id: existingAccounts[0]._id.toString() }, process.env.SECRET, { expiresIn: "1 week" });

            //Act
            const response = await requester
                .post("/models")
                .send(newModels.normalModel)
                .set({ "Authentication": token });

            //Assert
            assert.equal(response.status, 201);
            
            const assertResponse = await requester.get("/models/all");           
            assert.equal(assertResponse._body.models.length, 3);
        });
        
        it("should respond with 400 if name empty", async () => {
            //Arrange
            const token = jwt.sign({ id: existingAccounts[0]._id.toString() }, process.env.SECRET, { expiresIn: "1 week" });

            //Act
            const response = await requester
                .post("/models")
                .send(newModels.emptyName)
                .set({ "Authentication": token });

            //Assert
            assert.equal(response.status, 400);
            
            const assertResponse = await requester.get("/models/all");           
            assert.equal(assertResponse._body.models.length, 2);
        });
        
        it("should respond with 400 if name missing", async () => {
            //Arrange
            const token = jwt.sign({ id: existingAccounts[0]._id.toString() }, process.env.SECRET, { expiresIn: "1 week" });

            //Act
            const response = await requester
                .post("/models")
                .send(newModels.missingName)
                .set({ "Authentication": token });

            //Assert
            assert.equal(response.status, 400);
            
            const assertResponse = await requester.get("/models/all");           
            assert.equal(assertResponse._body.models.length, 2);
        });
        
        it("should respond with 400 if organization empty", async () => {
            //Arrange
            const token = jwt.sign({ id: existingAccounts[0]._id.toString() }, process.env.SECRET, { expiresIn: "1 week" });

            //Act
            const response = await requester
                .post("/models")
                .send(newModels.emptyOrganization)
                .set({ "Authentication": token });

            //Assert
            assert.equal(response.status, 400);
            
            const assertResponse = await requester.get("/models/all");           
            assert.equal(assertResponse._body.models.length, 2);
        });
        
        it("should respond with 400 if organization missing", async () => {
            //Arrange
            const token = jwt.sign({ id: existingAccounts[0]._id.toString() }, process.env.SECRET, { expiresIn: "1 week" });

            //Act
            const response = await requester
                .post("/models")
                .send(newModels.missingOrganization)
                .set({ "Authentication": token });

            //Assert
            assert.equal(response.status, 400);
            
            const assertResponse = await requester.get("/models/all");           
            assert.equal(assertResponse._body.models.length, 2);
        });
        
        it("should respond with 400 if date empty", async () => {
            //Arrange
            const token = jwt.sign({ id: existingAccounts[0]._id.toString() }, process.env.SECRET, { expiresIn: "1 week" });

            //Act
            const response = await requester
                .post("/models")
                .send(newModels.emptyDate)
                .set({ "Authentication": token });

            //Assert
            assert.equal(response.status, 400);
            
            const assertResponse = await requester.get("/models/all");           
            assert.equal(assertResponse._body.models.length, 2);
        });
        
        it("should respond with 400 if date missing", async () => {
            //Arrange
            const token = jwt.sign({ id: existingAccounts[0]._id.toString() }, process.env.SECRET, { expiresIn: "1 week" });

            //Act
            const response = await requester
                .post("/models")
                .send(newModels.missingDate)
                .set({ "Authentication": token });

            //Assert
            assert.equal(response.status, 400);
            
            const assertResponse = await requester.get("/models/all");           
            assert.equal(assertResponse._body.models.length, 2);
        });
        
        it("should respond with 400 if date invalid", async () => {
            //Arrange
            const token = jwt.sign({ id: existingAccounts[0]._id.toString() }, process.env.SECRET, { expiresIn: "1 week" });

            //Act
            const response = await requester
                .post("/models")
                .send(newModels.invalidDate)
                .set({ "Authentication": token });

            //Assert
            assert.equal(response.status, 400);
            
            const assertResponse = await requester.get("/models/all");           
            assert.equal(assertResponse._body.models.length, 2);
        });
        
        it("should respond with 201 if date utc format", async () => {
            //Arrange
            const token = jwt.sign({ id: existingAccounts[0]._id.toString() }, process.env.SECRET, { expiresIn: "1 week" });

            //Act
            const response = await requester
                .post("/models")
                .send(newModels.utcDate)
                .set({ "Authentication": token });

            //Assert
            assert.equal(response.status, 201);
            
            const assertResponse = await requester.get("/models/all");           
            assert.equal(assertResponse._body.models.length, 3);
        });
        
        it("should respond with 400 if url empty", async () => {
            //Arrange
            const token = jwt.sign({ id: existingAccounts[0]._id.toString() }, process.env.SECRET, { expiresIn: "1 week" });

            //Act
            const response = await requester
                .post("/models")
                .send(newModels.emptyURL)
                .set({ "Authentication": token });

            //Assert
            assert.equal(response.status, 400);
            
            const assertResponse = await requester.get("/models/all");           
            assert.equal(assertResponse._body.models.length, 2);
        });
        
        it("should respond with 400 if url missing", async () => {
            //Arrange
            const token = jwt.sign({ id: existingAccounts[0]._id.toString() }, process.env.SECRET, { expiresIn: "1 week" });

            //Act
            const response = await requester
                .post("/models")
                .send(newModels.missingURL)
                .set({ "Authentication": token });

            //Assert
            assert.equal(response.status, 201);
            
            const assertResponse = await requester.get("/models/all");           
            assert.equal(assertResponse._body.models.length, 3);
        });
        
        it("should respond with 400 if url invalid", async () => {
            //Arrange
            const token = jwt.sign({ id: existingAccounts[0]._id.toString() }, process.env.SECRET, { expiresIn: "1 week" });

            //Act
            const response = await requester
                .post("/models")
                .send(newModels.invalidURL)
                .set({ "Authentication": token });

            //Assert
            assert.equal(response.status, 400);
            
            const assertResponse = await requester.get("/models/all");           
            assert.equal(assertResponse._body.models.length, 2);
        });
        
        it("should respond with 400 if datasheet url empty", async () => {
            //Arrange
            const token = jwt.sign({ id: existingAccounts[0]._id.toString() }, process.env.SECRET, { expiresIn: "1 week" });

            //Act
            const response = await requester
                .post("/models")
                .send(newModels.emptyDatasheet)
                .set({ "Authentication": token });

            //Assert
            assert.equal(response.status, 400);
            
            const assertResponse = await requester.get("/models/all");           
            assert.equal(assertResponse._body.models.length, 2);
        });
        
        it("should respond with 201 if datasheet url missing", async () => {
            //Arrange
            const token = jwt.sign({ id: existingAccounts[0]._id.toString() }, process.env.SECRET, { expiresIn: "1 week" });

            //Act
            const response = await requester
                .post("/models")
                .send(newModels.missingDatasheet)
                .set({ "Authentication": token });

            //Assert
            assert.equal(response.status, 201);
            
            const assertResponse = await requester.get("/models/all");           
            assert.equal(assertResponse._body.models.length, 3);
        });
        
        it("should respond with 400 if datasheet url invalid", async () => {
            //Arrange
            const token = jwt.sign({ id: existingAccounts[0]._id.toString() }, process.env.SECRET, { expiresIn: "1 week" });

            //Act
            const response = await requester
                .post("/models")
                .send(newModels.invalidDatasheet)
                .set({ "Authentication": token });

            //Assert
            assert.equal(response.status, 400);
            
            const assertResponse = await requester.get("/models/all");           
            assert.equal(assertResponse._body.models.length, 2);
        });
        
        it("should respond with 400 if modality empty", async () => {
            //Arrange
            const token = jwt.sign({ id: existingAccounts[0]._id.toString() }, process.env.SECRET, { expiresIn: "1 week" });

            //Act
            const response = await requester
                .post("/models")
                .send(newModels.emptyModality)
                .set({ "Authentication": token });

            //Assert
            assert.equal(response.status, 400);
            
            const assertResponse = await requester.get("/models/all");           
            assert.equal(assertResponse._body.models.length, 2);
        });
        
        it("should respond with 400 if modality empty", async () => {
            //Arrange
            const token = jwt.sign({ id: existingAccounts[0]._id.toString() }, process.env.SECRET, { expiresIn: "1 week" });

            //Act
            const response = await requester
                .post("/models")
                .send(newModels.missingModality)
                .set({ "Authentication": token });

            //Assert
            assert.equal(response.status, 400);
            
            const assertResponse = await requester.get("/models/all");           
            assert.equal(assertResponse._body.models.length, 2);
        });
        
        it("should respond with 400 if dependency name empty", async () => {
            //Arrange
            const token = jwt.sign({ id: existingAccounts[0]._id.toString() }, process.env.SECRET, { expiresIn: "1 week" });

            //Act
            const response = await requester
                .post("/models")
                .send(newModels.emptyDependencyName)
                .set({ "Authentication": token });

            //Assert
            assert.equal(response.status, 400);
            
            const assertResponse = await requester.get("/models/all");           
            assert.equal(assertResponse._body.models.length, 2);
        });
        
        it("should respond with 400 if dependency name missing", async () => {
            //Arrange
            const token = jwt.sign({ id: existingAccounts[0]._id.toString() }, process.env.SECRET, { expiresIn: "1 week" });

            //Act
            const response = await requester
                .post("/models")
                .send(newModels.missingDependencyName)
                .set({ "Authentication": token });

            //Assert
            assert.equal(response.status, 400);
            
            const assertResponse = await requester.get("/models/all");           
            assert.equal(assertResponse._body.models.length, 2);
        });
        
        it("should respond with 400 if dependency url empty", async () => {
            //Arrange
            const token = jwt.sign({ id: existingAccounts[0]._id.toString() }, process.env.SECRET, { expiresIn: "1 week" });

            //Act
            const response = await requester
                .post("/models")
                .send(newModels.emptyDependencyURL)
                .set({ "Authentication": token });

            //Assert
            assert.equal(response.status, 400);
            
            const assertResponse = await requester.get("/models/all");           
            assert.equal(assertResponse._body.models.length, 2);
        });
        
        it("should respond with 201 if dependency url missing", async () => {
            //Arrange
            const token = jwt.sign({ id: existingAccounts[0]._id.toString() }, process.env.SECRET, { expiresIn: "1 week" });

            //Act
            const response = await requester
                .post("/models")
                .send(newModels.missingDependencyURL)
                .set({ "Authentication": token });

            //Assert
            assert.equal(response.status, 201);
            
            const assertResponse = await requester.get("/models/all");           
            assert.equal(assertResponse._body.models.length, 3);
        });
        
        it("should respond with 400 if dependency url invalid", async () => {
            //Arrange
            const token = jwt.sign({ id: existingAccounts[0]._id.toString() }, process.env.SECRET, { expiresIn: "1 week" });

            //Act
            const response = await requester
                .post("/models")
                .send(newModels.invalidDependencyURL)
                .set({ "Authentication": token });

            //Assert
            assert.equal(response.status, 400);
            
            const assertResponse = await requester.get("/models/all");           
            assert.equal(assertResponse._body.models.length, 2);
        });
        
        it("should respond with 201 if dependency array empty", async () => {
            //Arrange
            const token = jwt.sign({ id: existingAccounts[0]._id.toString() }, process.env.SECRET, { expiresIn: "1 week" });

            //Act
            const response = await requester
                .post("/models")
                .send(newModels.emptyDependencies)
                .set({ "Authentication": token });

            //Assert
            assert.equal(response.status, 201);
            
            const assertResponse = await requester.get("/models/all");           
            assert.equal(assertResponse._body.models.length, 3);
        });
        
        it("should respond with 201 if dependency array missing", async () => {
            //Arrange
            const token = jwt.sign({ id: existingAccounts[0]._id.toString() }, process.env.SECRET, { expiresIn: "1 week" });

            //Act
            const response = await requester
                .post("/models")
                .send(newModels.missingDependencies)
                .set({ "Authentication": token });

            //Assert
            assert.equal(response.status, 201);
            
            const assertResponse = await requester.get("/models/all");           
            assert.equal(assertResponse._body.models.length, 3);
        });
        
        it("should respond with 201 if access is closed", async () => {
            //Arrange
            const token = jwt.sign({ id: existingAccounts[0]._id.toString() }, process.env.SECRET, { expiresIn: "1 week" });

            //Act
            const response = await requester
                .post("/models")
                .send(newModels.closedAccess)
                .set({ "Authentication": token });

            //Assert
            assert.equal(response.status, 201);
            
            const assertResponse = await requester.get("/models/all");           
            assert.equal(assertResponse._body.models.length, 3);
        });
        
        it("should respond with 201 if access is limited", async () => {
            //Arrange
            const token = jwt.sign({ id: existingAccounts[0]._id.toString() }, process.env.SECRET, { expiresIn: "1 week" });

            //Act
            const response = await requester
                .post("/models")
                .send(newModels.limitedAccess)
                .set({ "Authentication": token });

            //Assert
            assert.equal(response.status, 201);
            
            const assertResponse = await requester.get("/models/all");           
            assert.equal(assertResponse._body.models.length, 3);
        });
        
        it("should respond with 400 if access is empty", async () => {
            //Arrange
            const token = jwt.sign({ id: existingAccounts[0]._id.toString() }, process.env.SECRET, { expiresIn: "1 week" });

            //Act
            const response = await requester
                .post("/models")
                .send(newModels.emptyAccess)
                .set({ "Authentication": token });

            //Assert
            assert.equal(response.status, 400);
            
            const assertResponse = await requester.get("/models/all");           
            assert.equal(assertResponse._body.models.length, 2);
        });
        
        it("should respond with 400 if access is missing", async () => {
            //Arrange
            const token = jwt.sign({ id: existingAccounts[0]._id.toString() }, process.env.SECRET, { expiresIn: "1 week" });

            //Act
            const response = await requester
                .post("/models")
                .send(newModels.missingAccess)
                .set({ "Authentication": token });

            //Assert
            assert.equal(response.status, 400);
            
            const assertResponse = await requester.get("/models/all");           
            assert.equal(assertResponse._body.models.length, 2);
        });
        
        it("should respond with 400 if access is invalid", async () => {
            //Arrange
            const token = jwt.sign({ id: existingAccounts[0]._id.toString() }, process.env.SECRET, { expiresIn: "1 week" });

            //Act
            const response = await requester
                .post("/models")
                .send(newModels.invalidAccess)
                .set({ "Authentication": token });

            //Assert
            assert.equal(response.status, 400);
            
            const assertResponse = await requester.get("/models/all");           
            assert.equal(assertResponse._body.models.length, 2);
        });
        
        it("should respond with 400 if access is contains multiple out of valid values", async () => {
            //Arrange
            const token = jwt.sign({ id: existingAccounts[0]._id.toString() }, process.env.SECRET, { expiresIn: "1 week" });

            //Act
            const response = await requester
                .post("/models")
                .send(newModels.multiAccess)
                .set({ "Authentication": token });

            //Assert
            assert.equal(response.status, 400);
            
            const assertResponse = await requester.get("/models/all");           
            assert.equal(assertResponse._body.models.length, 2);
        });
    });
    
    describe("Edit Model", () => {
        it("should respond with 204 in normal circumstances", async () => {
            //Arrange
            const token = jwt.sign({ id: existingAccounts[0]._id.toString() }, process.env.SECRET, { expiresIn: "1 week" });

            //Act
            const response = await requester
                .put("/models/" + existingModels[0]._id)
                .send(newModels.normalModel)
                .set({ "Authentication": token });

            //Assert
            assert.equal(response.status, 204);
            
            const assertResponse = await requester.get("/models/all");
            assert.equal(assertResponse._body.models[0].name, newModels.normalModel.name);
        });
        
        it("should respond with 403 with unauthorized user", async () => {
            //Arrange
            const token = jwt.sign({ id: existingAccounts[1]._id.toString() }, process.env.SECRET, { expiresIn: "1 week" });

            //Act
            const response = await requester
                .put("/models/" + existingModels[0]._id)
                .send(newModels.normalModel)
                .set({ "Authentication": token });

            //Assert
            assert.equal(response.status, 403);
            
            const assertResponse = await requester.get("/models/all");
            assert.notEqual(assertResponse._body.models[0].name, newModels.normalModel.name);
        });
        
        it("should respond with 401 with non existant user id", async () => {
            //Arrange
            const token = jwt.sign({ id: "66a106940fabd81ebcf76101" }, process.env.SECRET, { expiresIn: "1 week" });

            //Act
            const response = await requester
                .put("/models/" + existingModels[0]._id)
                .send(newModels.normalModel)
                .set({ "Authentication": token });

            //Assert
            assert.equal(response.status, 401);
            
            const assertResponse = await requester.get("/models/all");
            assert.notEqual(assertResponse._body.models[0].name, newModels.normalModel.name);
        });
        
        it("should respond with 404 with non existant model id", async () => {
            //Arrange
            const token = jwt.sign({ id: existingAccounts[0]._id.toString() }, process.env.SECRET, { expiresIn: "1 week" });

            //Act
            const response = await requester
                .put("/models/66a106940fabd81ebcf76101")
                .send(newModels.normalModel)
                .set({ "Authentication": token });

            //Assert
            assert.equal(response.status, 404);
            
            const assertResponse = await requester.get("/models/all");
            assert.notEqual(assertResponse._body.models[0].name, newModels.normalModel.name);
        });
    });
});