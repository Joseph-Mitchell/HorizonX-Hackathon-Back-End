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

        const accountRouter = new AccountRouter(new AccountController(new AccountService()), "/accounts");

        server = new Server(PORT, HOST, [accountRouter]);
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
    });
    
    describe("Login With Token", () => {
        it("should respond 200 in normal circumstances", async () => {
            //Arrange
            const token = jwt.sign({ id: existingAccounts[0]._id.toString() }, process.env.SECRET, { expiresIn: "1 week" });

            //Act
            const response = await requester.post("/accounts/logintoken").set({ "Authentication": token });
            
            //Assert
            assert.equal(response.status, 200);
            assert.isOk(jwt.verify(response.body.token, process.env.SECRET));
        });
        
        it("should respond 401 if no token given", async () => {
            //Act
            const response = await requester.post("/accounts/logintoken");
            
            //Assert
            assert.equal(response.status, 401);
        });
        
        it("should respond 401 if token is invalid", async () => {
            //Arrange
            const token = "invalidToken";

            //Act
            const response = await requester.post("/accounts/logintoken").set({ "Authentication": token });
            
            //Assert
            assert.equal(response.status, 401);
        });
        
        it("should respond 404 if given id has no match", async () => {
            //Arrange
            const token = jwt.sign({ id: "669e9e63fb809ab035750a75" }, process.env.SECRET, { expiresIn: "1 week" });

            //Act
            const response = await requester.post("/accounts/logintoken").set({ "Authentication": token });
            
            //Assert
            assert.equal(response.status, 404);
        });
    });
});