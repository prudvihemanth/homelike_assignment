"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const JWT = __importStar(require("jsonwebtoken"));
const bcrypt = __importStar(require("bcrypt"));
const logger_1 = __importDefault(require("./logger"));
const userSchema_1 = require("../schemas/userSchema");
class authController {
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
    createToken(userObj) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = {
                    id: userObj._id,
                    email: userObj.email,
                    role: userObj.role
                };
                const token = yield JWT.sign(user, 'shhhhh', { expiresIn: '1h' });
                return token;
            }
            catch (e) {
                logger_1.default.error(e);
                return e;
            }
        });
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
    validate(decoded, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userSchema_1.userSchema.findOne({ _id: decoded.id });
            if (user) {
                request.context = user;
                return { isValid: true };
            }
            else {
                return { isValid: false };
            }
        });
    }
    ;
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
    generateHash(password) {
        return __awaiter(this, void 0, void 0, function* () {
            const saltRounds = 10;
            try {
                const hash = yield bcrypt.hash(password, saltRounds);
                return hash;
            }
            catch (err) {
                logger_1.default.error(err);
                return err;
            }
        });
    }
    ;
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
    compareHash(password, hash) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isPasswordCorrect = yield bcrypt.compare(password, hash);
                return isPasswordCorrect;
            }
            catch (err) {
                logger_1.default.error(err);
                return err;
            }
        });
    }
}
exports.authController = authController;
