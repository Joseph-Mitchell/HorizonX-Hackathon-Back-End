import supertest from "supertest";

import Config from "../../src/config/Config.js";
import Server from "../../src/server/Server.js";
import Database from "../../src/database/Database.js";

import { assert } from "chai";
import { existingAccounts, existingRoles, testLogins } from "../data/testAccounts.js";
import AccountService from "../../src/services/Account.service.js";
import AccountController from "../../src/controllers/Account.controller.js";
import AccountRouter from "../../src/routers/Account.router.js";
import Account from "../../src/models/Account.model.js";
import Role from "../../src/models/Role.model.js";

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

describe("Account Integration Tests", () => {
    let server;
    let database;
    let requester;
    
    before(async () => {
        Config.load();
        const { PORT, HOST, DB_URI } = process.env;

        const languageModelRouter = new AccountRouter(new AccountController(new AccountService()), "/accounts");

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
            await Account.deleteMany();
            await Role.deleteMany();
        } catch (e) {
            console.log(e.message);
            throw new Error();
        }
        try {
            let encryptedAccounts = [];
            existingAccounts.forEach((account) => {
                account = { ...account }; //Clone each account to not overwrite test data
                account.password = bcrypt.hashSync(account.password, 8);
                encryptedAccounts.push(account);
            });
            
            await Account.insertMany(encryptedAccounts);
            await Role.insertMany(existingRoles);
        } catch (e) {
            console.log(e.message);
            throw new Error();
        }
    });
    
    describe("Login", () => {
        it("should respond 200 in normal circumstances", async () => {
            //Act
            const response = await requester.post("/accounts/login").send(testLogins.normal);
            
            //Assert
            assert.equal(response.status, 200);
            assert.isOk(jwt.verify(response.body.token, process.env.SECRET));
        });
        
        it("should respond 404 if given username does not exist", async () => {
            //Act
            const response = await requester.post("/accounts/login").send(testLogins.noUser);
            
            //Assert
            assert.equal(response.status, 404);
        });
        
        it("should respond 404 if password does not match", async () => {
            //Act
            const response = await requester.post("/accounts/login").send(testLogins.wrongPass);
            
            //Assert
            assert.equal(response.status, 404);
        });
    })
});