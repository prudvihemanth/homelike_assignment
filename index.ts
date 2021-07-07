import { Server, Request, ResponseToolkit } from "@hapi/hapi";
import Logger from "./src/utils/logger"

const init = async () => {
    const server: Server = new Server({
        port: 3000,
        host: 'localhost'
    });
    server.route({
        method: 'GET',
        path: '/',
        handler: (request: Request, h: ResponseToolkit) => {
            Logger.error("This is an error log");
            Logger.warn("This is a warn log");
            Logger.info("This is a info log");
            Logger.http("This is a http log");
            Logger.debug("This is a debug log");
            return 'Hello World!';
        }
    });
    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();