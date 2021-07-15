"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const userController_1 = require("../controllers/userController");
const basePath = "/api/v1/";
const controller = new userController_1.userController();
const userRoutes = [{
        method: 'POST',
        path: `${basePath}registerUser`,
        handler: controller.registerUser,
        options: {
            description: 'Get todo',
            notes: 'Returns a todo item by the id passed in the path',
            tags: ['api'],
            validate: {
                payload: joi_1.default.object({
                    firstName: joi_1.default.string().min(3).max(15).required(),
                    lastName: joi_1.default.string().min(3).max(15).required(),
                    email: joi_1.default.string()
                        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
                    password: joi_1.default.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
                        .required()
                })
            }
        }
    },
    {
        method: 'POST',
        path: `${basePath}login`,
        handler: controller.login,
        options: {
            description: 'Get todo',
            notes: 'Returns a todo item by the id passed in the path',
            tags: ['api'],
            validate: {
                payload: joi_1.default.object({
                    email: joi_1.default.string()
                        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
                    password: joi_1.default.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
                        .required()
                })
            }
        }
    },
    {
        method: 'GET',
        path: `${basePath}getUsersList`,
        handler: controller.getUsersList,
        options: {
            description: 'Get todo',
            notes: 'Returns a todo item by the id passed in the path',
            tags: ['api'],
            validate: {
                query: joi_1.default.object({
                    limit: joi_1.default.number().integer().min(1).max(100).default(10)
                })
            }
        }
    }];
exports.default = userRoutes;
