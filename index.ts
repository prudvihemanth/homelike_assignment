import { Server, Request, ResponseToolkit } from "@hapi/hapi";
import Logger from "./src/utils/logger";
import plugins from "./src/plugins/plugins"
import * as Inert from "@hapi/inert";
import * as Vision from "@hapi/vision";
import * as HapiSwagger from "hapi-swagger";



const init = async () => {
   
    const server: Server = new Server({
        port: 3000,
        host: 'localhost'
    });

    await server.register(plugins);

    server.route([{
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
    }]);

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();