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
const logger_1 = __importDefault(require("../utils/logger"));
const auth_1 = require("../utils/auth");
const userSchema_1 = require("../schemas/userSchema");
const controller = new auth_1.authController();
class userController {
    registerUser(request, h) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashedPassword = yield controller.generateHash(request.payload.password);
            const user = new userSchema_1.userSchema({
                firstName: request.payload.firstName,
                lastName: request.payload.lastName,
                email: request.payload.email,
                password: hashedPassword
            });
            try {
                const result = yield user.save();
                logger_1.default.info("coming first----");
                logger_1.default.info("new user saved with email", result.email);
                return result;
            }
            catch (e) {
                logger_1.default.error(e);
                return e;
            }
        });
    }
    login(request, h) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield userSchema_1.userSchema.find({ email: request.payload.email });
                if (user) {
                    logger_1.default.info(user[0].password);
                    const isPasswordCorrect = yield controller.compareHash(request.payload.password, user[0].password);
                    if (isPasswordCorrect) {
                        return user;
                    }
                    else {
                        logger_1.default.error("password mismatch");
                        throw new Error('wrong password proovided');
                    }
                }
            }
            catch (err) {
                logger_1.default.error(err);
                return err;
            }
        });
    }
    getUsersList(request, h) {
        return 'Hello dear users';
    }
}
exports.userController = userController;
