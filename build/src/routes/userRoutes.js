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
            auth: false,
            description: 'Register a new User',
            notes: 'ECreates a new Tenant/User and returns User Object. Email must be unique and password Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters',
            tags: ['api'],
            validate: {
                payload: joi_1.default.object({
                    firstName: joi_1.default.string().min(3).max(15).required(),
                    lastName: joi_1.default.string().min(3).max(15).required(),
                    role: joi_1.default.string().valid('USER', 'TENANT').required(),
                    email: joi_1.default.string()
                        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
                    password: joi_1.default.string().pattern(new RegExp("(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"))
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
            auth: false,
            description: 'Login as User/Tenant',
            notes: 'Returns logged in user with a jwt token. Ensure Password Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters',
            tags: ['api'],
            validate: {
                payload: joi_1.default.object({
                    email: joi_1.default.string()
                        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
                    password: joi_1.default.string().pattern(new RegExp("(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"))
                        .required()
                })
            }
        }
    },
    {
        method: 'GET',
        path: `${basePath}getUsersList`,
        options: {
            auth: 'jwt',
            plugins: { 'hapiAuthorization': { roles: ['TENANT', 'USER'] } },
            description: 'Get List Of All Users',
            notes: 'Returns array of all users',
            tags: ['api'],
            validate: {
                headers: joi_1.default.object({
                    authorization: joi_1.default.string().required()
                }).options({ allowUnknown: true })
            }
        },
        handler: controller.getUsersList
    }];
exports.default = userRoutes;
