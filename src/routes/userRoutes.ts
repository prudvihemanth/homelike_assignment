import Joi from "joi";

import { userController } from "../controllers/userController";


const basePath: string = "/api/v1/";
const controller = new userController();


const userRoutes = [{
    method: 'POST',
    path: `${basePath}registerUser`,
    handler: controller.registerUser,
    options: {
        description: 'Get todo',
        notes: 'Returns a todo item by the id passed in the path',
        tags: ['api'], // ADD THIS TAG
        validate: {
            payload: Joi.object({
                firstName: Joi.string().min(3).max(15).required(),
                lastName: Joi.string().min(3).max(15).required(),
                email: Joi.string()
                    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
                password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
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
        tags: ['api'], // ADD THIS TAG
        validate: {
            payload: Joi.object({
                email: Joi.string()
                    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
                password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
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
        tags: ['api'], // ADD THIS TAG
        validate: {
            query: Joi.object({
                limit: Joi.number().integer().min(1).max(100).default(10)
            })
        }
    }
}]


export default userRoutes;
