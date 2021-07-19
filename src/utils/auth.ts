import * as JWT from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import Logger from "./logger";
import { userSchema } from "../schemas/userSchema";


export class authController {


  /**
   * Create jwt token for valid email and password.
   *
   * @remarks
   * This method is part of Authentication and Autherization.
   *
   * @param userObj - Request payload should contain user object 
   * @returns Returns token
   *
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
    catch (e: any) {
      Logger.error(e)
      return e
    }
  }

  /**
   * Validate jwt token for valid user id.
   *
   * @remarks
   * This method is part of Authentication and Autherization.
   *
   * @param decoded - decoded jwt token
   * @param request - Append context to the request object 

   * @returns Returns boolean true/false if user id matches the id in database
   *
   */

  async validate(decoded: any, request: any) {
    const user = await userSchema.findOne({ _id: decoded.id });
    if (user) {
      request.context = user;
      return { isValid: true };
    }
    else {
      return { isValid: false };
    }
  };

  
 /**
   * Generate hash for plain password.
   *
   * @remarks
   * This method is part of Authentication and Autherization.
   *
   * @param password - plain password which needs to be encrypted 
   * @returns Returns hashed password to be stored in db
   *
   */

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

  
  /**
   * Compare hash and plain password.
   *
   * @remarks
   * This method is part of Authentication and Autherization.
   *
   * @param password - plain password from request payload 
   * @param hash - hashed  password from db 

   * @returns Returns boolean true/false if plain password matches the decoded hash 
   *
   */
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