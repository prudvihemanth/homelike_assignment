import { ResponseToolkit } from "@hapi/hapi";
import Boom from "@hapi/boom";

import Logger from "../utils/logger";
import { authController } from "../utils/auth";
import { userSchema } from "../schemas/userSchema";

const controller = new authController();


export class userController {

    async registerUser(request: any, h: ResponseToolkit) {
        const hashedPassword = await controller.generateHash(request.payload.password)
        const user = new userSchema(
            {
                firstName: request.payload.firstName,
                lastName: request.payload.lastName,
                email: request.payload.email,
                password: hashedPassword,
                role: request.payload.role
            })

        try {
            const result = await user.save();
            Logger.info(`user ${request.payload.email} successfully registered.`)
            return h.response(result).code(201);
        }
        catch (e : any) {
            Logger.error(`error registering user ${request.payload.email}, message: ${e.message}`)
            return Boom.conflict(e.message);
        }

    }

    async login(request: any, h: ResponseToolkit): Promise<any> {
        try {
            let user = await userSchema.find({ email: request.payload.email });
            if (user[0]) {
                const isPasswordCorrect = await controller.compareHash(request.payload.password, user[0].password);
                if (isPasswordCorrect) {
               const token = await controller.createToken(user[0]);
               const response = {
                   token: token,
                   _id: user[0]._id,
                   email: user[0].email,
                   role: user[0].role
               }
               return response;
                }
                else {
                   Logger.error(`password mismatch for user ${request.payload.email}`);
                   return Boom.conflict('wrong password proovided');
                }  
            } 

            else {
                Logger.error(`user not found for  ${request.payload.email}`);
                return Boom.notFound('user not found')
            }
        }
        catch (err: any) {
            Logger.error(`error logging in for user  ${request.payload.email}, message: ${err.message}`);
            return (err.message)
        }
    }

   async getUsersList(request: any, h: ResponseToolkit):  Promise<any> {
       try{
        const users = await userSchema.find();
        Logger.info('Get users list successful');
        return users;
       }
       catch(e: any) {
           Logger.error(`Get users list failure with ${e.message}`);
           return e;
       }
    }
}
