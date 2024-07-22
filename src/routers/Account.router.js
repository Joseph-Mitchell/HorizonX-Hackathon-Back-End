import { Router as ExpressRouter } from "express";
import AccountMiddleware from "../middleware/Account.middleware.js";

export default class AccountRouter {
    #router;
    #pathRoot;
    #controller;
    
    getRouter() {
        return this.#router;
    }
    
    getPathRoot() {
        return this.#pathRoot;
    }
    
    constructor(controller, pathRoot) {
        this.#router = ExpressRouter();
        this.#pathRoot = pathRoot;
        this.#controller = controller;
        
        this.#initialiseRouter();
    }
    
    #initialiseRouter() {
        this.#router.post("/login", (req, res) => {
            this.#controller.login(req, res);
        });
        this.#router.post("/logintoken", AccountMiddleware.authenticateToken, (req, res) => {
            this.#controller.tokenLogin(req, res);
        });
    }
}
