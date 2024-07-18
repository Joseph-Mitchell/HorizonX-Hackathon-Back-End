import { Router as ExpressRouter } from "express";

export default class Router {
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
        this.#router.get("/models/all", (req, res) => {
            this.#controller.getList(req, res);
        });
    }
}
