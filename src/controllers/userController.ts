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
                password: hashedPassword
            })

        try {
            const result = await user.save();
            Logger.info("coming first----")
            Logger.info("new user saved with email", result.email);
            return result;
        }
        catch (e) {
            Logger.error(e)
            return e;
        }

    }

    async login(request: any, h: ResponseToolkit): Promise<any> {
        try {
            const user = await userSchema.find({ email: request.payload.email });
            if (user) {
                Logger.info(user[0].password)
                const isPasswordCorrect = await controller.compareHash(request.payload.password, user[0].password);
                if (isPasswordCorrect) {
                    return user;
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
