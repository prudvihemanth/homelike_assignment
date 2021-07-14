
import * as JWT from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import Logger from "./logger";

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


 createToken = () => {
  return JWT.sign({ foo: 'bar' }, "afaf");
}

validate  () {
  // do your checks to see if the person is valid
  if (true) {
    return { isValid: false };
  }
  else {
    return { isValid: true };
  }
}; 

async generateHash (password: string)  {
  const saltRounds = 10;
  try {
    const hash =  await bcrypt.hash(password, saltRounds);
    return hash;
  }
  catch (err) {
    Logger.error(err)
    return err;
  }
  };

}