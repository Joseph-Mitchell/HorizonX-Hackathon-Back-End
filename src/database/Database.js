import { connect, disconnect } from 'mongoose';

export default class Database {
    #uri;
    
    constructor(uri) {
        this.#uri = uri;
    }
    
    async connect() {
        try {
            await connect(this.#uri);
        }
        catch (e) {
            console.error("Database connection error", e);
        }
    }
    
    async close() {
        await disconnect();
    }
}
