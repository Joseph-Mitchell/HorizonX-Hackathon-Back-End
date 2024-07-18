import supertest from "supertest";

import Config from "../../src/config/Config.js";
import Server from "../../src/server/Server.js";
import Database from "../../src/database/Database.js";
import LanguageModelRouter from "../../src/routers/LanguageModel.router.js";
import LanguageModelController from "../../src/controllers/LanguageModel.controller.js";
import LanguageModelService from "../../src/services/LanguageModel.service.js";
import LanguageModel from "../../src/models/LanguageModel.model.js";

import { existingModels } from "../data/testModels.js";
import { assert } from "chai";

describe("Account Integration Tests", () => {
    let server;
    let database;
    let requester;
    
    before(async () => {
        Config.load();
        const { PORT, HOST, DB_URI } = process.env;

        const languageModelRouter = new LanguageModelRouter(new LanguageModelController(new LanguageModelService()), "/models");

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
        });
    });
});