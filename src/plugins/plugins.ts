import * as Inert from "@hapi/inert";
import * as Vision from "@hapi/vision";
import * as HapiSwagger from "hapi-swagger";
import * as HapiAuthJWT from "hapi-auth-jwt2"

const swaggerOptions = {
    info: {
        title: 'Home Like API Documentation',
        version: '1.0',
    },
};

const plugins = [
    {
        plugin: Inert
    },
    {
        plugin: Vision
    },
    {
        plugin: HapiAuthJWT
    },
    {
        plugin: require('hapi-authorization'),
        options: {
            roles: ['ADMIN', 'USER', 'OWNER']	
        }
    },
    {
        plugin: HapiSwagger,
        options: swaggerOptions
    }
]

export default plugins;