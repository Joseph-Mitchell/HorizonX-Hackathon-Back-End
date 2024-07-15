import { config } from 'dotenv';

export default class Config {
    
    static #nodeEnv = process.env.NODE_ENV;
    
    static load() {
        if (Config.#nodeEnv !== "prod") {
            config({
                path: "src/config/.env.dev"
            });
        }
    }
}
