import * as JWT from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import Logger from "./logger";
import { userSchema } from "../schemas/userSchema";


export class authController {


  /**
    * Generates a JWT token.
    *
    * @remarks
    * This method is part of the {@link core-library#Statistics | Statistics subsystem}.
    *
    * @param x - The first input number
    * @param y - The second input number
    * @returns The arithmetic mean of `x` and `y`
    *
    * @beta
    */


  async createToken(userObj: any) {
    try {
      const user = {
        id: userObj._id,
        email: userObj.email,
        role: userObj.role
      }
      const token = await JWT.sign(user, 'shhhhh',{expiresIn: '1h'});
      return token;
    }
    catch (e) {
      Logger.error(e)
      return e
    }
  }

  async validate(decoded: any, request: any, h: any) {
    const user = await userSchema.findOne({ _id: decoded.id });
    if (user) {
      request.context = user;
      return { isValid: true };
    }
    else {
      return { isValid: false };
    }
  };

  async generateHash(password: string) {
    const saltRounds = 10;
    try {
      const hash = await bcrypt.hash(password, saltRounds);
      return hash;
    }
    catch (err) {
      Logger.error(err)
      return err;
    }
  };

  async compareHash(password: string, hash: string) {
    try {
      const isPasswordCorrect = await bcrypt.compare(password, hash);
      return isPasswordCorrect;
    }
    catch (err) {
      Logger.error(err)
      return err;
    }

  }

}