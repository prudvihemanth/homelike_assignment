import { Request, ResponseToolkit } from "@hapi/hapi";

import Logger from "../utils/logger";
import { authController } from "../utils/auth";

const controller = new authController();


export class userController {

    registerUser(request: any, h: ResponseToolkit) {
        const hashedPassword = controller.generateHash(request.payload.password)
        return hashedPassword;
    }

    login(request: Request, h: ResponseToolkit): string {
        return `Hello ${request.params.name}!`;
    }

    getUsersList(request: Request, h: ResponseToolkit): string {
        return 'Hello dear users';
    }
}
