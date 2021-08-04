"use strict";
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
exports.userController = void 0;
const boom_1 = __importDefault(require("@hapi/boom"));
const logger_1 = __importDefault(require("../utils/logger"));
const auth_1 = require("../utils/auth");
const userSchema_1 = require("../schemas/userSchema");
const controller = new auth_1.authController();
class userController {
    /**
    * Register a user/tenant.
    *
    * @remarks
    * This method is part of the User registration and Login.
    *
    * @param request - Payload Should be an object and should contain role, firstname, lastname, email and password
    * @returns The newly registered user/tenanat
    *
    */
    registerUser(request, h) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashedPassword = yield controller.generateHash(request.payload.password);
            const user = new userSchema_1.userSchema({
                firstName: request.payload.firstName,
                lastName: request.payload.lastName,
                email: request.payload.email,
                password: hashedPassword,
                role: request.payload.role
            });
            try {
                const result = yield user.save();
                logger_1.default.info(`user ${request.payload.email} successfully registered.`);
                return h.response(result).code(201);
            }
            catch (e) {
                logger_1.default.error(`error registering user ${request.payload.email}, message: ${e.message}`);
                return boom_1.default.conflict(e.message);
            }
        });
    }
    /**
    * Login as User/Tenant.
    *
    * @remarks
    * This method is part of the User registration and Login.
    *
    * @param request - Payload object should contain email and password.
    * @returns The Jwt token, logged in user details
    *
    */
    login(request, h) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let user = yield userSchema_1.userSchema.find({ email: request.payload.email });
                if (user[0]) {
                    const isPasswordCorrect = yield controller.compareHash(request.payload.password, user[0].password);
                    if (isPasswordCorrect) {
                        const token = yield controller.createToken(user[0]);
                        const response = {
                            token: token,
                            _id: user[0]._id,
                            email: user[0].email,
                            role: user[0].role
                        };
                        return response;
                    }
                    else {
                        logger_1.default.error(`password mismatch for user ${request.payload.email}`);
                        return boom_1.default.conflict('wrong password proovided');
                    }
                }
                else {
                    logger_1.default.error(`user not found for  ${request.payload.email}`);
                    return boom_1.default.notFound('user not found');
                }
            }
            catch (err) {
                logger_1.default.error(`error logging in for user  ${request.payload.email}, message: ${err.message}`);
                return (err.message);
            }
        });
    }
    /**
    * List all users.
    *
    * @remarks
    * This method is part of the User registration and Login.
    *
    * @param request - Headers should contain authorization token
    * @returns Array of user objects
    *
    */
    getUsersList(request, h) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield userSchema_1.userSchema.find();
                logger_1.default.info('Get users list successful');
                return users;
            }
            catch (e) {
                logger_1.default.error(`Get users list failure with ${e.message}`);
                return e;
            }
        });
    }
}
exports.userController = userController;
