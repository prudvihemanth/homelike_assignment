import {  Server } from "@hapi/hapi";
import mongoose from 'mongoose';
import Logger from "./src/utils/logger";
import plugins from "./src/plugins/plugins"
import userRoutes from "./src/routes/userRoutes";
import apartmentRoutes from "./src/routes/apartmentRoutes";
import { authController } from "./src/utils/auth";
// import * as dotenv from "dotenv";

const controller = new authController();

const validate = controller.validate;

const init = async () => {

    const server: Server = new Server({
        port: 3000,
        host: '0.0.0.0',
            routes: {
                validate: {
                    failAction: (request, h, err) => {
                        throw err;
                    }
                }
            }
    });

    const basePath: string = "/api/v1/";

    //register env
    require('dotenv').config()

    // register Hapi js plugins
    await server.register(plugins);

    // define auth strategy
    server.auth.strategy('jwt', 'jwt',
        {
            key: "shhhhh",
            validate,
        });

    server.auth.default('jwt');

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


    //serve istanbul test cases coverage
    server.route({
        method: 'GET',
        path: '/{param*}',
        options: {
            auth: false
        },
        handler: {
            directory: {
            path: "./coverage",
            listing: true
        }
        }
    });

    //register user Routes
    userRoutes.forEach((route: any) => {
        server.route(route);
    }) 
    
    //register apartment routes
    apartmentRoutes.forEach((route: any) => {
        server.route(route);
    }) 

    //db connection with Authentication and Avl support
    const dbOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    };

   let isConnectedBefore = false;

    let connect = async () => {

        await mongoose.connect('mongodb://localhost:27017/homelike', dbOptions, (err) => { 

            if (err) {
                Logger.error("mongodb connection error", err);
            }
            else {
                isConnectedBefore = true;
                Logger.info("mongodb connected");
            }
        });
    }

    // mongoose events

    mongoose.connection.on('error', err => {
        Logger.error(err);
    });

    mongoose.connection.on('disconnected', async () => {
        Logger.error('Lost MongoDB connection...');
        if (!isConnectedBefore)
            await connect();
    });

    mongoose.connection.on('connected', () => {
        isConnectedBefore = true;
        Logger.info('Connection established to MongoDB');
    });

    mongoose.connection.on('reconnected', () => {
        Logger.info('Reconnected to MongoDB');
    });

    // Close the Mongoose connection, when receiving SIGINT
    process.on('SIGINT', () => {
        mongoose.connection.close(() => {
            Logger.warn('Forced to close the MongoDB conection');
            process.exit(0);
        });
    });


   await server.start();

   await connect();

    Logger.info(`Server running on ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
    Logger.error(err);
    process.exit(1);
});

init();
