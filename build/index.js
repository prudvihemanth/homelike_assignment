"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hapi_1 = require("@hapi/hapi");
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = __importDefault(require("./src/utils/logger"));
const plugins_1 = __importDefault(require("./src/plugins/plugins"));
const userRoutes_1 = __importDefault(require("./src/routes/userRoutes"));
const apartmentRoutes_1 = __importDefault(require("./src/routes/apartmentRoutes"));
//import { validate } from "./src/utils/auth"
const dotenv = __importStar(require("dotenv"));
const init = () => __awaiter(void 0, void 0, void 0, function* () {
    const server = new hapi_1.Server({
        port: 3000,
        host: 'localhost'
    });
    const basePath = "/api/v1/";
    //register env
    dotenv.config();
    // register Hapi js plugins
    yield server.register(plugins_1.default);
    //define auth strategy
    // server.auth.strategy('jwt', 'jwt',
    //     {
    //         key: process.env.AUTH_SECRET,
    //         validate
    //     });
    // server.auth.default('jwt');
    //service heartbeat route
    server.route({
        method: 'GET',
        path: `${basePath}ping`,
        options: {
            auth: false
        },
        handler: () => {
            return { service: "homelike", version: "v1", status: "up" };
        }
    });
    //register service Routes
    server.route([...userRoutes_1.default, ...apartmentRoutes_1.default]);
    //db connection with Authentication and Avl support
    const dbOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    };
    let isConnectedBefore = false;
    let connect = () => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.connect('mongodb://localhost:27017/homelike', dbOptions, (err) => {
            if (err) {
                logger_1.default.error("mongodb connection error", err);
            }
            else {
                isConnectedBefore = true;
                logger_1.default.info("mongodb connected");
            }
        });
    });
    // mongoose events
    mongoose_1.default.connection.on('error', err => {
        logger_1.default.error(err);
    });
    mongoose_1.default.connection.on('disconnected', () => __awaiter(void 0, void 0, void 0, function* () {
        logger_1.default.error('Lost MongoDB connection...');
        if (!isConnectedBefore)
            yield connect();
    }));
    mongoose_1.default.connection.on('connected', () => {
        isConnectedBefore = true;
        logger_1.default.info('Connection established to MongoDB');
    });
    mongoose_1.default.connection.on('reconnected', () => {
        logger_1.default.info('Reconnected to MongoDB');
    });
    // Close the Mongoose connection, when receiving SIGINT
    process.on('SIGINT', () => {
        mongoose_1.default.connection.close(() => {
            logger_1.default.warn('Forced to close the MongoDB conection');
            process.exit(0);
        });
    });
    yield server.start();
    yield connect();
    logger_1.default.info(`Server running on ${server.info.uri}`);
});
process.on('unhandledRejection', (err) => {
    logger_1.default.error(err);
    process.exit(1);
});
init();
