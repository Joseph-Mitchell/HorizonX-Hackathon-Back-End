import express from "express";
import cors from "cors";

export default class Server {
    #app;
    #host;
    #port;
    #routers;
    #server;
    
    getApp () {
        return this.#app;
    }
    
    constructor(port, host, routers) {
        this.#app = express();
        this.#port = port;
        this.#host = host;
        this.#server = null;
        this.#routers = routers;
    }
    
    start() {
        if (this.#host === undefined) {
            this.#server = this.#app.listen(this.#port, () => {
                console.log(`Server is listening on port ${this.#port}`);
            });
        } else {
            this.#server = this.#app.listen(this.#port, this.#host, () => {
                console.log(`Server is listening on http://${this.#host}:${this.#port}`);
            });
        }
        
        this.#app.use(cors());
        this.#app.use(express.json({ limit: "10mb" }))
        
        this.#routers.forEach(router => {
            this.#app.use(router.getPathRoot(), router.getRouter());
        });
    }
    
    close() {
        this.#server?.close();
    }
}
