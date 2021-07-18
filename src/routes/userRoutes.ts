import Joi from "joi";
import { userController } from "../controllers/userController";


const basePath: string = "/api/v1/";
const controller = new userController();


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
            payload: Joi.object({
                firstName: Joi.string().min(3).max(15).required(),
                lastName: Joi.string().min(3).max(15).required(),
                role: Joi.string().valid('USER','TENANT').required(),
                email: Joi.string()
                    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
                password: Joi.string().pattern(new RegExp('(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}'))
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
            payload: Joi.object({
                email: Joi.string()
                    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
                password: Joi.string().pattern(new RegExp('(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}'))
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
        plugins: {'hapiAuthorization': {roles: ['TENANT', 'USER']}},
        description: 'Get List Of All Users',
        notes: 'Returns array of all users',
        tags: ['api'], 
        validate: {
            headers: Joi.object({
                authorization: Joi.string().required()
            }).options({ allowUnknown: true })
        }
    },
    handler: controller.getUsersList
}]


export default userRoutes;
