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
const chai_1 = require("chai");
const sinon_1 = __importDefault(require("sinon"));
const auth_1 = require("../../src/utils/auth");
const logger_1 = __importDefault(require("../../src/utils/logger"));
const userSchema_1 = require("../../src/schemas/userSchema");
const controller = new auth_1.authController();
describe('Auth Controller', () => {
    describe("Create Token", () => {
        it("Should return a jwt Token", () => __awaiter(void 0, void 0, void 0, function* () {
            const user = {
                id: "234jkjfnanfkjnsfd23sfs",
                email: "prudvihemanth@gmail.com",
                role: "user"
            };
            const token = yield controller.createToken(user);
            chai_1.expect(token).to.be.a('string');
        }));
        it("Should return error", () => __awaiter(void 0, void 0, void 0, function* () {
            const user = null;
            const token = yield controller.createToken(user);
            logger_1.default.info(token);
            chai_1.expect(token).to.throw(new Error(`Cannot read property '_id' of null`));
        }));
    });
    describe("Validate decoded user id from db", () => {
        it("Should validate to true", () => __awaiter(void 0, void 0, void 0, function* () {
            const decodedUser = { _id: "234jkjfnanfkjnsfd23sfs",
                email: "prudvihemanth@gmail.com",
                role: "user" };
            const validateStub = sinon_1.default.stub(userSchema_1.userSchema, "findOne");
            validateStub.withArgs(decodedUser)
                .resolves(Promise.resolve(decodedUser))
                .returns({ isValid: true });
            validateStub.withArgs({}).returns({ isValid: true });
            chai_1.expect(validateStub.calledTwice).to.be.true;
        }));
        it("Should validate to false", () => __awaiter(void 0, void 0, void 0, function* () {
        }));
    });
    describe("Generate Hash", () => {
        it("Should generate hash", () => __awaiter(void 0, void 0, void 0, function* () {
            const password = "homelike123@";
            const hash = yield controller.generateHash(password);
            chai_1.expect(hash).to.be.a('string');
            chai_1.expect(password).to.not.equal(hash);
            chai_1.expect(hash.length).to.be.above(password.length);
        }));
    });
    describe("Compare Hash", () => {
        // it("should compare hash and plain password", async() => {
        //     const password =  "homelike123@";
        //     const hash = 
        // })
    });
});
