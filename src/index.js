import Config from './config/Config.js';
import Server from "./server/Server.js";
import Database from "./database/database.js";

Config.load();
const { PORT, HOST, DB_URI } = process.env;

const routers = [];
const server = new Server(PORT, HOST, routers);
const database = new Database(DB_URI);

server.start();
database.connect();
