import supertest from "supertest";

import Config from "../../src/config/Config.js";
import Server from "../../src/server/Server.js";
import Database from "../../src/database/Database.js";
import LanguageModelRouter from "../../src/routers/LanguageModel.router.js";
import LanguageModelController from "../../src/controllers/LanguageModel.controller.js";
import LanguageModelService from "../../src/services/LanguageModel.service.js";
import LanguageModel from "../../src/models/LanguageModel.model.js";

import { existingModels } from "../data/testModels.js";
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
});