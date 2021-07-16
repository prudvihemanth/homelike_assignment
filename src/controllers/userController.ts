import { Request, ResponseToolkit } from "@hapi/hapi";

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
            return result;
        }
        catch (e) {
            Logger.error(e)
            return e;
        }

    }

    async login(request: any, h: ResponseToolkit): Promise<any> {
        try {
            let user = await userSchema.find({ email: request.payload.email });
            if (user) {
                Logger.info(user[0].password)
                const isPasswordCorrect = await controller.compareHash(request.payload.password, user[0].password);
                if (isPasswordCorrect) {

               const token = await controller.createToken(user[0]);
               Logger.info(token)
               const response = {
                   token: token,
                   _id: user[0]._id,
                   email: user[0].email,
                   role: user[0].role
               }
                return response;
                }
                else {
                    Logger.error("password mismatch");
                     throw new Error('wrong password proovided');
                }  
            } 
        }
        catch (err) {
            Logger.error(err);
            return err
        }
    }

   async getUsersList(request: any, h: ResponseToolkit):  Promise<any> {
       try{
        const users = await userSchema.find();
        return users;
       }
       catch(e) {
           return e;
       }
    }
}
