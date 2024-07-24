import { Router as ExpressRouter } from "express";
import AccountMiddleware from "../middleware/Account.middleware.js";
import LanguageModelMiddleware from "../middleware/LanguageModel.middleware.js";

export default class LanguageModelRouter {
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
        this.#router.get("/all", (req, res) => {
            this.#controller.getList(req, res);
        });
        
        this.#router.get("/:id", (req, res) => {
            this.#controller.getModel(req, res);
        });
        
        this.#router.delete("/:id", AccountMiddleware.authenticateToken, (req, res) => {
            this.#controller.deleteModel(req, res);
        });
        
        this.#router.post("/", [AccountMiddleware.authenticateToken, LanguageModelMiddleware.validateModelDetails()], (req, res) => {
            this.#controller.createModel(req, res);
        });
    }
}
