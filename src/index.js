import Config from './config/Config.js';
import Server from "./server/Server.js";
import Database from "./database/Database.js";
import LanguageModelRouter from './routers/LanguageModel.router.js';
import LanguageModelController from './controllers/LanguageModel.controller.js';
import LanguageModelService from './services/LanguageModel.service.js';
import AccountRouter from './routers/Account.router.js';
import AccountController from './controllers/Account.controller.js';
import AccountService from './services/Account.service.js';

Config.load();
const { PORT, HOST, DB_URI } = process.env;

const languageModelRouter = new LanguageModelRouter(new LanguageModelController(new LanguageModelService(), new AccountService()), "/models");
const accountRouter = new AccountRouter(new AccountController(new AccountService()), "/accounts");

const routers = [languageModelRouter, accountRouter];
const server = new Server(PORT, HOST, routers);
const database = new Database(DB_URI);

server.start();
database.connect();